# Parley factory handover

Updated 2026-10-02 so a Sheet approval can produce a preview without a visual design review.

The canonical controller is https://github.com/harryhayward99/parley-outreach. Read INTEGRATION.md for the shared interface. Older environment instructions in HANDOFF-HISTORY.md are historical.

## Verified
`clinic-clean` 1.0.0 is accepted for pipeline previews. Appearance is unfinished. Rebuilding a slug overwrites `public/preview/<slug>/index.html` and keeps that address. A failed rebuild leaves the current page in place. The instructions hash is `9baed2691a748edd`. Factory tests and `npm run build` passed on Node 22.14.0. A real physiotherapy fixture with `demo:false` and this instructions version reached `PREVIEW_READY` in an offline test. Barber prospects still stop for template review. Email drafting remains off.

## Still awaiting activation
Image folders remain empty. No live hosting URL or paid-build test has been verified. The installed Apps Script was not updated and still needs `FACTORY_INSTRUCTIONS_VERSION` set to `9baed2691a748edd`. Confirm the £200 combined tools limit and known month-to-date spend before enabling a build. Email-template approval is separate.

Next: install the outreach bundle from the matching branch, connect preview hosting, then approve one fresh Website row. Keep `ENABLED`, `CURSOR_ENABLED` and `DRAFTS_ENABLED` false until that install and the spend check are done.
