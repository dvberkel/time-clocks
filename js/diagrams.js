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
    var doNotShowTextOptions = {
        'width': 640, 'height': 480,
        'processViewOptions': {
            'eventViewOptions': {
                'showText': false
            }
        }
    };
    var diagrams = {
        'diagram.introduction': function(id){
	        var container = document.getElementById(id);
	        container.addEventListener('mousedown', function(event){
		        if (event.shiftKey) {
		            system.createProcess();
		        }
	        });

	        new pwl.SystemView(system, container, { 'width': 640, 'height': 480 });
        },
        'diagram.happend-before-1': function(id){
	        var container = document.getElementById(id);
            var happendBefore = new pwl.System();
	        new pwl.SystemView(happendBefore, container, doNotShowTextOptions);
            var p = happendBefore.createProcess();
            p.createEvent();
            p.createEvent();
        },
        'diagram.happend-before-2': function(id){
	        var container = document.getElementById(id);
            var happendBefore = new pwl.System();
	        new pwl.SystemView(happendBefore, container, doNotShowTextOptions);
            var p = happendBefore.createProcess();
            var p1 = p.createEvent();
            p.createEvent();
            var q = happendBefore.createProcess();
            var q1 = q.createEvent();
            p1.sendMessageTo(q1);
        },
        'diagram.happend-before-3': function(id){
	        var container = document.getElementById(id);
            var happendBefore = new pwl.System();
	        new pwl.SystemView(happendBefore, container, doNotShowTextOptions);
            var p = happendBefore.createProcess();
            var p1 = p.createEvent();
            p.createEvent();
            p.createEvent();
            var q = happendBefore.createProcess();
            var q1 = q.createEvent();
            q.createEvent();
            p1.sendMessageTo(q1);
        },
        'diagram.concurrent': function(id){
	        var container = document.getElementById(id);
            var happendBefore = new pwl.System();
	        new pwl.SystemView(happendBefore, container, doNotShowTextOptions);
            var p = happendBefore.createProcess();
            var p1 = p.createEvent();
            var p2 = p.createEvent();
            var q = happendBefore.createProcess();
            var q1 = q.createEvent();
            var q2 = q.createEvent();
            p1.sendMessageTo(q2);
            q1.sendMessageTo(p2);
        },
        'diagram.logical-clock': function(id){
	        var container = document.getElementById(id);
            var happendBefore = new pwl.System();
	        new pwl.SystemView(happendBefore, container, { 'width': 640, 'height': 480 });
            var p = happendBefore.createProcess(new pwl.Clock(2, 3));
            p.createEvent();
            p.createEvent();
            p.createEvent();
        }
    };
    for (var id in diagrams) {
        render(id, diagrams[id]);
    }

    window.system = system;
})(Reveal, pwl);
