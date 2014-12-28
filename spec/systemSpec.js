/*global describe, it, expect, beforeEach, pwl*/
describe('pwl.System', function(){
    'use strict';

    var system;

    beforeEach(function(){
	system = new pwl.System();
    });

    it('should be created', function(){
	expect(system).toBeDefined();
    });

    it('should create processes', function(){
	expect(system.createProcess()).toBeDefined();
    });

    it('should notify of process creation', function(){
	var notified = false;
	system.on('processCreated', function(){ notified = true; });

	system.createProcess();

	expect(notified).toBeTruthy();
    });

    it('notification of process creation should pass created process', function(){
	var notifiedProcess = false;
	system.on('processCreated', function(process){ notifiedProcess = process; });

	var actualProcess = system.createProcess();

	expect(actualProcess).toEqual(notifiedProcess);
    });
});
