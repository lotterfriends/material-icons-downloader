# material-icons-downloader
Download current [material-design-icons](https://material.io/resources/icons/), because Google don't update there [Repository](https://github.com/google/material-design-icons).<br><br>
See: 
https://github.com/google/material-design-icons/issues/786



## Install

```bash
> npm i --save-dev material-icons-downloader
```

## Icon Download

Add the download script to your package.json, the paramater is the target folder.

```js
{
  "name": "...",
  "version": "1.0.0",
  "description": "",
  ...
  "scripts": {
    "dl-icons": "material-icons-downloader --scss --force src/assets/fonts/material-iconfont",
    "postdl-icons": "cp -u src/assets/fonts/material-iconfont/mat-icon-font.scss src/scss/mat-icon-font.scss"
  },
  "keywords": [],
  ...
}
```

## Options

```bash
-h/--help    show this help
-f/--force   force download and ignore the version
-q/--quiet   no output
-s/--scss    create a scss file instead of css file
```

## Usage

### Normal version
```html
<mat-icon>file_copy</mat-icon>
```
### Normal version with color
```html
<mat-icon color="warn">file_copy</mat-icon>
```
### Outline version
```html
<mat-icon fontSet="material-icons-outlined">file_copy</mat-icon>
```
### Two tone version
```html
<mat-icon fontSet="material-icons-two-tone">file_copy</mat-icon>
```

### Round version
```html
<mat-icon fontSet="material-icons-round">file_copy</mat-icon>
```

### Sharp version
```html
<mat-icon fontSet="material-icons-sharp">file_copy</mat-icon>
```

## Style
Add the Styles and replace `##PATH-TO-ICONS##` with the Path defined as parameter in `package.json`. You can also use the generated `mat-icon-font.css` or `mat-icon-font.scss` file.

```css

/**
 * fonts for material icons
 */

@font-face {
  font-family: "Material Icons";
  font-style: normal;
  font-weight: 400;
  src: url("##PATH-TO-ICONS##/material-regular.eot"); /* For IE6-8 */
  src: local("Material Icons"), local("MaterialIcons-Regular"),
    url("##PATH-TO-ICONS##/material-regular.woff2") format("woff2"),
    url("##PATH-TO-ICONS##/material-regular.woff") format("woff"),
    url("##PATH-TO-ICONS##/material-regular.ttf") format("truetype");
}

.material-icons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  font-size: 24px; /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: "liga";
}

@font-face {
  font-family: "Material Icons Outlined";
  font-style: normal;
  font-weight: 400;
  src: url("##PATH-TO-ICONS##/material-outline.eot"); /* For IE6-8 */
  src: local("Material Icons Outlined"),
    url("##PATH-TO-ICONS##/material-outline.woff2") format("woff2"),
    url("##PATH-TO-ICONS##/material-outline.woff") format("woff"),
    url("##PATH-TO-ICONS##/material-outline.otf") format("opentype");
}

@font-face {
  font-family: "Material Icons Round";
  font-style: normal;
  font-weight: 400;
  src: url("##PATH-TO-ICONS##/material-round.eot"); /* For IE6-8 */
  src: local("Material Icons Round"),
    url("##PATH-TO-ICONS##/material-round.woff2") format("woff2"),
    url("##PATH-TO-ICONS##/material-round.woff") format("woff"),
    url("##PATH-TO-ICONS##/material-round.otf") format("opentype");
}

@font-face {
  font-family: "Material Icons Sharp";
  font-style: normal;
  font-weight: 400;
  src: url("##PATH-TO-ICONS##/material-sharp.eot"); /* For IE6-8 */
  src: local("Material Icons Sharp"),
    url("##PATH-TO-ICONS##/material-sharp.woff2") format("woff2"),
    url("##PATH-TO-ICONS##/material-sharp.woff") format("woff"),
    url("##PATH-TO-ICONS##/material-sharp.otf") format("opentype");
}

@font-face {
  font-family: "Material Icons Two Tone";
  font-style: normal;
  font-weight: 400;
  src: url("##PATH-TO-ICONS##/material-twotone.eot"); /* For IE6-8 */
  src: local("Material Icons twotone"),
    url("##PATH-TO-ICONS##/material-twotone.woff2") format("woff2"),
    url("##PATH-TO-ICONS##/material-twotone.woff") format("woff"),
    url("##PATH-TO-ICONS##/material-twotone.otf") format("opentype");
}


.material-icons-outlined,
.material-icons.material-icons--outlined,
.material-icons-two-tone,
.material-icons.material-icons--two-tone,
.material-icons-round,
.material-icons.material-icons--round,
.material-icons-sharp,
.material-icons.material-icons--sharp {
  font-weight: normal;
  font-style: normal;
  font-size: 24px;
  line-height: 1;
  letter-spacing: normal;
  text-transform: none;
  display: inline-block;
  white-space: nowrap;
  word-wrap: normal;
  direction: ltr;
}

.material-icons-outlined,
.material-icons.material-icons--outlined {
  font-family: "Material Icons Outlined";
}

.material-icons-two-tone,
.material-icons.material-icons--two-tone {
  font-family: "Material Icons Two Tone";
}

.material-icons-round,
.material-icons.material-icons--round {
  font-family: "Material Icons Round";
}

.material-icons-sharp,
.material-icons.material-icons--sharp {
  font-family: "Material Icons Sharp";
}

```