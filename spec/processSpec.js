/*global describe, it, expect, beforeEach, pwl*/
describe('process', function(undefined){
    'use strict';
    var process;

    beforeEach(function(){
	var system = new pwl.System();
	process = system.createProcess();
    });

    it('should be defined', function(){
	expect(process).toBeDefined();
    });

    it('should create events', function(){
	expect(process.createEvent()).toBeDefined();
    });

    it('should notify of event creation', function(){
	var notified = false;
	process.on('eventCreated', function(){ notified = true; });

	process.createEvent();

	expect(notified).toBeTruthy();
    });

    it('event creation should pass created event', function(){
	var notifiedEvent;
	process.on('eventCreated', function(event){ notifiedEvent = event; });

	var actualEvent = process.createEvent();

	expect(actualEvent).toEqual(notifiedEvent);
    });
});
