"use strict";
/**
 * @file arc4 main
 * @module arc4
 * @package arc4
 * @subpackage main
 * @version 2.0.0
 * @author hex7c0 <hex7c0@gmail.com>
 * @copyright hex7c0 2014
 * @license GPLv3
 */

/*
 * functions
 */
/**
 * build sbox
 * 
 * @function sbox
 * @return {Array}
 */
function sbox() {

    return [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,
            25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,
            47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,
            69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,
            91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,
            110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,
            126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,
            142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,
            158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,
            174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,
            190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,
            206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,
            222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,
            238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,
            254,255];
}
/**
 * generate ksa
 * 
 * @function ksa
 * @param {Array} key - user key
 * @return {Array}
 */
function ksa(key) {

    var j = 0;
    var s = sbox();
    var key = key;
    var len = key.len;
    for (var i = 0; i < 256; i++) {
        j = (j + s[i] + key[i % len]) % 256;
        s[j] = [s[i],s[i] = s[j]][0];
    }
    return s;
};
/**
 * body cipher
 * 
 * @function body
 * @param {String|Array|Buffer} inp - input
 * @param {String|Array|Buffer} res - response
 * @param {Array} ksa - ksa box
 * @return {String|Array|Buffer}
 */
function body(inp,res,ksa) {

    var i = 0, j = 0;
    var s = ksa;
    var res = res;
    if (typeof (res) == 'string') {
        for (var y = 0, l = inp.length; y < l; y++) {
            i = (i + 1) % 256;
            j = (j + s[i]) % 256;
            s[j] = [s[i],s[i] = s[j]][0];
            res += String.fromCharCode(inp.charCodeAt(y)
                    ^ s[(s[i] + s[j]) % 256]);
        }
    } else {
        for (var y = 0, l = inp.length; y < l; y++) {
            i = (i + 1) % 256;
            j = (j + s[i]) % 256;
            s[j] = [s[i],s[i] = s[j]][0];
            res[y] = inp[y] ^ s[(s[i] + s[j]) % 256];
        }
    }
    return res;
}
/**
 * body cipher RC4A
 * 
 * @function bodyRC4A
 * @param {String|Array|Buffer} inp - input
 * @param {String|Array|Buffer} res - response
 * @param {Array} ksa - ksa box
 * @return {String|Array|Buffer}
 */
function bodyRC4A(inp,res,ksa) {

    var i = 0, j1 = 0, j2 = 0;
    var s1 = ksa;
    var s2 = s1.slice();
    var res = res;
    if (typeof (res) == 'string') {
        for (var y = 0, l = inp.length; y < l; y++) {
            i = (i + 1) % 256;
            j1 = (j1 + s1[i]) % 256;
            s1[j1] = [s1[i],s1[i] = s1[j1]][0];
            res += String.fromCharCode(inp.charCodeAt(y)
                    ^ s2[(s1[i] + s1[j1]) % 256]);
            y++;
            j2 = (j2 + s2[i]) % 256;
            s2[j2] = [s2[i],s2[i] = s2[j2]][0];
            res += String.fromCharCode(inp.charCodeAt(y)
                    ^ s1[(s2[i] + s2[j2]) % 256]);
        }
    } else {
        for (var y = 0, l = inp.length; y < l; y++) {
            i = (i + 1) % 256;
            j1 = (j1 + s1[i]) % 256;
            s1[j1] = [s1[i],s1[i] = s1[j1]][0];
            res[y] = inp[y] ^ s2[(s1[i] + s1[j1]) % 256];
            y++;
            j2 = (j2 + s2[i]) % 256;
            s2[j2] = [s2[i],s2[i] = s2[j2]][0];
            res[y] = inp[y] ^ s1[(s2[i] + s2[j1]) % 256];
        }
    }
    return res;
};
/**
 * body cipher VMPC
 * 
 * @function bodyVMPC
 * @param {String|Array|Buffer} inp - input
 * @param {String|Array|Buffer} res - response
 * @param {Array} ksa - ksa box
 * @return {String|Array|Buffer}
 */
