# Category image bank

Harry adds reusable images. The factory copies an approved image into a client folder at build time. Later edits to this bank do not change a preview that has already been generated.

Categories: dental, physiotherapy, chiropractic, barber, veterinary, general. A prospect can use its own category and general. Barber has no approved template yet, so a barber job stops with Needs template review even if images exist.

## Add an image

1. Export a web-ready PNG, JPEG, WebP or AVIF. Keep the high-resolution master outside this repository. Do not add SVG.
2. Put the file in the matching category folder, for example `images/physiotherapy/reception.webp`.
3. Add an object to the `assets` array in `manifest.json`. Leave `exampleOnly` as documentation; the factory does not select it.

```json
{
  "id": "physio-reception-01",
  "category": "physiotherapy",
  "file": "images/physiotherapy/reception.webp",
  "tags": ["reception", "interior"],
  "alt": "Illustrative clinic reception",
  "sourceUrl": "https://example.com/licence-or-owned-record",
  "rights": "owned",
  "status": "draft",
  "illustrative": true
}
```

`file` is relative to `website-factory/`. `rights` is `owned`, `licensed` or `client-permission`. `illustrative` stays true. `status` stays `draft` until the image has been reviewed.

## Approve an image

Open the file, confirm the licence or ownership, and confirm the alt text does not claim it shows a prospect’s real staff or premises. Change `status` to `approved`. A job can select that `id` in `assets.librarySelections`. Draft, unknown, or mismatched-category images are rejected.

To replace an approved picture, add a new id and file. Do not overwrite a file that an existing client copy may share a name with inside an already generated preview. The client copy is a separate file under `public/factory-assets/clients/<slug>/`.
