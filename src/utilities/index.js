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

const grammar = require('../grammar');

exports.precision = require('./Precision');
exports.codex = require('./Codex');
exports.random = require('./Random');  // depends on codex

exports.Automaton = require('./Automaton').Automaton;
exports.Iterator = require('./Iterator').Iterator;
exports.Comparator = require('./Comparator').Comparator;
exports.Sorter = require('./Sorter').Sorter;  // depends on Comparator
exports.Duplicator = require('./Duplicator').Duplicator;  // depends on Visitor
exports.Formatter = require('./Formatter').Formatter;  // depends on Visitor

// NOTE: Can't include the Parser module since it depends on all components and that
//       would result in serious circular dependencies!
