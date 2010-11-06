TestCase("AssertTest",{
	"test that JsTestDriver is availabe" : function(){
		assertObject(Moock.Libraries.JsTestDriver);
		assertTrue(Moock.Libraries.JsTestDriver.check);
	}
	, "test that JTD isTrue is used on Assertion" : function(){
		var jtd = Moock.Libraries.JsTestDriver
		  , temp = jtd.isTrue;
		  
	   jtd.isTrue = new Moock.Stub();
	   
	   Moock.Assert.isTrue(true,"msg");
	   
	   assertTrue(!!jtd.isTrue.used);
	   
	   jtd.isTrue = temp;
	}
    , "test that JTD isTrue gets correct args on assertion" : function(){
        var jtd = Moock.Libraries.JsTestDriver
          , temp = jtd.isTrue;
          
       jtd.isTrue = new Moock.Stub();
       
       Moock.Assert.isTrue(true,"msg");
       
       assertEquals([true,'msg'],jtd.isTrue.args);
       
       jtd.isTrue = temp;
    }
	, "test YUI lib not used on assertion" : function(){
		var jtd = Moock.Libraries.JsTestDriver
		  , YUI = Moock.Libraries.YUI
          , y_temp = YUI.isTrue
		  , j_temp = jtd.isTrue;
          
       YUI.isTrue = new Moock.Stub();
	   jtd.isTrue = new Moock.Stub();
	   
	   Moock.Assert.isTrue(true);
	   
	   assertEquals(0,YUI.isTrue.used);
	   
	   jtd.isTrue = j_temp;
	   YUI.isTrue = y_temp;
	}
	, "test library addition use isTrue" : function(){
		var libs = Moock.Libraries
		  , mock = {
		  	   check :true
			   , isTrue : new Moock.Stub()
		  };
		
		libs.JsTestDriver.check = false;  
		
		libs.mock = mock;
		
		Moock.Assert.isTrue(true);
		
		assertTrue(!!libs.mock.isTrue.used);
		
		delete libs['mock'];  
		libs.JsTestDriver.check = true;
	} 
	, "test library addition uses areEqual" : function(){
        var libs = Moock.Libraries
          , mock = {
               check :true
               , areEqual : new Moock.Stub()
          };
		  
        libs.mock = mock;
        
        Moock.Assert.areEqual();
        
        assertTrue(!!libs.mock.areEqual.used);
        
        delete libs['mock'];  
    } 
});