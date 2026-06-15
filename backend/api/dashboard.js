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

        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #0b1020; color: #e9edf2; overflow-x: hidden; }
        .primary-orange { color: #F97316; }
        .bg-primary-orange { background-color: #F97316; }
        .border-primary-orange { border-color: #F97316; }
        .card-hover:hover { transform: translateY(-5px); transition: all 0.3s ease; border-color: #F97316; }
        .nav-link { transition: all 0.2s ease; }
        .nav-link:hover { color: #F97316; }
        .chart-container { position: relative; height: 300px; width: 100%; }

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

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.mr-2 {
  margin-right: 0.5rem;
}

.mr-4 {
  margin-right: 1rem;
}

.mt-1 {
  margin-top: 0.25rem;
}

.mt-2 {
  margin-top: 0.5rem;
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

.h-2\.5 {
  height: 0.625rem;
}

.min-h-screen {
  min-height: 100vh;
}

.w-16 {
  width: 4rem;
}

.w-2\.5 {
  width: 0.625rem;
}

.w-full {
  width: 100%;
}

.min-w-0 {
  min-width: 0px;
}

.min-w-\[200px\] {
  min-width: 200px;
}

.min-w-\[300px\] {
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

.flex-\[2\] {
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

.rounded-2xl {
  border-radius: 1rem;
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

.border-b {
  border-bottom-width: 1px;
}

.border-t {
  border-top-width: 1px;
}

.border-\[\#262b33\] {
  --tw-border-opacity: 1;
  border-color: rgb(38 43 51 / var(--tw-border-opacity, 1));
}

.bg-\[\#0b1020\] {
  --tw-bg-opacity: 1;
  background-color: rgb(11 16 32 / var(--tw-bg-opacity, 1));
}

.bg-\[\#16191f\] {
  --tw-bg-opacity: 1;
  background-color: rgb(22 25 31 / var(--tw-bg-opacity, 1));
}

.bg-\[\#222831\] {
  --tw-bg-opacity: 1;
  background-color: rgb(34 40 49 / var(--tw-bg-opacity, 1));
}

.bg-gray-800 {
  --tw-bg-opacity: 1;
  background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1));
}

.bg-green-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1));
}

.bg-orange-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(249 115 22 / var(--tw-bg-opacity, 1));
}

.bg-red-500 {
  --tw-bg-opacity: 1;
  background-color: rgb(239 68 68 / var(--tw-bg-opacity, 1));
}

.bg-white {
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));
}

.object-cover {
  -o-object-fit: cover;
     object-fit: cover;
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

.py-0\.5 {
  padding-top: 0.125rem;
  padding-bottom: 0.125rem;
}

.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
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

.pb-3 {
  padding-bottom: 0.75rem;
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

.text-2xl {
  font-size: 1.5rem;
  line-height: 2rem;
}

.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.text-\[10px\] {
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

.tracking-tight {
  letter-spacing: -0.025em;
}

.tracking-wider {
  letter-spacing: 0.05em;
}

.tracking-widest {
  letter-spacing: 0.1em;
}

.text-black {
  --tw-text-opacity: 1;
  color: rgb(0 0 0 / var(--tw-text-opacity, 1));
}

.text-blue-500 {
  --tw-text-opacity: 1;
  color: rgb(59 130 246 / var(--tw-text-opacity, 1));
}

.text-gray-400 {
  --tw-text-opacity: 1;
  color: rgb(156 163 175 / var(--tw-text-opacity, 1));
}

.text-gray-500 {
  --tw-text-opacity: 1;
  color: rgb(107 114 128 / var(--tw-text-opacity, 1));
}

.text-gray-600 {
  --tw-text-opacity: 1;
  color: rgb(75 85 99 / var(--tw-text-opacity, 1));
}

.text-green-500 {
  --tw-text-opacity: 1;
  color: rgb(34 197 94 / var(--tw-text-opacity, 1));
}

.text-red-500 {
  --tw-text-opacity: 1;
  color: rgb(239 68 68 / var(--tw-text-opacity, 1));
}

.shadow-2xl {
  --tw-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.shadow-lg {
  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}

.transition {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.hover\:bg-\[\#16191f\]:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(22 25 31 / var(--tw-bg-opacity, 1));
}

.hover\:bg-\[\#2c333d\]:hover {
  --tw-bg-opacity: 1;
  background-color: rgb(44 51 61 / var(--tw-bg-opacity, 1));
}

.hover\:text-red-400:hover {
  --tw-text-opacity: 1;
  color: rgb(248 113 113 / var(--tw-text-opacity, 1));
}

.hover\:text-white:hover {
  --tw-text-opacity: 1;
  color: rgb(255 255 255 / var(--tw-text-opacity, 1));
}

.hover\:opacity-90:hover {
  opacity: 0.9;
}

.focus\:outline-none:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
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
  const dotColor = state === 'ok' ? 'bg-green-500' : state === 'ko' ? 'bg-red-500' : 'bg-orange-500';
  return /*#__PURE__*/React.createElement("div", {
    className: "bg-[#16191f] border border-[#262b33] rounded-xl p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-gray-400 text-xs uppercase tracking-wider"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "text-lg font-semibold mt-2 flex items-center"
  }, state && /*#__PURE__*/React.createElement("span", {
    className: "w-2.5 h-2.5 rounded-full mr-2 " + dotColor
  }), value));
};
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
          backgroundColor: ['#F97316', '#3b82f6', '#10b981', '#f59e0b', '#6366f1'],
          borderWidth: 0
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#9ca3af'
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
          backgroundColor: ['#10b981', '#ef4444'],
          borderWidth: 0
        }]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#9ca3af'
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
          backgroundColor: '#F97316',
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            grid: {
              color: '#262b33'
            },
            ticks: {
              color: '#9ca3af'
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              color: '#9ca3af'
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
            backgroundColor: '#10b981',
            borderRadius: 8
          }]
        },
        options: {
          indexAxis: 'y',
          scales: {
            x: {
              grid: {
                color: '#262b33'
              },
              ticks: {
                color: '#9ca3af'
              }
            },
            y: {
              grid: {
                display: false
              },
              ticks: {
                color: '#9ca3af'
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
    className: "text-center py-20 text-gray-500 animate__animated animate__fadeIn"
  }, "Chargement des statistiques...");
  return /*#__PURE__*/React.createElement("div", {
    className: "animate__animated animate__fadeIn"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-bold mb-8"
  }, "Tableau de Bord Analytique"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg card-hover"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-gray-400 text-sm uppercase font-semibold"
  }, "Total Utilisateurs"), /*#__PURE__*/React.createElement("div", {
    className: "text-4xl font-bold mt-2 primary-orange"
  }, stats.counts.profiles), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-500 mt-1"
  }, "Utilisateurs inscrits")), /*#__PURE__*/React.createElement("div", {
    className: "bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg card-hover"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-gray-400 text-sm uppercase font-semibold"
  }, "Biblioth\xE8que"), /*#__PURE__*/React.createElement("div", {
    className: "text-4xl font-bold mt-2 text-blue-500"
  }, stats.counts.tracks), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-500 mt-1"
  }, "Titres import\xE9s")), /*#__PURE__*/React.createElement("div", {
    className: "bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg card-hover"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-gray-400 text-sm uppercase font-semibold"
  }, "Playlists"), /*#__PURE__*/React.createElement("div", {
    className: "text-4xl font-bold mt-2 text-green-500"
  }, stats.counts.playlists), /*#__PURE__*/React.createElement("div", {
    className: "text-xs text-gray-500 mt-1"
  }, "Playlists cr\xE9\xE9es"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold mb-6"
  }, "Sources des Titres"), /*#__PURE__*/React.createElement("div", {
    className: "chart-container"
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: chartRefs.sources
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold mb-6"
  }, "Visibilit\xE9 des Playlists"), /*#__PURE__*/React.createElement("div", {
    className: "chart-container"
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: chartRefs.visibility
  })))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold mb-6"
  }, "Top 5 - Titres \xE9cout\xE9s"), /*#__PURE__*/React.createElement("div", {
    className: "chart-container",
    style: {
      height: '250px'
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: chartRefs.top
  }))), /*#__PURE__*/React.createElement("div", {
    className: "bg-[#16191f] border border-[#262b33] p-6 rounded-2xl shadow-lg"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "text-lg font-semibold mb-6"
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
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen flex items-center justify-center p-6"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bg-[#16191f] border border-[#262b33] p-8 rounded-2xl w-full max-w-md shadow-2xl"
    }, /*#__PURE__*/React.createElement("h1", {
      className: "text-2xl font-bold mb-2"
    }, "Acc\xE8s Admin"), /*#__PURE__*/React.createElement("p", {
      className: "text-gray-400 text-sm mb-6"
    }, "Veuillez entrer votre cl\xE9 d'administration pour continuer."), /*#__PURE__*/React.createElement("input", {
      type: "password",
      value: adminKey,
      onChange: e => setAdminKey(e.target.value),
      className: "w-full bg-[#0b1020] border border-[#262b33] rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-primary-orange",
      placeholder: "Cl\xE9 secr\xE8te"
    }), /*#__PURE__*/React.createElement("button", {
      onClick: checkAuth,
      className: "w-full bg-primary-orange text-black font-bold py-3 rounded-xl hover:opacity-90 transition"
    }, "Se connecter")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col"
  }, /*#__PURE__*/React.createElement("header", {
    className: "border-b border-[#262b33] px-6 py-4 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "text-xl font-bold tracking-tight"
  }, "AFRO ", /*#__PURE__*/React.createElement("span", {
    className: "primary-orange"
  }, "SOUND"), " - Admin"), /*#__PURE__*/React.createElement("p", {
    className: "text-gray-500 text-xs mt-1"
  }, "Panel de gestion & monitoring")), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      localStorage.removeItem('afrosound_admin_key');
      setIsAuth(false);
    },
    className: "text-gray-500 text-xs hover:text-white mr-4"
  }, "D\xE9connexion"), /*#__PURE__*/React.createElement("button", {
    onClick: loadStatus,
    className: "bg-[#222831] border border-[#262b33] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2c333d]"
  }, "Rafra\xEEchir"))), /*#__PURE__*/React.createElement("nav", {
    className: "bg-[#16191f] border-b border-[#262b33] px-6 py-2 flex gap-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setView('status'),
    className: "nav-link px-3 py-1 rounded-md text-sm " + (view === 'status' ? 'bg-primary-orange text-black' : 'text-gray-400')
  }, "Dashboard"), /*#__PURE__*/React.createElement("button", {
    onClick: loadStats,
    className: "nav-link px-3 py-1 rounded-md text-sm " + (view === 'stats' ? 'bg-primary-orange text-black' : 'text-gray-400')
  }, "Statistiques"), /*#__PURE__*/React.createElement("button", {
    onClick: loadLibrary,
    className: "nav-link px-3 py-1 rounded-md text-sm " + (view === 'library' ? 'bg-primary-orange text-black' : 'text-gray-400')
  }, "Biblioth\xE8que"), /*#__PURE__*/React.createElement("button", {
    onClick: loadProfiles,
    className: "nav-link px-3 py-1 rounded-md text-sm " + (view === 'profiles' ? 'bg-primary-orange text-black' : 'text-gray-400')
  }, "Utilisateurs"), /*#__PURE__*/React.createElement("button", {
    onClick: loadPlaylists,
    className: "nav-link px-3 py-1 rounded-md text-sm " + (view === 'playlists' ? 'bg-primary-orange text-black' : 'text-gray-400')
  }, "Playlists")), /*#__PURE__*/React.createElement("main", {
    className: "flex-1 p-6 max-w-6xl mx-auto w-full"
  }, view === 'stats' && /*#__PURE__*/React.createElement(StatsView, {
    stats: stats
  }), view === 'status' && /*#__PURE__*/React.createElement("div", {
    className: "animate__animated animate__fadeIn"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-gray-500 text-xs uppercase font-bold tracking-widest mb-4"
  }, "\xC9tat du syst\xE8me"), /*#__PURE__*/React.createElement("div", {
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
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-gray-500 text-xs uppercase font-bold tracking-widest mb-4"
  }, "Diagnostics"), /*#__PURE__*/React.createElement("div", {
    className: "bg-[#16191f] border border-[#262b33] rounded-xl p-6 mb-8"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-4 items-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-[200px]"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-2"
  }, "Ping Supabase"), /*#__PURE__*/React.createElement("button", {
    onClick: pingSupabase,
    className: "w-full bg-primary-orange text-black font-bold py-2 rounded-lg"
  }, "Tester la DB")), /*#__PURE__*/React.createElement("div", {
    className: "flex-[2] min-w-[300px]"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-xs text-gray-500 mb-2"
  }, "Ping Audio"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    id: "audio-url-input",
    type: "text",
    className: "flex-1 bg-[#0b1020] border border-[#262b33] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-orange",
    placeholder: "URL du son..."
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => pingAudio(document.getElementById('audio-url-input').value),
    className: "bg-white text-black font-bold px-4 py-2 rounded-lg"
  }, "Tester")))), pingResult && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 p-4 bg-[#0b1020] border border-[#262b33] rounded-lg"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-bold text-gray-400 mb-2"
  }, pingResult.type, " Result:"), /*#__PURE__*/React.createElement("pre", {
    className: "text-xs overflow-auto"
  }, JSON.stringify(pingResult, null, 2)))), /*#__PURE__*/React.createElement("h2", {
    className: "text-gray-500 text-xs uppercase font-bold tracking-widest mb-4"
  }, "Importer des morceaux"), /*#__PURE__*/React.createElement("div", {
    className: "bg-[#16191f] border border-[#262b33] rounded-xl p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("input", {
    value: searchQuery,
    onChange: e => setSearchQuery(e.target.value),
    type: "text",
    className: "flex-1 bg-[#0b1020] border border-[#262b33] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-orange",
    placeholder: "Artiste, titre..."
  }), /*#__PURE__*/React.createElement("button", {
    onClick: doSearch,
    className: "bg-primary-orange text-black font-bold px-6 py-2 rounded-lg"
  }, "Rechercher")))), view === 'search' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-6"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold"
  }, "R\xE9sultats Audius"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setView('status'),
    className: "text-sm text-gray-400 hover:text-white"
  }, "Retour")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
  }, searchResults.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: "bg-[#16191f] border border-[#262b33] p-4 rounded-xl flex gap-4"
  }, /*#__PURE__*/React.createElement("img", {
    src: t.cover,
    className: "w-16 h-16 rounded-lg object-cover bg-gray-800",
    alt: ""
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-semibold truncate"
  }, t.title), /*#__PURE__*/React.createElement("div", {
    className: "text-sm text-gray-400 truncate"
  }, t.artist), /*#__PURE__*/React.createElement("button", {
    onClick: () => addToLibrary(t),
    className: "mt-2 bg-primary-orange/20 text-primary-orange text-xs font-bold px-3 py-1 rounded-md border border-primary-orange/50 hover:bg-primary-orange/30"
  }, "\u2795 Ajouter")))))), view === 'library' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold mb-6"
  }, "Biblioth\xE8que Publique (", library.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-left border-b border-[#262b33]"
  }, /*#__PURE__*/React.createElement("th", {
    className: "pb-3 text-xs text-gray-500 uppercase"
  }, "Titre"), /*#__PURE__*/React.createElement("th", {
    className: "pb-3 text-xs text-gray-500 uppercase"
  }, "Artiste"), /*#__PURE__*/React.createElement("th", {
    className: "pb-3 text-xs text-gray-500 uppercase"
  }, "Source"), /*#__PURE__*/React.createElement("th", {
    className: "pb-3 text-xs text-gray-500 uppercase"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, library.map(t => /*#__PURE__*/React.createElement("tr", {
    key: t.id,
    className: "border-b border-[#262b33] hover:bg-[#16191f]"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-4 font-medium"
  }, t.title), /*#__PURE__*/React.createElement("td", {
    className: "py-4 text-gray-400"
  }, t.artist), /*#__PURE__*/React.createElement("td", {
    className: "py-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-gray-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold text-gray-400"
  }, t.source)), /*#__PURE__*/React.createElement("td", {
    className: "py-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => deleteTrack(t.id),
    className: "text-red-500 hover:text-red-400 text-sm"
  }, "Supprimer")))))))), view === 'profiles' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold mb-6"
  }, "Utilisateurs (", profiles.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-left border-b border-[#262b33]"
  }, /*#__PURE__*/React.createElement("th", {
    className: "pb-3 text-xs text-gray-500 uppercase"
  }, "ID"), /*#__PURE__*/React.createElement("th", {
    className: "pb-3 text-xs text-gray-500 uppercase"
  }, "Username"), /*#__PURE__*/React.createElement("th", {
    className: "pb-3 text-xs text-gray-500 uppercase"
  }, "Inscrit le"))), /*#__PURE__*/React.createElement("tbody", null, profiles.map(p => /*#__PURE__*/React.createElement("tr", {
    key: p.id,
    className: "border-b border-[#262b33] hover:bg-[#16191f]"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-4 text-xs font-mono text-gray-500"
  }, p.id), /*#__PURE__*/React.createElement("td", {
    className: "py-4 font-medium"
  }, p.username || '---'), /*#__PURE__*/React.createElement("td", {
    className: "py-4 text-gray-400"
  }, new Date(p.created_at).toLocaleDateString()))))))), view === 'playlists' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-bold mb-6"
  }, "Playlists (", playlists.length, ")"), /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto"
  }, /*#__PURE__*/React.createElement("table", {
    className: "w-full"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", {
    className: "text-left border-b border-[#262b33]"
  }, /*#__PURE__*/React.createElement("th", {
    className: "pb-3 text-xs text-gray-500 uppercase"
  }, "Nom"), /*#__PURE__*/React.createElement("th", {
    className: "pb-3 text-xs text-gray-500 uppercase"
  }, "Propri\xE9taire"), /*#__PURE__*/React.createElement("th", {
    className: "pb-3 text-xs text-gray-500 uppercase"
  }, "Visibilit\xE9"), /*#__PURE__*/React.createElement("th", {
    className: "pb-3 text-xs text-gray-500 uppercase"
  }, "Actions"))), /*#__PURE__*/React.createElement("tbody", null, playlists.map(p => /*#__PURE__*/React.createElement("tr", {
    key: p.id,
    className: "border-b border-[#262b33] hover:bg-[#16191f]"
  }, /*#__PURE__*/React.createElement("td", {
    className: "py-4 font-medium"
  }, p.name), /*#__PURE__*/React.createElement("td", {
    className: "py-4 text-gray-400"
  }, p.profiles?.username || p.user_id), /*#__PURE__*/React.createElement("td", {
    className: "py-4"
  }, p.is_public ? /*#__PURE__*/React.createElement("span", {
    className: "text-green-500 text-xs"
  }, "Publique") : /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 text-xs"
  }, "Priv\xE9e")), /*#__PURE__*/React.createElement("td", {
    className: "py-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => deletePlaylist(p.id),
    className: "text-red-500 hover:text-red-400 text-sm"
  }, "Supprimer"))))))))), /*#__PURE__*/React.createElement("footer", {
    className: "p-6 text-center text-gray-600 text-xs border-t border-[#262b33]"
  }, "AFRO SOUND \xA9 2026 - Panel servi par le backend Vercel"));
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(/*#__PURE__*/React.createElement(App, null));

</script>
</body>
</html>`;
