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

    window.system = system;
})(Reveal, pwl);
