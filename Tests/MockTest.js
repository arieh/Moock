TestCase("Class.Mock Test",{
	"test mock creates a stub" : function(){
		var mock = new Class({
			Mock : {
				"a" : null
			}
		});
		
		var m = new mock;
        assertTrue(isStub(m.a));
	},
	"test mock an existing class" : function(){
		var cls = new Class({
			a:function(){}
	    });
		var mock = new Class({
		  Extends : cls
		  , Mock :{
		  	"a" : null
		  }	
		});
		
		assertFalse(isStub(new cls().a));
		var m = new mock;
		assertTrue(m instanceof cls);
		assertTrue(isStub(m.a));
	}
	, "test mock only part of class" : function(){
		
		var cls = new Class({
			getA : function(){return this.a();}
			, a : function(){return "a";}
		});
		
		var mock = new Class({
			Extends : cls
			, Mock : {
				"a" : "b"
			}
		});
		
		var m = new mock;
		
		assertEquals("b", m.getA());
	}
	, "test mock receives arguments" : function(){
		var cls = new Class({
            getA : function(){this.a("b");}
            , a : function(){return "a";}
        });
		
        var mock = new Class({
            Extends : cls
            , Mock : {
                "a" : "b"
            }
        });
		
		var m = new mock;
		m.getA();
		assertTrue(m.a.used == true);
		assertEquals(["b"],m.a.args);
	}
});
