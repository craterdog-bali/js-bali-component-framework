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
const elements = require('../src/elements');

describe('Bali Component Framework™', function() {

    describe('Test duration constructors', function() {

        it('should construct a default duration of zero', function() {
            var duration = new elements.Duration();
            var string = duration.toString();
            expect(string).to.equal(tests[0]);
        });

        it('should construct a duration of days from weeks', function() {
            var duration = new elements.Duration('~P5W');
            var string = duration.toString();
            expect(string).to.equal('~P35D');
        });

        it('should construct a duration and format it the same', function() {
            tests.forEach(function(expected) {
                var duration = new elements.Duration(expected);
                var string = duration.toString();
                expect(string).to.equal(expected);
            });
        });

    });

    describe('Test duration methods', function() {

        it('should return the correct type', function() {
            var type = new elements.Duration('~P0D').getType();
            expect(type).to.equal('<bali:[$protocol:v1,$tag:#Y6572KBG2SBYSCBHR88KB1GR616LFK8N,$version:v1,$digest:none]>');
        });

    });

});

var tests = [
    '~P0D',
    '~P12345Y',
    '~P2Y3M7D',
    '~P2Y3M7DT8H',
    '~P2Y3M7DT8H29M',
    '~P2Y3M7DT8H29M54S',
    '~P3M7DT8H29M54.321S',
    '~P7DT8H29M54.321S',
    '~PT8H29M54.321S',
    '~PT29M54.321S',
    '~PT54.321S',
    '~PT54S'
];

