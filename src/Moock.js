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
/*global assertTrue, assertEquals */

(function(window,undef){
    /**
     * Main Namespace
     *
     * Contains Version Number, Assertion Helpers, and Moock.Stub
     */
    var Moock = this.Moock = {
        version : "1.0.0"
        /**
         * @var {Function} pointer used to tell the stub to return "this"
         */
        , return_self : function(){}
        /**
         * Library Assertion Helpers for cross-lib compatibility.
         * Currently Supported:
         *   - YUI test
         *   - QUnit
         *   - Jasmine
         *   - JsTestRunner
         */
        , Libraries : {
            jasmine : {
                check : !!(this.jasmine && this.expect)
                , isTrue : function(expr,msg){
                    expect(expr).toEqual(true);
                }
                , areEqual : function(expct,actual,msg){
                    expect(actual).toEqual(expct);
                }
            }
        }
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
                var libs = Moock.Libraries, name;
                for (name in libs){
                    if (libs[name].check) libs[name].isTrue(expr,msg);
                }
            }
            /**
             * Asserts that two values are equal
             * @param {Object} expect
             * @param {Object} actual
             * @param {Object} msg
             */
            , areEqual : function(expect,actual,msg){
                var libs = Moock.Libraries, name;
                for (name in libs){
                    if (libs[name].check) libs[name].areEqual(expect,actual,msg);
                }
            }
        }
    };

    /**
     * Stubbing Factory. Returns the Stub function.
     *
     * The returned stub comes with a set of syntax helpers methods that can create readable expectations.
     * These can only work for supported libs. You can extend the Moock.Assert to support other test libs.
     *
     * @param {Object} [value] a value to be returned by the function
     *
     * @return {Function} a stub function
     */
    Moock.Stub = function Stub(value){
        function stb(){
            var value = stb.returned;

            stb.used++;

            if (stb.tests.used && stb.used > stb.tests.used) {
                throw "Calling a function more times than allowed. Expected: " + stb.tests.used + ". Called: " + stb.used;
            }

            stb.args = [].slice.call(arguments);

            if (stb.tests.args) Moock.Assert.areEqual(
                stb.tests.args
                , stb.args
                , "Passed parameters do not meet expectations"
            );

            stb.argument_stack.push(stb.args);

            if (value === Moock.return_self) return this;
            if (typeof value == 'function') return value.apply(stb,arguments);
            return value;
        }

        /* Syntax Helpers */

        /**
         * reset all counters.
         *
         * @return {Function} the stub object
         */
        stb.reset = function reset(){
            stb.used = 0;
            stb.args = [];
            stb.argument_stack = [];

            stb.returned = value;

            stb.tests = {
                used : false
                , args : false
            };

        };

        /**
         * How many times the function should run
         * @param {Boolean|Number} num if set to true, will expect the function to run at least once.
         *    If a number is supplied, should run the exact amount of times.
         *
         * @return {Function} the stub object
         */
        stb.called = function shouldBeCalled(num){
            if (!num && num !==0){
                stb.tests.used = true;
            }else if (num || num===0){
                stb.tests.used = num;
            }
            return stb;
        };

        /**
         * What argument should the function receive
         * @param {Array} args
         *
         * @return {Function} the stub object
         */
        stb.receive = function(args){
            stb.tests.args = args;
            return stb;
        };

        /**
         * what value whould the stub retrun (can function as a replacement for the value argument)
         *
         * @param {Mixed} value
         *
         * @return {Function} the stub object
         */
        stb.returnedValue = function(value){
            stb.returned = value;
            return stb;
        };

        /**
         * tests that the expectation defined were met.
         *
         * @return {Function} the stub object
         */
        stb.test = function(){
            var msg = "Number of calls did not meet expectation";

            if (typeof this.tests.used === 'number'){
                Moock.Assert.areEqual(this.tests.used,this.used,msg);
            }else if (this.tests.used) Moock.Assert.isTrue(!!this.called,msg);

            return stb;
        };

        stb.reset();

        return stb;
    };

    /* Helper Functions */

    /**
     * checks if a passed variable is a stub
     * @param {Object} stub
     * @return {bool}
     */
    Moock.isStub = function isStub(stub){
        return ("args" in stub && "called" in stub);
    };


    /**
     * This Object allows you to selectively stub certain methods of an object, as well as
     * add tests to it's constructor
     *
     * @param Object|Function  obj          the object to test
     * @oaram Object           list         a key value pairs of methods to stub and their returned value eg. {someMethod:'a', anotherMethod : Moock.return_self }
     * @param Function         constructor  a function to run inside the constructor. Will recieve the arguments as a paramter
     *
     *
     * This returned constructor will have a namespaced member called moock that privdes the same methods as a Stub does (called, received, test).
     * Note that `received` will be passed an array of passed arguments ([ ['a','b'], ['e','f'] ])
     */
    Moock.Mock = function(obj,list,constructor){
        list = list || {};

        var key
            , moock = {
                used : 0
                , args : []
                , tests : {
                    used : false
                    , args : false
                }
                , called : function(num){
                    this.tests.used = num;
                    return this;
                }
                , received : function(args){
                    this.tests.args = args;
                    return this;
                }
                , test : function(){
                    var msg = "Number of calls did not meet expectation";

                    if (typeof this.tests.used === 'number'){
                        Moock.Assert.areEqual(this.tests.used,this.used,msg);
                    }else if (this.tests.used) Moock.Assert.isTrue(!!this.called,msg);

                    return this;
                }
            };

        function Mock(){
            var args = Array.prototype.splice.call(arguments,0);

            if (typeof obj == 'function') obj.apply(this,args);
            constructor && constructor.apply(this,args);

            moock.used++;
            moock.args.push(args);
        }

        Mock.moock= moock;
        Mock.prototype = obj.prototype;

        for (key in list) if (list.hasOwnProperty(key)){
            Mock.prototype[key] = new Moock.Stub(list[key]);
        }

        return Mock;
    };

    /**
     * Allows spying on a function or on an object's method
     *
     * Syntax #1:
     *
     * @param {function} method the function to spy on
     * @params {function} [cb] a test function to run before the target runs
     *
     * Syntax #2:
     * @param {object} obj    object to spy on
     * @param {string} method method to spy on
     * @param {function} [cb] a test function to run before the target runs
     *
     * @returns {*} the returned values of the wrapped method
     */
    Moock.wrap = function(obj, method, cb){
        var method_name = method;

        if (typeof obj == 'function') {
            cb = method;
            method = obj;
            obj = null;
        } else {
            method = obj[method];
        }

        var stb = new Moock.Stub(function(){
            var ret;

            cb && cb.apply(null, arguments);
            ret = method.apply(obj, arguments);

            return ret;
        });


        if (obj) {
            obj[method_name] = stb;

            stb.restore = function(){
                if (obj) {
                    obj[method_name] = method;
                }
            };
        } else {
            return stb;
        }
    };

    try{
        module.exports = Moock;
    }catch(e){}

}).apply(this,[window]);
