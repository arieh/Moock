Moock
===================
Moock is a package of tools for JS TDD development, specifically designed for Class development.
The 2 main tools supplied are:

1. A method for creating stub functions, that allows you to define a set of expectations for the method and to pass it a returned value. 
2. A Mocking tool for creating partial mocks for non-class objects

*NOTE*
Moock supports the following testing frameworks, and defaults to Jasmine:

1. JsTestDriver
2. YUI Test
3. QUnit
4. Jasmine

*The basic stubbing mechanism was inspired by the mechanism described in [Test Driven Javascript Development](http://tddjs.com/).*

![Screenshot](https://github.com/arieh/Moock/raw/master/moock.png)

How to use
----------

### Stubbing

For creating stubs, we create a new Moock.Stub instance:

    ```
    var stub = new Moock.Stub([retunedValue])
    ```

The returned object provides the following helpers for the supported librarys:

* called : (`bool`|`number`) how many times should the function be called. If set to `true`, the method should be called at least once. If set to `false`, will not expect it to run.
* receive : (`array`) an array representing the arguments that should be passed to the function
* returnedValue : a value that the function should return (replaces the construction value)
* test : tests if the expectations were met.

Example:
    
    ```
    var stub = new Moock.Stub()
        .called(1)
        .receive(["a","b"])
        .returnedValue("aabb");
            
    console.log(stub("a","b")); //aabb
    stub.test();
    ```
    
For chaining, the library supplies a helper variable - `Moock.return_self`:

    ```
    var obj = {
        stub : new Moock.Stub().returnedValue(Moock.return_self)
    };
     
    assertTrue(obj === stub());
    ```
         
The returned value can also be a function. If so, the function will be used when the stub is called, receiving the passed arguments:

    ```
    var stub = new Moock.Stub(function(a,b){return a+b});
    
    console.log(stub("a","b")); //ab
    ```

Lastly, for those who want to use the library with non-supported libraries, the Stub object also supllies these low-leveled properties that you can use to test your stubs:

* used (`int`) : how many times the stub was called
* args (`array`) : what arguments were passed to the stub on the last call
* argument_stack (`array`) : an array containing all the consecutive arguments passed to the function. Useful for function that is being called multiple times.
* returned : what value to return when the stub is called.

Example:

    ```
    var stub = new Moock.Stub('aaa');
        
    console.log(stub("a")); //aaa
    console.log(stub.used); //1
         
    console.log(stub.args); //["a"]
    ```

#### Adding more library support

If you wish to add support for more libraries, simply add them to the Moock.Libraries object. Each addition should be an object
containing the folowing properties/methods:

* check : wheather or not to use the library on the current run. Should be a check for library availibility
* isTrue : passed 2 variables- an expresion and a message. Should run your library of choise assertion.
* areEqual : passed 3 variables - expected, actual and message. 

For more usage details, look up Libraries.Extra.js. 

### Wrapping

Moock comes with a simple wrapping function, in case you want to "spy" on a function or an object's method without removing it

    ```
    //options #1
    var setTimeout = Moock.wrap(window.setTimeout);
    setTimeout.called(1);
    
    setTimeout(function(){
        console.log('foo');
    }, 1000);
    
    setTimeout.test();
    
    //after 1s - logs foo
    
    
    //options #2
    
    Moock.wrap(window, 'setTimeout');
    
    setTimeout.called(1);
    
    setTimeout(function(){
        console.log('bar');
    }, 1000);
    
    setTimeout.test();
    
    setTimeout.restore(); //will restore window.setTimeout to original method
    ```
    
### Mocking

#### Moock.Mock

This tool allows you to create a mock of a JS object. 
The constructor accepts 3 arguments:

1. The object to mock
2. A list of methods to Stub and their returned value
3. A function to call on construction. The method will be scoped to the created Object and will receive the construction arguments.
	
Usage Example:

	```
    //some basic constructor
	function Construct(a,b){
		this.a = a;
		this.b = b;
	}
	
    //adding methods
	Constructs.prototype = {
		doSomething : function(){
			console.log(this.a);
		} , 
		doElse : function(){
			this.doSomething();
		}
	};
	
	var test = false, 
        old = Constructor; //keeping the old constructor 

    //MOCKING HERE \/
    
	Constructor = new Moock.Mock(
		Construct, 
		{	
			doSomething : function(){
				test = true;	
			}
		}
		, function(a,b){
			Moock.Assert.areEqaul(a,'a');
			Moock.Assert.areEqual(b,'b');
			
			Moock.Assert.areEqaul(this.a,'a');
			Moock.Assert.areEqual(this.b,'b');
		}
	);
	
	(new Constructor('a','b')).doElse();
	
	Constructor = old; //returning the constructor to its original value
	
	Moock.Assert.isTrue(test,"do something should have been called");
    ```
