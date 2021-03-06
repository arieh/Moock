/*
---
description: Adds Extra Library support for Moock.Assert

license: MIT-style

authors:
- Arieh Glazer

provides: [Moock.Libraries.YUI,Moock.Libraries.QUnit,Moock.Libraries.jasmine]

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

!function(global){

Moock.Libraries.YUI =  {
	    check : !!(this.YAHOO && YAHOO.utils && YAHOO.utils.Assert)
	    , isTrue : function(expr,msg){
	        YAHOO.utils.Assert.isTrue(expr,msg);
	    }
	    , areEqual : function(expect,actual,msg){
	        YAHOO.utils.Assert.areEqual(expect,actual,msg);
	    }
	};
	
Moock.Libraries.QUnit = {
        check : !!(this.QUnit && QUnit.ok && QUnit.equal)
        , isTrue : function(expr,msg){
            QUnit.ok(expr,msg);
        }
        , areEqual : function(expect,actual,msg){
            QUnit.equal(actual,expect,msg);
        }
    };
Moock.Libraries.JsTestDriver  = {
        check : !!(window.assertTrue && window.assertEquals)
            , isTrue : function(expr,msg){
            if (msg){
                assertTrue(msg,expr);
            } else assertTrue(expr);
        }
        , areEqual : function(expect,actual,msg){
            if (msg){
                assertEquals(msg,expect,actual);
            } else assertEquals(expect,actual);
        }
    };

    try{
        module.exports = Moock;
    }catch(e){}
		
}.apply(window || this);
