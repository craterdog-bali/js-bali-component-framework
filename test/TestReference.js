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

    describe('Test reference constructors', function() {

        it('should throw an exception for an empty reference', function() {
            expect(
                function() {
                    var empty = new elements.Reference();
                }
            ).to.throw();
            expect(
                function() {
                    var empty = new elements.Reference('');
                }
            ).to.throw();
            expect(
                function() {
                    var empty = new elements.Reference('<>');
                }
            ).to.throw();
        });

        it('should construct references and format matching references', function() {
            tests.forEach(function(expected) {
                var reference = new elements.Reference(expected);
                var string = reference.toString();
                expect(string).to.equal(expected);
            });
        });

    });

    describe('Test reference methods', function() {

        it('should return the correct type', function() {
            var type = new elements.Reference('<https://google.com/>').getType();
            expect(type).to.equal('<bali:[$protocol:v1,$tag:#CLP455XN9HV4CM5S6XDWS38SJNT7T5T3,$version:v1,$digest:none]>');
        });

    });

});

var tests = [
    '<https://google.com/>',
    '<bali:RKVVW90GXFP44PBTLFLF8ZG8NR425JYM>',
    '<bali:RKVVW90GXFP44PBTLFLF8ZG8NR425JYMv3.1>',
    '<bali:/bali/elements/Text>',
    '<bali:/bali/elements/Text?version=6.12.1>',
    '<bali:/abcCorp/reports/2010/Q3>'
];
