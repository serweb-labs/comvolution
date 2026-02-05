# Comvolution

**Comvolution** is a headless, extensible commerce engine designed for building highly customized, event-driven commerce systems.

It provides a clean, API-first core focused on **products, catalogs, carts, orders, and workflows**, without imposing any frontend, templates, or UI decisions.

Comvolution is built for **consultancies, software factories, and engineering teams** that need a flexible commerce foundation they can fully control and extend.

---

## Why Comvolution?

Most commerce platforms fall into one of two extremes:

- **Turnkey SaaS platforms** that are fast to start but hard to customize.
- **Enterprise platforms** that are powerful but heavy, expensive, and rigid.

Comvolution sits in between:

> A lightweight but enterprise-ready commerce core that you can shape to your needs.

---

## Core Principles

- **Headless by design**  
  No frontend, no themes, no templates. Comvolution exposes APIs and events only.

- **Schema-driven products**  
  Products support built-in fields and custom schemas defined declaratively (JSON/YAML).

- **Collections over pages**  
  Product groupings are defined as reusable queries (filters, sorting, pagination), not UI pages.

- **Event-driven workflows**  
  Commerce actions emit domain events that can trigger configurable workflows or external integrations.

- **Extensible, not magical**  
  Clear contracts, explicit behavior, and predictable extension points.

- **Integrator-friendly**  
  Designed to be embedded into larger systems, not to lock you into one.

---

## What Comvolution Is (and Is Not)

### ✅ What it is
- A commerce **engine**
- An API-first backend
- A foundation for custom e-commerce systems
- A platform for integrators and engineering teams

### ❌ What it is not
- A hosted SaaS storefront
- A theme-based shop builder
- A no-code solution
- A replacement for frontend frameworks

---

## Core Concepts

### Products
Products are defined using:
- Core attributes (id, sku, price, stock, etc.)
- Custom fields defined via schemas
- Versioned schemas for evolution over time

### Schemas
Schemas define additional product attributes and validation rules.

They can be:
- Stored as JSON/YAML
- Versioned
- Used for validation, querying, and filtering

### Collections
Collections are reusable product queries.

A collection may define:
- Filters
- Sorting
- Pagination
- Metadata (description, intent)

Collections are frontend-agnostic and can power:
- Category listings
- Campaign pages
- Mobile feeds
- External integrations

### Cart & Checkout
Comvolution provides APIs for:
- Cart lifecycle
- Pricing resolution
- Order creation
- Payment orchestration (via integrations)

No UI assumptions are made.

### Orders & Events
Every significant action emits domain events, such as:
- `order.created`
- `payment.authorized`
- `order.completed`
- `order.failed`

These events are the backbone for workflows and integrations.

### Workflows
Workflows allow you to react to events by:
- Triggering custom logic
- Calling external services
- Updating order state
- Supporting manual or automated transitions

---

## Architecture Overview

[ Frontend / Client ]
↓
[ Comvolution API ]
├─ Products & Schemas
├─ Collections
├─ Cart
├─ Orders
├─ Events
└─ Workflows
↓
[ Database / Event Store ]

Frontend implementations are intentionally outside the scope of the core.

---

## Technology Stack

- **Node.js**
- **NestJS**
- **TypeScript**
- API-first architecture
- Event-driven core

(Exact infrastructure choices are intentionally flexible.)

---

## Use Cases

- Custom e-commerce platforms for medium/large brands
- Commerce backends for mobile apps
- Social commerce and campaign-driven sales
- Enterprise systems requiring deep integrations
- Consulting and system-integration projects

---

## Project Status

Comvolution is currently in **early development**.

The focus is on:
- Core domain modeling
- API contracts
- Event system
- Extensibility

UI implementations, admin panels, and reference frontends may be provided later as separate projects.

---

## Who Is This For?

- Software consultancies
- System integrators
- In-house engineering teams
- Architects building composable commerce systems

If you are looking for a plug-and-play shop, Comvolution is probably not for you.
If you want control, flexibility, and a solid foundation — welcome.

---

## License

TBD

---

## Vision

Commerce should be a **capability**, not a constraint.

Comvolution aims to be the foundation you build on — not the box you work around.