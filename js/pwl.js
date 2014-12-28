/*global window:true*/
;(function(pwl, undefined){
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
})(window.pwl = window.pwl || {});
