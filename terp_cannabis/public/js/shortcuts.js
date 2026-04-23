/**
 * TERP Global Keyboard Shortcuts
 */
(function () {
  "use strict";

  document.addEventListener("keydown", function (e) {
    // Skip if typing in an input/textarea/select
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    switch (e.key) {
      case "n":
      case "N":
        e.preventDefault();
        window.location.href = "/app/sales-order/new-sales-order-1";
        break;
      case "i":
      case "I":
        window.location.href = "/app/batch";
        break;
      case "c":
      case "C":
        window.location.href = "/app/customer";
        break;
      case "?":
        showShortcutsModal();
        break;
    }
  });

  // Ctrl+N — New Sale (works even inside inputs)
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "n") {
      e.preventDefault();
      window.location.href = "/app/sales-order/new-sales-order-1";
    }
  });

  function showShortcutsModal() {
    if (document.getElementById("terp-shortcuts-modal")) return;
    const shortcuts = [
      ["Ctrl+K / ⌘K", "Open command palette"],
      ["Ctrl+N / ⌘N", "New Sales Order"],
      ["N (not typing)", "New Sales Order"],
      ["I (not typing)", "Inventory (Batches)"],
      ["C (not typing)", "Customers"],
      ["?", "Show this help"],
      ["Esc", "Close dialogs"],
    ];

    const modal = document.createElement("div");
    modal.id = "terp-shortcuts-modal";
    modal.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,.65);z-index:9998;
      display:flex;align-items:center;justify-content:center;
    `;
    const panel = document.createElement("div");
    panel.style.cssText = `
      background:#1a1a1a;border-radius:12px;padding:2rem;width:400px;
      box-shadow:0 16px 48px rgba(0,0,0,.5);
    `;
    panel.innerHTML = `<h3 style="color:#fff;margin-bottom:1.25rem;font-size:1rem;">Keyboard Shortcuts</h3>
      <table style="width:100%;border-collapse:collapse;">
        ${shortcuts.map(([key, desc]) => `
          <tr>
            <td style="padding:.4rem .5rem;color:#aaa;font-size:.8rem;width:160px;">
              <kbd style="background:#0f0f0f;border:1px solid #333;border-radius:4px;padding:.15rem .4rem;font-family:monospace;">${key}</kbd>
            </td>
            <td style="padding:.4rem .5rem;color:#ddd;font-size:.85rem;">${desc}</td>
          </tr>`).join("")}
      </table>
    `;
    modal.appendChild(panel);
    document.body.appendChild(modal);

    function close() { modal.remove(); }
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    document.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape") { close(); document.removeEventListener("keydown", esc); }
    });
  }
})();
