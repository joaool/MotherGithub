/**
 * jquery.FLnumberValidator.js
 * @version: v1
 * @author: adapted from Igor Escobar jquery.mask.j version v1.11.4 (http://blog.igorescobar.com) for numeric input only
 *
 * Created by Igor Escobar on 2012-03-10. Changed by Joao Oliveira (half size) on 2015-08-14
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 */


'use strict';

// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
(function (factory) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery || Zepto);
    }

}(function ($) {

    var Mask = function (el, options) {
        el = $(el);
        var mask = "###";
        globals.oldValue = el.val();
        var jMask = this, oldValue = el.val(), regexMask;
        var p = {
            invalid: [],
            afterMinusValidation: function (keyCode, caretPos, currVal) {
                var newVal = currVal;
                if (keyCode == 189) {
                    if (caretPos == 1) {//checks if it is a second dash
                        if (currVal.substr(0, 2) == "--")
                            newVal = currVal.substring(1);
                    } else {
                        var numAfterFirstDigitOrMinus = currVal.substring(1);
                        newVal = currVal.substring(0, 1) + numAfterFirstDigitOrMinus.replace(/-/g, '');//remove dash. Refuses minus because it is not at the beginning
                    }
                }
                return newVal;
            },
            getCaret: function () {
                try {
                    var sel;
                    var pos = 0;
                    var ctrl = el.get(0);
                    var dSel = document.selection;
                    var cSelStart = ctrl.selectionStart;
                    // IE Support
                    if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
                        sel = dSel.createRange();
                        sel.moveStart('character', el.is('input') ? -el.val().length : -el.text().length);
                        pos = sel.text.length;
                    }
                    // Firefox support
                    else if (cSelStart || cSelStart === '0') {
                        pos = cSelStart;
                    }

                    return pos;
                } catch (e) {
                }
            },
            setCaret: function (pos) {
                try {
                    if (el.is(':focus')) {
                        var range, ctrl = el.get(0);

                        if (ctrl.setSelectionRange) {
                            ctrl.setSelectionRange(pos, pos);
                        } else if (ctrl.createTextRange) {
                            range = ctrl.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', pos);
                            range.moveStart('character', pos);
                            range.select();
                        }
                    }
                } catch (e) {
                }
            },
            events: function () {
                el.on('keyup.mask', p.behaviour).on('change.mask', function () {
                    el.data('changed', true);
                });
            },
            val: function (v) {
                var isInput = el.is('input'),
                    method = isInput ? 'val' : 'text',
                    r;
                if (arguments.length > 0) {
                    if (el[method]() !== v) {
                        el[method](v);
                    }
                    r = el;
                } else {
                    r = el[method]();
                }

                return r;
            },
            behaviour: function (e) {
                e = e || window.event;
                p.invalid = [];
                var keyCode = e.keyCode || e.which;
                //globals.is_keyPressed = false;
                if ($.inArray(keyCode, jMask.byPassKeys) === -1) {
                    var caretPos = p.getCaret(),
                        currVal = p.val();
                    var newVal = p.getNewVal(keyCode, options.minus, options.radix, options.sep);
                    p.val(newVal);
                    globals.is_keyPressed = true;
                    return p.callbacks(e);
                }
            },
            getNewVal: function (keyCode, minus, radix, sep) {
                var group = 3;//not being used for now
                var radixCode = null;
                if (radix) {//if it is an integer radix is null
                    radixCode = (radix == ",") ? 188 : 190;
                }
                var currVal = p.val();
                var newVal = currVal;
                if (sep == ",")
                    if (keyCode == 188) {
                        newVal = newVal.replace(/,/g, '');//remove commas
                        return newVal;//if comma is a separator does not accept comma input - if comma is radix cannot be separator
                    }
                if (sep == ".")
                    if (keyCode == 190) {
                        newVal = newVal.replace(/\./g, '');//remove points
                        return newVal;//if point is a separator does not accept point input - if poinr is radix cannot be separator
                    }
                var caretPos = p.getCaret();
                if (minus)
                    newVal = p.afterMinusValidation(keyCode, caretPos, currVal);//minus is allowed
                //----
                if (radixCode) {
                    if (keyCode == radixCode) {//radix was entered
                        var radixPos = newVal.indexOf(radix);
                        var head = newVal.substring(0, radixPos);
                        var tail = newVal.substring(radixPos + 1);
                        if (currVal.getOcurrencesOf(radix) > 1) {//a second radix was introduced - we will keep the one close to the caret
                            head = newVal.substring(0, caretPos - 1);
                            head = head.replace(/[\.,]/g, '');//remove points and commas from head
                            tail = newVal.substring(caretPos);
                            tail = tail.replace(/[\.,]/g, '');//remove points and commas from tail
                        }
                        newVal = head + radix + tail;
                    }
                }else{//an integer
                    newVal = newVal.replace(/[.,]/g, '');
                }
                //----
                var invalidEntry = newVal.match(/[^0-9$.,-]/g);//searches for invalid char
                if (invalidEntry)
                    globals.is_lastEntryInvalid = true;
                else
                    globals.is_lastEntryInvalid = false;
                newVal = newVal.replace(/[^0-9$.,-]/g, '');
                return newVal;
            },
            callbacks: function (e) {
                console.log("callback area with oldvalue="+globals.oldValue+ " current="+ p.val()+" onChange="+ (globals.oldValue != p.val()) + " invalidEntry="+globals.is_lastEntryInvalid);
                var val = p.val();
                var changed = val !== oldValue;
                var defaultArgs = [val, e, el, options];
                var callback = function (name, criteria, args) {
                    console.log("callback "+name+" criteria="+criteria);
                    if (typeof options[name] === 'function' && criteria) {
                        options[name].apply(this, args);
                    }
                };
                callback('onChange', globals.oldValue != p.val(), defaultArgs);
                //callback('onKeyPress', changed === true, defaultArgs);
                callback('onKeyPress', globals.is_keyPressed, defaultArgs);
                //callback('onComplete', val.length === mask.length, defaultArgs);
                callback('onInvalid', globals.is_lastEntryInvalid, [val, e, el, p.invalid, options]);
                globals.oldValue= p.val();
                globals.is_keyPressed = false;
            }
        };


        // public methods
        jMask.mask = mask;
        jMask.options = options;
        jMask.init = function (onlyMask) {
            options = options || {};
            jMask.byPassKeys = $.jMaskGlobals.byPassKeys;
            jMask = $.extend(true, {}, jMask, options);
            p.events();
        };

        jMask.init(!el.is('input'));
    };
    $.fn.numberValidator = function (options) {
        options = options || {};
        var selector = this.selector,
            globals = $.jMaskGlobals,
            maskFunction = function () {
                return $(this).data('mask', new Mask(this, options));
            };

        $(this).each(maskFunction);

        return this;
    };
    var globals = {
        byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
        oldValue: null,
        is_lastEntryInvalid: false,
        is_keyPressed: false,
    };
    $.jMaskGlobals = $.jMaskGlobals || {};
    globals = $.jMaskGlobals = $.extend(true, {}, globals, $.jMaskGlobals);

}));
