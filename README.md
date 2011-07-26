Moock
===================
Moock is a package of tools for JS TDD development, specifically designed for Class development.
The 2 main tools supplied are:

1. A method for creating stub functions, that allows you to define a set of expectations for the method and to pass it a returned value. 
2. A Class Mutator that allows stubbing specific methods within a class.


*NOTE

Since v0.8, Moock's Stub is now cross-lib, and supports advanced expectation settings. It's syntax is also slightly changed.
Moock currently support these test libs:

1. JsTestDriver
2. YUI Test
3. QUnit
4. Jasmine*

*The basic stubbing mechanism was inspired by the mechanism described in [Test Driven Javascript Development](http://tddjs.com/).*

![Screenshot](https://github.com/arieh/Moock/raw/master/moock.png)

How to use
----------

### Stubbing

For creating stubs, we create a new Moock.Stub instance:

    #JS
    var stub = new Moock.Stub([retunedValue])

The returned object provides the following helpers for the supported librarys:

* called : (`bool`|`number`) how many times should the function be called. If set to `true`, the method should be called at least once. If set to `false`, will not expect it to run.
* receive : (`array`) an array representing the arguments that should be passed to the function
* returnedValue : a value that the function should return (replaces the construction value)
* test : tests if the expectations were met.

Example:
    
    #JS
    var stub = new Moock.Stub()
        .called(1)
        .receive(["a","b"])
        .returnedValue("aabb");
            
    console.log(stub("a","b")); //aabb
    stub.test();
    
For chaining, the library supplies a helper variable - `Moock.return_self`:

    #JS
    var obj = {
        stub : new Moock.Stub().returnedValue(Moock.return_self)
    };
     
    assertTrue(obj === stub());
         
The returned value can also be a function. If so, the function will be used when the stub is called, receiving the passed arguments:

    #JS
    var stub = new Moock.Stub(function(a,b){return a+b});
    
    console.log(stub("a","b")); //ab

Lastly, for those who want to use the library with non-supported libraries, the Stub object also supllies these low-leveled properties that you can use to test your stubs:

* used (`int`) : how many times the stub was called
* args (`array`) : what argumens were passed to the stub on the last call
* returned : what value to return when the stub is called.

Example:

    #JS
    var stub = new Moock.Stub('aaa');
        
    console.log(stub("a")); //aaa
    console.log(stub.used); //1
         
    console.log(stub.args); //["a"]

#### Adding more library support

If you wish to add support for more libraries, simply add them to the Moock.Libraries object. Each addition should be an object
containing the folowing properties/methods:

* check : wheather or not to use the library on the current run. Should be a check for library availibility
* isTrue : passed 2 variables- an expresion and a message. Should run your library of choise assertion.
* areEqual : passed 3 variables - expected, actual and message. 

For more usage details, look up Libraries.Extra.js. 


### Mocking

The package adds a new Class Mutator called Mock. It receives a literal object containing a list of method names 
to mock paired with returned value.
*NOTE - all stubbed methods are full Moock.Stub instances*

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
            methodA : "bbb"
        }
    });
    
    var m = new mock;
    m.methodB(); //logs "bbb"
    
    assertEqauls(["a","b","c"],m.methodA.args);
    
    
The package also comes with a helper function - `getMock` - that creates a mock that is an instance of a certain Class. 
If that Class is not defined, the helper will create a mock of that Class. This is useful for dependency injection tests:

    #JS
    var mock = getMock('ClassA',{
        doSomething : 'something'
    });
    
    var m = new mock;
    
    assertTrue(m instanceof ClassA); //works whether there is a real ClassA or not