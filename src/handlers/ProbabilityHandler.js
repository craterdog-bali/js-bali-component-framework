/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

var language = require('../BaliLanguage');
var Probability = require('../elements/Probability').Probability;


function ProbabilityHandler() {
    return this;
}
ProbabilityHandler.prototype.constructor = ProbabilityHandler;
exports.ProbabilityHandler = ProbabilityHandler;


ProbabilityHandler.prototype.toJavaScript = function(baliTree) {
    var nodeType = baliTree.constructor.name;
    switch (nodeType) {
        case 'TrueProbabilityContext':
            return true;
        case 'FalseProbabilityContext':
            return false;
        default:
            var fraction = Number('0' + baliTree.FRACTION().getText());  // add leading zero before decimal point
            var probability = new Probability(fraction);
            return probability;
    }
};


ProbabilityHandler.prototype.toBali = function(jsProbability) {
    var probability = jsProbability.toString();
    switch (probability) {
        case '1':
        case 'true':
            probability = 'true';
            break;
        case '0':
        case 'false':
            probability = 'false';
            break;
        default:
            probability = probability.substring(1);  // strip off leading zero before decimal point
    }
    var baliTree = language.parseElement(probability);
    return baliTree.probability();
};
