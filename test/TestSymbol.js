/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

const debug = 0;
const mocha = require('mocha');
const expect = require('chai').expect;
const bali = require('../').api(debug);


describe('Bali Nebula™ Component Framework - Symbol', function() {

    describe('Test symbol constructors', function() {

        it('should construct symbols using literals', function() {
            expect(bali.component('$foo').toString()).to.equal('$foo');
            expect(bali.component('$bar').toString()).to.equal('$bar');
        });

        it('should throw an exception for an empty symbol', function() {
            expect(
                function() {
                    const empty = bali.symbol();
                }
            ).to.throw();
            expect(
                function() {
                    const empty = bali.symbol('');
                }
            ).to.throw();
            expect(
                function() {
                    const empty = bali.component('$');
                }
            ).to.throw();
        });

        it('should throw an exception for a symbol containing white space', function() {
            expect(
                function() {
                    const bad = bali.symbol(' ');
                }
            ).to.throw();
            expect(
                function() {
                    const bad = bali.symbol('White Space');
                }
            ).to.throw();
        });

    });

    describe('Test symbol methods', function() {

        it('should perform the getIndex(), getItem() and getItems() methods correctly', function() {
            const symbol = bali.symbol('foobar');
            const range = bali.range(3, 5);
            const first = symbol.getItem(3);
            const last = symbol.getItem(5);
            const items = symbol.getItems(range);
            expect(first).to.equal(items.getItem(1));
            expect(last).to.equal(items.getItem(items.getSize()));
            expect(2).to.equal(symbol.getIndex('o'));
        });

    });

});
