/**
 * Created by maestrolsj on 16. 7. 18.
 */
var express = require('express');
var mongoose = require('mongoose');
var Employee = mongoose.model('Employee');
var Team = mongoose.model('Team');
var router = express.Router();

router.get('/employees', function (req, res, next) {
    Employee.find().sort('name.last').exec(function (error, results) {
        if (error) return next(error);

        res.json(results);
    });
});


router.get('/employees/:employeeId', function (req, res, next) {
    Employee.findOne({id: req.params.employeeId}).populate('team').exec(function (error, results) {
        if (error) next(error);
        if (!results) res.send(404);

        res.json(results);
    });
});

router.put('/employees/:employeeId',function(req,res,next){
    console.log("### update ###");
    delete req.body._id;
    console.dir(req.body);
    console.log(">>>>> req.body.team._id >>"+req.body.team._id);
    req.body.team = req.body.team._id;
    console.log(req.body.team);

    /*
     {
     "team":{"_id":"578cde229d51ff7417f27cb8"},
     "name":{"first":"Sejin","last":"Lee"},
     "image":"images/sejin.png"
     }

    */
    Employee.update({id:req.params.employeeId},req.body,function(err,numberAffected,response){
        if(err) return next(err);

        console.dir("## numberAffected >> " + numberAffected);
        res.send(200);
    });
});

module.exports = router;