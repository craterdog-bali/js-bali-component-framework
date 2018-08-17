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
var parser = require('../transformers/DocumentParser');
var NodeTypes = require('../syntax/NodeTypes');
var RootNode = require('../syntax/RootNode').RootNode;
var TreeNode = require('../syntax/TreeNode').TreeNode;
var random = require('./RandomUtilities');
var codex = require('./EncodingUtilities');


// DOCUMENTS

exports.isDocument = function(document) {
    if (!document) return false;
    try {
        if (document.constructor.name === 'String') {
            document = parser.parseDocument(document);
        }
        return document.constructor.name === 'RootNode' && document.type === NodeTypes.DOCUMENT;
    } catch (e) {
        return false;
    }
};


exports.copyDocument = function(document) {
    var source = document.toString();
    var copy = parser.parseDocument(source);
    return copy;
};


exports.draftDocument = function(document) {
    var source = document.toString();
    var draft = parser.parseDocument(source);
    draft.previousCitation = undefined;
    draft.seals = [];
    return draft;
};


exports.getPreviousCitation = function(document) {
    return document.previousCitation ? document.previousCitation.value : undefined;
};


exports.setPreviousCitation = function(document, previousCitation) {
    if (previousCitation.constructor.name === 'String') {
        previousCitation = parser.parseElement(previousCitation);
    }
    document.previousCitation = previousCitation;
};


exports.getBody = function(document) {
    return document.body;
};


exports.setBody = function(document, body) {
    document.body = body;
};


exports.getSeal = function(document) {
    var seal = document.seals[document.seals.length - 1];
    return seal;
};


exports.getSeals = function(document) {
    var seals = document.seals.slice(0);  // copy the array
    return seals;
};


exports.addSeal = function(document, citation, signature) {
    if (citation.constructor.name === 'String') {
        citation = parser.parseElement(citation);
    }
    if (signature.constructor.name === 'String') {
        signature = parser.parseElement(signature);
    }
    var seal = new TreeNode(NodeTypes.SEAL);
    seal.addChild(citation);
    seal.addChild(signature);
    document.addSeal(seal);
};


exports.removeSeal = function(document) {
    var copy = exports.copyDocument(document);
    copy.seals.pop();
    return copy;
};


exports.getCitation = function(seal) {
    var citation = seal.children[0].value;
    return citation;
};


exports.getSignature = function(seal) {
    var signature = seal.children[1].value;
    return signature;
};


// LISTS

exports.iterator = function(component) {
    var structure = component.children[0];
    var list = structure.children[0];
    var iterator = new ListIterator(list);
    return iterator;
};


exports.getValueForIndex = function(component, index) {
    var structure = component.children[0];
    var list = structure.children[0];
    var expressions = list.children;
    if (index < expressions.length) {
        return expressions[index];
    } else {
        return undefined;
    }
};


exports.setValueForIndex = function(component, index, value) {
    if (value.constructor.name === 'String') {
        value = parser.parseComponent(value);
    }
    var structure = component.children[0];
    var list = structure.children[0];
    var expressions = list.children;
    var old = expressions[index];
    expressions[index] = value;
    return old;
};


exports.addValue = function(component, value) {
    if (value.constructor.name === 'String') {
        value = parser.parseComponent(value);
    }
    var structure = component.children[0];
    var list = structure.children[0];
    var expressions = list.children;
    expressions.push(value);
};


// CATALOGS

exports.getStringForKey = function(component, key) {
    var visitor = new SearchingVisitor(key);
    component.accept(visitor);
    if (visitor.result) {
        return visitor.result.toString();
    } else {
        return undefined;
    }
};


exports.getValueForKey = function(component, key) {
    var visitor = new SearchingVisitor(key);
    component.accept(visitor);
    return visitor.result;
};


exports.setValueForKey = function(component, key, value) {
    if (component.type === NodeTypes.DOCUMENT) component = component.body;
    if (key.constructor.name === 'String') {
        key = parser.parseComponent(key);
    }
    if (value.constructor.name === 'String') {
        value = parser.parseComponent(value);
    }
    var association, symbol, old;
    var structure = component.children[0];
    var catalog = structure.children[0];

    // check to see if the symbol already exists in the catalog
    var associations = catalog.children;
    for (var i = 0; i < associations.length; i++) {
        association = associations[i];
        component = association.children[0];
        symbol = component.children[0];
        if (association.children[0].children[0].value === key.children[0].value) {
            old = association.children[1];
            association.children[1] = value;
            return old;
        }
    }

    // add a new association to the catalog
    association = new TreeNode(NodeTypes.ASSOCIATION);
    association.addChild(key);
    association.addChild(value);
    catalog.addChild(association);

    return old;
};


