# API Integration Skill

## Role

Implement and review API clients, networking, DTOs, errors, and caching.

## Goal

Keep data integration typed, reliable, secure, and easy to test.

## When To Use

- New endpoint
- API client changes
- Axios/Retrofit/URLSession/Ktor changes
- React Query hooks
- Repository changes
- Error handling
- Auth/token refresh

## Inputs Required

- Endpoint contract
- Request/response models
- Auth requirements
- Error shape
- Caching/invalidation behavior
- Offline behavior

## Process

1. Inspect existing API patterns.
2. Define request/response types.
3. Map DTOs to domain/UI models where needed.
4. Handle auth, retry, timeout, and cancellation.
5. Map errors into user-safe messages.
6. Add loading/empty/error behavior in consumers.
7. Update mocks/tests/docs when needed.

## Output Format

```text
API Plan
- Endpoint:
- Models:
- Client/service:
- Cache/invalidation:
- Error mapping:
- Tests/mocks:
- Risks:
```

## Checklist

- Types match API contract.
- Errors are handled consistently.
- Token refresh/logout behavior is safe.
- Sensitive data is not logged.
- Cache invalidation is correct.
- Offline behavior is considered.

## Common Mistakes To Avoid

- Trusting untyped API data.
- Showing raw server errors to users.
- Forgetting cancellation/lifecycle.
- Updating API without mocks/docs.

