# Geometric cover artwork QA

final result: passed

## Scope and reference

Replace publication and news cover imagery with the selected geometric direction. Existing page typography, navigation, copy, ordering, and list/grid behavior remain the reference for the surrounding UI.

Selected reference: `/Users/kevin/.codex/generated_images/01a0efd5-ff5e-77f3-884a-1a838c670c77/exec-86f36292-080a-4ebe-8984-1326e187f04e.png`.

Evidence directory: `/Users/kevin/.codex/visualizations/2026/09/30/01a0efd5-ff5e-77f3-884a-1a838c670c77/cover-assets/`.

## Comparison and inspection

- `reference-implementation-comparison.png` places the selected reference beside actual desktop grid and mobile detail screenshots in one image. Screenshot panels are resized uniformly for comparison; the reference is a direction board, not the website layout specification.
- `asset-contact-sheet.png`: all nine masters inspected for geometry, symmetry, line continuity, unwanted elements, and safe margins. The medal's outer-ring gap is intentional. EchoAlign uses three complete offset squares. New milestones share the same simple line language.
- Color/image surface: pale blue, sage, and cream with dark marks; no text baked into images. Source assets are 1254 × 1254, encoded as WebP without resizing. Minor background texture is acceptable within the selected direction.
- Typography/copy/layout surface: existing website font, titles, summaries, labels, navigation, and resource links preserved. The artwork fits the existing landscape, square, and portrait frames.

## Responsive verification

In-app browser at DPR 1: publications and news grids checked at widths 320, 390, 768, 1280, and 1920 CSS pixels; desktop screenshot at 1440. No horizontal overflow; all cover images loaded. Five recent-news thumbnails remain 96px on mobile and 104px on desktop.

Publication detail checked at 320, 390, 768, 1440, and 1920: mobile 4:3, tablet square, desktop 4:5. News detail inspected at 390. List/grid switching and the AI Safety filter producing one publication were exercised. The single-result card retains its intended aspect ratio on narrow screens.

DPR 2 was emulated and the DOM reported loaded images without overflow; the browser's screenshot output under mobile emulation was cropped, so it is not used as visual proof. The accepted screenshots use DPR 1. No claim of testing every device or browser.

Evidence: `responsive-checks.json`, `publications-desktop-final.jpg`, `publications-320.jpg`, `publications-390.jpg`, `publications-768.jpg`, `news-320-final.jpg`, `news-thumbnails-after.jpg`, `detail-390.jpg`, `detail-1440.jpg`, and `news-detail-390.jpg`.

## Findings and repairs

- P2: long recent-news titles stretched the image wrapper below the square image, exposing a dark strip on 320px screens. Added `self-start` to the recent-thumbnail wrapper on both sibling pages. DOM recheck confirms all five wrappers are 96 × 96. Before/after: `news-thumbnails-before.jpg` and `news-thumbnails-after.jpg`.
- P2: the single-publication frame had a fixed 280px minimum height that overrode its narrow-screen aspect ratio. Removed that minimum and verified the filtered card.
- Stronger strokes and central safe margins intentionally refine the direction board for small thumbnails. No unresolved P0/P1/P2 issue within the changed surfaces.

## Checks

- `node scripts/check-artwork.mjs`: all nine assets pass symbol visibility, centered crop safety at 1.68:1, 1.55:1, 1.36:1, 4:3, 1:1, 4:5, 4% hover enlargement, 2:1 social crop, and 104px visibility checks.
- `pnpm lint`: passed.
- `pnpm typecheck`: passed.
- `pnpm build`: passed, 24 static pages.
- Browser console warning/error inspection: empty.
