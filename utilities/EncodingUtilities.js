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
 * This private string acts as a lookup table for mapping one bit values to base 2
 * characters. 
 */
var base2LookupTable = "01";


/**
 * This function encodes the bytes in a data buffer into a base 2 string.
 *
 * @param {Buffer} buffer The data buffer containing the integer.
 * @param {String} indentation The string to be prepended to each line of the result.
 * @return {String} The base 2 encoded string.
 */
exports.base2Encode = function(buffer, indentation) {

    // validate the parameters
    var base2 = '';
    if (typeof indentation === 'undefined' || indentation === null) indentation = '';
    var length = buffer.length;
    if (length === 0) return "";  // empty binary string

    if (length > 10) {
        base2 += '\n';
        base2 += indentation;
    }

    // encode each byte
    for (var i = 0; i < length; i++) {
        var byte = buffer[i];

        // encode each bit
        for (var b = 7; b >= 0; b--) {
            var mask = 1 << b;
            var bit = (byte & mask) >>> b;
            base2 += base2LookupTable[bit];
        }

        // format as indented 80 character blocks
        if (i < length - 1 && i % 10 === 9) {
            base2 += '\n';
            base2 += indentation;
        }

    }

    return base2;
};


/**
 * This function decodes a base 2 encoded string into a data buffer containing the
 * decoded bytes.
 *
 * @param {String} base2 The base 2 encoded string.
 * @return {Buffer} A data buffer containing the decoded bytes.
 */
exports.base2Decode = function(base2) {

    // validate the base 2 encoded string
    base2 = base2.replace(/\s/g, "");  // strip out whitespace
    var length = base2.length;
    if (length % 8 !== 0) {
        throw new Error("ENCODING: The base 2 string must have a number of characters that is divisible by 8: " + base2);
    }

    // decode each base 2 character
    var buffer = Buffer.alloc(length / 8);
    var index = 0;
    while (index < length - 7) {

        // decode one byte
        var byte = 0;
        for (var b = 7; b >= 0; b--) {
            var character = base2[index++];
            var bit = base2LookupTable.indexOf(character);
            if (bit < 0) {
                throw new Error("ENCODING: Attempted to decode a string that is not base 2: " + base2);
            }
            byte |= (bit << b);
        }

        // append byte to binary string
        buffer[index / 8 - 1] = byte;

    }

    return buffer;
};


/**
 * This private string acts as a lookup table for mapping four bit values to base 16
 * characters. 
 */
var base16LookupTable = "0123456789ABCDEF";


/**
 * This function encodes the bytes in a data buffer into a base 16 string.
 *
 * @param {Buffer} buffer The data buffer containing the bytes to be encoded.
 * @param {String} indentation The string to be prepended to each line of the result.
 * @return {String} The base 16 encoded string.
 */
exports.base16Encode = function(buffer, indentation) {

    // validate the parameters
    var base16 = '';
    if (typeof indentation === 'undefined' || indentation === null) indentation = '';
    var length = buffer.length;
    if (length === 0) return base16;  // empty binary string

    if (length > 40) {
        base16 += '\n';
        base16 += indentation;
    }

    // encode each byte
    for (var i = 0; i < length; i++) {
        var byte = buffer[i];

        // encode high order nybble
        var highOrderNybble = (byte & 0xF0) >>> 4;
        base16 += base16LookupTable[highOrderNybble];

        // encode low order nybble
        var lowOrderNybble = byte & 0x0F;
        base16 += base16LookupTable[lowOrderNybble];

        // format as indented 80 character blocks
        if (i < length - 1 && i % 40 === 39) {
            base16 += '\n';
            base16 += indentation;
        }

    }

    return base16;
};


/**
 * This function decodes a base 16 encoded string into a data buffer containing the
 * decoded bytes.
 *
 * @param {String} base16 The base 16 encoded string.
 * @return {Buffer} A data buffer containing the decoded bytes.
 */