function bodyVMPC(inp,res,ksa) {

    var i = 0, j = 0;
    var s = ksa;
    var a = null, b = null;
    var res = res;
    if (typeof (res) == 'string') {
        for (var y = 0, l = inp.length; y < l; y++) {
            a = s[i];
            j = s[(j + a) % 256];
            b = s[j];
            res += String.fromCharCode(inp.charCodeAt(y) ^ s[s[b] + 1]);
            s[j] = [a,s[i] = b][0];
            i = (i + 1) % 256;
        }
    } else {
        for (var y = 0, l = inp.length; y < l; y++) {
            a = s[i];
            j = s[(j + a) % 256];
            b = s[j];
            res[y] = inp[y] ^ s[s[b] + 1];
            s[j] = [a,s[i] = b][0];
            i = (i + 1) % 256;
        }
    }
    return res;
};
/**
 * body cipher RC4p
 * 
 * @function bodyRC4p
 * @param {String|Array|Buffer} inp - input
 * @param {String|Array|Buffer} res - response
 * @param {Array} ksa - ksa box
 * @return {String|Array|Buffer}
 */
function bodyRC4p(inp,res,ksa) {

    var i = 0, j = 0;
    var s = ksa;
    var a = null, b = null, c = null;
    var res = res;
    if (typeof (res) == 'string') {
        for (var y = 0, l = inp.length; y < l; y++) {
            i = (i + 1) % 256;
            a = s[i];
            j = s[(j + a) % 256];
            b = s[j];
            s[j] = [a,s[i] = b][0];
            c = (s[i << 5 ^ j >> 3] + s[j << 5 ^ i >> 3]) % 256;
            res += String.fromCharCode(inp.charCodeAt(y)
                    ^ (s[a + b] + s[c ^ 0xAA]) ^ s[j + b]);
        }
    } else {
        for (var y = 0, l = inp.length; y < l; y++) {
            i = (i + 1) % 256;
            a = s[i];
            j = s[(j + a) % 256];
            b = s[j];
            s[j] = [a,s[i] = b][0];
            c = (s[i << 5 ^ j >> 3] + s[j << 5 ^ i >> 3]) % 256;
            res[y] = inp[y] ^ (s[a + b] + s[c ^ 0xAA]) ^ s[j + b];
        }
    }
    return res;
};
/**
 * export class
 * 
 * @exports rc4
 * @function rc4
 * @return {RC4}
 */
module.exports = function rc4(key) {

    return new RC4(key);
};

/*
 * class
 */
/**
 * RC4 class
 * 
 * @class RC4
 * @param {String|Array} key - user key
 * @return {Object}
 */
function RC4(key) {

    this.key;
    this.change(key);
}
/**
 * change user key
 * 
 * @function change
 * @param {String|Array|Buffer} key - user key
 * @return
 */
RC4.prototype.change = function(key) {

    this.key = new Array(key.legth);
    if (Array.isArray(key)) {
        this.key = key;
    } else if (typeof (key) == 'string' || Buffer.isBuffer(key)) {
        key = new Buffer(key);
        for (var i = 0, ii = key.length; i < ii; i++) {
            this.key[i] = key[i];
        }
    } else {
        throw new Error('Invalid data');
    }
    return;
};
/**
 * RC4 string code
 * 
 * @function codeString
 * @param {String} str - data
 * @return {String}
 */
RC4.prototype.codeString = function(str) {

    return body(str,'',ksa(this.key));
};
/**
 * RC4 array code
 * 
 * @function codeArray
 * @param {Array} arr - data
 * @return {Array}
 */
RC4.prototype.codeArray = function(arr) {

    var out = new Array(arr.length);
    return body(arr,out,ksa(this.key));
};
/**
 * RC4 buffer code
 * 
 * @function codeBuffer
 * @param {Buffer} buff - data
 * @return {Buffer}
 */
RC4.prototype.codeBuffer = function(buff) {

    var out = new Buffer(buff.length);
    return body(buff,out,ksa(this.key));
};
/**
 * RC4 mixed code. Alias for codeString or codeByte
 * 
 * @function code
 * @param {String|Array|Buffer} boh - data
 * @return {String|Array|Buffer}
 */
RC4.prototype.code = function(boh) {

    if (typeof (boh) == 'string') {
        return this.codeString(boh);
    } else if (Array.isArray(boh)) {
        return this.codeArray(boh);
    } else if (Buffer.isBuffer(boh)) {
        return this.codeBuffer(boh);
    } else {
        throw new Error('Invalid data');
    }
    return;
};
/**
 * RC4A string code
 * 
 * @function codeStringRC4A
 * @param {String} str - data
 * @return {String}
 */
