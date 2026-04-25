# Coherent Cabal — TODO

## Database & Backend
- [x] Artifacts table: id, nama, body, type (writing/music/art), fileUrl, fileKey, createdAt, expiresAt, lifeSeconds, purpleShade, isExpired
- [x] Quips table: id, artifactId, nama, body, fileUrl, fileKey, createdAt
- [x] Interactions table: id, artifactId, type (view/quip), createdAt
- [x] Intimate Collaborate threads table: id, artifactId, sessionA, sessionB, createdAt (ephemeral, cookie-scoped)
- [x] tRPC: artifact.list (by door type, active only)
- [x] tRPC: artifact.create (no auth required)
- [x] tRPC: artifact.view (record view, extend life +6h)
- [x] tRPC: quip.list (by artifactId)
- [x] tRPC: quip.create (record quip, extend life +18h)
- [x] tRPC: intimate.initiate (create/find thread by artifactId + sessionId)
- [x] tRPC: intimate.send (send message to thread)
- [x] tRPC: intimate.messages (get messages for thread)
- [x] tRPC: scheduled decay endpoint
- [x] Decay scheduler: advance purple shade every 18h of inactivity, expire at 7 days

## Landing Page
- [x] Black background with breathing diagonal stripes (different rhythm for background vs stripe animation)
- [x] Dark rich purple text
- [x] Landing copy: "You are here..." through "writing · music · art"
- [x] "Patha" as sole entry button (Sanskrit, exact label)
- [x] Smooth transition into forum field on click

## Forum Field
- [x] Dark mode open field — artifacts as presences, not list items
- [x] Three parallel door tabs: writing · music · art (equal weight, no hierarchy)
- [x] Artifact cards with white outline on creation
- [x] Color-state: 7 shades of purple deepening over time
- [x] No visible trace of expired artifacts
- [x] Multi-Color-Displays left panel with two color wheels (viewer-local only)
- [x] New artifact posting: minimal, no login required, Nama field optional

## Artifact Cards
- [x] Rectangular presence card with nama, body, color-state outline
- [x] "quip" button (sole visible action on card)
- [x] Fractal heart icon — unlabeled, discovered by presence
- [x] Fractal heart opens Intimate Collaborate thread

## Quip Modal
- [x] In-page modal (never new page)
- [x] Small blinking rectangle labeled "Artifact" at top
- [x] Body area: text input + gif/file upload
- [x] Nama field at bottom left
- [x] Upload pause: quiet reflection moment, not a warning

## Intimate Collaborate
- [x] Ephemeral DM thread scoped to artifact + two session cookies
- [x] Disclosure at start: thread lost on browser clear
- [x] Label: "Intimate Collaborate" (exact)
- [x] No label on fractal heart icon

## Decay System
- [x] Scheduled endpoint advances purple shade based on interaction timestamps
- [x] Permanently removes artifacts at 7-day expiry
- [x] No archive, no visible trace — compost is unseen

## Tests
- [x] Vitest: decay shade calculation logic (4 cases)
- [x] Vitest: auth logout

## Fixes (round 1)
- [x] Rename "place" button back to "quip" on artifact cards — quip is the action label
- [x] Multi-Color-Displays panel: fix vertical positioning so it sits centered in the field, not pinned to top
- [x] Multi-Color-Displays panel: make the wheels actually interactive/engageable when expanded
- [x] Artifact blinking rectangle: change blink interval from 3s to 2s
- [x] Intimate Collaborate: change blink interval from 3s to 2s (if blinking element present)
- [x] Quip modal blinking rectangle: label should say "Quip" not "Artifact" (three windows, three labels: Artifact / Quip / Intimate Collaborate, same mechanism)

## Fixes (round 2)
- [x] Multi-Color-Displays: restore hinge-upward behavior (panel opens upward from bottom-left, not as side overlay)
- [x] Multi-Color-Displays: make color selection actually apply visibly (wheels must respond to click and show selection)
- [x] Multi-Color-Displays: add a clear "return to default" button inside the panel
- [x] Landing page: increase text brightness/contrast so all lines read clearly — warm, not strained

## Fixes (round 3)
- [x] ArtifactCard: move quip button to bottom-right of card
- [x] ArtifactCard: move fractal heart to top-right of card (where the unknown dot currently sits)
- [x] ArtifactCard: remove the stray dot/element at top-right that serves no purpose
- [x] ArtifactCard + QuipModal + NewArtifactForm: accept all document/file types in upload inputs

## Fixes (round 3 — gaps)
- [x] ArtifactCard: clicking the artifact body/card area opens the quip window (not just the quip button)
- [x] ArtifactCard + QuipModal: render non-image file attachments as a file chip (filename + type) rather than a broken img tag

## Fixes (round 4)
- [x] Landing: Pātha button — replace underline with full purple border, making it clearly a button
- [x] Landing: correct spelling to Pātha (macron over first a)
- [x] ArtifactCard + QuipModal + NewArtifactForm: correct Nama label to Nāma (macron over a)

## Fixes (round 5)
- [x] MultiColorPanel: wheel A controls background color (not hue-rotate filter)
- [x] MultiColorPanel: wheel B controls text color, also applied to the Multi-Color-Displays tab label
- [x] MultiColorPanel: tab button gets same purple border as Pātha

## Notes
- Viewer-local text color (wheel B) currently applies to the forum field container and the Multi-Color-Displays tab label. Hardcoded inline colors on artifact cards, door tabs, and modals are not yet affected — intentionally deferred for stability.

## Fixes (round 6)
- [x] Forum: move "Draft Artifact" button to top-left (not top-right), rename from "quip" to "Draft Artifact", wrap in purple border box
- [x] Forum: wrap the three door labels (writing · music · art) in purple border boxes
- [x] ArtifactCard: wrap the "quip" button inside the card in a purple border box

## Fixes (round 7)
- [x] Forum: Draft Artifact button — move further left so it clears the artifact grid entirely, with breathing room
- [x] Forum: three door labels (writing · music · art) — center them properly in the available width (accounting for the 176px panel offset)

## Fixes (round 8)
- [x] Forum: Draft Artifact button and artifact grid must sit side-by-side in the same row — button left, grid right

## Fixes (round 9)
- [x] ArtifactCard: make the card larger (taller min-height, bigger text, more internal padding)
- [x] NewArtifactForm + QuipModal: add media upload support (images, video, audio) with preview

## Fixes (round 10 — pending)
- [ ] NewArtifactForm + QuipModal: add user-facing error state for upload/submit failures (not just console.error)
- [ ] NewArtifactForm + QuipModal: enforce MAX_FILE_BYTES (5MB) with clear feedback for oversized files
