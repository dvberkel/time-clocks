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

    var Process = function(){};

    var System = pwl.System = function(){
	Observable.call(this);
	this.processes = [];
    };
    System.prototype = Object.create(Observable.prototype);
    System.prototype.constructor = System;
    System.prototype.createProcess = function(){
	var process = this.processes.push(new Process(this));
	this.signal('processCreated', process);
	return process;
    };
})(window.pwl = window.pwl || {});
