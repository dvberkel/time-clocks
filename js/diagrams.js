/*global document, Reveal, pwl*/
;(function(Reveal, pwl){
    'use strict';
    var system = new pwl.System();

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
})(Reveal, pwl);
