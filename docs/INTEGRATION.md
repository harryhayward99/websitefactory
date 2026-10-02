# Controller/factory contract

Controller: https://github.com/harryhayward99/parley-outreach
Factory: https://github.com/harryhayward99/websitefactory

The authority is website-factory/integration.json. Copy its reviewed instructionsVersion to FACTORY_INSTRUCTIONS_VERSION after deploying the matching controller; do not silently adopt future values. Review the exact source commit pinned by the controller. Website approvals require an edit-event version/time/fingerprint record. Historical approvals must be reapproved.

Before a paid launch the controller checks combined spending/reservations, quotas, manifest version and an approved template for the sector. It retains one agent/run identity through recovery. Results must match slug, previewPath and instructionsVersion. PREVIEW_READY additionally requires demo=false and a SHA-256 HTML contentHash matching the fetched page.

Optional PREVIEW_ORIGIN waits for that same result and content at a stable factory hosting origin. Without it the stored deployment URL stays a snapshot. The Sheet and Gmail use the same saved URL. Publication and stable-origin setup are separate deployment steps; a code change alone does not provide them.

See https://github.com/harryhayward99/parley-outreach/blob/main/docs/OPERATIONS.md for operational actions, budget limits and installation. Email copy approval is separate. All sending is manual.
