# LV Vertical Tabs Component

A **lightweight, modular** vertical tab system with **image and button support**, built for easy integration into any project.  
Works with **vanilla JavaScript**. No dependencies required.

---

This project was built to provide a **lightweight, dependency-free** vertical tab component for internal use. Designed with **scalability, customization, and performance** in mind, this system leverages **CSS variables** for styling flexibility and **vanilla JavaScript** for fast execution.

| Developer                                               | Contact                                       |
| ------------------------------------------------------- | --------------------------------------------- |
| **Andy Ashley** // Sr. Front-End Engineer @ LeadVenture | [Email](mailto:andrew.ashley@leadventure.com) |

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [CDN via jsDelivr](#cdn-via-jsdelivr)
- [Usage](#usage)
  - [Basic Setup](#basic-setup)
  - [JavaScript Initialization](#javascript-initialization)
- [Configuration Options](#configuration-options)
- [Enabling Auto-Cycling](#enabling-auto-cycling)
- [Example Output](#example-output)
- [Overwriting Styles](#overwriting-styles)
  - [Default CSS Variables](#default-css-variables)
  - [Overriding Styles](#overriding-styles)
  - [Example Customization](#example-customization)

## Features

**Dynamic Tab Generation** – Just pass a config object.  
**Image & Button Support** – Each tab can have an image and an optional button.  
**Auto-Cycling** – Tabs can cycle automatically with hover-pause.  
**Mobile-Friendly & Responsive** – Adjusts between rows (mobile) and columns (desktop).  
**No Dependencies** – 100% pure JavaScript.

---

## **Installation**

### **CDN via jsDelivr**

Include the **CSS** and **JavaScript** files in your project:

```html
<!-- Styles -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/LeadVenture-Corp-Marketing/lv-vertical-tabs/dist/lv-vertical-tabs.min.css"
/>

<!-- Script -->
<script src="https://cdn.jsdelivr.net/gh/LeadVenture-Corp-Marketing/lv-vertical-tabs/dist/lv-vertical-tabs.min.js"></script>
```

## Usage

To initialize vertical tabs, add **container elements** in your HTML and call `createVerticalTabs()` in JavaScript.

### **Basic Setup**

Add the following **HTML structure**:

```html
<div id="vertical-tabs-left"></div>
<div id="vertical-tabs-right"></div>
```

### **JavaScript Initialization**

```html
<script defer>
  document.addEventListener("DOMContentLoaded", function () {
    createVerticalTabs({
      id: 1,
      container: "#vertical-tabs-left",
      position: "left",
      debug: true, // Debug flag if needed to show tab cycle information
      tabs: [
        {
          title: "Tab One",
          text: "Content for tab one.",
          button: { text: "Learn More", url: "#" },
          image: "/placeholder.png",
        },
        {
          title: "Tab Two",
          text: "Content for tab two.",
          button: { text: "Learn More", url: "#" },
          image: "/placeholder.png",
        },
      ],
    });

    createVerticalTabs({
      id: 2,
      container: "#vertical-tabs-right",
      position: "right",
      tabs: [
        {
          title: "Tab Three",
          text: "Content for tab three.",
          button: { text: "Learn More", url: "#" },
          image: "/placeholder.png",
        },
        {
          title: "Tab Four",
          text: "Content for tab four.",
          button: { text: "Learn More", url: "#" },
          image: "/placeholder.png",
        },
      ],
    });

    // Enable automatic cycling of tabs
    autoCycleTabs("#vertical-tabs-left", 3000);
    autoCycleTabs("#vertical-tabs-right", 3000);
  });
</script>
```

> **Debug Mode**: Setting `debug: true` will overlay a small box beneath each tab image showing the tab's index, image URL, and button info. Useful during development.

---

## **Configuration Options**

| Parameter   | Type     | Default  | Description                                       |
| ----------- | -------- | -------- | ------------------------------------------------- |
| `container` | `string` | `""`     | The selector for the tab container.               |
| `position`  | `string` | `"left"` | Set tab alignment (`"left"` or `"right"`).        |
| `tabs`      | `array`  | `[]`     | List of tab objects (title, text, image, button). |
| `debug`     | `boolean`| `false`  | Show overlay with debug info for each tab (index, image, button).|

Each **tab object** should follow this format:

```js
{
  title: "Tab Title",
  text: "Tab Description",
  button: { text: "Button Label", url: "https://example.com" }, //optional
  image: "/path-to-image.jpg"
}
```

---

### **Enabling Auto-Cycling**

```js
autoCycleTabs("#vertical-tabs-left", 3000); // Changes every 3 seconds
```

This will automatically switch tabs at the given interval **(default: `5000ms` / 5 seconds)**.

---

## **Example Output**

After running the script, the tabs will be generated dynamically inside:

```html
<div id="vertical-tabs-left"></div>
<div id="vertical-tabs-right"></div>
```

Each tab will display **its corresponding image and button**, switching dynamically.

---

## **Overwriting Styles**

This component uses some **CSS variables** to allow easy customization of colors and some other options. These styles can by overwritten by redefining the variables.

### **Default CSS Variables**

```css
:root {
  --vt-primary-color: hsl(232, 62%, 30%);
  --vt-secondary-color: hsl(101, 47%, 56%);
  --vt-tertiary-color: hsl(36, 100%, 50%);
  --vt-button-text-color: hsl(0, 0%, 100%);
  --vt-slim-border-color: hsl(0, 0%, 93%);
  --vt-image-border-radius: 8px;
  --vt-heading-font-size: 25px;
  --vt-text-font-size: 17px;
  --vt-button-font-size: 16px;
  --vt-button-border-radius: 4px 4px 25px 25px;
  --vt-button-box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
```

### **Overriding Styles**

To change the styles, redefine the CSS variables inside a `<style>` block or an external CSS file.

```css
:root {
  --vt-primary-color: hsl(220, 80%, 40%);
  --vt-secondary-color: hsl(50, 90%, 50%);
  --vt-button-border-radius: 10px;
}
```

### **Example Customization**

```css
.vt__wrapper {
  background-color: var(--vt-primary-color);
}

.vt__list-item-title {
  font-size: var(--vt-heading-font-size);
}

.vt__tab__button {
  background-color: var(--vt-tertiary-color);
  color: var(--vt-button-text-color);
  font-size: var(--vt-button-font-size);
  border-radius: var(--vt-button-border-radius);
  box-shadow: var(--vt-button-box-shadow);
}

.vt__tab__button:hover {
  background-color: var(--vt-secondary-color);
}
```
