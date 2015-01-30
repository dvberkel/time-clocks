/*global window, document, Reveal, pwl*/
;(function(Reveal, pwl){
    'use strict';
    var system = new pwl.System();

    var r = 114;
    document.body.addEventListener('keypress', function(event){
        if (event.charCode === r) {
            pwl.connector.reset();
        }
    });

    Reveal.addEventListener('slidechanged', function(){
        pwl.connector.reset();
    });

    var isRendered = { /* used to keep track of which slides are already rendered */ };
    Reveal.addEventListener('diagram.introduction', function(event){
	    if (!isRendered[event.type]) {
	        isRendered[event.type] = true;
	        var container = document.getElementById('diagram.introduction');
	        container.addEventListener('mousedown', function(event){
		        if (event.shiftKey) {
		            system.createProcess();
		        }
	        });

	        new pwl.SystemView(system, container, { width: 640, height: 480 });
	    }
    });

    var e = 101;
    document.body.addEventListener('keypress', function(event){
        if (event.charCode === e) {
            var p = system.createProcess();
            var q = system.createProcess();

            var p1 = p.createEvent();
            p.createEvent();
            p.createEvent();

            var q1 = q.createEvent();
            q.createEvent();

            pwl.connector.register(p1);
            pwl.connector.register(q1);
        }
    });

    window.system = system;
})(Reveal, pwl);
