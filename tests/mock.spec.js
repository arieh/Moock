describe('Moock.Mock', function(){
    function Test(){
        this.test_ran = true;
    }

    beforeEach(function(){
        Test.prototype = {
            constructor : Test,
            callA : function(){
                return 'a';
            },
            callB : function(){
                return 'b';
            },
            callBoth : function(){
                return this.callA() + this.callB();
            }
        };
    });

    it("Should allow mocking an object's constructor", function(){
        var test = false,
            Mock = Moock.Mock(Test, null, function(){
                test = true;
            });

        Mock.moock.called(1);

        var mock = new Mock();

        Mock.moock.test();
        expect(test).toBe(true);
        expect(mock.test_ran).toBe(true);
    });

    it("Should allow mocking a method", function(){
        var Mock = Moock.Mock(Test, {
            callA : function(){
                return 'C'
            }
        });

        var mock = new Mock();

        mock.callA.called(1);

        expect(mock.callBoth()).toEqual('Cb');

        mock.callA.test();
    });
});