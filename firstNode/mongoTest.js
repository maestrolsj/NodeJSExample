var mongoose = require('mongoose');

var db = mongoose.connection;
var dbUrl = 'mongodb://localhost/presidents';

var Schema = mongoose.Schema;
var TeamSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        }
    }
);
var EmployeeSchema = new Schema(
    {
        name: {
            first: {
                type: String,
                required: true
            },
            last: {
                type: String,
                required: true
            }
        },
        team: {
            type: Schema.Types.ObjectId,
            ref: 'TeamCollection'
        },
        image: {
            type: String,
            default: 'images/user.png'
        },
        address: {
            lines: {
                type: [String]
            },
            postal: {
                type: String
            }
        }
    }
);

var Team = mongoose.model('TeamCollection', TeamSchema);
var Employee = mongoose.model('EmployeeCollection', EmployeeSchema);

db.on('error', function (err) {
    return console.log('DB communicating error')
});

function insertTeams(callback) {

    Team.create(
        {name: 'Product Development'}
        , {name: 'Dev Ops'}
        , {name: 'Accounting'}
        , function (error, pd, devops, acct) {
            if (error) callback(error);
            else {
                //    console.dir(pd);
                //   console.dir(devops);
                //   console.dir(acct);
                console.info('teams succefully added');
                callback(null, pd, devops, acct);
            }
        }
    );
}

function insertEmployees(pd, devops, acct, callback) {
    Employee.create(
        {
            name: {
                first: 'John',
                last: 'Adams'
            },
            team: pd._id,
            address: {
                lines: ['2 Lincoln Memorial Cir NW'],
                zip: 20037
            }
        },

        {
            name: {
                first: 'Thomas',
                last: 'Jefferson'
            },
            team: devops._id,
            address: {
                lines: ['1600 Pennsylvania Avenue', 'White House'],
                zip: 20500
            }
        },

        {
            name: {
                first: 'James',
                last: 'Madison'
            },
            team: acct._id,
            address: {
                lines: ['2 15th St NW', 'PO Box 8675309'],
                zip: 20007
            }
        },

        {
            name: {
                first: 'James',
                last: 'Monroe'
            },
            team: acct._id,
            address: {
                lines: ['1850 West Basin Dr SW', 'Suite 210'],
                zip: 20242
            }
        },

        function (error, johnadams) {
            if (error) return callback(error);
            else {
                console.info('employees succesfully added');
                callback(null, {team: pd, employee: johnadams});
            }
        }
    );
}

function retrieveEmployee(data, callback) {
    Employee.findOne({_id: data.employee._id}).populate('team').exec(function (error, result) {
        if (error) return callback(error);
        else {
            console.log('*** Single Employee Result ***');
            console.log(result);
            callback(null, data);
        }
    });
}

function retrieveEmployees(data, callback) {
    Employee.find({'name.first': /J/i},
        function (error, results) {
            if (error) return callback(error);
            else {
                console.log('*** Employees Result ***');
                console.log(results);
                callback(null, data);
            }
        });
}

mongoose.connect(dbUrl, function (err) {
    if (err) return console.log('There was aproblem connecting to the database' + err);

    console.log('connected');

    insertTeams(function (err, pd, devops, acct) {
        if (err) return console.error(err);
        insertEmployees(pd, devops, acct, function (err, result) {

            retrieveEmployee(result, function (err, result) {

                retrieveEmployees(result, function (err, result) {
                    if (err) console.error(err);
                    else console.info('database activity complete');

                    db.close();
                    process.exit();
                });
            });
        });
    });
});