# Vedat Zeybek — Portfolio

A minimal, cinematic portfolio in one continuous 3D universe. Built with React, TypeScript, Vite, Three.js, React Three Fiber, Drei, GSAP and React Three Postprocessing. No router or additional state library.

## Run

Requires Node.js 22.12+ (developed with Node 22).

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

Vite uses a relative base, so `dist/` can be served from a domain root or subdirectory. Publishing is separate from the local build.

## Publish to GitHub Pages

Live URL: https://vedatzeybek.github.io/resume/

The existing Pages configuration publishes the root of the `gh-pages` branch. Commit source changes and push `main`, then run:

```sh
npm run deploy
```

This builds the production site, checks out `gh-pages` in a temporary worktree, replaces its generated files with `dist/`, adds `.nojekyll`, and pushes a normal deployment commit. Source files stay on `main`. GitHub Pages then publishes the branch; it may take a few minutes. Git push access to the repository is required. No access token is stored in the project. A failed deployment preserves its temporary checkout for inspection, and concurrent remote updates are rejected rather than overwritten.

## Edit content

- `src/data/profile.ts`: professional title, location, email, phone, GitHub, LinkedIn and resume URL.
- `src/data/projects.ts`: project text, technology tags and optional repository URLs.
- `src/data/experience.ts`: roles, dates, descriptions and optional technology lists.
- `src/data/techStack.ts`: CV technologies shown in a single, muted logo strip beneath the ME introduction. Two equal-width copies form a seamless 42-second leftward CSS loop. Hover or keyboard focus pauses it; reduced motion disables autoplay and allows manual horizontal scrolling. The duplicate is hidden from assistive technology.