exports.base16Decode = function(base16) {

    // validate the base 16 encoded string
    base16 = base16.replace(/\s/g, "");  // strip out whitespace
    base16 = base16.toUpperCase();
    var length = base16.length;
    if (length % 2 !== 0) {
        throw new Error("ENCODING: The base 16 string must have an even number of characters: " + base16);
    }

    // decode each base 16 character
    var buffer = Buffer.alloc(length / 2);
    var index = 0;
    while (index < length - 1) {

        // decode the character for the high order nybble
        var character = base16[index++];
        var highOrderNybble = base16LookupTable.indexOf(character);
        if (highOrderNybble < 0) {
            throw new Error("ENCODING: Attempted to decode a string that is not base 16: " + base16);
        }

        // decode the character for the low order nybble
        character = base16[index++];
        var lowOrderNybble = base16LookupTable.indexOf(character);
        if (lowOrderNybble < 0) {
            throw new Error("ENCODING: Attempted to decode a string that is not base 16: " + base16);
        }

        // combine the nybbles to form the byte
        var charCode = (highOrderNybble << 4) | lowOrderNybble;
        buffer[index / 2 - 1] = charCode;

    }

    return buffer;
};


/**
 * This private string acts as a lookup table for mapping five bit values to base 32
 * characters. It eliminate 4 vowels ("E", "I", "O", "U") to reduce any confusion with
 * 0 and O, 1 and I; and reduce the likelihood of *actual* (potentially offensive)
 * words from being included in a base 32 string.
 */
var base32LookupTable = "0123456789ABCDFGHJKLMNPQRSTVWXYZ";


/**
 * This function encodes the bytes in a data buffer into a base 32 string.
 *
 * @param {Buffer} buffer The data buffer containing the bytes to be encoded.
 * @param {String} indentation The string to be prepended to each line of the result.
 * @return {String} The base 32 encoded string.
 */
exports.base32Encode = function(buffer, indentation) {

    // validate the parameters
    var base32 = '';
    if (typeof indentation === 'undefined' || indentation === null) indentation = '';
    var length = buffer.length;
    if (length === 0) return "";  // empty binary string

    if (length > 50) {
        base32 += '\n';
        base32 += indentation;
    }

    // encode each byte
    for (var i = 0; i < length; i++) {
        var previousByte = buffer[i - 1];
        var currentByte = buffer[i];

        // encode next one or two 5 bit chunks
        base32 = base32EncodeNextChucks(previousByte, currentByte, i, base32);

        // format as indented 80 character blocks
        if (i < length - 1 && i % 50 === 49) {
            base32 += '\n';
            base32 += indentation;
        }

    }

    // encode the last chunk
    var lastByte = buffer[length - 1];
    base32 = base32EncodeLastChunk(lastByte, length - 1, base32);
    return base32;
};


/**
 * This function decodes a base 32 encoded string into a data buffer containing the
 * decoded bytes.
 *
 * @param {String} base32 The base 32 encoded string.
 * @return {Buffer} A data buffer containing the decoded bytes.
 */
exports.base32Decode = function(base32) {

    // validate the base 32 encoded string
    base32 = base32.replace(/\s/g, "");  // strip out whitespace
    base32 = base32.toUpperCase();
    var length = base32.length;

    var character;
    var chunk;

    // decode each base 32 character
    var buffer = Buffer.alloc(Math.floor(length * 5 / 8));
    var index = 0;
    while (index < length - 1) {
        character = base32[index];
        chunk = base32LookupTable.indexOf(character);
        if (chunk < 0) {
            throw new Error("ENCODING: Attempted to decode a string that is not base 32: " + base32);
        }
        base32DecodeNextCharacter(chunk, index++, buffer, 0);
    }
    if (index < length) {
        character = base32[index];
        chunk = base32LookupTable.indexOf(character);
        if (chunk < 0) {
            throw new Error("ENCODING: Attempted to decode a string that is not base 32: " + base32);
        }
        base32DecodeLastCharacter(chunk, index, buffer, 0);
    }
    return buffer;
};


