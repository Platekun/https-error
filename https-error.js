// Copyright (c) 2016 Frank Hellwig
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var util = require('util');

var errors = {
    badRequest: {
        code: 400,
        text: "Bad Request"
    },
    unauthorized: {
        code: 401,
        text: "Unauthorized"
    },
    paymentRequired: {
        code: 402,
        text: "Payment Required"
    },
    forbidden: {
        code: 403,
        text: "Forbidden"
    },
    notFound: {
        code: 404,
        text: "Not Found"
    },
    methodNotAllowed: {
        code: 405,
        text: "Method Not Allowed"
    },
    notAcceptable: {
        code: 406,
        text: "Not Acceptable"
    },
    proxyAuthenticationRequired: {
        code: 407,
        text: "Proxy Authentication Required"
    },
    requestTimeout: {
        code: 408,
        text: "Request Timeout"
    },
    conflict: {
        code: 409,
        text: "Conflict"
    },
    gone: {
        code: 410,
        text: "Gone"
    },
    lengthRequired: {
        code: 411,
        text: "Length Required"
    },
    preconditionFailed: {
        code: 412,
        text: "Precondition Failed"
    },
    payloadTooLarge: {
        code: 413,
        text: "Payload Too Large"
    },
    uriTooLong: {
        code: 414,
        text: "URI Too Long"
    },
    unsupportedMediaType: {
        code: 415,
        text: "Unsupported Media Type"
    },
    rangeNotSatisfiable: {
        code: 416,
        text: "Range Not Satisfiable"
    },
    expectationFailed: {
        code: 417,
        text: "Expectation Failed"
    },
    imATeapot: {
        code: 418,
        text: "I'm a teapot"
    },
    misdirectedRequest: {
        code: 421,
        text: "Misdirected Request"
    },
    unprocessableEntity: {
        code: 422,
        text: "Unprocessable Entity"
    },
    locked: {
        code: 423,
        text: "Locked"
    },
    failedDependency: {
        code: 424,
        text: "Failed Dependency"
    },
    unorderedCollection: {
        code: 425,
        text: "Unordered Collection"
    },
    upgradeRequired: {
        code: 426,
        text: "Upgrade Required"
    },
    preconditionRequired: {
        code: 428,
        text: "Precondition Required"
    },
    tooManyRequests: {
        code: 429,
        text: "Too Many Requests"
    },
    requestHeaderFieldsTooLarge: {
        code: 431,
        text: "Request Header Fields Too Large"
    },
    unavailableForLegalReasons: {
        code: 451,
        text: "Unavailable For Legal Reasons"
    },
    internalServerError: {
        code: 500,
        text: "Internal Server Error"
    },
    notImplemented: {
        code: 501,
        text: "Not Implemented"
    },
    badGateway: {
        code: 502,
        text: "Bad Gateway"
    },
    serviceUnavailable: {
        code: 503,
        text: "Service Unavailable"
    },
    gatewayTimeout: {
        code: 504,
        text: "Gateway Timeout"
    },
    httpVersionNotSupported: {
        code: 505,
        text: "HTTP Version Not Supported"
    },
    variantAlsoNegotiates: {
        code: 506,
        text: "Variant Also Negotiates"
    },
    insufficientStorage: {
        code: 507,
        text: "Insufficient Storage"
    },
    loopDetected: {
        code: 508,
        text: "Loop Detected"
    },
    bandwidthLimitExceeded: {
        code: 509,
        text: "Bandwidth Limit Exceeded"
    },
    notExtended: {
        code: 510,
        text: "Not Extended"
    },
    networkAuthenticationRequired: {
        code: 511,
        text: "Network Authentication Required"
    }
};

// Maps codes to their text description (e.g., 404 -> 'Not Found').
var byCode = {};

// Populate the byCode object.
Object.keys(errors).forEach(function (key) {
    var error = errors[key];
    byCode[error.code] = error.text;
});

// Given a code, returns the text description.
function findText(code) {
    return byCode[code] || 'Unknown Code';
}

// The template for the toHtml() method.
var htmlTemplate = '<div style="font-family:monospace;font-size:1.2em;margin:1em">' + '<p><strong>%d (%s)</strong></p><p>%s</p>' + '</div>';

var HttpsError = function (_Error) {
    _inherits(HttpsError, _Error);

    function HttpsError(code, message) {
        _classCallCheck(this, HttpsError);

        var _this = _possibleConstructorReturn(this, (HttpsError.__proto__ || Object.getPrototypeOf(HttpsError)).call(this, message));

        _this.name = 'HttpsError';
        _this._code = code;
        _this._text = findText(code);
        return _this;
    }

    _createClass(HttpsError, [{
        key: 'toString',
        value: function toString() {
            return util.format('Error: %d (%s) %s', this.code, this.text, this.message);
        }
    }, {
        key: 'toJson',
        value: function toJson() {
            return {
                status: 'error',
                code: this.code,
                text: this.text,
                message: this.message
            };
        }
    }, {
        key: 'toHtml',
        value: function toHtml() {
            return util.format(htmlTemplate, this.code, this.text, this.message);
        }
    }, {
        key: 'code',
        get: function get() {
            return this._code;
        }
    }, {
        key: 'text',
        get: function get() {
            return this._text;
        }
    }]);

    return HttpsError;
}(Error);

// Create a static factory method for each error. The factory method takes
// an error object or one or more arguments that are passed to util.format.


Object.keys(errors).forEach(function (key) {
    var code = errors[key].code;
    HttpsError[key] = function (err) {
        if (err instanceof Error) {
            return new HttpsError(code, err.message);
        } else {
            var args = Array.prototype.slice.call(arguments);
            var message = util.format.apply(util, args);
            return new HttpsError(code, message);
        }
    };
});

module.exports = HttpsError;