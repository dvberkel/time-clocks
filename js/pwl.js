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

    var IdGenerator = function(){
        this.nextId = 0;
    };
    IdGenerator.prototype.next = function(){
        return this.nextId++;
    };

    var eventIdGenerator = new IdGenerator();

    var Event = function(){
        Observable.call(this);
        this.id = eventIdGenerator.next();
        this.to = [];
        this.from = [];
    };
    Event.prototype = Object.create(Observable.prototype);
    Event.prototype.constructor = Event;
    Event.prototype.sendMessageTo = function(event) {
        this.to.push(event);
        event.from.push(this);
        this.signal('messaged', this.id, event.id);
    };

    var Connector = function(){
        this.reset();
    };
    Connector.prototype.register = function(event) {
        if (this.events.length < 2) {
            this.events.push(event);
        }
        if (this.events.length === 2) {
            this.connect();
        }
    };
    Connector.prototype.reset = function(){
        this.events = [];
    };
    Connector.prototype.connect = function(){
        if (this.events.length !== 2){
            throw new Error('unable to connect ' + this.events.length + '%s events');
        }
        this.events[0].sendMessageTo(this.events[1]);
        this.reset();
    };

    var connector = pwl.connector = new Connector();

    var Process = pwl.Process = function(){
        Observable.call(this);
        this.events = [];
    };
    Process.prototype = Object.create(Observable.prototype);
    Process.constructor = Process;
    Process.prototype.createEvent = function(){
        var event = new Event(this);
	    this.events.push(event);
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

    var defaultMessageViewOptions = {
        'dasharray': ['--..']
    };
    var MessageView = function(origin, target, paper, options){
        this.options = extend(options || {}, defaultMessageViewOptions);
        this.origin = origin;
        this.target = target;
        this.paper = paper;
        var boundUpdate = this.update.bind(this);
        this.origin.on('moved', boundUpdate);
        this.target.on('moved', boundUpdate);
        this.update();
    };
    MessageView.prototype.update = function(){
        if (this._line){
            this._line.remove();
        }

        var o = this.origin.circle();
        var t = this.target.circle();
        this._line = this.paper.path([
            'M', o.attr('cx'), ',', o.attr('cy'),
            'L', t.attr('cx'), ',', t.attr('cy')
        ]);
        this._line.attr('stroke-dasharray', this.options.dasharray);
    };

    var lookupEventView = {};
    var defaultEventViewOptions = {
	    'fill': 'black',
	    'radius': 5,
        'offset': 0.5
    };
    var EventView = function(event, paper, index, options){
        Observable.call(this);
        lookupEventView[event.id] = this;
	    this.options = extend(options || {}, defaultEventViewOptions);
	    this.event = event;
	    this.paper = paper;
	    this.index = index;
	    this.total = index + 1;
        this.cx = 0;
	    this.update();
        this.event.on('messaged',this.createMessageView.bind(this));
    };
    EventView.prototype = Object.create(Observable.prototype);
    EventView.prototype.constructor = EventView;
    EventView.prototype.updateCx = function(cx){
        this.cx = cx;
        this.update();
    };
    EventView.prototype.update = function(){
	    var position = (this.index + this.options.offset) * this.paper.height / this.total;
	    var circle = this.circle();
	    circle.attr({
	        'cy': position,
	        'cx': this.cx
	    });
        this.signal('moved');
    };
    EventView.prototype.circle = function(){
	    if (!this._circle) {
	        var circle = this._circle = this.paper.circle(
		        0,
		        0,
		        this.options.radius
	        );
	        circle.attr({
		        'fill': this.options.fill
	        });
	    }
	    return this._circle;
    };
    EventView.prototype.updateNumberOfSiblings = function(total){
	    this.total = total;
	    this.update();
    };
    EventView.prototype.createMessageView = function(originId, targetId){
        var origin = lookupEventView[originId];
        var target = lookupEventView[targetId];

        new MessageView(origin, target, this.paper);
    };

    var defaultProcessViewOptions = {
	    'fill': 'black',
	    'width': 2,
        'offset': 0.5,
        'eventViewOptions': defaultEventViewOptions
    };
    var ProcessView = function(process, paper, index, options){
	    Observable.call(this);
	    this.options = extend(options || {}, defaultProcessViewOptions);
	    this.process = process;
	    this.paper = paper;
	    this.index = index;
	    this.total = index + 1;
	    this.eventViewCount = 0;
	    this.process.on('eventCreated', this.createEventView.bind(this));
	    this.update();
    };
    ProcessView.prototype = Object.create(Observable.prototype);
    ProcessView.prototype.constructor = ProcessView;
    ProcessView.prototype.update = function(){
	    var position = this.position();
	    var line = this.line();
	    line.attr('x', position);
	    this.signal('x', position);
    };
    ProcessView.prototype.position = function(){
	    return (this.index + this.options.offset) * this.paper.width / this.total;
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
		        'fill': this.options.fill
	        });
	    }
	    return this._line;
    };
    ProcessView.prototype.updateNumberOfSiblings = function(total){
	    this.total = total;
	    this.update();
    };
    ProcessView.prototype.createEventView = function(event){
	    var eventView = new EventView(
	        event,
	        this.paper,
	        this.eventViewCount++,
	        this.options.eventViewOptions
	    );
        eventView.updateCx(this.position());
        eventView.circle().click(function(){
            connector.register(this.event);
        }.bind(eventView));
	    this.on('eventViewCreated', eventView.updateNumberOfSiblings.bind(eventView));
	    this.on('x', eventView.updateCx.bind(eventView));
	    this.signal('eventViewCreated', this.eventViewCount);
    };


    var defaultSystemViewOptions = {
        'width': 640,
        'height': 480,
	    'fillColor': 'white',
	    'processViewOptions': defaultProcessViewOptions
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
	    processView.line().click(function(event){
            if (event.metaKey) {
	            this.process.createEvent();
            }
	    }.bind(processView));
	    this.on('processViewCreated', processView.updateNumberOfSiblings.bind(processView));
	    this.signal('processViewCreated', this.processViewCount);
    };
})(window.pwl = window.pwl || {}, Raphael);
