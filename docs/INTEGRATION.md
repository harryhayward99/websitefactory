# Outreach ↔ website factory

Controller: https://github.com/harryhayward99/parley-outreach
Factory: https://github.com/harryhayward99/websitefactory
Company website: https://github.com/harryhayward99/parley-systems-ai

## Authority
The factory's website-factory/integration.json defines schema version 1, instructionsVersion, hosting paths and result statuses. The controller must explicitly configure FACTORY_INSTRUCTIONS_VERSION to the reviewed value; it does not adopt changed instructions silently. At migration the factory value is 54cd88f946a6d958.

## Request
An approved Website offer creates one durable job identity and Cursor agent ID. The v1 request selects websitefactory/main, includes business name/location/sector/official website/slug, follows BUILD.md and passes approvedInstructionsVersion. The controller persists factoryVersion with the job. Research and contact notes are not included in public output. The build is independent of email drafting and contact qualification.

## Result
Discover a successful GitHub preview deployment for the factory PR head commit. Retrieve /preview/<slug>/status.json from that deployment origin. Require matching slug, exact /preview/<slug>/index.html path, instructionsVersion matching the job and status PREVIEW_READY. Template/research/approval/budget errors pause for review. Unknown statuses or mismatches fail closed. Check the page itself for HTTP 200, noindex and business name. Save one preview URL in the job; use exactly that URL in Sheet status and the subsequent Gmail draft.

## What migration does not complete
No provider key, hosting project, spend cap or live deployment is created. Job quotas are not monetary caps. The installed Apps Script is unchanged and still has older source. Before activation, reconcile the saved SITE_REPO/SITE_REF, set the reviewed FACTORY_INSTRUCTIONS_VERSION, verify spend controls, approve a website template, and require fresh row approvals under those instructions. Automatic capture/invalidation of per-row instruction versions is not implemented; keep launch switches false until this is implemented or the queued rows are explicitly re-reviewed in a controlled single-lead rollout. End-to-end provider/hosting testing remains required. Gmail drafting stays off until email templates are separately approved.
