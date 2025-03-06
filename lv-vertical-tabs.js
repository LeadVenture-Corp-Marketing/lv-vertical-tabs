/**
 * Vertical Tabs Component
 * -----------------------------------------
 * A modular vertical tab system with optional auto-cycling.
 * Designed for easy integration
 *
 * @author  Andy Ashley - Sr. Front-end Engineer
 * @company LeadVenture
 * @version 1.0.0
 * @date   2025-03-06
 * @license Proprietary
 *
 * Usage:
 *  createVerticalTabs({
 *    container: "#vertical-tabs",
 *    position: "left",
 *    tabs: [{ title: "...", text: "...", image: "...", button: { text: "...", url: "..." } }]
 *  });
 *
 *  autoCycleTabs("#vertical-tabs-left", 3000);
 *
 * Features:
 * - Dynamically generates vertical tabs from config.
 * - Supports images & buttons per tab.
 * - Auto-cycling functionality with hover pause.
 * - No dependencies, works with vanilla JavaScript.
 */

/**
 * Creates a vertical tab component with images and optional buttons.
 * @param {Object} config - Configuration object.
 * @param {string} config.container - Selector for the container.
 * @param {string} [config.position="left"] - Position of the tabs ("left" or "right").
 * @param {Array} config.tabs - List of tab objects with title, text, image, and button.
 */
function createVerticalTabs(config) {
  const settings = {
    container: "#vertical-tabs",
    position: "left",
    tabs: [],
    ...config,
  };

  const container = document.querySelector(settings.container);
  if (!container)
    return console.warn(`Container ${settings.container} not found`);

  const elements = createTabElements(settings);
  container.appendChild(elements.wrapper);
  attachEventListeners(elements);
  selectTab(0, elements);
}

/**
 * Generates and returns the tab structure.
 * @param {Object} settings - Configuration settings.
 * @returns {Object} - References to created DOM elements.
 */
function createTabElements(settings) {
  const wrapper = createElement("div", "vt__wrapper", {
    "data-position": settings.position,
  });
  wrapper.dataset.position;
  const tabsEl = createElement("div", "vt__tabs");
  const tabUL = createElement("ul", "vt__list");
  const contentEl = createElement("div", "vt__content");

  tabsEl.appendChild(tabUL);

  const { tabItems, imageItems, buttonItems } = settings.tabs.reduce(
    (acc, tab, index) => {
      const tabEl = createTabItem(tab, index);
      acc.tabItems.push(tabEl);
      acc.imageItems.push(createImage(tab.image, contentEl));

      let button = null;
      if (tab.button && tab.button.text && tab.button.url) {
        button = createButton(tab.button);
        contentEl.appendChild(button);
      }
      acc.buttonItems.push(button);

      tabUL.appendChild(tabEl);
      return acc;
    },
    { tabItems: [], imageItems: [], buttonItems: [] }
  );

  settings.position === "left"
    ? wrapper.append(tabsEl, contentEl)
    : wrapper.append(contentEl, tabsEl);

  return { wrapper, tabUL, contentEl, tabItems, imageItems, buttonItems };
}

/**
 * Creates a single tab item.
 * @param {Object} tab - Tab data.
 * @param {number} index - Index of the tab.
 * @returns {HTMLElement} - The created tab element.
 */
function createTabItem(tab, index) {
  const tabEl = createElement("li", "vt__list-item");
  tabEl.dataset.index = index.toString();

  tabEl.innerHTML = `
        <h3 class="vt__list-item-title">${tab.title}</h3>
        <p class="vt__list-item-text">${tab.text}</p>
        `;

  return tabEl;
}

/**
 * Creates an image element for a tab.
 * @param {string} src - Image URL.
 * @param {HTMLElement} parent - Parent element to append to.
 * @returns {HTMLImageElement} - The created image element.
 */
function createImage(src, parent) {
  const img = new Image();
  img.src = src;
  img.className = "vt__image";
  img.style.display = "none";
  parent.appendChild(img);
  return img;
}

/**
 * Creates a button element for a tab.
 * @param {Object} button - Button data.
 * @returns {HTMLAnchorElement} - The created button element.
 */
function createButton(button) {
  return createElement("a", "vt__tab__button", {
    href: button.url,
    textContent: button.text,
    style: "display: none",
  });
}

/**
 * Attaches event listeners to the tab container.
 * @param {Object} elements - DOM elements of the tab component.
 */
function attachEventListeners(elements) {
  elements.tabUL.addEventListener("click", (event) => {
    const tabEl = event.target.closest(".vt__list-item");
    if (!tabEl) return console.warn("Clicked outside a tab");

    const index = Number(tabEl.dataset.index);
    if (isNaN(index)) return console.error("Invalid tab index:", tabEl);

    selectTab(index, elements);
  });
}

/**
 * Selects and highlights the active tab.
 * @param {number} index - Index of the tab to activate.
 * @param {Object} elements - DOM elements of the tab component.
 */
function selectTab(index, elements) {
  elements.tabItems.forEach((el, i) => {
    el.classList.toggle("active", i === index);
  });

  elements.imageItems.forEach((el, i) => {
    el.style.display = i === index ? "block" : "none";
  });

  elements.buttonItems.forEach((el, i) => {
    if (el) {
      el.style.display = i === index ? "inline-block" : "none";
    }
  });
}

/**
 * Automatically cycles through the tabs at a given interval.
 * @param {string} containerSelector - Selector for the tab container.
 * @param {number} [interval=3000] - Interval duration in milliseconds.
 */
function autoCycleTabs(containerSelector, interval = 5000) {
  const container = document.querySelector(containerSelector);
  if (!container)
    return console.warn(`Container ${containerSelector} not found`);

  const tabs = [...container.querySelectorAll(".vt__list-item")];
  if (!tabs.length)
    return console.warn(`No tabs found in ${containerSelector}`);

  let intervalId = setInterval(() => cycleTabs(tabs), interval);

  container.addEventListener("mouseenter", () => clearInterval(intervalId));
  container.addEventListener("mouseleave", () => {
    intervalId = setInterval(() => cycleTabs(tabs), interval);
  });
}

/**
 * Advances to the next tab in the sequence.
 * @param {HTMLElement[]} tabs - Array of tab elements.
 */
function cycleTabs(tabs) {
  const activeIndex = tabs.findIndex((tab) => tab.classList.contains("active"));
  const nextIndex = (activeIndex + 1) % tabs.length;
  tabs[nextIndex].click();
}

/**
 * Creates a new HTML element with optional attributes.
 * @param {string} tag - The HTML tag name.
 * @param {string} className - Class name(s) for the element.
 * @param {Object} [attributes={}] - Additional attributes as key-value pairs.
 * @returns {HTMLElement} - The created element.
 */
function createElement(tag, className, attributes = {}) {
  const el = document.createElement(tag);
  el.className = className;
  Object.entries(attributes).forEach(([key, value]) => {
    key.startsWith("data-") ? el.setAttribute(key, value) : (el[key] = value);
  });
  return el;
}