/**
 * This function encodes the bytes in a data buffer into a base 64 string.
 *
 * @param {Buffer} buffer The data buffer containing the bytes to be encoded.
 * @param {String} indentation The string to be prepended to each line of the result.
 * @return {String} The base 64 encoded string.
 */
exports.base64Encode = function(buffer, indentation) {

    // validate the parameters
    var base64 = '';
    if (typeof indentation === 'undefined' || indentation === null) indentation = '';
    var length = buffer.length;
    if (length === 0) return "";  // empty binary string

    // format as indented 80 character blocks
    if (length > 50) {
        base64 += '\n';
    }
    base64 += buffer.toString('base64');

    // insert indentations
    if (indentation) {
        base64 = base64.replace(/\n/g, '\n' + indentation);
    }

    return base64;
};


/**
 * This function decodes a base 64 encoded string into a data buffer containing the
 * decoded bytes.
 *
 * @param {String} base64 The base 64 encoded string.
 * @return {Buffer} A data buffer containing the decoded bytes.
 */
exports.base64Decode = function(base64) {
    return Buffer.from(base64, 'base64');
};


/**
 * This function converts a short into a data buffer containing its corresponding bytes
 * in 'big endian' order.
 *
 * @param {Number} short The short to be converted.
 * @return {Buffer} A data buffer containing the corresponding bytes.
 */
exports.shortToBytes = function(short) {
    var buffer = Buffer.alloc(2);
    for (var i = 0; i < 2; i++) {
        var byte = short >> (i * 8) & 0xFF;
        buffer[1 - i] = byte;
    }
    return buffer;
};


/**
 * This function converts the bytes in a data buffer in 'big endian' order to its
 * corresponding short value.
 *
 * @param {Buffer} buffer A data buffer containing the bytes for the short.
 * @return {Number} The corresponding short value.
 */
exports.bytesToShort = function(buffer) {
    var short = 0;
    for (var i = 0; i < 2; i++) {
        var byte = buffer[1 - i];
        short |= byte << (i * 8);
    }
    return short;
};


/**
 * This function converts an integer into a data buffer containing its corresponding bytes
 * in 'big endian' order.
 *
 * @param {Number} integer The integer to be converted.
 * @return {Buffer} The data buffer containing the corresponding bytes.
 */
exports.integerToBytes = function(integer) {
    var buffer = Buffer.alloc(4);
    for (var i = 0; i < 4; i++) {
        var byte = integer >> (i * 8) & 0xFF;
        buffer[3 - i] = byte;
    }
    return buffer;
};


/**
 * This function converts a buffer containing the bytes in 'big endian'
 * order to its corresponding integer value.
 *
 * @param {Buffer} buffer The buffer containing the bytes for the integer.
 * @return {Number} The corresponding integer value.
 */
exports.bytesToInteger = function(buffer) {
    var integer = 0;
    for (var i = 0; i < 4; i++) {
        var byte = buffer[3 - i];
        integer |= byte << (i * 8);
    }
    return integer;
};


// offset:    0        1        2        3        4        0
// byte:  00000111|11222223|33334444|45555566|66677777|...
// mask:   F8  07  C0 3E  01 F0  0F 80  7C 03  E0  1F   F8  07
function base32EncodeNextChucks(previous, current, byteIndex, base32) {
    var chunk;
    var offset = byteIndex % 5;
    switch (offset) {
        case 0:
            chunk = (current & 0xF8) >>> 3;
            base32 += base32LookupTable[chunk];
            break;
        case 1:
            chunk = ((previous & 0x07) << 2) | ((current & 0xC0) >>> 6);
            base32 += base32LookupTable[chunk];
            chunk = (current & 0x3E) >>> 1;
            base32 += base32LookupTable[chunk];
            break;
        case 2:
            chunk = ((previous & 0x01) << 4) | ((current & 0xF0) >>> 4);
            base32 += base32LookupTable[chunk];
            break;
        case 3:
            chunk = ((previous & 0x0F) << 1) | ((current & 0x80) >>> 7);
            base32 += base32LookupTable[chunk];
            chunk = (current & 0x7C) >>> 2;
            base32 += base32LookupTable[chunk];
            break;
        case 4:
            chunk = ((previous & 0x03) << 3) | ((current & 0xE0) >>> 5);
            base32 += base32LookupTable[chunk];
            chunk = current & 0x1F;
            base32 += base32LookupTable[chunk];
            break;
    }
    return base32;
}