RC4.prototype.codeStringRC4A = function(str) {

    return bodyRC4A(str,'',ksa(this.key));
};
/**
 * RC4A array code
 * 
 * @function codeArrayRC4A
 * @param {Array} arr - data
 * @return {Array}
 */
RC4.prototype.codeArrayRC4A = function(arr) {

    var out = new Array(arr.length);
    return body(arr,out,ksa(this.key));
};
/**
 * RC4A buffer code
 * 
 * @function codeBufferRC4A
 * @param {Buffer} buff - data
 * @return {Buffer}
 */
RC4.prototype.codeBufferRC4A = function(buff) {

    var out = new Buffer(buff.length);
    return body(buff,out,ksa(this.key));
};
/**
 * RC4A mixed code. Alias for codeString or codeByte
 * 
 * @function codeRC4A
 * @param {String|Array|Buffer} boh - data
 * @return {String|Array|Buffer}
 */
RC4.prototype.codeRC4A = function(boh) {

    if (typeof (boh) == 'string') {
        return this.codeStringRC4A(boh);
    } else if (Array.isArray(boh)) {
        return this.codeArrayRC4A(boh);
    } else if (Buffer.isBuffer(boh)) {
        return this.codeBufferRC4A(boh);
    } else {
        throw new Error('Invalid data');
    }
    return;
};
/**
 * VMPC string code
 * 
 * @function codeStringVMPC
 * @param {String} str - data
 * @return {String}
 */
RC4.prototype.codeStringVMPC = function(str) {

    return bodyVMPC(str,'',ksa(this.key));
};
/**
 * VMPC array code
 * 
 * @function codeArrayVMPC
 * @param {Array} arr - data
 * @return {Array}
 */
RC4.prototype.codeArrayVMPC = function(arr) {

    var out = new Array(arr.length);
    return bodyVMPC(arr,out,ksa(this.key));
};
/**
 * VMPC buffer code
 * 
 * @function codeBufferVMPC
 * @param {Buffer} buff - data
 * @return {Buffer}
 */
RC4.prototype.codeBufferVMPC = function(buff) {

    var out = new Buffer(buff.length);
    return bodyVMPC(buff,out,ksa(this.key));
};
/**
 * VMPC mixed code. Alias for codeString or codeByte
 * 
 * @function codeVMPC
 * @param {String|Array} boh - data
 * @return {String|Array}
 */
RC4.prototype.codeVMPC = function(boh) {

    if (typeof (boh) == 'string') {
        return this.codeStringVMPC(boh);
    } else if (Array.isArray(boh)) {
        return this.codeArrayVMPC(boh);
    } else if (Buffer.isBuffer(boh)) {
        return this.codeBufferVMPC(boh);
    } else {
        throw new Error('Invalid data');
    }
    return;
};
/**
 * RC4p string code
 * 
 * @function codeStringRC4p
 * @param {String} str - data
 * @return {String}
 */
RC4.prototype.codeStringRC4p = function(str) {

    return bodyRC4p(str,'',ksa(this.key));
};
/**
 * RC4p array code
 * 
 * @function codeArrayRC4p
 * @param {Array} arr - data
 * @return {Array}
 */
RC4.prototype.codeArrayRC4p = function(arr) {

    var out = new Array(arr.length);
    return bodyRC4p(arr,out,ksa(this.key));
};
/**
 * RC4p buffer code
 * 
 * @function codeBufferRC4p
 * @param {Buffer} buff - data
 * @return {Buffer}
 */
RC4.prototype.codeBufferRC4p = function(buff) {

    var out = new Buffer(buff.length);
    return bodyRC4p(buff,out,ksa(this.key));
};
/**
 * RC4p mixed code. Alias for codeString or codeByte
 * 
 * @function codeRC4p
 * @param {String|Array|Array} boh - data
 * @return {String|Array|Array}
 */
RC4.prototype.codeRC4p = function(boh) {

    if (typeof (boh) == 'string') {
        return this.codeStringRC4p(boh);
    } else if (Array.isArray(boh)) {
        return this.codeArrayRC4p(boh);
    } else if (Buffer.isBuffer(boh)) {
        return this.codeBufferRC4p(boh);
    } else {
        throw new Error('Invalid data');
    }
    return;
};
