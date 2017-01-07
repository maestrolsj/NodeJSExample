var async = require('async');
var mongoose = require('mongoose');
require(process.cwd() + '/lib/connection');

var Employee = mongoose.model('Employee');
var Team = mongoose.model('Team');

var data = {
    employees: [
        {
            id: '100003',
            name: {
                first: 'Colin',
                last: 'Ihrig'
            },
            image: 'images/employees/100003.png',
            address: {
                lines: ['11 Wall Street'],
                city: 'New York',
                state: 'NY',
                zip: 10118
            }
        },
        {
            id: '100021',
            name: {
                first: 'Adam',
                last: 'Bretz'
            },
            address: {
                lines: ['46 18th St', 'St. 210'],
                city: 'Pittsburgh',
                state: 'PA',
                zip: 15222
            }
        },
        {
            id: '100022',
            name: {
                first: 'Matt',
                last: 'Liegey'
            },
            address: {
                lines: ['2 S Market Square', '(Market Square)'],
                city: 'Pittsburgh',
                state: 'PA',
                zip: 15222
            }
        },
        {
            id: '100025',
            name: {
                first: 'Aleksey',
                last: 'Smolenchuk'
            },
            image: 'images/employees/100025.png',
            address: {
                lines: ['3803 Forbes Ave'],
                city: 'Pittsburgh',
                state: 'PA',
                zip: 15213
            }
        },
        {
            id: '100030',
            name: {
                first: 'Sarah',
                last: 'Gay'
            },
            address: {
                lines: ['3803 Forbes Ave'],
                city: 'Pittsburgh',
                state: 'PA',
                zip: 15108
            }
        },
        {
            id: '100031',
            name: {
                first: 'Dabe',
                last: 'Beshero'
            },
            address: {
                lines: ['1539 Washington Rd'],
                city: 'Mt Lebanon',
                state: 'PA',
                zip: 15228
            }
        }
    ],
    teams: [
        {
            name: 'Software and Service Group'
        },
        {
            name: 'Project Development'
        }
    ]
};

var deleteEmployees = function (callback) {
    console.info('Deleting employees');
    Employee.remove({}, function (error, response) {
        if (error) console.error('Error deleting employees: ' + error);
        console.info('Done deleting employees');
        callback();
    });
};

var addEmployees = function (callback) {
    console.info('Adding employees');
    Employee.create(data.employees, function (error) {
        if (error) console.error('Error:' + error);
        console.info('Done adding employees');
        callback();
    });
};

var deleteTeams = function (callback) {
    console.info('Deleting teams');
    Team.remove({}, function (error, response) {
        if (error) console.error('Error deleting teams: ' + error);
        console.info('Done deleting teams');
        callback();
    });
};

var addTeams = function (callback) {
    console.info('Adding teams');
    Team.create(data.teams, function (error,team1) {
        if (error) console.error('Error:' + error);
        else data.team_id = team1[0]._id;
        console.info('Done adding teams');
        callback();
    });
};

var updateEmployeeTeams = function(callback){
  console.info('Updating employee teams')  ;
    Employee.update({},
         {team  : data.team_id}
        ,{multi : true}
        ,function(error,numberAffected,response){
            if(error) console.error('Error updating emplyee team :' + error);

            console.info('Done updating employee teams');
            callback();
        }
    );
};

async.series(
    [
        deleteEmployees,
        deleteTeams,
        addEmployees,
        addTeams,
        updateEmployeeTeams
    ], function(error, results){
        if(error) console.log('Error : '+ error);

        mongoose.connection.close();
        console.log('Done!');
    }
);
