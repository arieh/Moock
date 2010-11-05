Moock
===================
Moock is a package of tools for JS TDD development, apecifically designed for Class development.
The 2 main tools supplied are:

1. A method for creating stub functions, that allows you to define a set of expectations for the method and to pass it a returned value.
2. A Class Mutator that allows stubbing specific methods within a class.

* The stubing mechanism is inspired by the mechanism described in (Test Driven Javascript Development)[http://tddjs.com/ "TDD JS"]. *

![Screenshot](https://github.com/arieh/Moock/raw/master/moock.png)

How To Use
==========

### Stubbing

For creating stubs, we use the `getStub` method:

    #JS
    var stub = getStub(retunedValue)


The passed value will be returned when the method is called. The returned stub comes with a set of attributes that allows us to test it's usage:

1. called (bool) : wether or not the function was called.
2. args (array) : what paramaters were passed to the funcion when called.

With these in mind, we can create a simple test:

    #JS
    var obj = {
        method1 : getStub("aaa")
        , method2 : function(){
            console.log(this.method1());
        }
    };
    
    assertFalse(obj.method1.called);
    obj.method2(); //logs aaa  
    assertTrue(obj.method1.called);
    
    /* checking passed variables */
    var obj = {
        method1 : getStub()
        , method2 : function(){
            this.method1("aa","bb");
        }
    };
    
    obj.method2();
    assertEquals(["aa","bb"],obj.method1.args);
    
The stub can also receive a function as a value. If so, it will call it, passing it the arguments. In most cases this is useless (you shouldn't have any logic in your stubs).
This can be used to encapsulate the assertions, or to perform very low level logic:

    #JS
    var stub = getStub(function(arg1,arg2){
        assertEquals(["a","b"],arguments);
        return arg1+arg2;
    });
    
    
The package also comes with a helper function - `isStub` - that is used to check if a given method is a true method or a stub.
### Mocking

The package adds a new Class Mutator called Mock. It receives a literal object containing a list of method names 
to mock paired with retured value.

    #JS
    /* simple usage */
    var mock = new Class({
        Mock : {
            'methodA' : 'aaa'
        }
    });
    
    var m = new mock;
    
    assertFalse(m.methodA.called);
    assertEquals("aaa",m.methodA('bbb'));
    assertTrue(m.methodA.called);
    assertEquals(['bbb'],m.methodA.args);
    

#### Creating a Class's Mock:

    #JS
    var cls = new Class({
        methodA : function(){/* do something */ }
    });
    
    var mock = new Class({
        Extends : cls
        , Mock : {
            'methodA' : 'aaa'
        } 
    });
    
    var m = new mock;
    assertTrue(m instanceof cls);
    assertTrue(isStub(m.methodA));
    
#### Mocking only certain parts of a Class:

    #JS
    var cls = new Class({
        methodA : function(){}
        methodB : function(){
            console.log(this.methodA("a","b","c");)
        }
    });
    
    var mock = new Class({
        Extends : cls
        , Mock :{
            methodA : getStub("bbb")
        }
    });
    
    var m = new mock;
    m.methodB(); //logs "bbb"
    
    assertEqauls(["a","b","c"],m.methodA.args);
    
    
The package also comes with a helper function - `getMock` - that creates a mock that is an instance of a certain Class. 
If that Class is not defined, the helper will create a mock for it. This is useful for depedancy injection tests:

    #JS
    var mock = getMock('ClassA',{
        doSomething : 'something'
    });
    
    var m = new mock;
    
    assertTrue(m instanceof ClassA); //works whether there is a real ClassA or not
    