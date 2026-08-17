export type InvoiceItem = {
    id?: string;
    name?: string;
    price?: number;
    quantity?: number;
};

export type Invoice = {
    invoice_id: string;
    total_price?: number;
    balance_due?: number;
    items?: InvoiceItem[];
    status?: string;
};

/**
 * Payment options Zenoti exposes for an invoice.
 *
 * `redirect_url` is present when the center is configured for a hosted
 * payment page. Sending the guest there keeps card data off your own front
 * end, which is what keeps the integration in SAQ A rather than SAQ A-EP.
 */
export type PaymentOption = {
    id: string;
    name: string;
    type?: string;
    redirect_url?: string;
};

export type ListPaymentOptionsResponse = {
    payment_options: PaymentOption[];
};

export type HostedPaymentSession = {
    /** Send the guest here to enter card details on Zenoti's page. */
    redirect_url: string;
    invoice_id: string;
    expires_at?: string;
};

export type PaymentResult = {
    invoice_id: string;
    status?: string;
    balance_due?: number;
    transaction_id?: string;
};
