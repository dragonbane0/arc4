"use strict";
/**
 * @file wrong example
 * @module arc4
 * @package arc4
 * @subpackage examples
 * @version 0.0.1
 * @author hex7c0 <hex7c0@gmail.com>
 * @license GPLv3
 */

/*
 * initialize module
 */
// import
try {
    var rc4 = require('../index.min.js'); // use require('arc4') instead
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

var a = 'pippo'; // key
var b = 'ciao'; // data
var cipher = rc4(a);

var d = cipher.codeString(b); // encrypt

cipher.change('pluto'); // change key

var e = cipher.codeString(d); // decrypt

console.log('original: ' + b);
console.log('encrypt: ' + d);
console.log('decrypt: ' + e);
