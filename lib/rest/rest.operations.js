"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAccessTokenFetcher = exports.deleteOp = exports.putOp = exports.getOp = exports.postOp = void 0;
const axios_1 = require("axios");
const headers_1 = require("./headers");
const Constants = require("nk-constants");
const restOptions = function (refresh = false) {
    let auth = 'Access ' + headers_1.default.getAccessToken().value;
    if (refresh)
        auth = 'Refresh ' + headers_1.default.getRefreshToken().value;
    return {
        headers: {
            'Authorization': auth,
            'Content-Type': 'application/json'
        }
    };
};
function throwError(s, e) {
    const error = new Error();
    error.message = e.constructor === ''.constructor ? e : JSON.stringify(e);
    error.name = s.toString();
    throw error;
}
function deconstructError(error) {
    let name = '503';
    let message = 'Service Unavailable';
    console.log(error, error.response, error.name, error.message);
    if (error.response) {
        name = error.response.status + '';
        message = error.response.data;
    }
    else if (error.name) {
        name = error.name;
        message = error.message;
    }
    return { name, message };
}
let fetchAccessToken;
const setAccessTokenFetcher = (af) => {
    fetchAccessToken = af;
};
exports.setAccessTokenFetcher = setAccessTokenFetcher;
const httpOp = function (method = 'get', url, data, refresh = false) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('httpOp', method, url, data, refresh);
        for (let i = 0; i < 5; i++) {
            console.log('httpOp', 'i', i);
            try {
                if (method === 'post')
                    return yield axios_1.default.post(url, data, restOptions(refresh));
                if (method === 'get')
                    return yield axios_1.default.get(url, restOptions(refresh));
                if (method === 'put')
                    return yield axios_1.default.put(url, data, restOptions(refresh));
                if (method === 'delete')
                    return yield axios_1.default.delete(url, restOptions(refresh));
            }
            catch (error) {
                const { name, message } = deconstructError(error);
                if (name === '401') {
                    console.log('name', name, message);
                    throwError('401', error.response.data.errorCode);
                }
                if (name === '403') {
                    if (error.response.data.errorCode === Constants.API.CUSTOM_ERROR.ACCESS_TOKEN_EXPIRED) {
                        try {
                            yield fetchAccessToken();
                            continue;
                        }
                        catch (error) {
                            console.log('error', error, error.name, error.message);
                            const { name, message } = deconstructError(error);
                            headers_1.default.setAccessToken('', 0);
                            headers_1.default.setRefreshToken('', 0);
                            headers_1.default.setUserConfirmed(false);
                            headers_1.default.backupData();
                            throwError(name, message);
                        }
                    }
                    else if (error.response.data.errorCode) {
                        throwError('403', error.response.data.errorCode);
                    }
                    else {
                        throwError(name, message);
                    }
                }
                else {
                    throwError(name, message);
                }
            }
            return { data: {} };
        }
        return { data: {} };
    });
};
const postOp = function (url, data, refresh = false) {
    return __awaiter(this, void 0, void 0, function* () {
        return httpOp('post', url, data, refresh);
    });
};
exports.postOp = postOp;
const getOp = function (url, refresh = false) {
    return __awaiter(this, void 0, void 0, function* () {
        return httpOp('get', url, null, refresh);
    });
};
exports.getOp = getOp;
const putOp = function (url, data, refresh = false) {
    return __awaiter(this, void 0, void 0, function* () {
        return httpOp('put', url, data, refresh);
    });
};
exports.putOp = putOp;
const deleteOp = function (url, refresh = false) {
    return __awaiter(this, void 0, void 0, function* () {
        return httpOp('delete', url, null, refresh);
    });
};
exports.deleteOp = deleteOp;
