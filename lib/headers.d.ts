interface Token {
    value: string;
    expiryTime: number;
}
interface HeaderData {
    userId: string;
    accessToken: Token;
    refreshToken: Token;
    isConfirmed: boolean;
}
declare class Headers {
    data: HeaderData;
    backupManager: (data: HeaderData) => void;
    setBackupManager(bm: (data: HeaderData) => void): void;
    isUserLoggedIn(): boolean;
    setUserId(userId: string): string;
    getUserId(): string;
    getAccessToken(): Token;
    getRefreshToken(): Token;
    setAccessToken(value: string, expiryTime: number): Token;
    setRefreshToken(value: string, expiryTime: number): Token;
    isUserConfirmed(): boolean;
    setUserConfirmed(isConfirmed: boolean): boolean;
    backupData(): void;
    loadDataRaw(data: HeaderData): void;
}
declare const _default: Headers;
export default _default;
