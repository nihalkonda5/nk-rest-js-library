import * as RestOperations from './rest.operations';

export default class RESTObject<T>{

    private api: Function;

    data: T;

    overloadables = {
        init: (): any => {
            this.data = <T>{};
        },
        newInstance: (): RESTObject<T> => {
            return null;
        },
        loadPartialContent: (preview: object): any => {
            this.setData(RESTObject.copyJSON(this.getData(), preview));
        },
        formulateCreateUrl: (): string => {
            return this.api();
        },
        formulateReadUrl: (full: boolean = false): string => {
            return this.api() + '/' + this.data["_id"] + (full ? '?full=true' : '');
        },
        formulateSearchUrl: (pageSize: number, pageNum: number): string => {
            return this.api() + "/search?pageSize=" + pageSize + "&pageNum=" + pageNum;
        },
        formulateUpdateUrl: (): string => {
            return this.api() + '/' + this.data["_id"];
        },
        formulateDeleteUrl: (): string => {
            return this.api() + '/' + this.data["_id"];
        },
        creationPacket: (): any => {
            return this.data;
        },
        updationPacket: (): any => {
            return this.data;
        }
    };

    constructor(api: string | Function) {
        if (api.constructor === ''.constructor)
            this.api = function () { return api };
        else
            this.api = <Function>api;
        this.overloadables.init();
    }

    getApi() {
        return this.api;
    }

    getData() {
        return this.data;
    }

    setData(data: T) {
        this.data = data;
        return this.getData();
    }

    static copyJSON(target, source: object) {
        for (const k of Object.keys(source)) {
            target[k] = (
                    (source[k] !== null) && 
                    (source[k] !== undefined) && 
                    (source[k].constructor.name === 'Object')
                ) ? 
                this.copyJSON(target[k] || {}, source[k]) :
                source[k];
        }
        return target;
    }

    async create() {
        const url = this.overloadables.formulateCreateUrl();
        const data = this.overloadables.creationPacket();
        console.log('POST', url,data);
        const response = await RestOperations.postOp(url,data);
        const responseData = response.data;
        console.log('POST', url,data,responseData);
        this.overloadables.loadPartialContent(responseData);
    }

    async read(full: boolean = false) {
        const url = this.overloadables.formulateReadUrl(full);
        console.log('GET', url);
        const response = await RestOperations.getOp(url);
        const responseData = response.data;
        console.log('GET', url,responseData);
        this.overloadables.loadPartialContent(responseData);
    }

    async update() {
        const url = this.overloadables.formulateUpdateUrl();
        const data = this.overloadables.updationPacket();
        console.log('PUT', url,data);
        const response = await RestOperations.putOp(url,data);
        const responseData = response.data;
        console.log('PUT', url,data,responseData);
        this.overloadables.loadPartialContent(responseData);
    }

    async delete() {
        const url = this.overloadables.formulateDeleteUrl();
        console.log('DELETE', url);
        const response = await RestOperations.deleteOp(url);
        const responseData = response.data;
        console.log('DELETE', url,responseData);
        this.overloadables.loadPartialContent(responseData);
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