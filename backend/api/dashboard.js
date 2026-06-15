module.exports = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AFRO SOUND - Admin Panel</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>


    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"/>
    <style>

        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Orbitron:wght@500;700;900&display=swap');

        /* ============================================================
           AFRO SOUND - Futuristic Admin Theme
           Palette inspired by the logo: neon leaf-green, gold/orange,
           cream and a deep african-night background.
        ============================================================ */
        :root {
            --bg: #060a07;
            --bg-2: #0a1410;
            --panel: rgba(14, 24, 18, 0.72);
            --panel-solid: #0c150f;
            --border: rgba(86, 209, 92, 0.16);
            --green: #34d058;
            --green-bright: #7cff4f;
            --gold: #f5a524;
            --orange: #f97316;
            --cream: #f3e9ce;
            --text: #e9f3e4;
            --muted: #8aa090;
        }

        * { box-sizing: border-box; }

        html { background-color: var(--bg); }

        body {
            font-family: 'Inter', sans-serif;
            background-color: var(--bg);
            color: var(--text);
            overflow-x: hidden;
            position: relative;
            min-height: 100vh;
        }

        .font-display { font-family: 'Orbitron', sans-serif; letter-spacing: 0.04em; }

        /* ---------- Animated background layers ---------- */
        .fx-bg {
            position: fixed;
            inset: 0;
            z-index: -3;
            background:
                radial-gradient(900px 600px at 12% -5%, rgba(52, 208, 88, 0.14), transparent 60%),
                radial-gradient(800px 600px at 95% 8%, rgba(245, 165, 36, 0.12), transparent 55%),
                radial-gradient(700px 700px at 50% 110%, rgba(124, 255, 79, 0.08), transparent 60%),
                linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 100%);
            animation: auroraShift 18s ease-in-out infinite alternate;
        }
        @keyframes auroraShift {
            0%   { filter: hue-rotate(0deg) saturate(1); }
            100% { filter: hue-rotate(-14deg) saturate(1.25); }
        }

        .fx-grid {
            position: fixed;
            inset: -50%;
            z-index: -2;
            background-image:
                linear-gradient(rgba(52, 208, 88, 0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(52, 208, 88, 0.06) 1px, transparent 1px);
            background-size: 46px 46px;
            transform: perspective(500px) rotateX(58deg);
            transform-origin: top center;
            mask-image: linear-gradient(180deg, transparent 35%, #000 60%, transparent 92%);
            -webkit-mask-image: linear-gradient(180deg, transparent 35%, #000 60%, transparent 92%);
            animation: gridScroll 14s linear infinite;
            opacity: 0.7;
        }
        @keyframes gridScroll {
            0%   { background-position: 0 0; }
            100% { background-position: 0 46px; }
        }

        .fx-scan {
            position: fixed;
            inset: 0;
            z-index: -1;
            pointer-events: none;
            background: repeating-linear-gradient(0deg, rgba(0,0,0,0) 0 3px, rgba(0,0,0,0.16) 3px 4px);
            mix-blend-mode: overlay;
            opacity: 0.35;
            animation: scan 8s linear infinite;
        }
        @keyframes scan {
            0% { background-position-y: 0; }
            100% { background-position-y: 100px; }
        }

        /* floating particles (sound dust) */
        .fx-particles { position: fixed; inset: 0; z-index: -1; pointer-events: none; overflow: hidden; }
        .fx-particles i {
            position: absolute;
            bottom: -10px;
            width: 4px; height: 4px;
            border-radius: 50%;
            background: var(--green-bright);
            box-shadow: 0 0 8px var(--green-bright);
            opacity: 0;
            animation: floatUp linear infinite;
        }
        @keyframes floatUp {
            0%   { transform: translateY(0) scale(0.6); opacity: 0; }
            10%  { opacity: 0.9; }
            90%  { opacity: 0.5; }
            100% { transform: translateY(-100vh) scale(1); opacity: 0; }
        }

        /* ---------- Glass panels ---------- */
        .glass {
            position: relative;
            background: var(--panel);
            border: 1px solid var(--border);
            border-radius: 18px;
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04);
            transition: transform 0.35s cubic-bezier(.2,.7,.2,1), border-color 0.35s, box-shadow 0.35s;
        }
        .glass::before {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: inherit;
            padding: 1px;
            background: linear-gradient(135deg, rgba(124,255,79,0.5), transparent 40%, transparent 60%, rgba(245,165,36,0.45));
            -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            opacity: 0.5;
            pointer-events: none;
        }
        .glass-hover:hover {
            transform: translateY(-6px);
            border-color: rgba(124, 255, 79, 0.55);
            box-shadow: 0 18px 50px rgba(0,0,0,0.6), 0 0 26px rgba(52, 208, 88, 0.28);
        }

        /* ---------- Neon text ---------- */
        .neon-green {
            color: var(--green-bright);
            text-shadow: 0 0 8px rgba(124,255,79,0.55), 0 0 22px rgba(52,208,88,0.35);
        }
        .neon-gold {
            color: var(--gold);
            text-shadow: 0 0 8px rgba(245,165,36,0.5), 0 0 20px rgba(249,115,22,0.3);
        }
        .text-cream { color: var(--cream); }
        .text-muted { color: var(--muted); }

        .title-flicker { animation: flicker 6s infinite steps(1); }
        @keyframes flicker {
            0%, 92%, 100% { opacity: 1; }
            93% { opacity: 0.6; }
            94% { opacity: 1; }
            96% { opacity: 0.4; }
            97% { opacity: 1; }
        }

        /* ---------- Logo emblem (animated, themed) ---------- */
        .emblem {
            position: relative;
            width: 52px; height: 52px;
            flex: 0 0 auto;
            display: grid;
            place-items: center;
        }
        .emblem .ring {
            position: absolute; inset: 0;
            border-radius: 50%;
            background: conic-gradient(from 0deg, var(--green), var(--gold), var(--green-bright), var(--orange), var(--green));
            -webkit-mask: radial-gradient(closest-side, transparent 64%, #000 66%);
            mask: radial-gradient(closest-side, transparent 64%, #000 66%);
            animation: ringSpin 6s linear infinite;
            filter: drop-shadow(0 0 8px rgba(52,208,88,0.6));
        }
        .emblem .ring.slow {
            inset: 6px;
            animation: ringSpin 9s linear infinite reverse;
            opacity: 0.7;
        }
        @keyframes ringSpin { to { transform: rotate(360deg); } }
        .emblem .core {
            position: relative;
            width: 22px; height: 22px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%, var(--gold), var(--orange));
            box-shadow: 0 0 14px rgba(245,165,36,0.8);
            animation: pulseCore 2.4s ease-in-out infinite;
        }
        @keyframes pulseCore {
            0%,100% { transform: scale(1); box-shadow: 0 0 14px rgba(245,165,36,0.7); }
            50%     { transform: scale(1.12); box-shadow: 0 0 22px rgba(245,165,36,1); }
        }

        /* ---------- Equalizer (sound-wave motif from the logo) ---------- */
        .eq { display: inline-flex; align-items: flex-end; gap: 3px; height: 22px; }
        .eq span {
            display: block;
            width: 3px;
            border-radius: 3px;
            background: linear-gradient(var(--green-bright), var(--green));
            box-shadow: 0 0 6px rgba(52,208,88,0.6);
            animation: equalize 1.1s ease-in-out infinite;
        }
        .eq span:nth-child(1){ animation-delay: 0s;    height: 40%; }
        .eq span:nth-child(2){ animation-delay: .15s;  height: 80%; }
        .eq span:nth-child(3){ animation-delay: .3s;   height: 55%; }
        .eq span:nth-child(4){ animation-delay: .45s;  height: 100%; }
        .eq span:nth-child(5){ animation-delay: .6s;   height: 65%; }
        .eq span:nth-child(6){ animation-delay: .25s;  height: 90%; }
        .eq span:nth-child(7){ animation-delay: .5s;   height: 45%; }
        @keyframes equalize {
            0%, 100% { transform: scaleY(0.35); }
            50%      { transform: scaleY(1); }
        }

        /* ---------- Nav ---------- */
        .nav-link {
            position: relative;
            transition: all 0.25s ease;
            border: 1px solid transparent;
        }
        .nav-link:hover { color: var(--green-bright); border-color: var(--border); }
        .nav-active {
            color: #04210c !important;
            background: linear-gradient(120deg, var(--green-bright), var(--green)) !important;
            box-shadow: 0 0 18px rgba(52,208,88,0.55);
            border-color: transparent !important;
        }

        /* ---------- Buttons ---------- */
        .btn-primary {
            position: relative;
            overflow: hidden;
            background: linear-gradient(120deg, var(--green-bright), var(--green));
            color: #04210c;
            font-weight: 800;
            border: none;
            box-shadow: 0 0 18px rgba(52,208,88,0.4);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 28px rgba(52,208,88,0.7); }
        .btn-primary::after {
            content: ""; position: absolute; top: 0; left: -120%;
            width: 60%; height: 100%;
            background: linear-gradient(120deg, transparent, rgba(255,255,255,0.55), transparent);
            transform: skewX(-20deg);
            animation: shimmer 3.5s ease-in-out infinite;
        }
        @keyframes shimmer { 0%, 60% { left: -120%; } 100% { left: 140%; } }

        .btn-gold {
            background: linear-gradient(120deg, var(--gold), var(--orange));
            color: #2a1500; font-weight: 800; border: none;
            box-shadow: 0 0 16px rgba(245,165,36,0.4);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 0 26px rgba(245,165,36,0.7); }

        .btn-ghost {
            background: rgba(124,255,79,0.06);
            border: 1px solid var(--border);
            color: var(--text);
            transition: all 0.2s;
        }
        .btn-ghost:hover { border-color: var(--green); color: var(--green-bright); background: rgba(124,255,79,0.12); }

        /* ---------- Inputs ---------- */
        .inp {
            background: rgba(4, 10, 7, 0.7);
            border: 1px solid var(--border);
            color: var(--text);
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .inp:focus { outline: none; border-color: var(--green); box-shadow: 0 0 0 3px rgba(52,208,88,0.18); }

        /* ---------- Status dot ---------- */
        .dot { position: relative; }
        .dot::after {
            content: ""; position: absolute; inset: -4px; border-radius: 50%;
            border: 1px solid currentColor; opacity: 0.5;
            animation: ping 1.8s cubic-bezier(0,0,0.2,1) infinite;
        }
        @keyframes ping { 0% { transform: scale(0.8); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }

        /* ---------- Misc ---------- */
        .chart-container { position: relative; height: 300px; width: 100%; }
        .stat-num { font-family: 'Orbitron', sans-serif; }
        .divider-glow { height: 1px; background: linear-gradient(90deg, transparent, var(--green), transparent); opacity: 0.5; }

        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: var(--bg-2); }
        ::-webkit-scrollbar-thumb { background: linear-gradient(var(--green), var(--gold)); border-radius: 8px; }

        .tr-row { transition: background 0.2s; }
        .tr-row:hover { background: rgba(52, 208, 88, 0.07); }

        .rise { animation: rise 0.6s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

/* Tailwind CSS */
*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}

::backdrop {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}

/*
! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com
*/

/*
1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)
2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)
*/

*,
::before,
::after {
  box-sizing: border-box;
  /* 1 */
  border-width: 0;
  /* 2 */
  border-style: solid;
  /* 2 */
  border-color: #e5e7eb;
  /* 2 */
}

::before,
::after {
  --tw-content: '';
}

/*
1. Use a consistent sensible line-height in all browsers.
2. Prevent adjustments of font size after orientation changes in iOS.
3. Use a more readable tab size.
4. Use the user's configured \`sans\` font-family by default.
5. Use the user's configured \`sans\` font-feature-settings by default.
6. Use the user's configured \`sans\` font-variation-settings by default.
7. Disable tap highlights on iOS
*/

html,
:host {
  line-height: 1.5;
  /* 1 */
  -webkit-text-size-adjust: 100%;
  /* 2 */
  -moz-tab-size: 4;
  /* 3 */
  -o-tab-size: 4;
     tab-size: 4;
  /* 3 */
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  /* 4 */
  font-feature-settings: normal;
  /* 5 */
  font-variation-settings: normal;
  /* 6 */
  -webkit-tap-highlight-color: transparent;
  /* 7 */
}

/*
1. Remove the margin in all browsers.
2. Inherit line-height from \`html\` so users can set them as a class directly on the \`html\` element.
*/

body {
  margin: 0;
  /* 1 */
  line-height: inherit;
  /* 2 */
}

/*
1. Add the correct height in Firefox.
2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)
3. Ensure horizontal rules are visible by default.
*/

hr {
  height: 0;
  /* 1 */
  color: inherit;
  /* 2 */
  border-top-width: 1px;
  /* 3 */
}

/*
Add the correct text decoration in Chrome, Edge, and Safari.
*/

abbr:where([title]) {
  -webkit-text-decoration: underline dotted;
          text-decoration: underline dotted;
}

/*
Remove the default font size and weight for headings.
*/

h1,
h2,
h3,
h4,
h5,
h6 {
  font-size: inherit;
  font-weight: inherit;
}

/*
Reset links to optimize for opt-in styling instead of opt-out.
*/

a {
  color: inherit;
  text-decoration: inherit;
}

/*
Add the correct font weight in Edge and Safari.
*/

b,
strong {
  font-weight: bolder;
}

/*
1. Use the user's configured \`mono\` font-family by default.
2. Use the user's configured \`mono\` font-feature-settings by default.
3. Use the user's configured \`mono\` font-variation-settings by default.
4. Correct the odd \`em\` font sizing in all browsers.
*/

code,
kbd,
samp,
pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  /* 1 */
  font-feature-settings: normal;
  /* 2 */
  font-variation-settings: normal;
  /* 3 */
  font-size: 1em;
  /* 4 */
}

/*
Add the correct font size in all browsers.
*/

small {
  font-size: 80%;
}

/*
Prevent \`sub\` and \`sup\` elements from affecting the line height in all browsers.
*/

sub,
sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

sub {
  bottom: -0.25em;
}

sup {
  top: -0.5em;
}

/*
1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)
2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)
3. Remove gaps between table borders by default.
*/

table {
  text-indent: 0;
  /* 1 */
  border-color: inherit;
  /* 2 */
  border-collapse: collapse;
  /* 3 */
}

/*
1. Change the font styles in all browsers.
2. Remove the margin in Firefox and Safari.
3. Remove default padding in all browsers.
*/

button,
input,
optgroup,
select,
textarea {
  font-family: inherit;
  /* 1 */
  font-feature-settings: inherit;
  /* 1 */
  font-variation-settings: inherit;
  /* 1 */
  font-size: 100%;
  /* 1 */
  font-weight: inherit;
  /* 1 */
  line-height: inherit;
  /* 1 */
  letter-spacing: inherit;
  /* 1 */
  color: inherit;
  /* 1 */
  margin: 0;
  /* 2 */
  padding: 0;
  /* 3 */
}

/*
Remove the inheritance of text transform in Edge and Firefox.
*/

button,
select {
  text-transform: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Remove default button styles.
*/

button,
input:where([type='button']),
input:where([type='reset']),
input:where([type='submit']) {
  -webkit-appearance: button;
  /* 1 */
  background-color: transparent;
  /* 2 */
  background-image: none;
  /* 2 */
}

/*
Use the modern Firefox focus style for all focusable elements.
*/

:-moz-focusring {
  outline: auto;
}

/*
Remove the additional \`:invalid\` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)
*/

:-moz-ui-invalid {
  box-shadow: none;
}

/*
Add the correct vertical alignment in Chrome and Firefox.
*/

progress {
  vertical-align: baseline;
}

/*
Correct the cursor style of increment and decrement buttons in Safari.
*/

::-webkit-inner-spin-button,
::-webkit-outer-spin-button {
  height: auto;
}

/*
1. Correct the odd appearance in Chrome and Safari.
2. Correct the outline style in Safari.
*/

[type='search'] {
  -webkit-appearance: textfield;
  /* 1 */
  outline-offset: -2px;
  /* 2 */
}

/*
Remove the inner padding in Chrome and Safari on macOS.
*/

::-webkit-search-decoration {
  -webkit-appearance: none;
}

/*
1. Correct the inability to style clickable types in iOS and Safari.
2. Change font properties to \`inherit\` in Safari.
*/

::-webkit-file-upload-button {
  -webkit-appearance: button;
  /* 1 */
  font: inherit;
  /* 2 */
}

/*
Add the correct display in Chrome and Safari.
*/

summary {
  display: list-item;
}

/*
Removes the default spacing and border for appropriate elements.
*/

blockquote,
dl,
dd,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
figure,
p,
pre {
  margin: 0;
}

fieldset {
  margin: 0;
  padding: 0;
}

legend {
  padding: 0;
}

ol,
ul,
menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

/*
Reset default styling for dialogs.
*/

dialog {
  padding: 0;
}

/*
Prevent resizing textareas horizontally by default.
*/

textarea {
  resize: vertical;
}

/*
1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)
2. Set the default placeholder color to the user's configured gray 400 color.
*/

input::-moz-placeholder, textarea::-moz-placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

input::placeholder,
textarea::placeholder {
  opacity: 1;
  /* 1 */
  color: #9ca3af;
  /* 2 */
}

/*
Set the default cursor for buttons.
*/

button,
[role="button"] {
  cursor: pointer;
}

/*
Make sure disabled buttons don't get the pointer cursor.
*/

:disabled {
  cursor: default;
}

/*
1. Make replaced elements \`display: block\` by default. (https://github.com/mozdevs/cssremedy/issues/14)
2. Add \`vertical-align: middle\` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)
   This can trigger a poorly considered lint error in some tools but is included by design.
*/

img,
svg,
video,
canvas,
audio,
iframe,
embed,
object {
  display: block;
  /* 1 */
  vertical-align: middle;
  /* 2 */
}

/*
Constrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)
*/

img,
video {
  max-width: 100%;
  height: auto;
}

/* Make elements with the HTML hidden attribute stay hidden by default */

[hidden]:where(:not([hidden="until-found"])) {
  display: none;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.mb-10 {
  margin-bottom: 2.5rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-5 {
  margin-bottom: 1.25rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.mr-1 {
  margin-right: 0.25rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-3 {
  margin-top: 0.75rem;
}

.mt-4 {
  margin-top: 1rem;
}

.block {
  display: block;
}

.flex {
  display: flex;
}

.table {
  display: table;
}

.grid {
  display: grid;
}

.h-16 {
  height: 4rem;
}

.h-2\\.5 {
  height: 0.625rem;
}

.min-h-screen {
  min-height: 100vh;
}

.w-16 {
  width: 4rem;
}

.w-2\\.5 {
  width: 0.625rem;
}

.w-full {
  width: 100%;
}

.min-w-0 {
  min-width: 0px;
}

.min-w-\\[200px\\] {
  min-width: 200px;
}

.min-w-\\[300px\\] {
  min-width: 300px;
}

.max-w-6xl {
  max-width: 72rem;
}

.max-w-md {
  max-width: 28rem;
}

.flex-1 {
  flex: 1 1 0%;
}

.flex-\\[2\\] {
  flex: 2;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.flex-col {
  flex-direction: column;
}

.flex-wrap {
  flex-wrap: wrap;
}

.items-end {
  align-items: flex-end;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}

.gap-4 {
  gap: 1rem;
}

.gap-6 {
  gap: 1.5rem;
}

.gap-8 {
  gap: 2rem;
}

.overflow-auto {
  overflow: auto;
}

.overflow-x-auto {
  overflow-x: auto;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rounded {
  border-radius: 0.25rem;
}

.rounded-full {
  border-radius: 9999px;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.rounded-md {
  border-radius: 0.375rem;
}

.rounded-xl {
  border-radius: 0.75rem;
}

.border {
  border-width: 1px;
}

.bg-green-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(74 222 128 / var(--tw-bg-opacity, 1));
}

.bg-orange-400 {
  --tw-bg-opacity: 1;
  background-color: rgb(251 146 60 / var(--tw-bg-opacity, 1));
}

.bg-red-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity, 1));
}

.object-cover {
  -o-object-fit: cover;
     object-fit: cover;
}

.p-2 {
  padding: 0.5rem;
}

.p-3 {
  padding: 0.75rem;
}

.p-4 {
  padding: 1rem;
}

.p-6 {
  padding: 1.5rem;
}

.p-8 {
  padding: 2rem;
}

.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}

.px-3 {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.px-6 {
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.py-0\\.5 {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.py-1\\.5 {
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.py-20 {
  padding-top: 5rem;
  padding-bottom: 5rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

.font-sans {
  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
}

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.text-\\[10px\\] {
  font-size: 10px;
}

.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-xl {
  font-size: 1.25rem;
  line-height: 1.75rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.font-bold {
  font-weight: 700;
}

.font-medium {
  font-weight: 500;
}

.font-semibold {
  font-weight: 600;
}

.uppercase {
  text-transform: uppercase;
}

.tracking-\\[0\\.25em\\] {
  letter-spacing: 0.25em;
}

.tracking-tight {
  letter-spacing: -0.025em;
}

.tracking-wide {
  letter-spacing: 0.025em;
}

.tracking-wider {
  letter-spacing: 0.05em;
}

.tracking-widest {
  letter-spacing: 0.1em;
}

.text-green-400 {
  --tw-text-opacity: 1;
  color: rgb(74 222 128 / var(--tw-text-opacity, 1));
}

.text-orange-400 {
  --tw-text-opacity: 1;
  color: rgb(251 146 60 / var(--tw-text-opacity, 1));
}

.text-red-400 {
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity, 1));
}

.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity, 1));
}

.ring {
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
}

.blur {
  --tw-blur: blur(8px);
  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);
}

.hover\\:text-red-300:hover {
  --tw-text-opacity: 1;
  color: rgb(252 165 165 / var(--tw-text-opacity, 1));
}

@media (min-width: 768px) {
  .md\\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .md\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .md\\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

</style>
</head>
<body>
    <div id="root"></div>

    <script>
const {
  useState,
  useEffect
} = React;
const StatusCard = ({
  label,
  value,
  state
}) => {
  const dotColor = state === 'ok' ? 'text-green-400 bg-green-400' : state === 'ko' ? 'text-red-500 bg-red-500' : 'text-orange-400 bg-orange-400';
  return /*#__PURE__*/React.createElement("div", {
    className: "glass glass-hover p-4 rise"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-muted text-xs uppercase tracking-widest font-display"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-semibold mt-3 flex items-center text-cream"
  }, state && /*#__PURE__*/React.createElement("span", {
    className: "dot w-2.5 h-2.5 rounded-full mr-2 " + dotColor
  }), value));
};
const Equalizer = () => /*#__PURE__*/React.createElement("span", {
  className: "eq",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null));
const Emblem = () => /*#__PURE__*/React.createElement("span", {
  className: "emblem",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("span", {
  className: "ring"
}), /*#__PURE__*/React.createElement("span", {
  className: "ring slow"
}), /*#__PURE__*/React.createElement("span", {
  className: "core"
}));
const Particles = () => /*#__PURE__*/React.createElement("div", {
  className: "fx-particles",
  "aria-hidden": "true"
}, Array.from({
  length: 14
}).map((_, i) => /*#__PURE__*/React.createElement("i", {
  key: i,
  style: {
    left: i * 7 + 3 + '%',
    animationDuration: 9 + i % 5 * 2.5 + 's',
    animationDelay: i * 0.9 + 's',
    background: i % 3 === 0 ? '#f5a524' : '#7cff4f',
    boxShadow: '0 0 8px ' + (i % 3 === 0 ? '#f5a524' : '#7cff4f')
  }
})));
const StatsView = ({
  stats
}) => {
  const chartRefs = {
    sources: React.useRef(null),
    visibility: React.useRef(null),
    top: React.useRef(null),
    searches: React.useRef(null)
  };
  useEffect(() => {
    if (!stats) return;
    const charts = [];

    // Sources Chart
    const sourceCtx = chartRefs.sources.current.getContext('2d');
    charts.push(new Chart(sourceCtx, {
      type: 'pie',
      data: {
        labels: Object.keys(stats.trackSources),
        datasets: [{
          data: Object.values(stats.trackSources),
          backgroundColor: ['#7cff4f', '#f5a524', '#34d058', '#f97316', '#f3e9ce'],
          borderColor: '#0c150f',
          borderWidth: 3
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#8aa090'
            }
          }
        }
      }
    }));

    // Visibility Chart
    const visCtx = chartRefs.visibility.current.getContext('2d');
    charts.push(new Chart(visCtx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(stats.playlistVisibility),
        datasets: [{
          data: Object.values(stats.playlistVisibility),
          backgroundColor: ['#34d058', '#f5a524'],
          borderColor: '#0c150f',
          borderWidth: 3
        }]
      },
      options: {
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#8aa090'
            }
          }
        }
      }
    }));

    // Top Tracks
    const topCtx = chartRefs.top.current.getContext('2d');
    charts.push(new Chart(topCtx, {
      type: 'bar',
      data: {
        labels: stats.topTracks.map(t => t.title.substring(0, 15) + '...'),
        datasets: [{
          label: 'Écoutes',
          data: stats.topTracks.map(t => t.count),
          backgroundColor: '#f5a524',
          hoverBackgroundColor: '#f97316',
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            grid: {
              color: 'rgba(52,208,88,0.12)'
            },
            ticks: {
              color: '#8aa090'
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: '#8aa090'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    }));

    // Top Searches
    if (stats.topSearches && chartRefs.searches.current) {
      const searchCtx = chartRefs.searches.current.getContext('2d');
      charts.push(new Chart(searchCtx, {
        type: 'bar',
        data: {
          labels: stats.topSearches.map(s => s.query),
          datasets: [{
            label: 'Recherches',
            data: stats.topSearches.map(s => s.count),
            backgroundColor: '#34d058',
            hoverBackgroundColor: '#7cff4f',
            borderRadius: 8
          }]
        },
        options: {
          indexAxis: 'y',
          scales: {
            x: {
              grid: {
                color: 'rgba(52,208,88,0.12)'
              },
              ticks: {
                color: '#8aa090'
              }
            },
            y: {
              grid: {
                display: false
              },
              ticks: {
                color: '#8aa090'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      }));
    }
    return () => {
      charts.forEach(c => c.destroy());
    };
  }, [stats]);
  if (!stats) return /*#__PURE__*/React.createElement("div", {
    className: "text-center py-20 text-muted animate__animated animate__fadeIn"
  }, "Chargement des statistiques...");
  return /*#__PURE__*/React.createElement("div", {
    className: "animate__animated animate__fadeIn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mb-8"
  }, /*#__PURE__*/React.createElement(Equalizer, null), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-bold font-display neon-green"
  }, "Tableau de Bord Analytique")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass glass-hover p-6 rise"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-muted text-sm uppercase font-semibold tracking-wide"
  }, "Total Utilisateurs"), /*#__PURE__*/React.createElement("div", {
    className: "text-4xl font-bold mt-2 stat-num neon-green"
  }, stats.counts.profiles), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-muted mt-1"
  }, "Utilisateurs inscrits")), /*#__PURE__*/React.createElement("div", {
    className: "glass glass-hover p-6 rise",
    style: {
      animationDelay: '0.08s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-muted text-sm uppercase font-semibold tracking-wide"
  }, "Biblioth\\xE8que"), /*#__PURE__*/React.createElement("div", {
    className: "text-4xl font-bold mt-2 stat-num neon-gold"
  }, stats.counts.tracks), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-muted mt-1"
  }, "Titres import\\xE9s")), /*#__PURE__*/React.createElement("div", {
    className: "glass glass-hover p-6 rise",
    style: {
      animationDelay: '0.16s'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-muted text-sm uppercase font-semibold tracking-wide"
  }, "Playlists"), /*#__PURE__*/React.createElement("div", {
    className: "text-4xl font-bold mt-2 stat-num neon-green"
  }, stats.counts.playlists), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-muted mt-1"
  }, "Playlists cr\\xE9\\xE9es"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass p-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold mb-6 text-cream"
  }, "Sources des Titres"), /*#__PURE__*/React.createElement("div", {
    className: "chart-container"
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: chartRefs.sources
  }))), /*#__PURE__*/React.createElement("div", {
    className: "glass p-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold mb-6 text-cream"
  }, "Visibilit\\xE9 des Playlists"), /*#__PURE__*/React.createElement("div", {
    className: "chart-container"
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: chartRefs.visibility
  })))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "glass p-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold mb-6 text-cream"
  }, "Top 5 - Titres \\xE9cout\\xE9s"), /*#__PURE__*/React.createElement("div", {
    className: "chart-container",
    style: {
      height: '250px'
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: chartRefs.top
  }))), /*#__PURE__*/React.createElement("div", {
    className: "glass p-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold mb-6 text-cream"
  }, "Top 5 - Recherches populaires"), /*#__PURE__*/React.createElement("div", {
    className: "chart-container",
    style: {
      height: '250px'
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: chartRefs.searches
  })))));
};
const App = () => {
  const [status, setStatus] = useState(null);
  const [pingResult, setPingResult] = useState(null);
  const [searchQuery, setSearchQuery] = useState('burna boy');
  const [searchResults, setSearchResults] = useState([]);
  const [library, setLibrary] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [stats, setStats] = useState(null);
  const [view, setView] = useState('status');
  const [adminKey, setAdminKey] = useState(localStorage.getItem('afrosound_admin_key') || '');
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    loadStatus();
    if (adminKey) checkAuth();
  }, []);
  const checkAuth = () => {
    setIsAuth(true);
    localStorage.setItem('afrosound_admin_key', adminKey);
  };
  const adminFetch = async (url, options = {}) => {
    const sep = url.includes('?') ? '&' : '?';
    const finalUrl = url + sep + 'key=' + adminKey;
    const res = await fetch(finalUrl, {
      ...options,
      headers: {
        ...options.headers,
        'x-admin-key': adminKey
      }
    });
    if (res.status === 401) {
      setIsAuth(false);
      throw new Error('Unauthorized');
    }
    return res;
  };
  const loadStatus = async () => {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error(e);
    }
  };
  const pingSupabase = async () => {
    setPingResult({
      type: 'Supabase',
      message: 'En cours...'
    });
    try {
      const res = await adminFetch('/api/admin/ping/supabase');
      const data = await res.json();
      setPingResult({
        type: 'Supabase',
        ...data
      });
    } catch (e) {
      setPingResult({
        type: 'Supabase',
        success: false,
        error: e.message
      });
    }
  };
  const pingAudio = async url => {
    if (!url) return alert('Entrez une URL');
    setPingResult({
      type: 'Audio',
      message: 'En cours...'
    });
    try {
      const res = await adminFetch('/api/admin/ping/audio?url=' + encodeURIComponent(url));
      const data = await res.json();
      setPingResult({
        type: 'Audio',
        ...data
      });
    } catch (e) {
      setPingResult({
        type: 'Audio',
        success: false,
        error: e.message
      });
    }
  };
  const doSearch = async () => {
    try {
      const res = await fetch('/api/audius/search?query=' + encodeURIComponent(searchQuery));
      const data = await res.json();
      setSearchResults(data || []);
      setView('search');
    } catch (e) {
      alert(e.message);
    }
  };
  const addToLibrary = async track => {
    try {
      const res = await adminFetch('/api/admin/tracks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: track.id,
          title: track.title,
          artist: track.artist,
          cover_url: track.cover,
          audio_url: track.audioUrl,
          source: track.source,
          duration: track.duration
        })
      });
      const d = await res.json();
      if (d.success) alert('Ajouté !');else alert('Erreur: ' + d.error);
    } catch (e) {
      alert(e.message);
    }
  };
  const loadLibrary = async () => {
    try {
      const res = await fetch('/api/songs');
      const data = await res.json();
      setLibrary(data || []);
      setView('library');
    } catch (e) {
      alert(e.message);
    }
  };
  const loadProfiles = async () => {
    try {
      const res = await adminFetch('/api/admin/profiles');
      const data = await res.json();
      setProfiles(data.data || []);
      setView('profiles');
    } catch (e) {
      alert(e.message);
    }
  };
  const loadPlaylists = async () => {
    try {
      const res = await adminFetch('/api/admin/playlists');
      const data = await res.json();
      setPlaylists(data.data || []);
      setView('playlists');
    } catch (e) {
      alert(e.message);
    }
  };
  const loadStats = async () => {
    try {
      setView('stats');
      const res = await adminFetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (e) {
      alert(e.message);
    }
  };
  const deleteTrack = async id => {
    if (!confirm('Supprimer ce titre ?')) return;
    try {
      await adminFetch('/api/admin/tracks/' + id, {
        method: 'DELETE'
      });
      loadLibrary();
    } catch (e) {
      alert(e.message);
    }
  };
  const deletePlaylist = async id => {
    if (!confirm('Supprimer cette playlist ?')) return;
    try {
      await adminFetch('/api/admin/playlists/' + id, {
        method: 'DELETE'
      });
      loadPlaylists();
    } catch (e) {
      alert(e.message);
    }
  };
  if (!isAuth) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "fx-bg"
    }), /*#__PURE__*/React.createElement("div", {
      className: "fx-grid"
    }), /*#__PURE__*/React.createElement("div", {
      className: "fx-scan"
    }), /*#__PURE__*/React.createElement(Particles, null), /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen flex items-center justify-center p-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "glass p-8 w-full max-w-md rise"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-4 mb-5"
    }, /*#__PURE__*/React.createElement(Emblem, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      className: "text-2xl font-bold font-display title-flicker"
    }, "AFRO ", /*#__PURE__*/React.createElement("span", {
      className: "neon-green"
    }, "SOUND")), /*#__PURE__*/React.createElement("p", {
      className: "text-muted text-xs uppercase tracking-[0.25em]"
    }, "Acc\\xE8s Admin"))), /*#__PURE__*/React.createElement("p", {
      className: "text-muted text-sm mb-6"
    }, "Veuillez entrer votre cl\\xE9 d'administration pour continuer."), /*#__PURE__*/React.createElement("input", {
      type: "password",
      value: adminKey,
      onChange: e => setAdminKey(e.target.value),
      onKeyDown: e => e.key === 'Enter' && checkAuth(),
      className: "inp w-full rounded-xl px-4 py-3 mb-4",
      placeholder: "Cl\\xE9 secr\\xE8te"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: checkAuth,
      className: "btn-primary w-full py-3 rounded-xl"
    }, "Se connecter"))));
  }
  const navItems = [{
    key: 'status',
    label: 'Dashboard',
    action: () => setView('status')
  }, {
    key: 'stats',
    label: 'Statistiques',
    action: loadStats
  }, {
    key: 'library',
    label: 'Bibliothèque',
    action: loadLibrary
  }, {
    key: 'profiles',
    label: 'Utilisateurs',
    action: loadProfiles
  }, {
    key: 'playlists',
    label: 'Playlists',
    action: loadPlaylists
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "fx-bg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fx-grid"
  }), /*#__PURE__*/React.createElement("div", {
    className: "fx-scan"
  }), /*#__PURE__*/React.createElement(Particles, null), /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col"
  }, /*#__PURE__*/React.createElement("header", {
    className: "px-6 py-4 flex items-center justify-between",
    style: {
      borderBottom: '1px solid var(--border)',
      background: 'rgba(6,10,7,0.55)',
      backdropFilter: 'blur(10px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement(Emblem, null), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-xl font-bold font-display tracking-tight title-flicker"
  }, "AFRO ", /*#__PURE__*/React.createElement("span", {
    className: "neon-green"
  }, "SOUND"), " ", /*#__PURE__*/React.createElement("span", {
    className: "text-muted text-sm font-sans"
  }, "/ Admin")), /*#__PURE__*/React.createElement("p", {
    className: "text-muted text-xs mt-1 tracking-wide"
  }, "Panel de gestion & monitoring"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement(Equalizer, null), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      localStorage.removeItem('afrosound_admin_key');
      setIsAuth(false);
    },
    className: "text-muted text-xs hover:text-cream mr-1"
  }, "D\\xE9connexion"), /*#__PURE__*/React.createElement("button", {
    onClick: loadStatus,
    className: "btn-ghost px-4 py-2 rounded-lg text-sm font-semibold"
  }, "Rafra\\xEEchir"))), /*#__PURE__*/React.createElement("nav", {
    className: "px-6 py-3 flex gap-3 flex-wrap",
    style: {
      borderBottom: '1px solid var(--border)',
      background: 'rgba(10,20,16,0.5)'
    }
  }, navItems.map(item => /*#__PURE__*/React.createElement("button", {
    key: item.key,
    onClick: item.action,
    className: "nav-link px-4 py-1.5 rounded-lg text-sm font-medium " + (view === item.key ? 'nav-active' : 'text-muted')
  }, item.label))), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 p-6 max-w-6xl mx-auto w-full"
  }, view === 'stats' && /*#__PURE__*/React.createElement(StatsView, {
    stats: stats
  }), view === 'status' && /*#__PURE__*/React.createElement("div", {
    className: "animate__animated animate__fadeIn"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "neon-green text-xs uppercase font-bold tracking-widest mb-4 font-display"
  }, "\\xC9tat du syst\\xE8me"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
  }, /*#__PURE__*/React.createElement(StatusCard, {
    label: "Backend",
    value: status ? "En ligne" : "Chargement...",
    state: status ? "ok" : "warn"
  }), /*#__PURE__*/React.createElement(StatusCard, {
    label: "Supabase",
    value: status?.env?.supabase ? "Configuré" : "Absent",
    state: status?.env?.supabase ? "ok" : "ko"
  }), /*#__PURE__*/React.createElement(StatusCard, {
    label: "Audius",
    value: status?.audiusReachable ? "Joignable" : "Indisponible",
    state: status?.audiusReachable ? "ok" : "ko"
  }), /*#__PURE__*/React.createElement(StatusCard, {
    label: "Node Version",
    value: status?.node || "---"
  })), /*#__PURE__*/React.createElement("div", {
    className: "divider-glow mb-8"
  }), /*#__PURE__*/React.createElement("h2", {
    className: "neon-green text-xs uppercase font-bold tracking-widest mb-4 font-display"
  }, "Diagnostics"), /*#__PURE__*/React.createElement("div", {
    className: "glass p-6 mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-4 items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-[200px]"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-muted mb-2"
  }, "Ping Supabase"), /*#__PURE__*/React.createElement("button", {
    onClick: pingSupabase,
    className: "btn-primary w-full py-2 rounded-lg"
  }, "Tester la DB")), /*#__PURE__*/React.createElement("div", {
    className: "flex-[2] min-w-[300px]"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-muted mb-2"
  }, "Ping Audio"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    id: "audio-url-input",
    type: "text",
    className: "inp flex-1 rounded-lg px-3 py-2 text-sm",
    placeholder: "URL du son..."
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => pingAudio(document.getElementById('audio-url-input').value),
    className: "btn-gold px-4 py-2 rounded-lg"
  }, "Tester")))), pingResult && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 p-4 rounded-lg",
    style: {
      background: 'rgba(4,10,7,0.7)',
      border: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-bold neon-gold mb-2"
  }, pingResult.type, " Result:"), /*#__PURE__*/React.createElement("pre", {
    className: "text-xs overflow-auto text-cream"
  }, JSON.stringify(pingResult, null, 2)))), /*#__PURE__*/React.createElement("h2", {
    className: "neon-green text-xs uppercase font-bold tracking-widest mb-4 font-display"
  }, "Importer des morceaux"), /*#__PURE__*/React.createElement("div", {
    className: "glass p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value),
    type: "text",
    className: "inp flex-1 rounded-lg px-3 py-2 text-sm",
    placeholder: "Artiste, titre..."
  }), /*#__PURE__*/React.createElement("button", {
    onClick: doSearch,
    className: "btn-primary px-6 py-2 rounded-lg"
  }, "Rechercher")))), view === 'search' && /*#__PURE__*/React.createElement("div", {
    className: "animate__animated animate__fadeIn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-6"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold font-display neon-green"
  }, "R\\xE9sultats Audius"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView('status'),
    className: "btn-ghost px-3 py-1.5 rounded-lg text-sm"
  }, "Retour")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  }, searchResults.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "glass glass-hover p-4 flex gap-4 rise"
  }, /*#__PURE__*/React.createElement("img", {
    src: t.cover,
    className: "w-16 h-16 rounded-lg object-cover",
    style: {
      background: 'var(--bg-2)'
    },
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold truncate text-cream"
  }, t.title), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-muted truncate"
  }, t.artist), /*#__PURE__*/React.createElement("button", {
    onClick: () => addToLibrary(t),
    className: "mt-2 text-xs font-bold px-3 py-1 rounded-md neon-green",
    style: {
      background: 'rgba(124,255,79,0.12)',
      border: '1px solid var(--green)'
    }
  }, "+ Ajouter")))))), view === 'library' && /*#__PURE__*/React.createElement("div", {
    className: "animate__animated animate__fadeIn"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold mb-6 font-display neon-green"
  }, "Biblioth\\xE8que Publique (", library.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "glass p-2 overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-left",
    style: {
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Titre"), /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Artiste"), /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Source"), /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, library.map(t => /*#__PURE__*/React.createElement("tr", {
    key: t.id,
    className: "tr-row",
    style: {
      borderBottom: '1px solid rgba(52,208,88,0.08)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    className: "p-3 font-medium text-cream"
  }, t.title), /*#__PURE__*/React.createElement("td", {
    className: "p-3 text-muted"
  }, t.artist), /*#__PURE__*/React.createElement("td", {
    className: "p-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded text-[10px] uppercase font-bold neon-gold",
    style: {
      background: 'rgba(245,165,36,0.12)'
    }
  }, t.source)), /*#__PURE__*/React.createElement("td", {
    className: "p-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => deleteTrack(t.id),
    className: "text-red-400 hover:text-red-300 text-sm"
  }, "Supprimer")))))))), view === 'profiles' && /*#__PURE__*/React.createElement("div", {
    className: "animate__animated animate__fadeIn"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold mb-6 font-display neon-green"
  }, "Utilisateurs (", profiles.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "glass p-2 overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-left",
    style: {
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "ID"), /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Username"), /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Inscrit le"))), /*#__PURE__*/React.createElement("tbody", null, profiles.map(p => /*#__PURE__*/React.createElement("tr", {
    key: p.id,
    className: "tr-row",
    style: {
      borderBottom: '1px solid rgba(52,208,88,0.08)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    className: "p-3 text-xs font-mono text-muted"
  }, p.id), /*#__PURE__*/React.createElement("td", {
    className: "p-3 font-medium text-cream"
  }, p.username || '---'), /*#__PURE__*/React.createElement("td", {
    className: "p-3 text-muted"
  }, new Date(p.created_at).toLocaleDateString()))))))), view === 'playlists' && /*#__PURE__*/React.createElement("div", {
    className: "animate__animated animate__fadeIn"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold mb-6 font-display neon-green"
  }, "Playlists (", playlists.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "glass p-2 overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-left",
    style: {
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Nom"), /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Propri\\xE9taire"), /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Visibilit\\xE9"), /*#__PURE__*/React.createElement("th", {
    className: "p-3 text-xs text-muted uppercase tracking-wider"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, playlists.map(p => /*#__PURE__*/React.createElement("tr", {
    key: p.id,
    className: "tr-row",
    style: {
      borderBottom: '1px solid rgba(52,208,88,0.08)'
    }
  }, /*#__PURE__*/React.createElement("td", {
    className: "p-3 font-medium text-cream"
  }, p.name), /*#__PURE__*/React.createElement("td", {
    className: "p-3 text-muted"
  }, p.profiles?.username || p.user_id), /*#__PURE__*/React.createElement("td", {
    className: "p-3"
  }, p.is_public ? /*#__PURE__*/React.createElement("span", {
    className: "neon-green text-xs font-semibold"
  }, "Publique") : /*#__PURE__*/React.createElement("span", {
    className: "text-muted text-xs"
  }, "Priv\\xE9e")), /*#__PURE__*/React.createElement("td", {
    className: "p-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => deletePlaylist(p.id),
    className: "text-red-400 hover:text-red-300 text-sm"
  }, "Supprimer"))))))))), /*#__PURE__*/React.createElement("footer", {
    className: "p-6 text-center text-muted text-xs",
    style: {
      borderTop: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "neon-green font-display"
  }, "AFRO SOUND"), " \\xA9 2026 \\u2014 Panel servi par le backend Vercel")));
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(App, null));

</script>
</body>
</html>`;