# Dawwar Monorepo AI Instructions

**MASTER INDEX:** Before starting any new task, consult the **Complete Project Brain** at `docs/README.md` for a full overview of the system architecture, documentation map, and implementation status.

This file contains team-shared conventions, architectural rules, and project-specific instructions for AI agents working within the Dawwar monorepo.

## Architecture Guidelines

- **Order and Payment Flow:** The fundamental architecture for how orders transition through their lifecycle and how money is settled across the platform is explicitly defined. Before implementing any backend logic regarding orders, status transitions, socket notifications, or payments, you MUST read the comprehensive architectural guide located at:
  `docs/architecture/talabat-mrsool-dawwar-flow.md`

- **Merchant App Standards:** The Merchant App must mirror the quality bar of the Customer App. Strict standards for Reactotron setup, Profile Gates, Icons, Localization, Memoization, and TypeScript are defined in:
  `docs/apps/merchant-standards.md`

- **Guest Mode, Categories & Anonymous Cart:** Dawwar supports guest browsing, a hierarchical category tree, and a persistent client-side anonymous cart. Read the architecture here before modifying customer browsing or cart behavior:
  `docs/architecture/categories-guest-cart.md`

## Engineering Standards
- Do not implement money movement without a synchronized status transition and `OrderEvent` insertion.
- All wallet mutations MUST include a descriptive and unique `referenceId`.
- Settlements and order status updates must execute atomically within a database transaction.
- Payment webhooks (e.g., Paymob) must undergo signature verification before any logic is processed.