function Fixture(func,args,bind){
    return function(){
       for (var i = args.length; i>=0;--i) func.apply(bind,args[i]);    
    }       
}



