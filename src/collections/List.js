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
 * This collection class implements a sortable list containing components that are
 * indexed as items in a list. The indexing is ordinal based (e.g. 1..N) and allows either
 * positive indexes starting at the beginning of the list or negative indexes starting at
 * the end of the list as follows:
 * <pre>
 *        1          2          3            N
 *    [item 1] . [item 2] . [item 3] ... [item N]
 *       -N        -(N-1)     -(N-2)        -1
 * </pre>
 * 
 * The items in the list are maintained in the order in which they were added to the list.
 * But they may be reordered by sorting the list.
 */
const types = require('../abstractions/Types');
const Composite = require('../abstractions/Composite').Composite;
const Collection = require('../abstractions/Collection').Collection;
const Sorter = require('../utilities/Sorter').Sorter;
const random = require('../utilities/Random');


// PUBLIC FUNCTIONS

/**
 * This constructor creates a new list component with optional parameters that are
 * used to parameterize its type.
 * 
 * @param {Parameters} parameters Optional parameters used to parameterize this list. 
 * @returns {List} The new list.
 */
function List(parameters) {
    Collection.call(this, types.LIST, parameters);
    this.array = [];
    this.complexity += 2;  // account for the '[' ']' delimiters
    return this;
}
List.prototype = Object.create(Collection.prototype);
List.prototype.constructor = List;
exports.List = List;


/**
 * This function creates a new list using the specified collection to seed the
 * initial items in the list. The list may be parameterized by specifying optional
 * parameters that are used to parameterize its type.
 * 
 * @param {Array|Object|Collection} collection The collection containing the initial
 * items to be used to seed the new list.
 * @param {Parameters} parameters Optional parameters used to parameterize this list. 
 * @returns {List} The new list.
 */
List.fromCollection = function(collection, parameters) {
    var list = new List(parameters);
    var iterator;
    var type = collection.constructor.name;
    switch (type) {
        case 'Array':
            collection.forEach(function(item) {
                list.addItem(item);
            });
            break;
        case 'List':
        case 'Queue':
        case 'Set':
            iterator = collection.getIterator();
            while (iterator.hasNext()) {
                list.addItem(iterator.getNext());
            }
            break;
        case 'Stack':
            iterator = collection.getIterator();
            // a stack's iterator starts at the top, we need to start at the bottom
            iterator.toEnd();
            while (iterator.hasPrevious()) {
                list.addItem(iterator.getPrevious());
            }
            break;
        default:
            throw new Error('BUG: A list cannot be initialized using a collection of type: ' + type);
    }
    return list;
};


/**
 * This function returns a new list that contains all the items that are in
 * the first list or the second list or both.
 *
 * @param {List} list1 The first list to be operated on.
 * @param {List} list2 The second list to be operated on.
 * @returns {List} The resulting list.
 */
List.concatenation = function(list1, list2) {
    var result = list1.constructor.fromCollection(list1, list1.parameters);
    result.addItems(list2);
    return result;
};


/**
 * This function returns a new list that contains the items that are in
 * the first list but not in the second list.
 *
 * @param {List} list1 The first list to be operated on.
 * @param {List} list2 The second list to be operated on.
 * @returns {List} The resulting list.
 */
List.difference = function(list1, list2) {
    var result = list1.constructor.fromCollection(list1, list1.parameters);
    result.removeItems(list2);
    return result;
};


// PUBLIC METHODS

/**
 * This method accepts a visitor as part of the visitor pattern.
 * 
 * @param {Visitor} visitor The visitor that wants to visit this list.
 */
List.prototype.acceptVisitor = function(visitor) {
    visitor.visitList(this);
};


/**
 * This method returns the number of items that are currently in this list.
 * 
 * @returns {Number} The number of items in this list.
 */
List.prototype.getSize = function() {
    var size = this.array.length;
    return size;
};


/**
 * This method returns an array containing the items in this list.
 * 
 * @returns {Array} An array containing the items in this list.
 */
List.prototype.toArray = function() {
    return this.array.slice();  // copy the array
};


/**
 * This method retrieves the item that is associated with the specified index from this list.
 * 
 * @param {Number} index The index of the desired item.
 * @returns {Component} The item at the position in this list.
 */
