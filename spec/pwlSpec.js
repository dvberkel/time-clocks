/*global describe, it, expect, pwl*/
describe('pwl', function(){
    'use strict';
    it('should exist', function(){
	expect(pwl).toBeDefined();
    });

    it('should have a \'System\' property', function(){
	expect(pwl.System).toBeDefined();
    });
});
