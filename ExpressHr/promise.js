var promise = new Promise(function(resolve, reject){
    var success = false;

    if(success){
        resolve('promise fulfilled');
    }else {
        reject('promise rejected');
    }
});

promise.then(function(result){
    console.log(result);
}, function(error){
    console.log(error);
});