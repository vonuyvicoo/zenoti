import { type ZenotiClient } from "@/_internal/client";
import { ValidationError } from "@/errors";
import {
    HostedPaymentSession,
    Invoice,
    ListPaymentOptionsResponse,
    PaymentOption,
    PaymentResult
} from "./types";

export class PaymentsService {
    constructor(private readonly zenoti: ZenotiClient) {}

    /**
     * Read an invoice, including the outstanding balance.
     *
     * A booking gets an invoice once it is reserved with `create_invoice`
     * set, so this is the handoff point between the booking flow and
     * checkout.
     */
    async getInvoice(invoice_id: string): Promise<Invoice> {
        if (!invoice_id?.trim()) {
            throw new ValidationError("invoice_id is required.");
        }

        const response = await this.zenoti
            .getClient()
            .get(`/v1/invoices/${invoice_id}`);

        return (await response.data) as Invoice;
    }

    /** Payment options configured for the center holding this invoice. */
    async getPaymentOptions(invoice_id: string): Promise<PaymentOption[]> {
        if (!invoice_id?.trim()) {
            throw new ValidationError("invoice_id is required.");
        }

        const response = await this.zenoti
            .getClient()
            .get(`/v1/invoices/${invoice_id}/payment_options`);

        const data = (await response.data) as ListPaymentOptionsResponse;
        return data.payment_options ?? [];
    }

    /**
     * Open a hosted payment session and return the URL to send the guest to.
     *
     * This is the PCI-lighter of the two routes Zenoti supports. Card details
     * are entered on Zenoti's page and never touch your own front end or
     * server, which keeps the integration in SAQ A. Collecting the card
     * yourself and posting it through means the card data crosses your
     * origin, moving you to SAQ A-EP and pulling your front end into scope.
     *
     * Prefer this unless there is a hard requirement for an embedded form.
     */
    async createHostedPaymentSession(
        invoice_id: string,
        options: { return_url?: string; cancel_url?: string } = {}
    ): Promise<HostedPaymentSession> {
        if (!invoice_id?.trim()) {
            throw new ValidationError("invoice_id is required.");
        }

        const response = await this.zenoti
            .getClient()
            .post(`/v1/invoices/${invoice_id}/online_payment_link`, {
                ...(options.return_url ? { return_url: options.return_url } : undefined),
                ...(options.cancel_url ? { cancel_url: options.cancel_url } : undefined)
            });

        const data = await response.data;

        return {
            invoice_id,
            redirect_url: data?.redirect_url ?? data?.payment_link ?? data?.url,
            expires_at: data?.expires_at
        };
    }

    /**
     * Settle an invoice against a stored payment method or account balance.
     *
     * This path never handles a raw card number. Anything that would put a
     * PAN through your own server belongs behind a tokenizing gateway, not
     * here.
     */
    async collect(
        invoice_id: string,
        payment_option_id: string,
        amount: number
    ): Promise<PaymentResult> {
        if (!invoice_id?.trim()) {
            throw new ValidationError("invoice_id is required.");
        }
        if (!payment_option_id?.trim()) {
            throw new ValidationError("payment_option_id is required.");
        }
        if (!Number.isFinite(amount) || amount <= 0) {
            throw new ValidationError("amount must be a positive number.");
        }

        const response = await this.zenoti
            .getClient()
            .post(`/v1/invoices/${invoice_id}/payment`, {
                payment_option_id,
                amount
            });

        const data = await response.data;

        return {
            invoice_id,
            status: data?.status,
            balance_due: data?.balance_due,
            transaction_id: data?.transaction_id
        };
    }
}
