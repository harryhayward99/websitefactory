# Parley factory handover

Updated 2026-10-02 after the approved repository separation.

Factory source from Cursor PR #1 was reviewed with the extracted controller; the canonical controller is now https://github.com/harryhayward99/parley-outreach. The marketing repository no longer owns orchestration. Read INTEGRATION.md for the shared interface. Older environment instructions in HANDOFF-HISTORY.md are historical.

## Verified
Factory tests and build pass locally. Cursor's starter/layout, image-copying, duplicate handling, instruction-version validation, status documents and hosting config are preserved. Integration metadata now identifies the separate controller. The instructions hash changed to 54cd88f946a6d958 because the reviewed contract changed. Existing fictional preview snapshots were preserved.

## Still awaiting activation
The clinic template is draft; Harry has not approved the design. Image folders remain empty. No live hosting URL or paid-build test has been verified. The installed Apps Script was not updated. Email-template approval is separate from design approval.

Next: select all three repositories in Cursor if working on the whole company, or outreach + factory for this integration. Review the starter, connect hosting/provider access and verify combined budget controls. Agree the instructions version and fresh Sheet approvals, install the controller bundle, then run one controlled end-to-end job. Do not switch live processing on merely because this migration merged.