// same as normal, but pad with 0's in "next" byte
// case:      0        1        2        3        4
// byte:  xxxxx111|00xxxxx3|00004444|0xxxxx66|000xxxxx|...
// mask:   F8  07  C0 3E  01 F0  0F 80  7C 03  E0  1F
function base32EncodeLastChunk(last, byteIndex, base32) {
    var chunk;
    var offset = byteIndex % 5;
    switch (offset) {
        case 0:
            chunk = (last & 0x07) << 2;
            base32 += base32LookupTable[chunk];
            break;
        case 1:
            chunk = (last & 0x01) << 4;
            base32 += base32LookupTable[chunk];
            break;
        case 2:
            chunk = (last & 0x0F) << 1;
            base32 += base32LookupTable[chunk];
            break;
        case 3:
            chunk = (last & 0x03) << 3;
            base32 += base32LookupTable[chunk];
            break;
        case 4:
            // nothing to do, was handled by previous call
            break;
    }
    return base32;
}


// offset:    0        1        2        3        4        0
// byte:  00000111|11222223|33334444|45555566|66677777|...
// mask:   F8  07  C0 3E  01 F0  0F 80  7C 03  E0  1F   F8  07
function base32DecodeNextCharacter(chunk, characterIndex, buffer, index) {
    var byteIndex = Math.floor(index + (characterIndex * 5) / 8);
    var offset = characterIndex % 8;
    switch (offset) {
        case 0:
            buffer[byteIndex] |= chunk << 3;
            break;
        case 1:
            buffer[byteIndex] |= chunk >>> 2;
            buffer[byteIndex + 1] |= chunk << 6;
            break;
        case 2:
            buffer[byteIndex] |= chunk << 1;
            break;
        case 3:
            buffer[byteIndex] |= chunk >>> 4;
            buffer[byteIndex + 1] |= chunk << 4;
            break;
        case 4:
            buffer[byteIndex] |= chunk >>> 1;
            buffer[byteIndex + 1] |= chunk << 7;
            break;
        case 5:
            buffer[byteIndex] |= chunk << 2;
            break;
        case 6:
            buffer[byteIndex] |= chunk >>> 3;
            buffer[byteIndex + 1] |= chunk << 5;
            break;
        case 7:
            buffer[byteIndex] |= chunk;
            break;
    }
}


// same as normal, but pad with 0's in "next" byte
// case:      0        1        2        3        4
// byte:  xxxxx111|00xxxxx3|00004444|0xxxxx66|00077777|...
// mask:   F8  07  C0 3E  01 F0  0F 80  7C 03  E0  1F
function base32DecodeLastCharacter(chunk, characterIndex, buffer, index) {
    var byteIndex = Math.floor(index + (characterIndex * 5) / 8);
    var offset = characterIndex % 8;
    switch (offset) {
        case 1:
            buffer[byteIndex] |= chunk >>> 2;
            break;
        case 3:
            buffer[byteIndex] |= chunk >>> 4;
            break;
        case 4:
            buffer[byteIndex] |= chunk >>> 1;
            break;
        case 6:
            buffer[byteIndex] |= chunk >>> 3;
            break;
        case 7:
            buffer[byteIndex] |= chunk;
            break;
    }
}
