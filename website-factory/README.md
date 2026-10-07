# Parley website factory

This is a first working factory foundation, not live Sheet-to-build automation.

Run `node website-factory/factory.mjs fictional-clinic` to generate the starter. Open public/preview/fictional-clinic/index.html, or after deployment /preview/fictional-clinic/index.html. Run `node --test website-factory/factory.test.mjs` for validation checks.

- catalogue.json: selectable designs with status and immutable versions.
- templates/<id>/<version>/render.mjs: self-contained renderer; new versions are separate files.
- sites/<slug>.json: sourced business data, selected template, copy and assets.
- images/<category>: your reusable image folders. Follow images/README.md to register a draft and approve it in images/manifest.json.
- public/factory-assets/clients/<slug>: copies of the selected approved images and the official prospect logo. The generator makes these copies.
- public/preview/<slug>/index.html: the prospect's page. Rebuilding that slug replaces this file and keeps the same address.
- integration.json: controller contract, instructions version, £200 monthly tools budget, and email drafting switch. Drafting stays off.

Image categories: dental, physiotherapy, chiropractic, barber, veterinary and general. Add images here in your Cursor project, or sync your external image folders into these directories. Cloud jobs cannot access folders that exist only on your computer. Keep original high-resolution masters outside Git; commit web-ready, licensed copies. Dental, physiotherapy, chiropractic and veterinary use the same health landing photograph for now, plus the shared booking portrait, review photograph, specialist portrait and service cover. Demo cards named Jordan Example, Sam Example and Riley Example each use a separate illustrative treatment photograph. A later dental photograph can replace only the dental landing file.

Read BUILD.md for the research, logo collection and build procedure. Cursor performs research with its available browsing tools; this foundation does not contain an autonomous general-purpose crawler. Failed research must be reported rather than filled with false facts.

`care-modern` 1.0.0 is the accepted layout for a new dental, physiotherapy, chiropractic or veterinary clinic. Open `public/preview/fictional-well/index.html` for the physiotherapy concept and `public/preview/fictional-dental/index.html` for the dental concept. A later clinic uses that same layout with its own name, colour, services, practitioners, hours and reviews. Sample people and sample fees stay on the labelled demos. A real clinic gets the prices page only when its own fees are recorded. Service names come from the practice: a dentist uses names such as Cosmetic, Oral Hygiene, Emergency, Family and DenPlan, not the physiotherapy list. Team details sit beside each thumbnail on the About page. That page opens with the practice name, a short summary and an underlined link with a downward chevron, “Get to know the specialists,” which jumps to the team. Services, About, Reviews, Prices and Contact each open with the same small subtitle and a relevant icon, above the title. The contact heading is the practice name. On a labelled demo a small illustrative exterior sits beside that summary, and it fills the width on a narrow screen. Contact opens with a map. Colour comes from the company brand accent, and it has no shop or cart. `clinic-clean` remains only for previews that already name it. Barber remains blocked. Email drafting stays off.

No live switch is changed by this branch. Missing Cursor/GitHub credentials and end-to-end deployment checks still block activation.
