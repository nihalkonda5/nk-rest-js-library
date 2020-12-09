import RESTObject from './rest.object';
export default class SearchRESTObject<T> {
    data: RESTObject<T>;
    request: {
        query: object;
        sort: object;
        attributes: object;
        pageSize: number;
        pageNum: number;
    };
    response: {
        query: object;
        sort: object;
        attributes: object;
        pageSize: number;
        pageNum: number;
        pageCount: number;
        resultSize: number;
        resultTotalSize: number;
        result: RESTObject<T>[];
    };
    constructor(data: RESTObject<T>);
    setRequest(request?: {
        query?: object;
        sort?: object;
        pageSize?: number;
        pageNum?: number;
        attributes?: object;
    }): void;
    hasNextPage(): boolean;
    loadNextPage(): Promise<void | this>;
    search(): Promise<void>;
}
