import axios, { AxiosInstance } from "axios";

export type ZenotiClientOptions = {
    apiKey: string;
    baseUrl?: string;
    centerId: string;
}

export class ZenotiClient {
    private zenoti: AxiosInstance;
    private center_id: string;

    constructor(options: ZenotiClientOptions) {
        this.zenoti = axios.create({
            baseURL: options.baseUrl || "https://api.zenoti.com",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `apikey ${options.apiKey}`
            }
        });

        this.zenoti.interceptors.request.use(config => {
            if(config.url) {
                config.url = config.url.replace(":center_id", options.centerId)
            }

            return config;
        });

        this.center_id = options.centerId;
    }

    getClient() {
        return this.zenoti;
    }

    getCenterId() {
        return this.center_id;
    }
}
