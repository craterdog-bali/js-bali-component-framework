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

/**
 * This abstract class defines the methods that all components must support.
 */
var types = require('../abstractions/Types');
var Comparator = require('../utilities/Comparator').Comparator;
var Formatter = require('../utilities/Formatter').Formatter;


// PUBLIC FUNCTIONS

/**
 * This constructor creates a new component of the specified type with the optional
 * parameters that are used to parameterize its type.
 * 
 * @param {Number} type The type of component.
 * @param {Parameters} parameters Optional parameters used to parameterize this component. 
 * @returns {Component} The new component.
 */
function Component(type, parameters) {
    this.type = type;
    this.parameters = parameters;
    this.complexity = parameters ? parameters.complexity : 0;  // number of characters in its source code
    return this;
}
Component.prototype.constructor = Component;
exports.Component = Component;


// PUBLIC METHODS

/**
 * This method returns whether or not this component is parameterized.
 * 
 * @returns {Boolean} Whether or not this component is parameterized.
 */
Component.prototype.isParameterized = function() {
    return !!this.parameters;
};


/**
 * This method determines whether or not the complexity of this component is less than
 * the maximum complexity (IS_COMPLEX) for a simple component.
 * 
 * @returns {Boolean} Whether or not this component is simple.
 */
Component.prototype.isSimple = function() {
    return types.isSimple(this.complexity);
};


/**
 * This method sets the complexity of this component to be greater than the maximum complexity
 * for a simple component.
 */
Component.prototype.setToComplex = function() {
    this.complexity = types.IS_COMPLEX;
};


/**
 * This method returns a string representation of the component.
 * 
 * @returns {String} The corresponding string representation.
 */
Component.prototype.toString = function() {
    var string = this.toDocument();
    return string;
};


/**
 * This method provides the canonical way to export this component in
 * Bali Document Notation™.
 * 
 * @param {String} indentation A blank string that will be prepended to each indented line in
 * the source code.
 * @returns {String} The source code for this component.
 */
Component.prototype.toDocument = function(indentation) {
    var formatter = new Formatter();
    var source = formatter.formatComponent(this, indentation);
    return source;
};


/**
 * This method determines whether or not this component is equal to another component.
 * 
 * @param {Object} that The object that is being compared.
 * @returns {Boolean} Whether or not this component is equal to another component.
 */
Component.prototype.isEqualTo = function(that) {
    var comparator = new Comparator();
    return comparator.componentsAreEqual(this, that);
};


/**
 * This method compares this component with another object for natural order. It may be
 * overridden with a more efficient implementation by a subclass.
 * 
 * @param {Object} that The object that is being compared.
 * @returns {Number} -1 if this < that; 0 if this === that; and 1 if this > that.
 */
Component.prototype.comparedTo = function(that) {
    var comparator = new Comparator();
    return comparator.compareComponents(this, that);
};


/**
 * This method returns the unique hash value for this component.
 * 
 * @returns {Number} The unique hash value for this component.
 */
Component.prototype.getHash = function() {
    var hash = 0;
    var source = this.toString();
    if (source.length === 0) return hash;
    for (var i = 0; i < source.length; i++) {
        var character = source.charCodeAt(i);
        hash = ((hash << 5) - hash) + character;
        hash |= 0;  // truncate to a 32 bit integer
    }
    return hash;
};


/**
 * This abstract method accepts a visitor as part of the visitor pattern. It must be
 * implemented by a subclass.
 * 
 * @param {Visitor} visitor The visitor that wants to visit this component.
 */
Component.prototype.acceptVisitor = function(visitor) {
    throw new Error('COMPONENT: Abstract method acceptVisitor(visitor) must be implemented by a concrete subclass.');
};
