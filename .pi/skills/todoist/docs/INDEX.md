# Todoist Documentation Archive

Scraped: 2026-03-02

## API Version History

Todoist has two generations of APIs. The version numbers are counterintuitive:

- **REST API v2 + Sync API v9** — the OLDER generation (separate REST and Sync endpoints)
- **API v1** (`todoist.com/api/v1`) — the NEWER unified API, replacing both REST v2 and Sync v9

The TypeScript SDK v4+/v5+ targets the new API v1. The Python SDK v3.x still wraps REST v2.
The developer portal (`developer.todoist.com/`) serves the full unified docs covering both generations.

## Folder Structure

### official-api/ — developer.todoist.com
Core Todoist API documentation from the official developer portal.

| File | Source | Size |
|------|--------|------|
| developer-portal-full.md | https://developer.todoist.com/ | Full portal (all sections in one page, covers both API generations) |
| rest-v2/index.md | https://developer.todoist.com/rest/v2 | REST API v2 reference (OLDER — being replaced by API v1) |
| sync-v9/index.md | https://developer.todoist.com/sync/v9 | Sync API v9 reference (OLDER — being replaced by API v1) |
| guides/index.md | https://developer.todoist.com/guides/ | OAuth, SDKs, webhooks, colors |
| ui-extensions/index.md | https://developer.todoist.com/ui-extensions | UI Extensions (context menu, composer, settings) |

### sdk-python/ — doist.github.io/todoist-api-python
Official Python SDK documentation.

| File | Source |
|------|--------|
| overview.md | https://doist.github.io/todoist-api-python/ |
| api-client.md | https://doist.github.io/todoist-api-python/api/ |
| api-client-async.md | https://doist.github.io/todoist-api-python/api_async/ |
| models.md | https://doist.github.io/todoist-api-python/models/ |

### sdk-typescript/ — doist.github.io/todoist-api-typescript
Official TypeScript SDK documentation.

| File | Source |
|------|--------|
| overview.md | https://doist.github.io/todoist-api-typescript/ |
| api-class-reference.md | https://doist.github.io/todoist-api-typescript/api/classes/TodoistApi |
| error-class.md | (TodoistRequestError - small, not critical) |

## Key URLs Not Scraped
- https://github.com/Doist/todoist-api-python (GitHub blocked scraper, README fetched via gh CLI)
- https://github.com/Doist/todoist-api-typescript
- https://developer.todoist.com/appconsole.html (app management, requires auth)
- https://developer.todoist.com/submissions.html (app submission)

## Notes
- `developer-portal-full.md` contains the full unified portal (same content served at both `/` and `/api/v1/`). We kept one copy.
- REST v2 and Sync v9 are the older API generation — still functional but being superseded by the new unified API v1
- The REST v2, Sync v9, Guides, and UI Extensions are separate single-page docs
- Python SDK v3.x wraps REST v2; TypeScript SDK v4+/v5+ targets the new API v1
- Python SDK has the most complete API reference (all methods with source code)
