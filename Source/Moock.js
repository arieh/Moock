function isStub(stub){
    return ("args" in stub && "called" in stub);
}

function getStub(value){
    function Stub(){
        Stub.called = true;
        Stub.args = arguments;
        if (typeOf(value) == 'function') return value.apply(Stub,arguments);
		return value;
    }
    Stub.called = false;
    Stub.args = [];
	return Stub;
}


Class.Mutators.Mock = function(methods){
    for (var name in methods){
        if (!(methods.hasOwnProperty(name))) continue;
        
        this.prototype[name] = getStub(methods[name]);
    }
};

function getMock(classname,methods){

    if (window[classname]){
        return new Class({
            Extends : window[classname]
            , Mock : methods
        });
        
    }
    
    return window[classname] = new Class({Mock:methods});
}