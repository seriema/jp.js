(function() {
	'use strict';

	module('Burndown.attributes');
	
	var paper;
	var guidelineDataStop = [25, 0];
	var burndownData1 = [25,21,20,17,15, 12,11,10,8, 7,5,3,0];
	var burndownData2 = [25,24,23,19,19, 17,15,12,11, 9,8,5,2];
	var burndownData3 = [25,20,18,14,12, 10,8,6,5, 3,1,0,0];
	var burndownData4 = [25,21,21,19,17, 14,13,11,9, 7,7,4,1];
	var burndownDataStop = [burndownData1, burndownData2, burndownData3, burndownData4];
//	var colors = ['#001', '#002', '#003', '#004'];
	var labels = ['Jan', '', '', '', '', 'Feb', '', '', '', 'Mar', '', '', ''];

	var width = 680;
	var height = 200;
//	var yMax = 25;
	var defaults;
	
	QUnit.testStart(function() {
		paper = window.Raphael('qunit-fixture', width,height);
		defaults = window.Raphael.fn.burndown3.defaults;
	});
	
	QUnit.testDone(function() {
		window.Raphael.fn.burndown3.defaults = defaults;
	});
	
	test('Burndown line uses default color', function() {
		var graph = paper.burndown3(guidelineDataStop, burndownDataStop, labels);
		var bline = graph.burndown.line.attr('stroke');
		var expected = window.Raphael.fn.burndown3.defaults.colors.burndown;
		
		strictEqual(bline, expected);
	});

	test('Burndown line default color can be changed', function() {
		var color = '#bada55';
		window.Raphael.fn.burndown3.defaults.colors.burndown = color;

		var graph = paper.burndown3(guidelineDataStop, burndownDataStop, labels);
		var bline = graph.burndown.line.attr('stroke');
		
		strictEqual(bline, color);
	});
	
	test('Burndown line color can be set by user', function() {
		var color = '#bada55';
		var graph = paper.burndown3(guidelineDataStop, burndownDataStop, labels, [color]);
		var bline = graph.burndown.line.attr('stroke');
		
		strictEqual(bline, color);
	});
	
	test('Burndown area uses default color', function() {
		var graph = paper.burndown3(guidelineDataStop, burndownDataStop, labels);
		var barea = graph.burndown.area.attr('fill');
		var expected = window.Raphael.fn.burndown3.defaults.colors.burndown;
		
		strictEqual(barea, expected);
	});

	test('Burndown area default color can be changed', function() {
		var color = '#bada55';
		window.Raphael.fn.burndown3.defaults.colors.burndown = color;

		var graph = paper.burndown3(guidelineDataStop, burndownDataStop, labels);
		var barea = graph.burndown.area.attr('fill');
		
		strictEqual(barea, color);
	});
	
	test('Burndown area color can be set by user', function() {
		var color = '#bada55';
		var graph = paper.burndown3(guidelineDataStop, burndownDataStop, labels, [color]);
		var barea = graph.burndown.area.attr('fill');
		
		strictEqual(barea, color);
	});
	
	
	module('Burndown.math');
	
	test('Finds max Y on optimal burndown', function() {
		var data = [[5,4,3,2,1,0]];
		var expected = 5;
		var result = window.Raphael.fn.burndown3.math.findYMax(data);
		
		strictEqual(result, expected);
	});

	test('Finds max Y on bad burndown', function() {
		var data = [[5,4,3,6,1,0]];
		var expected = 6;
		var result = window.Raphael.fn.burndown3.math.findYMax(data);
		
		strictEqual(result, expected);
	});

	test('Finds max Y on horrible burndown', function() {
		var data = [[5,6,7,8,9]];
		var expected = 9;
		var result = window.Raphael.fn.burndown3.math.findYMax(data);
		
		strictEqual(result, expected);
	});
	
	test('Inverts Y-value so that 0 on graph has correct value on Raphael paper', function() {
		var yValue = window.Raphael.fn.burndown3.math.invertY(height, 0);
		var expected = height - defaults.gutter.y;

		strictEqual(yValue, expected);
	});
}());