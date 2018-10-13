/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

var mocha = require('mocha');
var expect = require('chai').expect;
var Tag = require('../src/elements/Tag').Tag;

describe('Bali Primitive Types™', function() {

    describe('Test tag constructors', function() {

        it('should generate a default random tag with 20 bytes', function() {
            var random = new Tag();
            expect(random.getNumberOfBytes()).to.equal(20);
            var expected = random.toSource();
            var tag = new Tag(expected);
            var result = tag.toSource();
            expect(result).to.equal(expected);
        });

        it('should generate a random tag with 15 bytes', function() {
            var random = new Tag(15);
            expect(random.getNumberOfBytes()).to.equal(15);
            var expected = random.toSource();
            var tag = new Tag(expected);
            var result = tag.toSource();
            expect(result).to.equal(expected);
        });

        it('should generate a predefined tag', function() {
            expected = '#NT5PG2BXZGBGV5JTNPCP2HTM4JP6CS4X';
            var tag = new Tag(expected);
            var result = tag.toSource();
            expect(result).to.equal(expected);
        });

        it('should throw an exception for an empty symbol', function() {
            expect(
                function() {
                    var bad = new Tag('This is not a tag!');
                }
            ).to.throw();
        });

    });

});