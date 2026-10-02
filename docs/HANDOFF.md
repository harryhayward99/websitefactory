# Parley website factory handover

Latest update: 2026-10-02

GitHub is the shared source of truth for this work. ChatGPT cannot automatically see a Cursor conversation. Read this file, the pull request, and `website-factory/integration.json` instead.

## Implemented and verified

The factory repository already had a draft `clinic-clean` 1.0.0 starter, sourced site records, category image folders, a static generator, and a fictional preview. That description matches the code that was on `main`.

This branch adds the missing factory controls and a revised starter for review. The starter is still **draft**. It has not been marked approved.

- `clinic-clean` 1.0.0 was revised in place because it has not been approved or used for a real prospect. Desktop and mobile layouts were checked on the fictional Meadow Example Clinic page. After approval, design changes belong in a new version directory. Existing preview HTML is not rebuilt when a template changes.
- Approved category images are copied into `public/factory-assets/clients/<slug>/` during generation. Library edits do not alter an existing preview. Registration and approval steps are in `website-factory/images/README.md`. No images have been added yet.
- A real prospect with no fitting approved template returns sheet status **Needs template review**. The barber category is in that state.
- A real prospect whose `approvedInstructionsVersion` does not match `integration.json` returns **Needs fresh approval**. Current version: `71896a2782c0c4e6`.
- A second build of an existing preview keeps the HTML and prints `ALREADY_BUILT`. `shouldLaunchBuild` refuses another launch when any job record already exists.
- Each result is written to `public/preview/<slug>/status.json` and `website-factory/jobs/<slug>.json`. The Sheet URL must be the successful deployment origin plus `previewPath` from that status file. The same string is the only URL allowed in a future Gmail draft.
- Hosting config is `vercel.json`: install `npm install`, build `npm run build`, output directory `public`, Node 22.
- Email drafting is off in `integration.json`. The monthly tools budget recorded there is £200. No emails were sent and no paid Cloud Agent build was launched.

## Not verified

`https://github.com/harryhayward99/parley-systems-ai` and [pull request 3](https://github.com/harryhayward99/parley-systems-ai/pull/3) are not visible to this cloud agent. GitHub returns “repository not found” for the credential in this environment. The environment only includes `github.com/harryhayward99/websitefactory`. The controller’s Apps Script was therefore not compared line by line with this factory.

Cursor’s current Cloud Agents API was checked against the public docs on 2026-10-02. New work should use v1 (`POST /v1/agents`, then poll `GET /v1/agents/{id}/runs/{runId}`). v1 webhooks are not available yet. A controller that still calls `/v0/agents` does not match `integration.json`. That mismatch cannot be confirmed or cleared until the controller repository is readable.

No hosting project is linked, so there is no live deployment URL.

## Branches, pull requests, and deployments

- Factory branch: `cursor/activate-website-factory-ffdc`
- Factory base: `main` on `https://github.com/harryhayward99/websitefactory`
- Controller: `https://github.com/harryhayward99/parley-systems-ai` pull request 3, unread from here
- Local preview path: `/preview/fictional-clinic/index.html`
- Live deployment: none

## Tests

Command: `npm test` (`node --test website-factory/factory.test.mjs`)

Result on 2026-10-02: 14 tests, 14 passed.

Covered: escaped fictional HTML, draft templates blocked for real prospects, unknown template versions, source attribution, local raster assets, illustrative labels, narrow-viewport CSS, Needs template review, fresh approval, private fields, duplicate launch refusal, copying an approved library image, preserving an existing preview, and the hosting contract matching `vercel.json`.

`npm run build` then reported `ALREADY_BUILT fictional-clinic`. A second `node website-factory/factory.mjs fictional-clinic` preserved the preview.

Desktop (1280px) and mobile (390px) screenshots of the fictional starter were taken from a local static server. The clinic template remains draft until Harry reviews it.

## Next steps

1. Review the fictional starter in the factory pull request. Say if `clinic-clean` 1.0.0 can be approved. Approving it changes `catalogue.json`, which changes `instructionsVersion`, so the installed Apps Script must be updated before any real build.
2. Add `harryhayward99/parley-systems-ai` to this Cursor cloud environment, or grant the connected GitHub app access, so pull request 3 can be checked against `website-factory/integration.json`.
3. In the Cursor dashboard, set the Cloud Agents spend limit to £200 per month. Put the Cursor API key in Apps Script script properties only. Do not commit it.
4. Connect hosting to this repository using build command `npm run build` and output directory `public`. Turn on deployment protection if these previews should not be public. This repository is public, and `noindex` is not access control.
5. Update the installed Apps Script separately. A merge here does not change that script. Keep email drafting disabled.
6. Run the single-lead test below before allowing routine builds.

## One approved lead, end to end

Do this only after the template is approved, the spend limit is confirmed, the API key is stored in Apps Script, hosting is connected, and the script matches instructions version `71896a2782c0c4e6` or a newer version you have deliberately accepted.

1. Choose one Sheet row whose offer includes Website. Set Approve once.
2. Expect one Cloud Agent, one factory branch, and one preview. The Sheet status should move from Building to Preview ready, or to a specific error such as Needs template review, Needs fresh approval, Research incomplete, Budget blocked, or Build failed.
3. Set Approve again on the same row. Expect Already started and no second agent.
4. When the hosting deployment for that commit is successful, open `{deployment origin}/preview/{slug}/status.json`. Accept it only when `status` is `PREVIEW_READY`.
5. The Sheet cell and any later Gmail draft must both contain exactly `{origin}{previewPath}`. With drafting disabled, no draft should be created.
6. Read the preview, then send the email yourself only if you decide to. This test does not send email.

## Secrets

None of the following belong in this repository: Cursor API keys, GitHub tokens, mailbox credentials, private prospect notes, or contact research. Enter secrets in the Cursor dashboard and in Apps Script script properties.
