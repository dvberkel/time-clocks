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
    function render(id, callback){
        Reveal.addEventListener(id, function(event){
	        if (!isRendered[event.type]) {
	            isRendered[event.type] = true;
                callback(id);
	        }
        });
    }
    var diagrams = {
        'diagram.introduction': function(){
	        var container = document.getElementById('diagram.introduction');
	        container.addEventListener('mousedown', function(event){
		        if (event.shiftKey) {
		            system.createProcess();
		        }
	        });

	        new pwl.SystemView(system, container, { width: 640, height: 480 });
        },
        'diagram.happend-before-1': function(){
	        var container = document.getElementById('diagram.happend-before-1');
            var happendBefore = new pwl.System();
	        new pwl.SystemView(happendBefore, container, { width: 640, height: 480 });
            var p = happendBefore.createProcess();
            p.createEvent();
            p.createEvent();
        }
    };
    for (var id in diagrams) {
        render(id, diagrams[id]);
    }

    window.system = system;
})(Reveal, pwl);
