let handlers = {
    handleEmptyToken: () => { },
    handleExpiredRefreshToken: () => { },
    handleNetworkError: () => { }
}

export function setHandlers(value: typeof handlers) {
    handlers = value;
}


export default function safePromise<T>(promise: Promise<T>): Promise<T> {
    console.log('safe.promise', promise);
    return new Promise<T>((resolve, reject) => {
        promise.then((result) => {
            console.log('safe.promise', 'result', result);
            resolve(result);
        }).catch((error) => {
            console.log('safe.promise', 'error', error, '|', error.message, '|', error.status);
            // if(error.message === Strings.ERROR.TOKEN_EMPTY){
            //     console.log('Sign In Required','');
            //     handlers.handleEmptyToken();
            // }else if(error.message === Strings.ERROR.REFRESH_TOKEN_EXPIRED){
            //     console.log('Sign In Required','');
            //     handlers.handleExpiredRefreshToken();
            // }else if(error.message === Strings.ERROR.NETWORK_ERROR){
            //     console.log('safe.promise','redirect');
            //     console.log('/oops');
            //     handlers.handleNetworkError();
            // }else{
            //     reject(error);
            // }
        })
    })
}