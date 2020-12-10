"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHandlers = void 0;
const Constants = require("nk-constants");
let handlers = {
    handleTokenError: () => { },
    handleNotFoundError: () => { },
    handleNetworkError: () => { },
    handleConfirmationNeededError: () => { }
};
function setHandlers(value) {
    handlers = value;
}
exports.setHandlers = setHandlers;
function safePromise(promise) {
    console.log('safe.promise', promise);
    return new Promise((resolve, reject) => {
        promise.then((result) => {
            console.log('safe.promise', 'result', result);
            resolve(result);
        }).catch((error) => {
            console.log('safe.promise', 'error', error, '|', error.message, '|', error.status);
            if ([
                Constants.API.CUSTOM_ERROR.UNAUTHORIZED,
                Constants.API.CUSTOM_ERROR.ACCESS_TOKEN_EXPIRED,
                Constants.API.CUSTOM_ERROR.AUTHENTICATION_REQUIRED,
                Constants.API.CUSTOM_ERROR.REFRESH_TOKEN_EXPIRED,
                Constants.API.CUSTOM_ERROR.TOKEN_EXPIRED
            ].indexOf(error.message) !== -1) {
                handlers.handleTokenError();
            }
            else if (error.message === Constants.API.CUSTOM_ERROR.USER_UNCONFIRMED) {
                handlers.handleConfirmationNeededError();
            }
            else if (error.message === Constants.API.CUSTOM_ERROR.NOT_FOUND) {
                handlers.handleNotFoundError();
            }
            else if (error.message === 'Network Error') {
                handlers.handleNetworkError();
            }
            else {
                reject(error);
            }
        });
    });
}
exports.default = safePromise;
