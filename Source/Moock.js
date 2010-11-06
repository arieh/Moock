/*
---
description: Main Moock API, including and Assertion Decorator for cross-lib and a Stubbing mechanism

license: MIT-style

authors:
- Arieh Glazer

provides: [Moock,Moock.Stub,Moock.Assert,isStub]

...
*/
/*!
Copyright (c) 2010 Arieh Glazer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE 
*/

/**
 * Main Namespace 
 * 
 * Contains Version Number, Assertion Helpers, and Moock.Stub 
 */
var Moock = {
	version : 0.7
	/**
	 * Library Assertion Helpers for cross-lib compatibility.
	 * Currently Supported:
	 *   - YUI test
	 *   - QUnit
	 *   - Jasmine
	 *   - JsTestRunner
	 */
	, YUI_TEST : (window['YAHOO'] && YAHOO['utils'] && YAHOO.utils['Assert']) ? YAHOO.utils.Assert : false
	, QUnit  : (window['QUnit']) ? QUnit : false
	, jasmine : (window['jasmin'] && expect) ? true : false  
	/**
	 * @var {Function} pointer used to tell the stub to return "this"
	 */
	, return_self : function(){}
    
	/**
	 * Cross-Lib Assertion Decorators
	 */
	, Assert : {
		/**
		 * Asserts that an expression is true (===).  
		 * @param {Object} expr 
		 * @param {Object} msg
		 */
		isTrue : function(expr,msg){
			if (window['assertTrue']) assertTrue(expr);
			if (Moock.YUI_TEST)	Moock.YUI_TEST.isTrue(expr,msg);
			if (Moock.QUnit) Moock.QUnit.ok(expt,msg); 
			if (Moock.jasmine) expect(expr).toEqual(true);
		}
		/**
		 * Asserts that two values are equal
		 * @param {Object} expect
		 * @param {Object} actual
		 * @param {Object} msg
		 */
		, areEqual : function(expect,actual,msg){
			if (window['assertEquals']) assertEquals(expect,actual);
            if (Moock.YUI_TEST) Moock.YUI_TEST.areEqual(expect,actual,msg);
            if (Moock.QUnit) Moock.QUnit.equal(actual,expect,msg); 
            if (Moock.jasmine) expect(actual).toEqual(expect);
		}
	}
	/**
	 * Stubbing Factory. Returns the Stub function. 
	 * 
	 * The returned stub comes with a set of syntax helpers methods that can create readable expectations.
	 * These can only work for supported libs. You can extend the Moock.Assert to support other test libs.
	 *  
	 * @param {Object} value a value to be returned by the function
	 * 
	 * @return {Function} a stub function
	 */
	, Stub : function Stub(value){
	    function Stub(){
	        var value = Stub.returned;
	        
	        Stub.used++;
			 
			if (Stub.tests.args) Moock.Assert.areEqual(Stub.tests.args,arguments);
			
	        Stub.args = arguments;
	        if (value === Moock.return_self) return this;
	        if (typeof value == 'function') return value.apply(Stub,arguments);
	        return value;
	    }
	    
	    Stub.used = 0;
	    Stub.args = [];
	    
	    Stub.returned = value;
	    
	    Stub.tests = {
	        used : false
	      , args : false
	    };
	    
		/* Syntax Helpers */
		
		/**
		 * How many times the function should run 
		 * @param {Boolean|Number} num if set to true, will expect the function to run at least once. 
		 *    If a number is supplied, should run the exact amount of times.
		 *    
		 * @return {Function} the stub object
		 */
	    Stub.called = function shouldBeCalled(num){
	       if (!num && num !==0){
	           this.tests.called = true;
	       }else if (num || num===0){
	           this.tests.called = num;
	       }
	       return this;
	    };
	    
		/**
		 * What argument should the function receive 
		 * @param {Array} args
         *    
         * @return {Function} the stub object
		 */
	    Stub.receive = function(args){
	       this.tests.args = args;
	       return this;
	    };  
	    
		/**
		 * what value whould the stub retrun (can function as a replacement for the value argument)
		 * 
		 * @param {Mixed} value
         *    
         * @return {Function} the stub object
		 */
	    Stub.returnedValue = function(value){
	       this.returned = value;
	       return this;
	    };
	    
		/**
		 * tests that the expectation defined were met.
         *    
         * @return {Function} the stub object
		 */
	    Stub.test = function(){
	       if (typeof this.tests.ued === 'number'){
	           Moock.Assert.areEqual(this.tests.used,this.used);
	       }else if (this.tests.used) Moock.Assert.isTrue(this.called == true);
	    };
	    
	    return Stub;
	}
};

/* Helper Functions */

/**
 * checks if a passed variable is a stub
 * @param {Object} stub
 * @return {bool}
 */
function isStub(stub){
    return ("args" in stub && "called" in stub);
}

