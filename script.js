const config = { childList: true, subtree: true };
const selector =
  ".merge-status-list.js-updatable-content-preserve-scroll-position";

/**
 * @type MutationObserver | null
 */
let observer = null;
let mutating = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // listen for messages sent from background.js
  if (request.message === "url changed") main();
});

main();

// Function to determine the status of an item
function getItemStatus(statusItem) {
  const icon = statusItem.querySelector(".merge-status-icon svg");

  if (icon.classList.contains("anim-rotate")) return "pending";
  if (icon.classList.contains("color-fg-danger")) return "error";
  if (icon.classList.contains("color-fg-success")) return "success";
  if (icon.classList.contains("neutral-check")) return "skipped";
  if (icon.classList.contains("hx_dot-fill-pending-icon")) return "queued";
  return "other";
}

// Function to determine if an item is required
function isRequired(statusItem) {
  return statusItem.querySelector(".label.Label--primary") !== null;
}

// Function to sort status items
function sortStatusItems() {
  mutating = true;
  const container = document.querySelector(selector);
  const statusItems = Array.from(container.children);
  const sortedItems = statusItems.sort((a, b) => {
    const statusA = getItemStatus(a);
    const statusB = getItemStatus(b);
    const requiredA = isRequired(a);
    const requiredB = isRequired(b);

    // First, sort by status
    if (statusA !== statusB) {
      const order = [
        "error",
        "pending",
        "queued",
        "success",
        "other",
        "skipped",
      ];
      return order.indexOf(statusA) - order.indexOf(statusB);
    }

    // If status is the same, sort by required (required items first)
    if (requiredA !== requiredB) {
      return requiredB ? 1 : -1;
    }

    // If both status and required are the same, maintain original order
    return 0;
  });

  // Remove all items from the container
  statusItems.forEach((item) => item.remove());

  // Add sorted items back to the container
  sortedItems.forEach((item) => container.appendChild(item));

  setTimeout(() => {
    mutating = false;
  }, 250);
}

function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const globalObserver = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        globalObserver.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    globalObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

function startObserving() {
  const container = document.querySelector(selector);
  if (!container) return;

  sortStatusItems();

  observer = new MutationObserver((mutationList, o) => {
    if (!mutating) sortStatusItems();
  });

  observer.observe(container, {
    attributes: true,
    childList: true,
    subtree: true,
  });
}

function stopObserving() {
  if (observer) observer.disconnect();
}

async function main() {
  const shouldCheck = /\/pull\/\d+$/i.test(window.location.pathname);
  if (shouldCheck) {
    await waitForElm(selector);
    startObserving();
  } else {
    stopObserving();
  }
}
