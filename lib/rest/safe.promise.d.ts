declare let handlers: {
    handleTokenError: () => void;
    handleNotFoundError: () => void;
    handleNetworkError: () => void;
    handleConfirmationNeededError: () => void;
};
export declare function setHandlers(value: typeof handlers): void;
export default function safePromise<T>(promise: Promise<T>): Promise<T>;
export {};
