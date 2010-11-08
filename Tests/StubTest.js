TestCase("StubTest",{
    "test stub called is false when not called" : function(){
       var stub = new Moock.Stub();
       assertFalse(stub.used == true);            
    } 
    , "test stub called is true when called" : function(){
       var stub = new Moock.Stub();
       stub();
       assertTrue(stub.used == true); 
    }
    , "test stub uses returned vale" : Fixture(
       function(expected){
        var stub = new Moock.Stub(expected);
        assertEquals(expected,stub());
       }  
       , [
           ["aaa"]
           ,["bbb"]
           ,[111]
       ]
    )
    , "test stub saves received arguments" : Fixture(
       function(arg1,arg2){
        var stub = new Moock.Stub();
        stub(arg1,arg2);
        assertEquals([arg1,arg2],stub.args);
       }
       ,[
           ['aa','bb']
           ,[{a:'b'},2]
           ,[1,2]
       ]
    ) 
	, "test isStub" : function(){
		var stub = new Moock.Stub();
		assertTrue(isStub(stub));
	}, "test stub with function" : function(){
		var used = false;
		var stub = new Moock.Stub(function(args){
		  used = true;
		  assertEquals(["a","b"],arguments);
		  return "aabb";	 
		});
		assertEquals("aabb",stub("a","b"));
		assertTrue(used);
	}
    , "test chaining" : function(){
		var obj = {			
				a:new Moock.Stub(Moock.return_self)
			}
	       , test = obj.a(); 
		
		assertSame(obj,test);
	}
	, "test stub.called using 0" : function(){
		var stub = new Moock.Stub();
		stub.called(0);
		stub.test();
	}
	, "test stub.called using true" :function(){
		var stub = new Moock.Stub();
		stub.called();
		stub();
		stub.test();
	}
    , "test stub.called multiple" : function(){
		var stub = new Moock.Stub().called(2);
		stub();
		stub();
		stub.test();
	}
	, "test stub.receive should work" : Fixture(
       function(){
        var stub = new Moock.Stub().receive(arguments);
		stub.apply(null,arguments);
		stub.test();
       }
       ,[
           ['aa','bb']
           ,[{a:'b'},2]
           ,[1,2]
       ]
    )
	, "test stub.returnedValue" : Fixture(
       function(expected){
        var stub = new Moock.Stub().returnedValue(expected);
        assertEquals(expected,stub());
       }  
       , [
           ["aaa"]
           ,["bbb"]
           ,[111]
       ]
    )
	, "test mocking getElementById" : function(){
		var gid = document.getElementById;
		document.getElementById = 
		    new Moock.Stub()
		       .called(1)
		       .receive(["a"])
		       .returnedValue(document.createElement('div'));
		       
		document.getElementById("a");
			   
		document.getElementById.test();
		
		document.getElementById = gid;
	}
}); 


