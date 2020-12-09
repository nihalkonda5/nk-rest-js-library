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
const RestOperations = require("./rest.operations");
class RESTObject {
    constructor(api) {
        this.overloadables = {
            init: () => {
                this.data = {};
            },
            newInstance: () => {
                return null;
            },
            loadPartialContent: (preview) => {
                this.setData(RESTObject.copyJSON(this.getData(), preview));
            },
            formulateCreateUrl: () => {
                return this.api();
            },
            formulateReadUrl: (full = false) => {
                return this.api() + '/' + this.data["_id"] + (full ? '?full=true' : '');
            },
            formulateSearchUrl: (pageSize, pageNum) => {
                return this.api() + "/search?pageSize=" + pageSize + "&pageNum=" + pageNum;
            },
            formulateUpdateUrl: () => {
                return this.api() + '/' + this.data["_id"];
            },
            formulateDeleteUrl: () => {
                return this.api() + '/' + this.data["_id"];
            },
            creationPacket: () => {
                return this.data;
            },
            updationPacket: () => {
                return this.data;
            }
        };
        if (api.constructor === ''.constructor)
            this.api = function () { return api; };
        else
            this.api = api;
        this.overloadables.init();
    }
    getApi() {
        return this.api;
    }
    getData() {
        return this.data;
    }
    setData(data) {
        this.data = data;
        return this.getData();
    }
    static copyJSON(target, source) {
        for (const k of Object.keys(source)) {
            target[k] = ((source[k] !== null) &&
                (source[k] !== undefined) &&
                (source[k].constructor.name === 'Object')) ?
                this.copyJSON(target[k] || {}, source[k]) :
                source[k];
        }
        return target;
    }
    create() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.overloadables.formulateCreateUrl();
            const data = this.overloadables.creationPacket();
            console.log('POST', url, data);
            const response = yield RestOperations.postOp(url, data);
            const responseData = response.data;
            console.log('POST', url, data, responseData);
            this.overloadables.loadPartialContent(responseData);
        });
    }
    read(full = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.overloadables.formulateReadUrl(full);
            console.log('GET', url);
            const response = yield RestOperations.getOp(url);
            const responseData = response.data;
            console.log('GET', url, responseData);
            this.overloadables.loadPartialContent(responseData);
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.overloadables.formulateUpdateUrl();
            const data = this.overloadables.updationPacket();
            console.log('PUT', url, data);
            const response = yield RestOperations.putOp(url, data);
            const responseData = response.data;
            console.log('PUT', url, data, responseData);
            this.overloadables.loadPartialContent(responseData);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            const url = this.overloadables.formulateDeleteUrl();
            console.log('DELETE', url);
            const response = yield RestOperations.deleteOp(url);
            const responseData = response.data;
            console.log('DELETE', url, responseData);
            this.overloadables.loadPartialContent(responseData);
        });
    }
    static deIdfy(json) {
        if (json.constructor !== {}.constructor) {
            return json;
        }
        delete json['_id'];
        for (const key of Object.keys(json)) {
            json[key] = RESTObject.deIdfy(json[key]);
        }
        return json;
    }
}
exports.default = RESTObject;
