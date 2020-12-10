import axios from 'axios';
import Headers from './headers';
// import Factory from '../utils/factory';
// import Strings from '../utils/Strings';
// import binderKeys from '../utils/factory/binder.keys';

import * as Constants from 'nk-constants';

const restOptions = function (refresh: boolean = false) {
    let auth = 'Access ' + Headers.getAccessToken().value;
    if (refresh)
        auth = 'Refresh ' + Headers.getRefreshToken().value;
    return {
        headers: {
            'Authorization': auth,
            'Content-Type': 'application/json'
        }
    }
}

function throwError(s, e) {
    const error = new Error();
    error.message = e.constructor === ''.constructor ? e : JSON.stringify(e);
    error.name = s.toString();
    throw error;
}

function deconstructError(error) {
    let name = '503';
    let message = 'Service Unavailable';
    console.log(error, error.response, error.name, error.message)
    if (error.response) {
        name = error.response.status + '';
        message = error.response.data;
    } else if (error.name) {
        name = error.name;
        message = error.message;
    }
    return { name, message };
}

let fetchAccessToken;

const setAccessTokenFetcher = (af) => {
    fetchAccessToken = af;
}

const httpOp = async function (
    method: 'post' | 'get' | 'put' | 'delete' = 'get',
    url: string,
    data: any,
    refresh: boolean = false
) {
    console.log('httpOp', method, url, data, refresh);
    for (let i = 0; i < 5; i++) {
        console.log('httpOp', 'i', i);
        try {
            if (method === 'post')
                return await axios.post(url, data, restOptions(refresh));
            if (method === 'get')
                return await axios.get(url, restOptions(refresh));
            if (method === 'put')
                return await axios.put(url, data, restOptions(refresh));
            if (method === 'delete')
                return await axios.delete(url, restOptions(refresh));
        } catch (error) {

            const { name, message } = deconstructError(error);

            if (name === '401') {
                console.log('name', name, message);
                throwError('401', error.response.data.errorCode);
            }

            if (name === '403') {
                if (error.response.data.errorCode === Constants.API.CUSTOM_ERROR.ACCESS_TOKEN_EXPIRED) {
                    try {
                        // console.log('Factory','boundFunction',binderKeys.AUTH_GET_ACCESS_TOKEN,Factory.boundFunction(binderKeys.AUTH_GET_ACCESS_TOKEN))
                        // await (Factory.boundFunction(binderKeys.AUTH_GET_ACCESS_TOKEN)());
                        await fetchAccessToken();
                        continue;
                    } catch (error) {
                        console.log('error', error, error.name, error.message);
                        const { name, message } = deconstructError(error);

                        Headers.setAccessToken('', 0);
                        Headers.setRefreshToken('', 0);
                        Headers.setUserConfirmed(false);
                        Headers.backupData();

                        throwError(name, message);
                    }
                } else if (error.response.data.errorCode) {
                    throwError('403', error.response.data.errorCode);
                } else {
                    throwError(name, message);
                }
            } else {
                throwError(name, message);
            }
        }
        return { data: {} };
    }
    return { data: {} };
}

const postOp = async function (url: string, data: any, refresh: boolean = false) {
    return httpOp('post', url, data, refresh);
};

const getOp = async function (url: string, refresh: boolean = false) {
    return httpOp('get', url, null, refresh);
};

const putOp = async function (url: string, data: any, refresh: boolean = false) {
    return httpOp('put', url, data, refresh);
};

const deleteOp = async function (url: string, refresh: boolean = false) {
    return httpOp('delete', url, null, refresh);
}

export {
    postOp,
    getOp,
    putOp,
    deleteOp,
    setAccessTokenFetcher
}