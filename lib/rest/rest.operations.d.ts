declare const postOp: (url: string, data: any, refresh?: boolean) => Promise<import("axios").AxiosResponse<any> | {
    data: {};
}>;
declare const getOp: (url: string, refresh?: boolean) => Promise<import("axios").AxiosResponse<any> | {
    data: {};
}>;
declare const putOp: (url: string, data: any, refresh?: boolean) => Promise<import("axios").AxiosResponse<any> | {
    data: {};
}>;
declare const deleteOp: (url: string, refresh?: boolean) => Promise<import("axios").AxiosResponse<any> | {
    data: {};
}>;
export { postOp, getOp, putOp, deleteOp };
