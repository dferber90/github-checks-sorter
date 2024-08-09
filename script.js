const config = { childList: true, subtree: true };

// Function to determine the status of an item
function getItemStatus(statusItem) {
  const icon = statusItem.querySelector(".merge-status-icon svg");
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
function sortStatusItems(container) {
  const statusItems = Array.from(container.children);
  const sortedItems = statusItems.sort((a, b) => {
    const statusA = getItemStatus(a);
    const statusB = getItemStatus(b);
    const requiredA = isRequired(a);
    const requiredB = isRequired(b);

    // First, sort by status
    if (statusA !== statusB) {
      const order = ["error", "other", "queued", "success", "skipped"];
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
}

async function main() {
  const selector =
    ".merge-status-list.js-updatable-content-preserve-scroll-position";

  const container = document.querySelector(selector);
  if (!container) return;

  sortStatusItems(container);
}

main();
setInterval(() => main(), 500);
