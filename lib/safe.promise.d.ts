declare let handlers: {
    handleEmptyToken: () => void;
    handleExpiredRefreshToken: () => void;
    handleNetworkError: () => void;
};
export declare function setHandlers(value: typeof handlers): void;
export default function safePromise<T>(promise: Promise<T>): Promise<T>;
export {};
