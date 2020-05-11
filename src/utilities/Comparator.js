/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/
'use strict';

/*
 * This component class implements a comparator that can be used to compare any two components
 * for their natural ordering.
 */


// PUBLIC FUNCTIONS

/**
 * This function creates a new comparator object that can be used to compare two objects.
 * if an algorithm function is specified, that function is used to do the comparison, otherwise,
 * a natural comparison will be performed.
 *
 * @param {Function} algorithm An optional function implementing a comparison algorithm.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Comparator} The new comparator.
 */
const Comparator = function(algorithm, debug) {
    debug = debug || 0;

    // PUBLIC METHODS

    /**
     * This method determines whether or not two components are equal.
     *
     * @param {Component} firstComponent The first component to be compared.
     * @param {Component} secondComponent The second component to be compared.
     * @returns {Boolean} Whether or not the two components are equal.
     *
     */
    this.componentsAreEqual = function(firstComponent, secondComponent) {
        return this.compareComponents(firstComponent, secondComponent) === 0;
    };


    /**
     * This method compares two components for their ordering.
     *
     * @param {Component} first The first component to be compared.
     * @param {Component} second The second component to be compared.
     * @returns {Number} -1 if first < second; 0 if first === second; and 1 if first > second.
     *
     */
    this.compareComponents = algorithm || natural;

    return this;
};
Comparator.prototype.constructor = Comparator;
exports.Comparator = Comparator;


/**
 * This method compares two objects for their natural ordering.
 *
 * @param {Object} first The first component to be compared.
 * @param {Object} second The second component to be compared.
 * @returns {Number} -1 if first < second; 0 if first === second; and 1 if first > second.
 *
 */
const natural = function(first, second) {
    // handle undefined objects
    if (first === null) first = undefined;  // normalize nulls
    if (second === null) second = undefined;  // normalize nulls
    if (first !== undefined && second === undefined) {
        return 1;  // anything is greater than nothing
    }
    if (first === undefined && second !== undefined) {
        return -1;  // nothing is less than anything
    }
    if (first === undefined && second === undefined) {
        return 0;  // nothing is equal to nothing
    }

    // handle numeric values
    if (typeof first === 'number' && typeof second === 'number') {
        if (first.toString() === second.toString()) return 0;  // handle NaN
        return Math.sign(first - second);
    }
    if (first.toNumber && (typeof second === 'number' || typeof second === 'boolean')) {
        if (first.toString() === second.toString()) return 0;  // handle NaN
        return Math.sign(first.toNumber() - second);
    }
    if ((typeof first === 'number' || typeof first === 'boolean') && second.toNumber) {
        if (first.toString() === second.toString()) return 0;  // handle NaN
        return Math.sign(first - second.toNumber());
    }
    if (first.isComponent && first.isType('/bali/elements/Number') && second.isComponent && second.isType('/bali/elements/Number')) {
        if (first.toString() === second.toString()) return 0;  // handle NaN
        var result = Math.sign(Math.fround(first.getMagnitude()) - Math.fround(second.getMagnitude()));
        if (result === 0) {
            result = natural(first.getPhase(), second.getPhase());
        }
        return result;
    }
    if (first.isComponent && first.isType('/bali/elements/Duration') && second.isComponent && second.isType('/bali/elements/Duration')) {
        if (first.toString() === second.toString()) return 0;  // handle NaN
        return Math.sign(first.toNumber() - second.toNumber());
    }
    if (first.isComponent && first.isType('/bali/elements/Moment') && second.isComponent && second.isType('/bali/elements/Moment')) {
        if (first.toString() === second.toString()) return 0;  // handle NaN
        return Math.sign(first.toNumber() - second.toNumber());
    }
    if (first.toNumber && second.toNumber) {
        if (first.toString() === second.toString()) return 0;  // handle NaN
        return Math.sign(Math.fround(first.toNumber()) - Math.fround(second.toNumber()));
    }

    // handle boolean values (must come after numeric values since all components support toBoolean)
    if (typeof first === 'boolean' && typeof second === 'boolean') {
        return Math.sign(first - second);
    }
    if (first.toBoolean && typeof second === 'boolean') {
        return Math.sign(first.toBoolean() - second);
    }
    if (typeof first === 'boolean' && second.toBoolean) {
        return Math.sign(first - second.toBoolean());
    }

    // handle string values
    if (typeof first === 'string' && typeof second === 'string') {
        return Math.sign(first.localeCompare(second));
    }
    if (first.isComponent && typeof second === 'string') {
        return natural(first, first.componentize(second));
    }
    if (typeof first === 'string' && second.isComponent) {
        return natural(second.componentize(first), second);
    }

    // handle arrays
    if (Array.isArray(first) && Array.isArray(second)) {
        var firstIndex = 0;
        var secondIndex = 0;
        var result = 0;
        while (result === 0 && firstIndex < first.length && secondIndex < second.length) {
            result = natural(first[firstIndex++], second[secondIndex++]);
        }
        if (result !== 0) {
            return result;
        }  // found a difference
        if (firstIndex < first.length) {
            return 1;
        }  // the first is longer than the second
        if (secondIndex < second.length) {
            return -1;
        }  // the second is longer than the first
        return 0;  // they are the same length and all values are equal
    }

    // handle RegExp
    if (first.constructor.name === 'RegExp' && second.constructor.name === 'RegExp') {
        return Math.sign(first.source.localeCompare(second.source));
    }

    // handle buffers
    if (first.constructor.name === 'Buffer' && second.constructor.name === 'Buffer') {
        return Buffer.compare(first, second);
    }

    // handle associations
    if (first.isComponent && first.isType('/bali/structures/Association') && second.isComponent && second.isType('/bali/structures/Association')) {
        var result = natural(first.getKey(), second.getKey());
        if (result === 0) {
            result = natural(first.getValue(), second.getValue());
        }
        return result;
    }

    // handle exceptions
    if (first.isComponent && first.isType('/bali/structures/Exception') && second.isComponent && second.isType('/bali/structures/Exception')) {
        return natural(first.getAttributes(), second.getAttributes());
    }

    // handle procedures
    if (first.isComponent && first.isType('/bali/structures/Procedure') && second.isComponent && second.isType('/bali/structures/Procedure')) {
        return natural(first.getStatements(), second.getStatements());
    }

    // handle range components
    if (first.getFirst && second.getFirst) {
        var result = natural(first.getFirst(), second.getFirst());
        if (result === 0) {
            result = natural(first.getLast(), second.getLast());
        }
        return result;
    }

    // handle collection components (note: tree leaf nodes are treated as empty collections)
    if (first.isComponent && first.isType('/bali/types/Collection') && second.isComponent && second.isType('/bali/types/Collection')) {
        const firstIterator = first.getIterator();
        const secondIterator = second.getIterator();
        var result = 0;
        while (result === 0 && firstIterator.hasNext() && secondIterator.hasNext()) {
            result = natural(firstIterator.getNext(), secondIterator.getNext());
        }
        if (result !== 0) {
            return result;
        }  // found a difference
        if (firstIterator.hasNext()) {
            return 1;
        }  // the first is longer than the second
        if (secondIterator.hasNext()) {
            return -1;
        }  // the second is longer than the first
        return 0;  // they are the same length and all items are equal
    }

    // handle elements
    if (first.getValue && second.getValue) {
        return natural(first.getValue(), second.getValue());
    }

    // anything else, compare their string values (handles JS and Bali types)
    return Math.sign(first.toString().localeCompare(second.toString()));
};
