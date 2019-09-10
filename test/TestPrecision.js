/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

const mocha = require('mocha');
const expect = require('chai').expect;
const precision = require('../src/utilities/Precision');


describe('Bali Nebula™ Component Framework - Precision', function() {

    describe('Test arithmetic operations', function() {

        it('should test addition', function() {
            expect(precision.sum(12.345, 543.21)).to.equal(555.56);
            expect(precision.sum(1.2345e+1, 5.4321e-2)).to.equal(12.399);
            expect(precision.sum(1.23456789e+1, 54.321e-3)).to.equal(12.4);
            expect(precision.sum(0, 0)).to.equal(0);
            expect(precision.sum(0, -0)).to.equal(0);
            expect(precision.sum(0, Infinity)).to.equal(Infinity);
            expect(precision.sum(0, -Infinity)).to.equal(Infinity);
            expect(precision.sum(-0, Infinity)).to.equal(Infinity);
            expect(precision.sum(-0, -Infinity)).to.equal(Infinity);
            expect(precision.sum(Infinity, Infinity)).to.equal(Infinity);
            expect(precision.sum(Infinity, -Infinity)).to.equal(Infinity);
            expect(precision.sum(-Infinity, -Infinity)).to.equal(Infinity);
        });

        it('should test subtraction', function() {
            expect(precision.difference(123.45, 54.321)).to.equal(69.13);
            expect(precision.difference(1.2345e+1, 5.4321e-2)).to.equal(12.291);
            expect(precision.difference(1.23456789e+1, 54.321e-3)).to.equal(12.291358);
            expect(precision.difference(0, 0)).to.equal(0);
            expect(precision.difference(0, -0)).to.equal(0);
            expect(precision.difference(0, Infinity)).to.equal(Infinity);
            expect(precision.difference(0, -Infinity)).to.equal(Infinity);
            expect(precision.difference(-0, 0)).to.equal(0);
            expect(precision.difference(-0, -0)).to.equal(0);
            expect(precision.difference(-0, Infinity)).to.equal(Infinity);
            expect(precision.difference(-0, -Infinity)).to.equal(Infinity);
            expect(precision.difference(Infinity, 0)).to.equal(Infinity);
            expect(precision.difference(Infinity, Infinity).toString()).to.equal(NaN.toString());
            expect(precision.difference(Infinity, -Infinity).toString()).to.equal(NaN.toString());
            expect(precision.difference(-Infinity, 0)).to.equal(Infinity);
            expect(precision.difference(-Infinity, Infinity).toString()).to.equal(NaN.toString());
            expect(precision.difference(-Infinity, -Infinity).toString()).to.equal(NaN.toString());
        });

        it('should test multiplication', function() {
            expect(precision.product(123.45, 67.8)).to.equal(8.37e+3);
            expect(precision.product(1.2345e+2, 6.789e-9)).to.equal(8.381e-7);
            expect(precision.product(1.2345e+56, 6.7e-23)).to.equal(Infinity);
            expect(precision.product(0, 0)).to.equal(0);
            expect(precision.product(0, -0)).to.equal(0);
            expect(precision.product(0, 1)).to.equal(0);
            expect(precision.product(0, -1)).to.equal(0);
            expect(precision.product(0, Infinity).toString()).to.equal(NaN.toString());
            expect(precision.product(0, -Infinity).toString()).to.equal(NaN.toString());
            expect(precision.product(-0, -0)).to.equal(0);
            expect(precision.product(-0, 1)).to.equal(0);
            expect(precision.product(-0, -1)).to.equal(0);
            expect(precision.product(-0, Infinity).toString()).to.equal(NaN.toString());
            expect(precision.product(-0, -Infinity).toString()).to.equal(NaN.toString());
            expect(precision.product(1, 1)).to.equal(1);
            expect(precision.product(1, -1)).to.equal(-1);
            expect(precision.product(1, Infinity)).to.equal(Infinity);
            expect(precision.product(1, -Infinity)).to.equal(Infinity);
            expect(precision.product(-1, Infinity)).to.equal(Infinity);
            expect(precision.product(-1, -Infinity)).to.equal(Infinity);
            expect(precision.product(Infinity, Infinity)).to.equal(Infinity);
            expect(precision.product(Infinity, -Infinity)).to.equal(Infinity);
            expect(precision.product(-Infinity, -Infinity)).to.equal(Infinity);
        });

        it('should test division', function() {
            expect(precision.quotient(1, 3)).to.equal(0.3333333333333333);
            expect(precision.quotient(123.45, 67.8)).to.equal(1.82);
            expect(precision.quotient(1.2345e+2, 7.8e-9)).to.equal(16000000000);
            expect(precision.quotient(1.2345e+56, 6.789e-23)).to.equal(Infinity);
            expect(precision.quotient(0, 0).toString()).to.equal(NaN.toString());
            expect(precision.quotient(0, -0).toString()).to.equal(NaN.toString());
            expect(precision.quotient(0, 1)).to.equal(0);
            expect(precision.quotient(0, -1)).to.equal(0);
            expect(precision.quotient(0, Infinity)).to.equal(0);
            expect(precision.quotient(0, -Infinity)).to.equal(0);
            expect(precision.quotient(-0, 0).toString()).to.equal(NaN.toString());
            expect(precision.quotient(-0, -0).toString()).to.equal(NaN.toString());
            expect(precision.quotient(-0, 1)).to.equal(0);
            expect(precision.quotient(-0, -1)).to.equal(0);
            expect(precision.quotient(-0, Infinity)).to.equal(0);
            expect(precision.quotient(-0, -Infinity)).to.equal(0);
            expect(precision.quotient(1, 0)).to.equal(Infinity);
            expect(precision.quotient(1, -0)).to.equal(Infinity);
            expect(precision.quotient(1, 1)).to.equal(1);
            expect(precision.quotient(1, -1)).to.equal(-1);
            expect(precision.quotient(1, Infinity)).to.equal(0);
            expect(precision.quotient(1, -Infinity)).to.equal(0);
            expect(precision.quotient(-1, 0)).to.equal(Infinity);
            expect(precision.quotient(-1, -0)).to.equal(Infinity);
            expect(precision.quotient(-1, 1)).to.equal(-1);
            expect(precision.quotient(-1, -1)).to.equal(1);
            expect(precision.quotient(-1, Infinity)).to.equal(0);
            expect(precision.quotient(-1, -Infinity)).to.equal(0);
            expect(precision.quotient(Infinity, 0)).to.equal(Infinity);
            expect(precision.quotient(Infinity, -0)).to.equal(Infinity);
            expect(precision.quotient(Infinity, 1)).to.equal(Infinity);
            expect(precision.quotient(Infinity, -1)).to.equal(Infinity);
            expect(precision.quotient(Infinity, Infinity).toString()).to.equal(NaN.toString());
            expect(precision.quotient(Infinity, -Infinity).toString()).to.equal(NaN.toString());
            expect(precision.quotient(-Infinity, 0)).to.equal(Infinity);
            expect(precision.quotient(-Infinity, -0)).to.equal(Infinity);
            expect(precision.quotient(-Infinity, 1)).to.equal(Infinity);
            expect(precision.quotient(-Infinity, -1)).to.equal(Infinity);
            expect(precision.quotient(-Infinity, Infinity).toString()).to.equal(NaN.toString());
            expect(precision.quotient(-Infinity, -Infinity).toString()).to.equal(NaN.toString());
        });

        it('should test remainder', function() {
            expect(precision.remainder(1, 3)).to.equal(1);
            expect(precision.remainder(24, 7)).to.equal(3);
            expect(precision.remainder(123.45, 67.8)).to.equal(55.7);
            expect(precision.remainder(1.2345e+2, 7.8e-9)).to.equal(7.2e-9);
            expect(precision.remainder(1.2345e+56, 6.789e-23).toString()).to.equal(NaN.toString());
            expect(precision.remainder(0, 0).toString()).to.equal(NaN.toString());
            expect(precision.remainder(0, -0).toString()).to.equal(NaN.toString());
            expect(precision.remainder(0, 1)).to.equal(0);
            expect(precision.remainder(0, -1)).to.equal(0);
            expect(precision.remainder(0, Infinity)).to.equal(0);
            expect(precision.remainder(0, -Infinity)).to.equal(0);
            expect(precision.remainder(-0, 0).toString()).to.equal(NaN.toString());
            expect(precision.remainder(-0, -0).toString()).to.equal(NaN.toString());
            expect(precision.remainder(-0, 1)).to.equal(0);
            expect(precision.remainder(-0, -1)).to.equal(0);
            expect(precision.remainder(-0, Infinity)).to.equal(0);
            expect(precision.remainder(-0, -Infinity)).to.equal(0);
            expect(precision.remainder(1, 0).toString()).to.equal(NaN.toString());
            expect(precision.remainder(1, -0).toString()).to.equal(NaN.toString());
            expect(precision.remainder(1, 1)).to.equal(0);
            expect(precision.remainder(1, -1)).to.equal(0);
            expect(precision.remainder(1, Infinity)).to.equal(1);
            expect(precision.remainder(1, -Infinity)).to.equal(1);
            expect(precision.remainder(-1, 0).toString()).to.equal(NaN.toString());
            expect(precision.remainder(-1, -0).toString()).to.equal(NaN.toString());
            expect(precision.remainder(-1, 1)).to.equal(0);
            expect(precision.remainder(-1, -1)).to.equal(0);
            expect(precision.remainder(-1, Infinity)).to.equal(-1);
            expect(precision.remainder(-1, -Infinity)).to.equal(-1);
            expect(precision.remainder(Infinity, 0).toString()).to.equal(NaN.toString());
            expect(precision.remainder(Infinity, -0).toString()).to.equal(NaN.toString());
            expect(precision.remainder(Infinity, 1).toString()).to.equal(NaN.toString());
            expect(precision.remainder(Infinity, -1).toString()).to.equal(NaN.toString());
            expect(precision.remainder(Infinity, Infinity).toString()).to.equal(NaN.toString());
            expect(precision.remainder(Infinity, -Infinity).toString()).to.equal(NaN.toString());
            expect(precision.remainder(-Infinity, 0).toString()).to.equal(NaN.toString());
            expect(precision.remainder(-Infinity, -0).toString()).to.equal(NaN.toString());
            expect(precision.remainder(-Infinity, 1).toString()).to.equal(NaN.toString());
            expect(precision.remainder(-Infinity, -1).toString()).to.equal(NaN.toString());
            expect(precision.remainder(-Infinity, Infinity).toString()).to.equal(NaN.toString());
            expect(precision.remainder(-Infinity, -Infinity).toString()).to.equal(NaN.toString());
        });

    });

    describe('Test power operations', function() {

        it('should test exponentiation', function() {
            expect(precision.exponential(1.2345)).to.equal(3.4367);
            expect(precision.exponential(12.345)).to.equal(2.298e+5);
            expect(precision.exponential(123.45)).to.equal(Infinity);
        });

        it('should test logarithms', function() {
            expect(precision.logarithm(3.4367)).to.equal(1.2345);
            expect(precision.logarithm(229800.1)).to.equal(12.345);
            expect(precision.logarithm(4.11e+32)).to.equal(75.096146004318);
            expect(precision.logarithm(Math.E)).to.equal(1);
        });

    });

    describe('Test trigonometric operations', function() {

        it('should test sine', function() {
            expect(precision.sine(0)).to.equal(0);
            expect(precision.sine(Math.PI / 4)).to.equal(0.7071067811865475);
            expect(precision.sine(Math.PI / 2)).to.equal(1);
            expect(precision.sine(Math.PI * 3 / 5)).to.equal(0.9510565162951536);
            expect(precision.sine(Math.PI)).to.equal(0);
            expect(precision.sine(Math.PI * 5 / 3)).to.equal(-0.8660254037844386);
            expect(precision.sine(Math.PI * 3 / 2)).to.equal(-1);
            expect(precision.sine(Math.PI * 2)).to.equal(0);
            expect(precision.sine(-Math.PI / 4)).to.equal(-0.7071067811865475);
            expect(precision.sine(-Math.PI / 2)).to.equal(-1);
            expect(precision.sine(-Math.PI * 3 / 5)).to.equal(-0.9510565162951536);
            expect(precision.sine(-Math.PI)).to.equal(0);
            expect(precision.sine(-Math.PI * 5 / 3)).to.equal(0.8660254037844386);
            expect(precision.sine(-Math.PI * 3 / 2)).to.equal(1);
            expect(precision.sine(-Math.PI * 2)).to.equal(0);
        });

        it('should test cosine', function() {
            expect(precision.cosine(0)).to.equal(1);
            expect(precision.cosine(Math.PI / 4)).to.equal(0.7071067811865476);
            expect(precision.cosine(Math.PI / 2)).to.equal(0);
            expect(precision.cosine(Math.PI * 3 / 5)).to.equal(-0.309016994374947);
            expect(precision.cosine(Math.PI)).to.equal(-1);
            expect(precision.cosine(Math.PI * 5 / 3)).to.equal(0.5);
            expect(precision.cosine(Math.PI * 3 / 2)).to.equal(0);
            expect(precision.cosine(Math.PI * 2)).to.equal(1);
            expect(precision.cosine(-Math.PI / 4)).to.equal(0.7071067811865476);
            expect(precision.cosine(-Math.PI / 2)).to.equal(0);
            expect(precision.cosine(-Math.PI * 3 / 5)).to.equal(-0.309016994374947);
            expect(precision.cosine(-Math.PI)).to.equal(-1);
            expect(precision.cosine(-Math.PI * 5 / 3)).to.equal(0.5);
            expect(precision.cosine(-Math.PI * 3 / 2)).to.equal(0);
            expect(precision.cosine(-Math.PI * 2)).to.equal(1);
        });

        it('should test tangent', function() {
            expect(precision.tangent(0)).to.equal(0);
            expect(precision.tangent(Math.PI / 4)).to.equal(1);
            expect(precision.tangent(Math.PI / 2)).to.equal(Infinity);
            expect(precision.tangent(Math.PI * 3 / 5)).to.equal(-3.07768353717525);
            expect(precision.tangent(Math.PI)).to.equal(0);
            expect(precision.tangent(Math.PI * 5 / 3)).to.equal(-1.73205080756888);
            expect(precision.tangent(Math.PI * 3 / 2)).to.equal(Infinity);
            expect(precision.tangent(Math.PI * 2)).to.equal(0);
            expect(precision.tangent(-0)).to.equal(0);
            expect(precision.tangent(-Math.PI / 4)).to.equal(-1);
            expect(precision.tangent(-Math.PI / 2)).to.equal(Infinity);
            expect(precision.tangent(-Math.PI * 3 / 5)).to.equal(3.07768353717525);
            expect(precision.tangent(-Math.PI)).to.equal(0);
            expect(precision.tangent(-Math.PI * 5 / 3)).to.equal(1.73205080756888);
            expect(precision.tangent(-Math.PI * 3 / 2)).to.equal(Infinity);
            expect(precision.tangent(-Math.PI * 2)).to.equal(0);
        });

    });

    describe('Test inverse trigonometric operations', function() {

        it('should test arcsine', function() {
            expect(precision.arcsine(0)).to.equal(0);
            expect(precision.arcsine(0.54321)).to.equal(0.57426);
            expect(precision.arcsine(1)).to.equal(1.570796326794897);
            expect(precision.arcsine(-0)).to.equal(0);
            expect(precision.arcsine(-0.54321)).to.equal(-0.57426);
            expect(precision.arcsine(-1)).to.equal(-1.570796326794897);
        });

        it('should test arccosine', function() {
            expect(precision.arccosine(0)).to.equal(1.570796326794897);
            expect(precision.arccosine(0.54321)).to.equal(0.99654);
            expect(precision.arccosine(1)).to.equal(0);
            expect(precision.arccosine(-0)).to.equal(1.570796326794897);
            expect(precision.arccosine(-0.54321)).to.equal(2.145);
            expect(precision.arccosine(-1)).to.equal(3.141592653589793);
        });

        it('should test arctangent', function() {
            expect(precision.arctangent(0, 1)).to.equal(0);
            expect(precision.arctangent(-0, 1)).to.equal(0);
            expect(precision.arctangent(1, 1)).to.equal(0.7853981633974483);
            expect(precision.arctangent(1, 0)).to.equal(1.570796326794897);
            expect(precision.arctangent(1, -0)).to.equal(1.570796326794897);
            expect(precision.arctangent(1, -1)).to.equal(2.35619449019234);
            expect(precision.arctangent(0, -1)).to.equal(3.141592653589793);
            expect(precision.arctangent(-0, -1)).to.equal(3.141592653589793);
            expect(precision.arctangent(-1, -1)).to.equal(-2.35619449019234);
            expect(precision.arctangent(-1, 0)).to.equal(-1.570796326794897);
            expect(precision.arctangent(-1, -0)).to.equal(-1.570796326794897);
            expect(precision.arctangent(-1, 1)).to.equal(-0.7853981633974483);
        });

    });

});
