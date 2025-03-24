/**
 * Vertical Tabs Component
 * -----------------------------------------
 * A modular vertical tab system with optional auto-cycling.
 * Designed for easy integration with TypeScript support.
 *
 * @author  Andy Ashley - Sr. Front-end Engineer
 * @company LeadVenture
 * @version 2.0.0
 * @date    2025-03-24
 * @license Proprietary
 */

// Types
declare interface TabButtonConfig {
  text: string;
  url: string;
}

declare interface TabConfig {
  title: string;
  text: string;
  image: string;
  button?: TabButtonConfig;
}

declare interface VerticalTabsConfig {
  container: string;
  position?: "left" | "right";
  tabs: TabConfig[];
  debug?: boolean;
}

declare interface TabElements {
  wrapper: HTMLDivElement;
  tabUL: HTMLUListElement;
  contentEl: HTMLDivElement;
  tabItems: HTMLLIElement[];
  imageItems: HTMLImageElement[];
  debugItems: HTMLDivElement[];
  buttonItems: HTMLAnchorElement[];
}

/**
 * Creates a vertical tab component with images and optional buttons.
 * @param config - Configuration object.
 */
(function () {
  const createVerticalTabs = (config: VerticalTabsConfig): void => {
    const settings: Required<VerticalTabsConfig> = {
      position: "left",
      debug: false,
      ...config,
    };

    const container = document.querySelector<HTMLElement>(settings.container);
    if (!container) {
      console.warn(`Container ${settings.container} not found`);
      return;
    }

    const elements = createTabElements(settings);
    container.appendChild(elements.wrapper);
    attachEventListeners(elements);
    selectTab(0, elements);
  };

  /**
   * Generates and returns the tab structure.
   * @param settings - Configuration settings.
   * @returns References to created DOM elements.
   */
  const createTabElements = (
    settings: Required<VerticalTabsConfig>
  ): TabElements => {
    const wrapper = createElement<HTMLDivElement>("div", "vt__wrapper", {
      "data-position": settings.position,
    });

    const tabsEl = createElement<HTMLDivElement>("div", "vt__tabs");
    const tabUL = createElement<HTMLUListElement>("ul", "vt__list");
    const contentEl = createElement<HTMLDivElement>("div", "vt__content");

    tabsEl.appendChild(tabUL);

    const accumulatedItems = settings.tabs.reduce<{
      tabItems: HTMLLIElement[];
      imageItems: HTMLImageElement[];
      buttonItems: HTMLAnchorElement[];
      debugItems: HTMLDivElement[];
    }>(
      (acc, tab, index) => {
        const tabEl = createTabItem(tab, index);
        acc.tabItems.push(tabEl);
        acc.imageItems.push(createImage(tab.image, contentEl));

        let button: HTMLAnchorElement;
        tab.button?.text && tab.button?.url
          ? (button = createButton(tab.button))
          : (button = createElement<HTMLAnchorElement>("a", "vt__tab__button", {
              href: "#",
              textContent: "Placeholder",
              style: "visibility: hidden; display: inline-block;",
            }));
        contentEl.appendChild(button);
        acc.buttonItems.push(button);

        if (settings.debug) {
          contentEl.style.position = "relative";
          const debugEl = createDebugOverlay(index, tab.image, tab.button);
          contentEl.appendChild(debugEl);
          acc.debugItems.push(debugEl);
        }

        tabUL.appendChild(tabEl);
        return acc;
      },
      { tabItems: [], imageItems: [], buttonItems: [], debugItems: [] }
    );

    settings.position === "left"
      ? wrapper.append(tabsEl, contentEl)
      : wrapper.append(contentEl, tabsEl);

    return {
      wrapper,
      tabUL,
      contentEl,
      ...accumulatedItems,
    };
  };

  /**
   * Creates a single tab item.
   * @param tab - Tab data.
   * @param index - Index of the tab.
   * @returns The created tab element.
   */
  const createTabItem = (tab: TabConfig, index: number): HTMLLIElement => {
    const tabEl = createElement<HTMLLIElement>("li", "vt__list-item");
    tabEl.dataset.index = index.toString();

    tabEl.innerHTML = `
    <h3 class="vt__list-item-title">${tab.title}</h3>
    <p class="vt__list-item-text">${tab.text}</p>
  `;

    return tabEl;
  };

  /**
   * Creates an image element for a tab.
   * @param src - Image URL.
   * @param parent - Parent element to append to.
   * @returns The created image element.
   */
  const createImage = (src: string, parent: HTMLElement): HTMLImageElement => {
    const img = createElement<HTMLImageElement>("img", "vt__image", {
      src,
      style: "display: none",
    });
    parent.appendChild(img);
    return img;
  };

  /**
   * Creates a button element for a tab.
   * @param button - Button data.
   * @returns The created button element.
   */
  const createButton = (button: TabButtonConfig): HTMLAnchorElement => {
    return createElement<HTMLAnchorElement>("a", "vt__tab__button", {
      href: button.url,
      textContent: button.text,
      style: "display: none",
    });
  };

  const createDebugOverlay = (
    index: number,
    image: string,
    button: TabButtonConfig | undefined
  ): HTMLDivElement => {
    const debugEl = createElement<HTMLDivElement>("div", "vt__debug");
    debugEl.style.display = "none";
    debugEl.innerHTML = `<strong>Debug Info:</strong><br>Index: ${index}<br>Image: ${image}<br>Button: ${
      button ? button.text : "None"
    }`;
    return debugEl;
  };

  /**
   * Attaches event listeners to the tab container.
   * @param elements - DOM elements of the tab component.
   */
  const attachEventListeners = (elements: TabElements): void => {
    elements.tabUL.addEventListener("click", (event: Event) => {
      const target = event.target as HTMLElement;
      const tabEl = target.closest<HTMLLIElement>(".vt__list-item");

      if (!tabEl) return;

      const indexStr = tabEl.dataset.index;
      if (!indexStr) return;

      const index = Number(indexStr);
      if (isNaN(index)) return;

      selectTab(index, elements);
    });
  };

  /**
   * Selects and highlights the active tab.
   * @param index - Index of the tab to activate.
   * @param elements - DOM elements of the tab component.
   */
  const selectTab = (index: number, elements: TabElements): void => {
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

    elements.debugItems.forEach((el, i) => {
      if (el) {
        el.style.display = i === index ? "block" : "none";
      }
    });
  };

  /**
   * Automatically cycles through the tabs at a given interval.
   * @param containerSelector - Selector for the tab container.
   * @param interval - Interval duration in milliseconds.
   */
  const autoCycleTabs = (
    containerSelector: string,
    interval = 5000
  ): (() => void) | void => {
    const container = document.querySelector<HTMLElement>(containerSelector);
    if (!container) {
      console.warn(`Container ${containerSelector} not found`);
      return;
    }

    const tabs = Array.from(
      container.querySelectorAll<HTMLLIElement>(".vt__list-item")
    );
    if (!tabs.length) {
      console.warn(`No tabs found in ${containerSelector}`);
      return;
    }

    let intervalId: number | undefined = window.setInterval(
      () => cycleTabs(tabs),
      interval
    );

    container.addEventListener("mouseenter", () => {
      window.clearInterval(intervalId);
      intervalId = undefined;
    });

    container.addEventListener("mouseleave", () => {
      if (!intervalId) {
        intervalId = window.setInterval(() => cycleTabs(tabs), interval);
      }
    });

    // Return cleanup function
    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  };

  /**
   * Advances to the next tab in the sequence.
   * @param tabs - Array of tab elements.
   */
  const cycleTabs = (tabs: HTMLLIElement[]): void => {
    const activeIndex = tabs.findIndex((tab) =>
      tab.classList.contains("active")
    );
    const nextIndex = (activeIndex + 1) % tabs.length;
    tabs[nextIndex].click();
  };

  /**
   * Creates a new HTML element with optional attributes.
   * @param tag - The HTML tag name.
   * @param className - Class name(s) for the element.
   * @param attributes - Additional attributes as key-value pairs.
   * @returns The created element.
   */
  const createElement = <T extends HTMLElement>(
    tag: string,
    className: string,
    attributes: Record<string, string> = {}
  ): T => {
    const el = document.createElement(tag) as T;
    el.className = className;

    Object.entries(attributes).forEach(([key, value]) => {
      if (key === "style") {
        el.style.cssText = value;
      } else if (key.startsWith("data-")) {
        el.setAttribute(key, value);
      } else {
        (el as any)[key] = value;
      }
    });

    return el;
  };
  (window as any).createVerticalTabs = createVerticalTabs;
  (window as any).autoCycleTabs = autoCycleTabs;
})();
