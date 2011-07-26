/*
---
description: A Class Mutator for mocking classes

license: MIT-style

authors:
- Arieh Glazer

requires:
- core/1.3: [Class]

provides: [Class.Mutators.Mock]

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
if (!Class) var Class = {Mutators : {}};

/**
 * creates a stub function
 * @param {Mixed} value if passed, the stub will return this value once it runs.
 * @return {Function} a stub function
 */
Class.Mutators.Mock = function(methods){
    for (var name in methods){
        if (!(methods.hasOwnProperty(name))) continue;
        
        this.prototype[name] = new Moock.Stub(methods[name]);
    }
};

/* Helper Functions */

/**
 * Creates a mock object that is an instance of a given class
 * @param {String} classname the name of that Class to be mocked.
 * @param {Object} methods a list of method names and their returned values
 * 
 * @return {Class} a new Mocked Class
 */
function getMock(classname,methods){

    if (window[classname]){
        return new Class({
            Extends : window[classname]
            , Mock : methods
        });
        
    }
    
    return window[classname] = new Class({Mock:methods});
}