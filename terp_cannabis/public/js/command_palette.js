/**
 * TERP Command Palette (Ctrl+K)
 * Extends Frappe's existing search/awesome-bar with TERP-style quick-launch.
 */
(function () {
  "use strict";

  const PINNED = [
    { label: "New Order", url: "/app/sales-order/new-sales-order-1", icon: "plus" },
    { label: "New Intake", url: "/app/intake-session/new-intake-session-1", icon: "download" },
    { label: "Inventory", url: "/app/batch", icon: "package" },
    { label: "Customers", url: "/app/customer", icon: "users" },
  ];

  const NAV_ITEMS = [
    { label: "Dashboard", url: "/app" },
    { label: "Sales Orders", url: "/app/sales-order" },
    { label: "Quotations", url: "/app/quotation" },
    { label: "Sales Catalogues", url: "/app/sales-catalogue" },
    { label: "Live Shopping", url: "/app/live-shopping-session" },
    { label: "Pick List / Shipping", url: "/app/delivery-note" },
    { label: "Purchase Orders", url: "/app/purchase-order" },
    { label: "Inventory (Batches)", url: "/app/batch" },
    { label: "Intake Sessions", url: "/app/intake-session" },
    { label: "Photography Queue", url: "/app/photography-queue" },
    { label: "Sample Requests", url: "/app/sample-request" },
    { label: "Customers", url: "/app/customer" },
    { label: "Suppliers", url: "/app/supplier" },
    { label: "Client Needs", url: "/app/client-need" },
    { label: "Supplier Supply", url: "/app/supplier-supply" },
    { label: "Match Records", url: "/app/match-record" },
    { label: "Accounting", url: "/app/account" },
    { label: "Sales Invoices", url: "/app/sales-invoice" },
    { label: "Purchase Invoices", url: "/app/purchase-invoice" },
    { label: "Payments", url: "/app/payment-entry" },
    { label: "General Ledger", url: "/app/general-ledger" },
    { label: "Chart of Accounts", url: "/app/account" },
    { label: "Bank Accounts", url: "/app/bank-account" },
    { label: "Credit Limits", url: "/app/credit-limit" },
    { label: "Pricing Profiles", url: "/app/pricing-profile" },
    { label: "COGS Rules", url: "/app/cogs-rule" },
    { label: "Analytics", url: "/app/terp-analytics" },
    { label: "Leaderboard", url: "/app/client-leaderboard" },
    { label: "Calendar", url: "/app/event" },
    { label: "Settings", url: "/app/system-settings" },
    { label: "Users", url: "/app/user" },
    { label: "Feature Flags", url: "/app/feature-flag" },
    { label: "Organization Settings", url: "/app/organization-settings" },
  ];

  const ACTIONS = [
    { label: "New Sales Order", url: "/app/sales-order/new-sales-order-1", key: "N" },
    { label: "New Purchase Order", url: "/app/purchase-order/new-purchase-order-1", key: "P" },
    { label: "Record Payment", url: "/app/payment-entry/new-payment-entry-1" },
    { label: "New Intake Session", url: "/app/intake-session/new-intake-session-1", key: "I" },
    { label: "Expected Deliveries Today", url: "/app/purchase-order?schedule_date=Today&status=To+Receive+and+Bill" },
    { label: "Sales Catalogue", url: "/app/sales-catalogue" },
  ];

  function buildPalette() {
    const overlay = document.createElement("div");
    overlay.id = "terp-palette-overlay";
    overlay.style.cssText = `
      position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:9999;
      display:flex;align-items:flex-start;justify-content:center;padding-top:10vh;
    `;

    const panel = document.createElement("div");
    panel.style.cssText = `
      background:#1a1a1a;border-radius:12px;width:100%;max-width:600px;
      box-shadow:0 24px 64px rgba(0,0,0,.6);overflow:hidden;
    `;

    const search = document.createElement("input");
    search.placeholder = "Search for a command to run...";
    search.style.cssText = `
      width:100%;background:#0f0f0f;border:none;border-bottom:1px solid #333;
      padding:1rem 1.25rem;color:#fff;font-size:1rem;outline:none;
    `;

    const results = document.createElement("div");
    results.style.cssText = "max-height:420px;overflow-y:auto;padding:0.5rem 0;";

    panel.appendChild(search);
    panel.appendChild(results);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    function renderDefault() {
      results.innerHTML = "";
      addSection("Pinned", PINNED);
      addSection("Navigation", NAV_ITEMS.slice(0, 12));
      addSection("Actions", ACTIONS);
    }

    function addSection(title, items) {
      const header = document.createElement("div");
      header.textContent = title;
      header.style.cssText = "padding:0.5rem 1.25rem;font-size:0.7rem;color:#666;font-weight:600;text-transform:uppercase;letter-spacing:.08em;";
      results.appendChild(header);
      items.forEach(item => addItem(item));
    }

    function addItem(item) {
      const el = document.createElement("div");
      el.textContent = item.label + (item.key ? `  (${item.key})` : "");
      el.style.cssText = `
        padding:0.6rem 1.25rem;cursor:pointer;font-size:0.9rem;color:#ddd;
        display:flex;align-items:center;gap:0.5rem;
      `;
      el.addEventListener("mouseenter", () => { el.style.background = "#2a2a2a"; });
      el.addEventListener("mouseleave", () => { el.style.background = ""; });
      el.addEventListener("click", () => {
        close();
        window.location.href = item.url;
      });
      results.appendChild(el);
    }

    let searchTimer;
    search.addEventListener("input", () => {
      clearTimeout(searchTimer);
      const q = search.value.trim();
      if (!q) { renderDefault(); return; }
      searchTimer = setTimeout(() => {
        const lower = q.toLowerCase();
        const all = [...PINNED, ...NAV_ITEMS, ...ACTIONS];
        const matched = all.filter(i => i.label.toLowerCase().includes(lower));
        results.innerHTML = "";
        if (matched.length === 0) {
          results.innerHTML = '<div style="padding:1rem 1.25rem;color:#666;font-size:0.875rem;">No results found</div>';
          return;
        }
        matched.forEach(item => addItem(item));

        // Also hit Frappe search
        frappe.call({
          method: "frappe.client.get_list",
          args: { doctype: "Customer", filters: [["customer_name", "like", `%${q}%`]], fields: ["name", "customer_name"], limit: 5 },
          callback: (r) => {
            if (!r.message?.length) return;
            const header = document.createElement("div");
            header.textContent = "Customers";
            header.style.cssText = "padding:0.5rem 1.25rem;font-size:0.7rem;color:#666;font-weight:600;text-transform:uppercase;";
            results.appendChild(header);
            r.message.forEach(c => addItem({ label: c.customer_name, url: `/app/customer/${c.name}` }));
          },
        });
      }, 120);
    });

    function close() {
      overlay.remove();
      document.removeEventListener("keydown", onKey);
    }

    function onKey(e) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });

    renderDefault();
    search.focus();
  }

  // Register Ctrl+K / Cmd+K
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      if (!document.getElementById("terp-palette-overlay")) {
        buildPalette();
      }
    }
  });
})();
