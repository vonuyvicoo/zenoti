import { ZenotiError } from "./base";

/**
 * Thrown when Zenoti rejects a request with HTTP 429.
 *
 * `retryAfterSeconds` carries the value of the `Retry-After` response header
 * when the API sends one, so callers can back off for the interval Zenoti
 * asked for instead of guessing.
 */
export class RateLimitError extends ZenotiError {
    public readonly name: string = "RateLimitError";

    constructor(message: string, public readonly retryAfterSeconds?: number) {
        super(message);
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}
