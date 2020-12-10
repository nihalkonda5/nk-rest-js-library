"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setHandlers = void 0;
let handlers = {
    handleEmptyToken: () => { },
    handleExpiredRefreshToken: () => { },
    handleNetworkError: () => { }
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
        });
    });
}
exports.default = safePromise;
