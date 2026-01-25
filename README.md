# Zenoti SDK for TypeScript

Unofficial SDK wrapper for Zenoti's REST API. Typed client for guests, appointments, bookings, services, and therapists.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
![Node](https://img.shields.io/badge/Node-18%2B-43853d?logo=node.js&logoColor=white)
![License](https://img.shields.io/github/license/vonuyvicoo/zenoti)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

![Zenoti SDK Logo](https://github.com/user-attachments/assets/e59f4ae0-c14f-4ecf-9597-c8637c49dfdf)

## Installation

```bash
pnpm add zenoti
# or
npm install zenoti
```

## Setup

Create a client with your API key and center ID. An optional `baseUrl` overrides the default `https://api.zenoti.com`.

```typescript
import { Zenoti } from "zenoti";

const client = new Zenoti({
  apiKey: "your-api-key",
  centerId: "your-center-id",
  // baseUrl: "https://api.zenoti.com"  // optional
});
```

## API Overview

### Guests (`client.guests`)

- `create(payload: CreateGuestDto)` – Create a guest with `personal_info` (first_name, last_name, email, mobile_phone)
- `search(payload: SearchGuestDto)` – Search by `email`, `first_name`, or `last_name` (at least one required)
- `getAll(page?, size?)` – List guests with pagination (defaults: page 1, size 10)
- `get(guest_id)` – Get a guest by ID
- `getPurchases(guest_id)` – List a guest’s products

### Appointments (`client.appointments`)

- `getAll(start_date, end_date)` – List appointments in a date range

### Bookings (`client.bookings`)

- `create(payload: CreateBookingDto)` – Create a booking with `date`, `guests` (id, items with `item_id`), and optional `therapist_id`
- `getSlots(booking_id)` – Get available slots for a booking
- `reserve(booking_id, slot_time, create_invoice?)` – Reserve a slot (default `create_invoice: false`)
- `confirm(booking_id, notes, group_name)` – Confirm a reserved booking

### Services (`client.services`)

- `getAll(page?, size?)` – List services with pagination (defaults: page 1, size 30)
- `search(search_string)` – Search services by name; experimental, may be rate-limited

### Therapists (`client.therapists`)

- `getAll()` – List all therapists for the center

## Example

```typescript
import { Zenoti } from "zenoti";

const client = new Zenoti({
  apiKey: process.env.ZENOTI_API_KEY!,
  centerId: process.env.ZENOTI_CENTER_ID!,
});

// Create a guest
const guest = await client.guests.create({
  personal_info: {
    first_name: "Jane",
    last_name: "Doe",
    email: "jane@example.com",
    mobile_phone: { country_code: 1, number: "5551234567" },
  },
});

// Search guests
const results = await client.guests.search({ email: "jane@example.com" });

// List appointments
const appointments = await client.appointments.getAll("2025-01-01", "2025-01-31");

// Create a booking and reserve a slot
const booking = await client.bookings.create({
  date: "2025-01-15",
  guests: { id: guest.id, items: { item_id: "service-uuid" } },
  therapist_id: "optional-therapist-uuid",
});
const { slots } = await client.bookings.getSlots(booking.id);
await client.bookings.reserve(booking.id, slots[0].Time);
await client.bookings.confirm(booking.id, "Notes", "Group name");
```

## Errors

The SDK throws:

- `ValidationError` – Invalid or missing input (e.g. empty search, invalid DTOs)
- `NotFoundError` – Resource not found
- `AuthenticationError` – Invalid or missing API key
- `AuthorizationError` – Insufficient permissions

## Exports

You can import the main client, options, services, types, and errors:

```typescript
import {
  Zenoti,
  ZenotiClientOptions,
  ValidationError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
} from "zenoti";
```

## Build

```bash
pnpm build
```

Output: ESM (`dist/index.js`), CJS (`dist/index.cjs`), and type definitions (`dist/index.d.ts`).