Technology logos are vendored SVGs from [Devicon](https://github.com/devicons/devicon); no icon package or external runtime request is needed. Their MIT license is included in `public/licenses/devicon.txt`.

Contact details, LinkedIn, internship dates, responsibilities and technologies are sourced from the supplied CV. The original PDF is stored at `public/cv/Vedat_Zeybek_CV.pdf` and downloaded from the top-right CV link or Contact section. Replace that file to update the downloadable document, and update the data files separately for website text. Contact details appear in the right-hand column on desktop and below the introduction on mobile.

Every current project has a GitHub repository link. Usta uses the URL supplied directly by Vedat; VitrA Press AI Assistant, Community Management System and Minishell use the repository links embedded in the supplied CV. Minishell and miniRT display the supplied terminal screenshot and rendered scene; Webserv displays the supplied architecture diagram. These original images live in `src/assets/projects/` and are configured through each project's optional `image` field. They preserve their aspect ratio without cropping, load lazily and decode asynchronously. The remaining project visuals are conceptual SVG illustrations.

## Scene and navigation

The single Canvas persists across every section. Stops sit at `z = 0, -150, -300, -450`. Each region has a restrained composition and only renders while near the camera. All objects are procedural; no large textures, stock images or external font requests are required. Planet shaders combine terrain, craters, surface-normal relief and sparse warm settlement lights. A single solid sphere carries a restrained rim light; there is no second atmospheric shell. Surface noise and crater details are filtered against projected pixel size to avoid distant shimmer. Nebulae use layered, domain-warped noise for gas filaments and dust lanes. Slow planet rotation, cloud drift and subtle star variation stop under reduced motion. Ring bands use broad, stable density variations and analytic edge filtering to prevent distant aliasing.

`navigationStore.ts` provides a small external store through `useSyncExternalStore`. It contains the active stop, destination and travel phase. The mutable `flight` object holds frame values outside React to avoid rerendering UI at animation speed.

`useWarpTransition.ts` owns the GSAP timeline:

1. Fade content out in 200 ms.
2. Move the camera with acceleration and deceleration.
3. Increase FOV from 48° to 61° and back.
4. Stretch shader-based star segments along the travel axis, up to 28 world units.
5. Reveal the next section and restore keyboard focus.

The full journey takes about 1.87 seconds. Input is locked during travel. Direct jumps travel the same route, and reverse trips invert the star direction. Navbar, side indicators, wheel, touch swipes and keyboard arrows/Page Up/Page Down all use the same transition. Home/End navigate to the first/last stop. Wheel accumulation has a threshold and a cooldown to limit accidental trackpad navigation. Overflowing content scrolls first; navigation starts at its boundary.

Supported section hashes: `#me`, `#projects`, `#experience`, `#contact` (including page refresh).

## Projects carousel

`ProjectCarousel.tsx` and `useProjectCarousel.ts` implement a custom foreground carousel with React state, CSS perspective and Pointer Events. The existing Projects introduction stays separate. The renderer derives offsets and control boundaries from the data array, including empty and single-project states.

- Active card: full opacity, +40 px depth, no Y rotation; adjacent cards: 0.5 opacity, 0.88 scale, ±4° rotation; next neighbors: 0.16 opacity, 0.79 scale.
- Cards snap over 560 ms. A small inverse projection on the active card keeps its text at native pixel scale.
- VitrA Press AI Assistant is selected initially through its `initiallyActive` data flag. If no entry has that flag, the carousel starts at the middle project. Minishell is the first entry. Small visible gaps separate the active card and its neighbors.
- Clicking a neighboring card selects it; clicking anywhere on the active card opens its repository. The source link also works with the keyboard. Drag gestures suppress link activation.
- Horizontal drag/swipe (48 px threshold), horizontal trackpad scrolling, wheel over the cards, arrow buttons and Left/Right keys change the active project.
- Wheel events are consumed only inside the card viewport. Vertical wheel outside it continues section navigation. Vertical touch gestures remain native scrolling; horizontal swipes never start warp travel.
- Input checks share the travel lock. Carousel changes neither move the camera nor replace the Canvas. Inactive content is inert and excluded from assistive-technology navigation; project changes are announced.
- Reduced motion removes the card transition.
- The perspective stage ignores pointer hits so neighboring cards behind its plane remain clickable. Drag offsets update once per animation frame through a CSS variable, and card content is memoized. Active glow fades via opacity rather than animating a shadow.

The Webserv and miniRT entries use the public collaborative repositories pinned on Vedat's GitHub profile. Descriptions are based on their READMEs: [Webserv](https://github.com/CilginSinek/webserv), [miniRT](https://github.com/CilginSinek/miniRT).

## Accessibility and rendering

- Semantic content, keyboard navigation, focus handling, live section announcements and a skip link.
- `prefers-reduced-motion`: short fade, no warp or FOV changes, no pointer parallax or card tilt.
- Mobile: 500 background stars, 250 travel segments, 5 instanced asteroids, simpler planet geometry and no bloom. Desktop: 1500 stars, 850 segments, 18 asteroids.
- DPR capped at 1.5 on desktop and mobile, with antialiasing enabled. Desktop postprocessing uses 4× multisampling.
- Render loop stops when the tab is hidden.
- Projects uses on-demand rendering while idle: its atmosphere stays still during card interaction. Section travel resumes the continuous render loop on the same Canvas.
- React UI loads separately from the 3D scene. Bloom loads separately and only on desktop without reduced motion.
- WebGL failure/context loss leaves the HTML portfolio navigable over a CSS fallback.

The Three.js engine is the largest lazy-loaded chunk; Vite may report its size warning. It is not part of the initial UI chunk. No claim of a particular frame rate is made without testing on the target device.

## Design

The supplied reference compositions inform the spacious typography, dark palette, restrained cards and minimal navigation. The scene intentionally contains fewer objects. There is no character, game interface, sound, chromatic aberration or heavy motion blur.

## Validation performed

Production builds passed after each of the six implementation phases. Chromium checks covered the full travel state sequence, hidden content during travel, repeated-input locking, forward/reverse/direct navigation, preservation of the same Canvas, wheel threshold, keyboard navigation and focus after arrival.

Layouts were checked at 1920×1080, 1440×900, 1366×768, 390×844 and 320×568. Mobile card scrolling and navigation at the content boundary were exercised. Reduced motion was verified to keep warp at 0 and FOV at 48. The portfolio remained navigable with WebGL disabled, and section hashes survived refresh. Automated axe checks reported no WCAG 2 A/AA or 2.1 AA violations in the four desktop sections. This is not a substitute for manual assistive-technology or physical-device testing.

The carousel revision passed a production build and Chromium interaction checks for buttons, keyboard boundaries, mouse drag thresholds, horizontal trackpad input, wheel isolation, persistent Canvas identity, and section navigation outside the cards. At 390 px, browser-emulated touch swipes worked in both directions, vertical touch preserved the selection, and content had no horizontal overflow. An isolated component harness covered 3, 5, 8 and 12 projects, a singleton, an empty list, repopulation and reduced motion. The Projects axe scan reported no violations. Final screenshots at 1440×900 and 390×844 and a before/after comparison are saved in the local, gitignored `.artifacts/` directory.

The subsequent click/performance fix was reproduced using coordinate-based clicks: the perspective stage had intercepted hits intended for negative-Z neighboring cards. Regression checks passed for left/right card clicks, active-card repository links, drag without accidental navigation, mobile taps/swipes, and the persistent Canvas across section travel. WebGL draw-call instrumentation confirmed that Projects renders initially, then makes no further draws while idle. Local headless Chromium/SwiftShader timing comparisons are recorded in `.artifacts/carousel-baseline.json` and `.artifacts/carousel-after.json`; these are comparative software-rendering measurements, not physical-device FPS guarantees.