exports.deleteKey = function(component, key) {
    if (key.constructor.name === 'String') {
        key = parser.parseComponent(key);
    }
    var association, symbol;
    var structure = component.children[0];
    var catalog = structure.children[0];

    // find the key in the catalog
    var associations = catalog.children;
    for (var i = 0; i < associations.length; i++) {
        association = associations[i];
        component = association.children[0];
        symbol = component.children[0];
        if (symbol.value === key.value) {
            associations.splice(i, 1);  // remove this association
            return;
        }
    }
};


// ELEMENTS

exports.isTag = function(tag) {
    if (!tag) return false;
    try {
        if (tag.constructor.name === 'String') {
            tag = parser.parseElement(tag);
        }
        return tag.constructor.name === 'TerminalNode' && tag.type === NodeTypes.TAG;
    } catch (e) {
        return false;
    }
};


exports.tag = function() {
    var bytes = random.generateRandomBytes(20);
    var tag = '#' + codex.base32Encode(bytes);
    return tag;
};


exports.isReference = function(reference) {
    if (!reference) return false;
    try {
        var type = reference.constructor.name;
        if (type === 'URL') {
            reference = '<' + reference.toString().replace(/%23/, '#') + '>';
            type = reference.constructor.name;
        }
        if (type === 'String') {
            reference = parser.parseElement(reference);
        }
        return reference.constructor.name === 'TerminalNode' && reference.type === NodeTypes.REFERENCE;
    } catch (e) {
        return false;
    }
};


exports.isVersion = function(version) {
    if (!version) return false;
    try {
        if (version.constructor.name === 'String') {
            version = parser.parseElement(version);
        }
        return version.constructor.name === 'TerminalNode' && version.type === NodeTypes.VERSION;
    } catch (e) {
        return false;
    }
};


// PRIVATE CLASSES

function ListIterator(list) {
    this.expressions = list.children;
    this.index = 0;
    return this;
}
ListIterator.prototype.constructor = ListIterator;


ListIterator.prototype.hasNext = function() {
    return this.index < this.expressions.length;
};


ListIterator.prototype.getNext = function() {
    if (this.index < this.expressions.length) {
        return this.expressions[this.index++];
    } else {
        return undefined;
    }
};


function SearchingVisitor(value) {
    this.value = value;
    return this;
}
SearchingVisitor.prototype.constructor = SearchingVisitor;


// association: component ':' expression
SearchingVisitor.prototype.visitAssociation = function(association) {
    var component = association.children[0];
    var expression = association.children[1];
    var object = component.children[0];
    //if (object.type !== NodeTypes.STRUCTURE &&
            //object.type !== NodeTypes.BLOCK &&
    if (object.value === this.value) {
        this.result = expression;
    } else if (expression.type === NodeTypes.COMPONENT) {
        expression.accept(this);
    }
};


// catalog:
//     association (',' association)* |
//     NEWLINE (association NEWLINE)* |
//     ':' /*empty catalog*/
SearchingVisitor.prototype.visitCatalog = function(catalog) {
    var associations = catalog.children;
    for (var i = 0; i < associations.length; i++) {
        associations[i].accept(this);
    }
};


// component: object parameters?
SearchingVisitor.prototype.visitComponent = function(component) {
    var object = component.children[0];
    if (object.type === NodeTypes.STRUCTURE) {
        object.accept(this);
    }
};


// document: NEWLINE* (reference NEWLINE)? component (NEWLINE seal)* NEWLINE* EOF
SearchingVisitor.prototype.visitDocument = function(document) {
    var component = document.body;
    component.accept(this);
};


// list:
//     expression (',' expression)* |
//     NEWLINE (expression NEWLINE)* |
//     /*empty list*/
SearchingVisitor.prototype.visitList = function(list) {
    var expressions = list.children;
    for (var i = 1; i < expressions.length; i++) {
        var expression = expressions[i];
        if (expression.type === NodeTypes.COMPONENT) {
            expression.accept(this);
        }
    }
};


// structure: '[' collection ']'
SearchingVisitor.prototype.visitStructure = function(structure) {
    var collection = structure.children[0];
    if (collection.type !== NodeTypes.RANGE) {
        collection.accept(this);
    }
};