"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Headers {
    constructor() {
        this.backupManager = (data) => {
            console.log('backupManager', data);
        };
        this.data = {
            userId: '',
            accessToken: {
                value: '',
                expiryTime: 0
            },
            refreshToken: {
                value: '',
                expiryTime: 0
            },
            isConfirmed: false
        };
    }
    static getInstance() {
        if (!Headers.instance)
            Headers.instance = new Headers();
        return Headers.instance;
    }
    setBackupManager(bm) {
        this.backupManager = bm;
    }
    isUserLoggedIn() {
        console.log('Headers', 'isUserLoggedIn', this.data.accessToken.expiryTime);
        return this.data.accessToken.expiryTime > 0;
    }
    setUserId(userId) {
        this.data.userId = userId;
        return this.data.userId;
    }
    getUserId() {
        return this.data.userId;
    }
    getAccessToken() {
        return this.data.accessToken;
    }
    getRefreshToken() {
        return this.data.refreshToken;
    }
    setAccessToken(value, expiryTime) {
        this.data.accessToken = {
            value,
            expiryTime
        };
        return this.getAccessToken();
    }
    setRefreshToken(value, expiryTime) {
        this.data.refreshToken = {
            value,
            expiryTime
        };
        return this.getRefreshToken();
    }
    isUserConfirmed() {
        return this.data.isConfirmed;
    }
    setUserConfirmed(isConfirmed) {
        this.data.isConfirmed = isConfirmed;
        return this.data.isConfirmed;
    }
    backupData() {
        console.log('backup', JSON.stringify(this.data));
        try {
            this.backupManager(this.data);
        }
        catch (error) {
            console.error(error);
        }
    }
    loadDataRaw(data) {
        this.data = data;
    }
}
exports.default = Headers.getInstance();
