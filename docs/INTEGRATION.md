# Outreach ↔ website factory

Controller: https://github.com/harryhayward99/parley-outreach
Factory: https://github.com/harryhayward99/websitefactory
Company website: https://github.com/harryhayward99/parley-systems-ai

## Authority
The factory's website-factory/integration.json defines schema version 1, instructionsVersion, hosting paths and result statuses. The controller must explicitly configure FACTORY_INSTRUCTIONS_VERSION to the reviewed value; it does not adopt changed instructions silently. The current factory value is 383ceff3a5d55fc4.

## Request
An approved Website offer creates one durable job identity and Cursor agent ID. The v1 request selects websitefactory/main, includes business name/location/sector/official website/slug, follows BUILD.md and passes approvedInstructionsVersion. The controller persists factoryVersion with the job. Research and contact notes are not included in public output. The build is independent of email drafting and contact qualification.

## Result
Discover a successful GitHub preview deployment for the factory PR head commit. Retrieve /preview/<slug>/status.json from that deployment origin. Require matching slug, exact /preview/<slug>/index.html path, instructionsVersion matching the job and status PREVIEW_READY. Template/research/approval/budget errors pause for review. Unknown statuses or mismatches fail closed. Check the page itself for HTTP 200, noindex and business name. Save one preview URL in the job; use exactly that URL in Sheet status and the subsequent Gmail draft.

## What migration does not complete
clinic-clean 1.0.0 is accepted for pipeline previews. Its appearance is unfinished, and accepting it does not approve email templates. The controller records FACTORY_INSTRUCTIONS_VERSION on a website job the first time that approval is seen, and does not launch if that stored value later differs from the script property or from this manifest. That behaviour exists in the outreach repository source. The installed Apps Script is unchanged and still has older source. No provider key, hosting project, spend cap or live deployment is created. Job quotas are not monetary caps. Before the one test lead, install the current controller bundle, set FACTORY_INSTRUCTIONS_VERSION to 383ceff3a5d55fc4, point SITE_REPO at harryhayward99/websitefactory and SITE_REF at main, confirm the £200 combined tools limit and known month-to-date spend, connect preview hosting, and approve one fresh Website row. Keep launch switches false until those checks are done. Gmail drafting stays off until email templates are separately approved.
