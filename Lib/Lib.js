/**
 * a helper function for the test runner.
 * 
 * The function recivies a test function and a stack of parameter lists to pass it. 
 * Will run the test function once for each set, passing the variables. 
 * 
 * @param {Funcion} func a test function
 * @param {Array} args a stack of variable lists. Each list must be an array
 * @param {Mixed} bind
 * 
 * @return {Function}
 */
function Fixture(func,args,bind){
    return function(){
       for (var i = args.length-1; i>=0; i--) func.apply(bind,args[i]);    
    };       
}



