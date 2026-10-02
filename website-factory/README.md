# Parley website factory

This is a first working factory foundation, not live Sheet-to-build automation.

Run `node website-factory/factory.mjs fictional-clinic` to generate the starter. Open public/preview/fictional-clinic/index.html, or after deployment /preview/fictional-clinic/index.html. Run `node --test website-factory/factory.test.mjs` for validation checks.

- catalogue.json: selectable designs with status and immutable versions.
- templates/<id>/<version>/render.mjs: self-contained renderer; new versions are separate files.
- sites/<slug>.json: sourced business data, selected template, copy and assets.
- images/<category>: your reusable image folders. Add the provenance/permission information to images/manifest.json and set status approved when ready to use.
- public/factory-assets/clients/<slug>: selected copies of approved images and the official prospect logo.
- public/preview/<slug>/index.html: frozen output for the prospect; updates to a template or the image bank do not change it.

Image categories: dental, physiotherapy, chiropractic, barber, veterinary and general. Add images here in your Cursor project, or sync your external image folders into these directories. Cloud jobs cannot access folders that exist only on your computer. Keep original high-resolution masters outside Git; commit web-ready, licensed copies. No images have been supplied yet.

Read BUILD.md for the research, logo collection and build procedure. Cursor performs research with its available browsing tools; this foundation does not contain an autonomous general-purpose crawler. Failed research must be reported rather than filled with false facts.

The clinic starter is DRAFT and has not received visual approval. The factory rejects real prospects on unapproved templates. Approve a template only after reviewing its demo. It can be improved incrementally without rebuilding the entire system.

No live switch is changed by this branch. Missing Cursor/GitHub credentials and end-to-end deployment checks still block activation.
