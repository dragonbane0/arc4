"use strict";
/**
 * @file vmpc test
 * @module arc4
 * @package arc4
 * @subpackage test
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
    var assert = require('assert');
} catch (MODULE_NOT_FOUND) {
    console.error(MODULE_NOT_FOUND);
    process.exit(1);
}

/*
 * test module
 */
describe('vmpc',function() {

    var a;// key
    var b;// data

    it('string - should return some string',function(done) {

        a = 'pippo';
        b = 'ciao';
        var cipher = rc4(a);
        var d = cipher.codeStringVMPC(b); // encrypt
        var e = cipher.codeStringVMPC(d); // decrypt
        assert.deepEqual(b,e,'clear');
        assert.notDeepEqual(b,d,'orig - encrypt');
        assert.notDeepEqual(e,d,'encrypt - decrypt');

        var cipher = rc4(a,true);
        var dd = cipher.codeStringVMPC(b); // encrypt
        var ee = cipher.codeStringVMPC(dd); // decrypt
        assert.deepEqual(b,ee,'lodash');
        assert.notDeepEqual(b,dd,'orig - encrypt');
        assert.notDeepEqual(ee,dd,'encrypt - decrypt');

        assert.deepEqual(d,dd,'encrypt');
        assert.deepEqual(e,ee,'decrypt');
        done();
    });

    it('array - should return some array',function(done) {

        a = [112,105,112,112,111];
        b = [99,105,97,111];
        var cipher = rc4(a);
        var d = cipher.codeArrayVMPC(b); // encrypt
        var e = cipher.codeArrayVMPC(d); // decrypt
        assert.deepEqual(b,e,'clear');
        assert.notDeepEqual(b,d,'orig - encrypt');
        assert.notDeepEqual(e,d,'encrypt - decrypt');

        var cipher = rc4(a,true);
        var dd = cipher.codeArrayVMPC(b); // encrypt
        var ee = cipher.codeArrayVMPC(dd); // decrypt
        assert.deepEqual(b,ee,'lodash');
        assert.notDeepEqual(b,dd,'orig - encrypt');
        assert.notDeepEqual(ee,dd,'encrypt - decrypt');

        assert.deepEqual(d,dd,'encrypt');
        assert.deepEqual(e,ee,'decrypt');
        done();
    });

    it('buffer - should return some buffer',function(done) {

        a = new Buffer('pippo');
        b = new Buffer('ciao');
        var cipher = rc4(a);
        var d = cipher.codeBufferVMPC(b); // encrypt
        var e = cipher.codeBufferVMPC(d); // decrypt
        assert.deepEqual(b,e,'clear');
        assert.notDeepEqual(b,d,'orig - encrypt');
        assert.notDeepEqual(e,d,'encrypt - decrypt');

        var cipher = rc4(a,true);
        var dd = cipher.codeBufferVMPC(b); // encrypt
        var ee = cipher.codeBufferVMPC(dd); // decrypt
        assert.deepEqual(b,ee,'lodash');
        assert.notDeepEqual(b,dd,'orig - encrypt');
        assert.notDeepEqual(ee,dd,'encrypt - decrypt');

        assert.deepEqual(d,dd,'encrypt');
        assert.deepEqual(e,ee,'decrypt');
        done();
    });

    it('combine - should return combine',function(done) {

        a = new Buffer('pippo');
        b = '1';
        var cipher = rc4(a);
        var d = cipher.codeVMPC(b); // encrypt
        d = [d.charCodeAt(0)]; // string->byte
        var e = cipher.codeVMPC(d); // decrypt
        e = String.fromCharCode(e[0]); // byte -> string
        assert.deepEqual(b,e,'clear');
        assert.notDeepEqual(b,d,'orig - encrypt');
        assert.notDeepEqual(e,d,'encrypt - decrypt');
        done();
    });

    it('wrong - change key',function(done) {

        a = 'pippo';
        b = 'ciao';
        var cipher = rc4(a);
        var d = cipher.codeStringVMPC(b); // encrypt
        cipher.change('pluto'); // change key
        var e = cipher.codeStringVMPC(d); // decrypt
        assert.notDeepEqual(b,e,'clear');
        assert.notDeepEqual(b,d,'orig - encrypt');
        assert.notDeepEqual(e,d,'encrypt - decrypt');
        done();
    });

    it('file - should read encrypted file',function(done) {

        var fs = require('fs');
        a = 'hex7c0';
        b = new Buffer('ciao I\'m hex7c0\nHow are you?\n:D');
        var cipher = rc4(a);

        var d = cipher.codeBufferVMPC(b); // encrypt
        // use {encoding: null} when you write buffer
        fs.writeFile('crypted',d,{
            encoding: null
        },function(err) {

            if (err)
                return done(err);
            // use {encoding: null} when you read buffer
            fs.readFile('crypted',{
                encoding: null
            },function(err,data) {

                if (err)
                    return done(err);
                var e = cipher.codeBufferVMPC(data); // decrypt
                assert.deepEqual(b,e,'clear');
                assert.notDeepEqual(b,d,'orig - encrypt');
                assert.notDeepEqual(e,d,'encrypt - decrypt');
                fs.unlink('crypted',function() {

                    done();
                });
            });
        });
    });
});
