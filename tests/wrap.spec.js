var Moock = require('../src/Moock');

describe('Moock.wrap', function(){
    var o_setTimeout = window.setTimeout;

    afterEach(function(){
        window.setTimeout = o_setTimeout;
    });

    describe("Wrapping a function", function(){
        it("Should allow wrapping a function", function(done){
            window.setTimeout = Moock.wrap(window.setTimeout);

            function test(){
                window.setTimeout.test();
                done();
            }

            window.setTimeout.called(1);
            window.setTimeout.receive([test, 1000]);
            window.setTimeout(test, 1000);
        });

        it("Should allow passing a test function", function(done){
            var arg;

            window.setTimeout = Moock.wrap(window.setTimeout, function(cb, time){
                arg = time;
            });

            window.setTimeout(done, 123);

            expect(arg).toBe(123);
        });
    });

    describe("Wrapping a method", function(){
        it("Should allow wrapping a method", function(done){
            Moock.wrap(window,'setTimeout');

            window.setTimeout.returnedValue(done);

            setTimeout(done, 1000);
        });

        it("Should have a restore method", function(done){
            Moock.wrap(window,'setTimeout');

            window.setTimeout(function(){
                window.setTimeout.restore();

                expect(window.setTimeout).toBe(o_setTimeout);
                done();
            }, 1000);
        });
    });
});
