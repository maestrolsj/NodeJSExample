var mongoose = require('mongoose');
var dbUrl = 'mongodb://localhost/presidents';

mongoose.connect(dbUrl);

// Ctrl+C : EXIT
process.on(
    'SIGINT'
    ,function()
     {
        mongoose.connection.close(
            function()
            {
                console.log('Mongoose disconnected');
                process.exit(0);
            }
        );
     }
);
console.log('Mongoose Connected');

require('../models/employee');
require('../models/team');