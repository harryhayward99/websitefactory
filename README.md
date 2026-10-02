# Parley Website Factory

Reusable website templates, category image banks and generated prospect concepts.

## Start

Requires Node.js 22 or later. Run `npm test`, then `npm run build`. Serve the `public` directory or configure your static host to publish it. The fictional starter is at `/preview/fictional-clinic/index.html`.

Read `website-factory/README.md`, `website-factory/BUILD.md` and `website-factory/integration.json`. The clinic starter is draft and requires visual approval before real prospect builds. Hosting uses `npm run build` and publishes the `public` directory (`vercel.json`). Category image folders are ready for your web-ready assets. See `website-factory/images/README.md` to register and approve them.

## Approval workflow

The separate outreach controller receives approval in Google Sheets, requests a build in this repository, and waits for a successful preview deployment. The same validated preview URL is placed in the Sheet status and, once email drafting is approved, the Gmail draft. Emails are sent manually. This repository alone does not enable that live integration.

## Visibility

This repository was public when initialised. Keep credentials, mailbox settings, private prospect notes and contact research out of it. Make the repository private before storing confidential client research or assets; public preview pages also need hosting access controls if confidentiality is required. `noindex` is not access control.
