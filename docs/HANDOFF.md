# Parley factory handover

Updated 2026-10-02. The accepted clinic pipeline starter is deployed. Appearance remains unfinished; email drafting remains a separate approval.

Factory tests and static build passed. Successful generation refreshes result metadata even when HTML is unchanged, and hosting builds verify existing snapshots rather than rebuilding all prospects. Category assets are staged and use content-based filenames. The image bank is empty; barber still needs a template.

Operational installation records and rollout checks are maintained in the private parley-outreach repository. Template development remains here. The pipeline is not yet activated for real prospect jobs.

## Outreach screenshot capture — 2026-10-05

Added npm run capture -- <slug>: renders validated local HTML and assets with JavaScript disabled and external requests blocked, verifies visible images and concept labelling, captures 1440x1000 JPEG, and writes landing.jpg plus screenshot.json bound to the HTML and image SHA-256. These files must accompany the prospect PR and be published beside index.html. No existing HTML is regenerated. The outreach controller task now requests capture automatically.

Playwright is pinned to 1.62.1. Run npm install and npx playwright install --with-deps chromium in the build environment. Local syntax validation passed, but Chromium download in the assistant workspace failed with an invalid/truncated archive; visual capture is unverified locally. The read-only PR workflow runs capture on ready previews and uploads artifacts, without committing or publishing them. Artifact success alone does not put screenshots into production.

Before activation: inspect CI images, include matching Courtyard landing.jpg and screenshot.json in a reviewed deployment, merge this capture support, and install outreach controller 2026.10.05.1 after its checks. Do not enable email drafts until matching screenshot, verified contact fields and published privacy URL are ready.

## Modern care template — 2026-10-05

Added draft template `care-modern` 1.0.0 for dental, physiotherapy, chiropractic and veterinary. The fictional homepage uses Manrope, black type, pale brand-tinted bands and white cards over a large photo area. It has separate home, service, team and contact views in `public/preview/fictional-well/index.html`. Team details sit beside each thumbnail. Contact opens with a map of the published address. Sample people are labelled as layout only, not staff. Colour comes from `brand.accent`. There is no shop or cart. `clinic-clean` 1.0.0 and existing prospect snapshots were left in place. The template is not approved, so real jobs do not switch to it yet. The instructions hash is now `df0cb16195fe9285`; the installed controller still has `93aa95661ffc71cc` until that property is updated after review. Email drafting stays off.
