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
