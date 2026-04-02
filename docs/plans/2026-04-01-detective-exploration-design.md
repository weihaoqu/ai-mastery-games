# Detective Interactive Exploration — Design Document

**Mechanic:** Full exploration mode with zoomable/pannable pixel art scenes, clickable hotspots revealing evidence as modals, discovery tracker, and bonus scoring.

## Layout

Interactive scene at top with hotspot overlays. Click hotspots to discover evidence via modals. Diagnosis available anytime. Bonus points for thorough investigation.

## Components

### 1. Hotspot Data (per case)
Add `hotspots` array to Case type: `{evidenceId, x, y, w, h}` as percentages. Mapped to visible objects in each scene illustration.

### 2. InteractiveScene Component
- Zoomable (scroll/pinch)
- Pannable (drag when zoomed)
- Hotspot overlays with subtle pulsing glow
- Magnifying glass cursor on hover
- Click opens EvidenceModal

### 3. EvidenceModal Component
Popup overlay showing evidence title, type icon, content, KEY badge. Close button.

### 4. Discovery Tracker
Counter in top bar: "Evidence found: 2/4". Tracks discovered evidence.

### 5. Updated Play Page Flow
Replace static image + expandable cards with InteractiveScene. Evidence board shows only discovered items. Diagnosis always available.

### 6. Scoring Update
Bonus multiplier: all evidence = 1.5x, key only = 1.0x.

## Not in Scope
- Regenerating illustrations
- Sound effects
- Animated zoom transitions
- Mini-map
