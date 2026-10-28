# REFERENCE_NOTES.md

## Live Reference Site Analysis: `https://3-d-website-alpha.vercel.app/`
Analyzed directly from live production source and HTTP response on October 28, 2026.

---

### 1. The 3D Canvas Itself
- **Implementation**: The reference site embeds `<spline-viewer class="robot-3d" url="https://prod.spline.design/Qr2knMM4aKElH8x7/scene.splinecode"></spline-viewer>`.
- **Frame Rate & Loop**: Renders via WebGL at 60 FPS in a `requestAnimationFrame` loop.
- **Animation & Timing**:
  - Continuous vertical floating/levitation: Smooth sinusoidal cycle (approx. 3.5s per cycle) with ease-in-out easing.
  - Subtle roll/pitch tilting synchronized with the hover cycle.

### 2. Mouse and Cursor Interaction
- **Pointer Tracking**:
  - The robot's head and neck yaw and pitch smoothly towards the cursor location using spring/damping interpolation (`lerp`).
  - The floating 3D text ("Front" and "End") demonstrates subtle parallax depth shift relative to the mouse.

### 3. Scroll Behavior
- **Observed Behavior**: The reference page is a single-screen hero experience (`overflow: hidden` on `.container`, `min-height: 100vh`). There are no sub-sections below the fold and no page scrolling.
- **Component Design**: Built as a responsive standalone component that can function either as a full-viewport hero or embed seamlessly inside parent layouts.

### 4. Intro or Loading Animation
- **Observed**: The reference site uses the `AOS` (Animate On Scroll) library:
  - Header items fade down (`data-aos="fade-down"` duration 1500–3000ms).
  - Main hero content and 3D viewer fade and zoom in (`data-aos="fade-zoom-in"`).
- **Standalone Component**: Includes smooth mount fade-in and graceful preloading state while WebGL compiles materials and shaders.

### 5. JavaScript Bundle and Libraries
- **Reference Site Stack**: Plain HTML5, `style.css`, `@splinetool/viewer@1.9.98`, and `aos@next`. The 3D model is a proprietary Spline binary `.splinecode`.
- **Our Rebuild Stack**:
  - Rebuilt 100% from scratch using **Three.js** primitives (`three`, `RoundedBoxGeometry`, `ExtrudeGeometry`).
  - No external proprietary model files or downloaded assets.
  - Fully typed, React/Next.js client component with performance-optimized animation loop.

### 6. Eye Behavior
- **Visuals**: Two glowing spherical eyes embedded within dark recessed circular sockets on the rounded screen face.
- **Lighting**: Reddish-coral / pink emissive glow (`#ff4071` / `#ff5c8a`) with high bloom/emissive intensity.
- **Animation**: Periodic eye blink cycle (scale-Y squeeze every 4–6s) with subtle luminance pulsation and directional gaze orientation following the head.

### 7. Exact Colors, Fonts, Font Weights and Sizes
- **Background**: `#000000` (deep space black) with a subtle perspective grid and top-right ambient blur layer.
- **Robot Materials**:
  - Pedestal / Body: Deep metallic obsidian/indigo (`#161324` to `#24183d`) with high specular gloss (metalness: 0.85, roughness: 0.22).
  - Rim Lights: Strong purple/magenta key light from upper-right (`#a855f7` / `#c084fc`) creating vivid neon edge highlights; cool blue/cyan rim light from left (`#38bdf8`).
  - Neck Posts & Joints: Polished chrome/steel finish (`#cccccc`, metalness: 0.95, roughness: 0.15).
  - Screen Bezel: Chamfered rounded frame with deep midnight visor glass.
- **Typography & UI**:
  - Font: System UI / Inter (`font-sans`).
  - Header Logo: `font-size: 3rem`, `font-weight: 300`, uppercase.
  - Hero Headline: `font-size: 4rem` (clamp 2.5rem–4.5rem), `font-weight: 600`, `letter-spacing: 0.1em`.
  - Subtitle: `font-size: 1.2rem`, color `#9ca3af` / `gray`.

### 8. Exact Page Copy (Corrected Typos)
- The extracted text from the reference site indeed contained developer typos in the live HTML:
  - `INTRUCING &wedbar;` -> **`INTRODUCING`** (or `INTRODUCING •`)
  - `ENAIL FOR DEVELOPERS` -> **`EMAIL FOR DEVELOPERS`**
  - `the best way to reach uumans insted of spam folders, dlever transactional and marketing emails at scale.` -> **`The best way to reach humans instead of spam folders, deliver transactional and marketing emails at scale.`**
  - `Getstared >` -> **`Get Started >`**
  - `SIGNING` -> **`Sign In`** / **`Sign Up`**
- All corrected spellings are implemented cleanly.

### 9. Left-Side Hero Text & Styling
- Positioned in left column (`max-width: 40rem`, left-aligned).
- Badge / Tag: Pill badge with animated running gradient border (`#656565`, `#7f42a7`, `#6600c5`, `#5300a0`).
- CTA Buttons:
  - Secondary: Pill outline `Documentation >` (border `#2a2a2a`, hover background `#1a1a1a`).
  - Primary: Pill solid `Get Started >` (bg `#e5e7eb`, text `#000000`, hover bg `#d1d5db`).

### 10. Navbar Navigation & Hover States
- Logo `MCODE` on left.
- Centered links: `COMPANY`, `FEATURES`, `RESOURCES`, `DOCS`.
- Right button: `Sign In` pill button.
- Smooth CSS transitions on hover (color shift and background brightness).

### 11. Background Gradient & Grid
- Dark ambient backdrop with subtle glowing violet radial gradient behind the robot.
- 3D perspective grid plane in the scene floor/backdrop reflecting specular lights.

### 12. Responsive Behavior
- **Desktop (>= 1024px)**: Dual column side-by-side — text on left, full interactive 3D robot scene on right.
- **Tablet / Mobile (< 1024px)**: Stacked layout with robot positioned above or centered, scaling appropriately while keeping text readable.

### 13. Performance & Fallbacks
- Automatic WebGL context detection.
- `prefers-reduced-motion` media query respect (pauses bobbing/oscillation).
- Efficient Three.js disposal on unmount (geometries, materials, textures, requestAnimationFrame cancellation) preventing memory leaks.

### 14. Other Pages / Routes
- No other pages or routes exist on `3-d-website-alpha.vercel.app`. It is a focused, high-impact single-screen hero showcase.

