/*global window:true, Raphael*/
;(function(pwl, raphael, undefined){
    /* pwl stands for papers-we-love */
    'use strict';

    var Observable = function(){
        this.observers = {};
    };
    Observable.prototype.on = function(event, callback){
        (this.observers[event] = this.observers[event] || []).push(callback);
    };
    Observable.prototype.signal = function(event){
        var args = Array.prototype.slice.call(arguments, 1);
        (this.observers[event] || []).forEach(function(callback){
            callback.apply(undefined, args);
        }.bind(this));
    };

    var Event = function(){};

    var Process = pwl.Process = function(){
        Observable.call(this);
        this.events = [];
    };
    Process.prototype = Object.create(Observable.prototype);
    Process.constructor = Process;
    Process.prototype.createEvent = function(){
        var event = new Event(this);
        this.signal('eventCreated', event);
        return event;
    };

    var System = pwl.System = function(){
        Observable.call(this);
        this.processes = [];
    };
    System.prototype = Object.create(Observable.prototype);
    System.prototype.constructor = System;
    System.prototype.createProcess = function(){
        var process = new Process(this);
        this.processes.push(process);
        this.signal('processCreated', process);
        return process;
    };

    function extend(){
        var result = {};
        Array.prototype.slice.call(arguments).forEach(function(argument){
            for (var key in argument) {
                if (argument.hasOwnProperty(key)) {
                    result[key] = result[key] || argument[key];
                }
            }
        });
        return result;
    }


    var defaultProcessViewOptions = {
	'width': 2
    };
    var ProcessView = function(process, paper, index, options){
	this.options = extend(options || {}, defaultProcessViewOptions);
	this.process = process;
	this.paper = paper;
	this.index = index;
	this.total = index + 1;
	this.update();
    };
    ProcessView.prototype.update = function(){
	var position = (this.index + 1) * this.paper.width / this.total;
	var line = this.line();
	line.attr('x', position);
    };
    ProcessView.prototype.line = function(){
	if (!this._line) {
	    var line = this._line = this.paper.rect(
		0,
		0,
		this.options.width,
		this.paper.height
	    );
	    line.attr({
		'fill': 'black'
	    });
	}
	return this._line;
    };
    ProcessView.prototype.updateNumberOfSiblings = function(total){
	this.total = total;
	this.update();
    };


    var defaultSystemViewOptions = {
        'width': 640,
        'height': 480,
	'fillColor': 'white',
	'processViewOptions': {
	    'width': 2
	}
    };
    var SystemView = pwl.SystemView = function(system, container, options){
	Observable.call(this);
        this.options = extend(options || {}, defaultSystemViewOptions);
        this.system = system;
        this.paper = raphael(
            container,
            this.options.width,
            this.options.height
        );
	this.processViewCount = 0;
	this.system.on('processCreated', this.createProcessView.bind(this));
        this.initialize();
    };
    SystemView.prototype = Object.create(Observable.prototype);
    SystemView.prototype.constructor = SystemView;
    SystemView.prototype.initialize = function(){
        var background = this.paper.rect(
            0, 0,
            this.options.width, this.options.height
	);
        background.attr({
            'fill': this.options.fillColor
        });
    };
    SystemView.prototype.createProcessView = function(process){
	var processView = new ProcessView(
	    process,
	    this.paper,
	    this.processViewCount++,
	    this.options.processViewOptions
	);
	this.on('processViewCreated', processView.updateNumberOfSiblings.bind(processView));
	this.signal('processViewCreated', this.processViewCount);
    };
})(window.pwl = window.pwl || {}, Raphael);
