"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var node_fetch_1 = require("node-fetch");
var Accept = 'application/json';
var ContentType = 'application/json';
var ContentTypeReg = new RegExp(ContentType);
var TendzinClientError = /** @class */ (function (_super) {
    __extends(TendzinClientError, _super);
    function TendzinClientError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return TendzinClientError;
}(Error));
var TendzinClientRequestError = /** @class */ (function (_super) {
    __extends(TendzinClientRequestError, _super);
    function TendzinClientRequestError(message, status) {
        var _this = _super.call(this, message) || this;
        _this.status = status || 500;
        _this.name = _this.constructor.name;
        Error.captureStackTrace(_this, _this.constructor);
        return _this;
    }
    return TendzinClientRequestError;
}(TendzinClientError));
function isJSONResponse(response) {
    var contentType = response.headers.get('content-type');
    if (!contentType) {
        return false;
    }
    var matchData = contentType.match(ContentTypeReg);
    if (!matchData) {
        return false;
    }
    return true;
}
function request(path, options) {
    return __awaiter(this, void 0, void 0, function () {
        var url, response, isJSON, body, errors, text;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = options.protocol + "://" + options.host + "/" + path;
                    return [4 /*yield*/, node_fetch_1.default(url, { headers: options.headers, body: options.body, method: options.method })];
                case 1:
                    response = _a.sent();
                    isJSON = isJSONResponse(response);
                    if (!(response.ok && isJSON)) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    body = _a.sent();
                    return [2 /*return*/, body];
                case 3:
                    if (response.ok) {
                        return [2 /*return*/, {}];
                    }
                    if (!isJSON) return [3 /*break*/, 5];
                    return [4 /*yield*/, response.json()];
                case 4:
                    errors = _a.sent();
                    throw new TendzinClientRequestError(JSON.stringify(errors), response.status);
                case 5: return [4 /*yield*/, response.text()];
                case 6:
                    text = _a.sent();
                    throw new TendzinClientRequestError(text, response.status);
            }
        });
    });
}
function headers(token) {
    return {
        Accept: Accept,
        Authorization: "Bearer " + token,
        'Content-Type': ContentType,
    };
}
function mergeOptions(options, token, data, method) {
    var newOptions = __assign({ method: method, host: 'sydney.tendzin.com', protocol: 'https' }, options, { headers: __assign({}, headers(token), options.headers) });
    if (data) {
        newOptions.body = JSON.stringify(data);
    }
    return newOptions;
}
function postRequest(path, token, data, options) {
    return request(path, mergeOptions(options, token, data, 'post'));
}
function patchRequest(path, token, data, options) {
    console.log(data);
    return request(path, mergeOptions(options, token, data, 'patch'));
}
function getRequest(path, token, options) {
    return request(path, mergeOptions(options, token, null, 'get'));
}
function fqdn(node) {
    return node + ".tendzin.com";
}
module.exports = function (_a) {
    var _this = this;
    var _b = _a === void 0 ? {} : _a, token = _b.token, node = _b.node;
    if (!token) {
        throw new TendzinClientError("missing property \"token\", login at tendzin.com and issue a token for node you wish to use");
    }
    if (!node) {
        throw new TendzinClientError("missing property \"node\", try \"sydney', \"los-angeles\" or \"london\" for example");
    }
    return {
        transact: function (events, uuid, transactionId) { return __awaiter(_this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            host: fqdn(node),
                            headers: {},
                        };
                        if (transactionId) {
                            options.headers = {
                                'tendzin-transaction-id': transactionId,
                            };
                        }
                        return [4 /*yield*/, patchRequest("range/day/" + uuid, token, { events: events }, options)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        }); },
        spawn: function () { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, postRequest('range/day', token, null, { host: fqdn(node) })];
                    case 1:
                        result = (_a.sent()).result;
                        return [2 /*return*/, result];
                }
            });
        }); },
        getInventory: function (uuid) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getRequest("range/day/" + uuid + "/inventories", token, { host: fqdn(node) })];
                    case 1:
                        result = (_a.sent()).result;
                        return [2 /*return*/, result];
                }
            });
        }); },
        getContiguousInventory: function (uuid) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getRequest("range/day/" + uuid + "/contiguous-inventories", token, { host: fqdn(node) })];
                    case 1:
                        result = (_a.sent()).result;
                        return [2 /*return*/, result];
                }
            });
        }); },
        getStatus: function (uuid) { return __awaiter(_this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getRequest("range/day/" + uuid, token, { host: fqdn(node) })];
                    case 1:
                        result = (_a.sent()).result;
                        return [2 /*return*/, result];
                }
            });
        }); },
    };
};
