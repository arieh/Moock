describe('Moock.wrap', function(){
    //var window = {
    //    setTimeout : function setTimeout(cb, delay){
    //        cb();
    //    }
    //};

    var o_setTimeout = window.setTimeout;

    afterEach(function(){
        window.setTimeout = o_setTimeout;
    });

    describe("Wrapping a function", function(){
        it("Should allow wrapping a function", function(done){
            window.setTimeout = Moock.wrap(window.setTimeout);

            function setTimeout(){
                window.setTimeout.test();
                done();
            }

            window.setTimeout.called(1);
            window.setTimeout.receive([setTimeout, 100]);
            window.setTimeout(setTimeout, 100);
        });

        it("Should allow passing a setTimeout function", function(done){
            var arg=null;

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

            window.setTimeout(done, 100);
        });

        it("Should have a restore method", function(done){
            Moock.wrap(window,'setTimeout');

            window.setTimeout(function(){
                window.setTimeout.restore();

                expect(window.setTimeout).toBe(o_setTimeout);
                done();
            }, 100);
        });
    });
});
