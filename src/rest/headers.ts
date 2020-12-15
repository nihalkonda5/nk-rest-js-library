interface Token {
    value: string,
    expiryTime: number
}

interface HeaderData {
    userId: string,
    accessToken: Token,
    refreshToken: Token,
    isConfirmed: boolean
}

class Headers {

    private static instance: Headers;

    data: HeaderData;

    private constructor() {
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

    static getInstance(): Headers {
        if (!Headers.instance)
            Headers.instance = new Headers();
        return Headers.instance;
    }

    backupManager = (data: HeaderData) => {
        console.log('backupManager', data);
    };

    setBackupManager(bm: (data: HeaderData) => void) {
        this.backupManager = bm;
    }

    isUserLoggedIn() {
        console.log('Headers', 'isUserLoggedIn', this.data.accessToken.expiryTime);
        return this.data.accessToken.expiryTime > 0;
    }

    setUserId(userId: string) {
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

    setAccessToken(value: string, expiryTime: number) {
        this.data.accessToken = {
            value,
            expiryTime
        };
        return this.getAccessToken();
    }

    setRefreshToken(value: string, expiryTime: number) {
        this.data.refreshToken = {
            value,
            expiryTime
        };
        return this.getRefreshToken();
    }

    isUserConfirmed() {
        return this.data.isConfirmed;
    }

    setUserConfirmed(isConfirmed: boolean) {
        this.data.isConfirmed = isConfirmed;
        return this.data.isConfirmed;
    }

    backupData() {
        console.log('backup', JSON.stringify(this.data))
        try {
            this.backupManager(this.data);
        } catch (error) {
            console.error(error);
        }
    }

    loadDataRaw(data: HeaderData) {
        this.data = data;
    }

}

export default Headers.getInstance();