List.prototype.getItem = function(index) {
    index = this.normalizeIndex(index);
    index--;  // convert to JS zero based indexing
    var item = this.array[index];
    return item;
};


/**
 * This method replaces an existing item in this list with a new one.  The new
 * item replaces the existing item at the specified index.
 *
 * @param {Number} index The index of the existing item.
 * @param {Component} item The new item that will replace the existing one.
 *
 * @returns The existing item that was at the specified index.
 */
List.prototype.setItem = function(index, item) {
    item = Composite.asComponent(item);
    index = this.normalizeIndex(index) - 1;  // convert to JS zero based indexing
    var oldItem = this.array[index];
    this.array[index] = item;
    this.complexity += item.complexity - oldItem.complexity;
    return oldItem;
};


/*
 * This method appends the specified item to this list.
 * 
 * @param {String|Number|Boolean|Component} item The item to be added to this list.
 * @returns {Boolean} Whether or not the item was successfully added.
 */
List.prototype.addItem = function(item) {
    item = Composite.asComponent(item);
    this.array.push(item);
    this.complexity += item.complexity;
    if (this.getSize() > 1) this.complexity += 2;  // account for the ', ' separator
    return true;
};


/**
 * This method inserts the specified item into this list before the item
 * associated with the specified index.
 *
 * @param {Number} index The index of the item before which the new item is to be inserted.
 * @param {Component} item The new item to be inserted into this list.
 */
List.prototype.insertItem = function(index, item) {
    item = Composite.asComponent(item);
    index = this.normalizeIndex(index);
    index--;  // convert to javascript zero based indexing
    this.array.splice(index, 0, item);
    this.complexity += item.complexity;
    if (this.getSize() > 1) this.complexity += 2;  // account for the ', ' separator
};


/**
 * This method removes from this list the item associated with the specified
 * index.
 *
 * @param {Number} index The index of the item to be removed.
 * @returns {Component} The item at the specified index.
 */
List.prototype.removeItem = function(index) {
    index = this.normalizeIndex(index);
    index--;  // convert to javascript zero based indexing
    var oldItem = this.array[index];
    if (oldItem) {
        this.array.splice(index, 1);
        this.complexity -= oldItem.complexity;
        if (this.getSize() > 0) this.complexity -= 2;  // account for the ', ' separator
    }
    return oldItem;
};


/**
 * This method removes from this list the items associated with the specified
 * index range.
 *
 * @param {Number} firstIndex The index of the first item to be removed.
 * @param {Number} lastIndex The index of the last item to be removed.
 * @returns The list of the items that were removed from this list.
 */
List.prototype.removeItems = function(firstIndex, lastIndex) {
    firstIndex = this.normalizeIndex(firstIndex);
    lastIndex = this.normalizeIndex(lastIndex);
    var removedItems = new List(this.parameters);
    var index = firstIndex;
    while (index <= lastIndex) {
        var removedItem = this.removeItem(index++);
        if (removedItem) removedItems.addItem(removedItem);
    }
    return removedItems;
};


/**
 * This method removes all items from this list.
 */
List.prototype.removeAll = function() {
    var size = this.getSize();
    if (size > 1) this.complexity -= (size - 1) * 2;  // account for all the ', ' separators
    this.array.splice(0);
};


/**
 * This method sorts the items in this list into their natural order as defined
 * by the <code>this.comparedTo(that)</code> method of the items being compared.
 * 
 * @param {Sorter} sorter An optional sorter to use for sorting the items. If none is
 * specified, the default natural sorter will be used.
 */
List.prototype.sortItems = function(sorter) {
    sorter = sorter || new Sorter();
    sorter.sortCollection(this);
};


/**
 * This method reverses the order of the items in this list.
 */
List.prototype.reverseItems = function() {
    this.array.reverse();
};


/**
 * This method shuffles the items in this list using a randomizing algorithm.  It uses ordinal
 * indexing with the modern version of the Fisher-Yates shuffle:
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
 */
List.prototype.shuffleItems = function() {
    var size = this.getSize();
    for (var index = size; index > 1; index--) {
        var randomIndex = random.index(index);  // in range [1..index] ordinal indexing
        var item = this.getItem(index);
        this.setItem(index, this.getItem(randomIndex));
        this.setItem(randomIndex, item);
    }
};
