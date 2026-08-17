import axios, { AxiosError, AxiosInstance } from "axios";
import {
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    RateLimitError,
    ValidationError,
    ZenotiError
} from "@/errors";

export type ZenotiClientOptions = {
    apiKey: string;
    baseUrl?: string;
    centerId: string;
}

/**
 * Pull a human-readable message out of a Zenoti error body.
 *
 * Zenoti is not consistent about the envelope: some endpoints return
 * `{ Error: { Message } }`, others `{ error: { message } }`, and some return
 * a bare string. Fall back to the HTTP status text rather than surfacing
 * "[object Object]".
 */
const extractMessage = (data: unknown, fallback: string): string => {
    if (typeof data === "string" && data.trim()) return data.trim();

    if (data && typeof data === "object") {
        const body = data as Record<string, any>;
        const envelope = body.Error ?? body.error ?? body;
        const message =
            envelope?.Message ??
            envelope?.message ??
            body.Message ??
            body.message;

        if (typeof message === "string" && message.trim()) return message.trim();
    }

    return fallback;
};

/**
 * Read `Retry-After` off a 429 so callers can back off for the interval the
 * API actually asked for instead of guessing. The header is either a delay in
 * seconds or an HTTP date.
 */
const retryAfterSeconds = (headers: unknown): number | undefined => {
    if (!headers || typeof headers !== "object") return undefined;

    const raw =
        (headers as Record<string, any>)["retry-after"] ??
        (headers as Record<string, any>)["Retry-After"];

    if (raw === undefined || raw === null) return undefined;

    const asSeconds = Number(raw);
    if (Number.isFinite(asSeconds)) return Math.max(0, asSeconds);

    const asDate = Date.parse(String(raw));
    if (Number.isNaN(asDate)) return undefined;

    return Math.max(0, Math.round((asDate - Date.now()) / 1000));
};

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

        // Translate HTTP failures into the error classes the README documents.
        // Without this every failure reached the caller as a raw AxiosError,
        // so a bad API key and a taken booking slot were indistinguishable
        // without inspecting `error.response.status` by hand.
        this.zenoti.interceptors.response.use(
            response => response,
            (error: AxiosError) => {
                // No response means a network/timeout failure, not an API error.
                if (!error.response) {
                    return Promise.reject(
                        new ZenotiError(error.message || "Request to Zenoti failed")
                    );
                }

                const { status, statusText, data } = error.response;
                const message = extractMessage(
                    data,
                    statusText || `Request failed with status ${status}`
                );

                switch (status) {
                    case 400:
                    case 422:
                        return Promise.reject(new ValidationError(message, data));
                    case 401:
                        return Promise.reject(new AuthenticationError(message));
                    case 403:
                        return Promise.reject(new AuthorizationError(message));
                    case 404:
                        return Promise.reject(new NotFoundError(message));
                    case 429:
                        return Promise.reject(
                            new RateLimitError(
                                message,
                                retryAfterSeconds(error.response.headers)
                            )
                        );
                    default:
                        return Promise.reject(new ZenotiError(message));
                }
            }
        );

        this.center_id = options.centerId;
    }

    getClient() {
        return this.zenoti;
    }

    getCenterId() {
        return this.center_id;
    }
}
