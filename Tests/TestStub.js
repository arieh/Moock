TestCase("StubTest",{
    "test stub called is false when not called" : function(){
       var stub = getStub();
       assertFalse(stub.called);            
    } 
    , "test stub called is true when called" : function(){
       var stub = getStub();
       stub();
       assertTrue(stub.called); 
    }
    , "test stub uses returned vale" : Fixture(
       function(expected){
        var stub = getStub(expected);
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
        var stub = getStub();
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
		var stub = getStub();
		assertTrue(isStub(stub));
	}, "test stub with function" : function(){
		var used = false;
		var stub = getStub(function(args){
		  used = true;
		  assertEquals(["a","b"],arguments);
		  return "aabb";	 
		});
		assertEquals("aabb",stub("a","b"));
		assertTrue(used);
	}
    , "test chaining" : function(){
		var obj = {			
			a:getStub(Moock.return_self)
		};
		
		assertTrue(obj === obj.a());
	}
}); 