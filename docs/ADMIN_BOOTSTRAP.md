# Admin Bootstrap

The first admin has to be created manually because there's no admin to do it through the UI yet (chicken-and-egg). Subsequent admins can be flipped from the admin console.

## Promote a user to admin

1. Sign up the user account normally (or use an existing one).
2. Find their `id` in DynamoDB — go to the AWS Console → DynamoDB → tables → `vedic-transform-production-Users` → scan/query by email.
3. Update the item: add an attribute `role` (string) with value `admin`.

Via AWS CLI:

```bash
aws dynamodb update-item \
  --table-name vedic-transform-production-Users \
  --key '{"id":{"S":"<USER_ID>"}}' \
  --update-expression "SET #r = :role" \
  --expression-attribute-names '{"#r":"role"}' \
  --expression-attribute-values '{":role":{"S":"admin"}}' \
  --region us-east-1
```

The change is effective immediately — admin-auth reads the role on each request, no token re-issue needed.

## Demote

Same command, set `:role` to `"user"` (or remove the attribute with `REMOVE #r`).

## What's gated

- `GET /admin/users` (search)
- `GET /admin/users/{id}` (full Context Pack)
- Anything under `/admin/*` on the Next.js side (currently `/admin`, `/admin/users/[id]`)

`Users.role === 'admin'` is the only signal. Future role types (e.g. `support`, `content`) can be added by extending `functions/lib/admin.ts`.

## Security notes

- Admin endpoints respond 401 (not 403) for non-admins so we don't leak existence of the admin surface.
- `passwordHash` and `googleSub` are stripped from any admin response that includes a Users row.
- Admin actions are not currently audited — once event emission lands (`functions/lib/events.ts`), each admin call should emit an `admin.*` event.
