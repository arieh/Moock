describe('Moock.Stub', function(){
    var stb;

    beforeEach(function(){
        stb = new Moock.Stub;
    });

    describe("Stub.called", function(){
        it("Should update the `used` counter", function(){
            stb();

            expect(stb.used).toBe(1);

            stb();
            stb();

            expect(stb.used).toBe(3);
        });

        it("Should work with the `test` method", function(){
            stb.called(3);

            stb();
            stb();
            stb();

            stb.test();
        });

        it("Should fail if called more than expected", function(){
            stb.called(2);

            function test(){
                stb();
            }

            stb();
            stb();

            expect(test).toThrow();
        });

        it("Should allow testing that a method should never be called", function(){
            stb.called(0);

            expect(function(){
                stb();
            }).toThrow();
        });

        it("Should allow testing that method is called at least once", function(){
            stb.called();

            stb();

            stb.test();
        });
    });

    describe("Returned value", function(){
        it("Should allow returning normal values", function(){
            [1, 'abc', ['a'], {}].forEach(function(value){
                stb.returnedValue(value);

                expect(stb()).toBe(value);
            });
        });

        it("Should allow value to be a function", function(){
            var test = function(){
                test.called = true;
                return "test called";
            };

            stb.returnedValue(test);

            expect(stb()).toBe('test called');
            expect(test.called).toBe(true);
        });

        it("Should allow chaining", function(){
            var obj = {
                a: stb
            };

            stb.returnedValue(Moock.return_self);

            expect(obj.a()).toBe(obj);
        });

        it("Should also work with the Stub constructor", function(){
            var test = function(){
                test.called = true;
            };

            stb = new Moock.Stub(test);
            stb();
            expect(test.called).toBe(true);
        });
    });

    describe("Testing arguments", function(){
        it("Should populate the `args` property", function(){
            stb("a","b",{a:'b'});

            expect(stb.args).toEqual(['a','b',{a:'b'}]);
        });

        it("Should populate the argument_stack property", function(){
            var args = [
                ['a', 'b'],
                [['a'], {a:'b'}],
                [null, false, true, 1, 10]
            ];
            args.forEach(function(args){
                stb.apply(null,args);
            });

            expect(stb.argument_stack).toEqual(args);
        });

        it("Should also work with the `receive` method", function(){
            stb.receive(['a','b']);

            stb('a','b');
        });
    });
});