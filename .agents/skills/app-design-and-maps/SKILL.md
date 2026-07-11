---
name: app-design-and-maps
description: Enforces this app's premium glassmorphism design system, Leaflet map component standards, and Gemini AI integration patterns (waste-image scanning, voice queries). Use whenever building or editing screens, map views, scanning UI, or any Gemini-powered feature in this waste-management app.
---

# App Design & Maps Skill

## Mission
This app (a waste-management / recycling scanner platform) has a specific dark, "premium tech" visual language and two recurring technical integrations: Leaflet maps and Gemini AI. This skill exists so every new screen the agent builds looks and behaves consistently with what's already shipped — instead of reinventing colors, spacing, or map/AI plumbing each time.

Read `resources/design_system_tokens.json` before styling any new screen.
Read `examples/LeafletMapTemplate.tsx` before adding or editing any map view.
Read `examples/GeminiAnalysisPrompt.txt` before wiring up any Gemini vision or voice feature.

---

## 1. Aesthetic Design Tokens

- **Theme:** dark-first. Base background is deep navy/near-black, never pure black (`#0A0E14` default — see tokens file).
- **Accent:** emerald/eco-green as primary accent (waste/recycling context), with a secondary violet used sparingly for premium/pro UI elements.
- **Signature surface:** `.glass-card` — frosted glass panel used for every card, modal, and floating panel. Never use flat opaque cards; the frosted-glass look is the app's identity.
- **Circular gauges:** used for bin fill-level, recycling score, and daily-scan-count widgets. Always SVG-based (not a third-party gauge library) so stroke color/animation stays on-brand.
- **Motion:**
  - `animate-scanline` — plays while Gemini is actively analyzing a waste image. Never show a generic spinner for scan states; use this instead.
  - `animate-float` — subtle idle motion (2–4px, 3–4s ease-in-out loop) applied to hero icons, empty-state illustrations, and floating action buttons. Do not apply to text or data that needs to stay readable/still.
- **Typography:** one geometric sans for headings (weight 600–700), one readable sans for body. Numbers in gauges/stats use tabular-nums.
- **Do NOT:**
  - Use pure white cards or light-mode-style flat shadows — breaks the premium-dark identity.
  - Introduce a new accent color without checking `design_system_tokens.json` first.
  - Use default browser/OS map pins — always use the custom pin component described below.

## 2. Map Component Standards

- All maps use **Leaflet** (via `react-leaflet`), never Google Maps JS SDK, for licensing/cost reasons already decided for this project.
- Coordinates are always handled as `{ lat: number, lng: number }` — never as `[lat, lng]` tuples in app state (Leaflet's own API can take tuples internally, but our state/props layer stays object-shaped for readability).
- Custom pin droppers: waste bins, recycling centers, and user-reported locations each get a distinct custom marker icon (see template) — never the default Leaflet blue marker.
- Panning/zoom transitions use Leaflet's built-in `flyTo` with ~0.8–1.2s duration — avoid instant `setView` jumps for user-triggered navigation (instant `setView` is fine for initial load).
- Map containers always sit inside a `.glass-card` frame with rounded corners consistent with the rest of the app (see tokens file for radius value) — the map itself should never span edge-to-edge with square corners.
- See `examples/LeafletMapTemplate.tsx` for the full reference implementation (container setup, custom icons, marker clustering pattern, and pin-drop handler).

## 3. Gemini AI Integration Templates

Two recurring AI features in this app:

1. **Waste image scanning** — user photographs an item, Gemini classifies material type + recyclability + disposal instructions.
2. **Voice queries** — user asks a spoken question about disposal/recycling; response is synthesized back as both text and (optionally) voice.

Standards:
- Always request **structured JSON output** from Gemini for the scanning feature — never free-text parsed with regex. See `examples/GeminiAnalysisPrompt.txt` for the exact schema/prompt format already in use.
- Always validate the parsed JSON against the expected schema before rendering — if Gemini returns malformed JSON, show a retry state, never a raw error dump.
- While a request is in flight, trigger the `animate-scanline` treatment on the image preview (per section 1) — not a generic spinner.
- Voice queries: transcribe first, confirm the transcribed text to the user before sending to Gemini (short confirmation UI), then stream/display the response.
- Never hardcode API keys in client code — Gemini calls go through the existing backend proxy route.

---

## Decision tree for the agent

- Building a new screen? → Load design tokens first, use `.glass-card` for every panel.
- Adding/editing a map? → Load `LeafletMapTemplate.tsx`, follow marker + panning conventions.
- Wiring a Gemini feature (image or voice)? → Load `GeminiAnalysisPrompt.txt`, use structured JSON + scanline loading state.
- Unsure about a color/spacing value? → Check `design_system_tokens.json` before inventing one.
