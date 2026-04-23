/**
 * Notification bell enhancements — extend the Frappe desk notification dropdown.
 * Frappe already renders a notification bell in the navbar; this file adds
 * TERP-specific alert types and ensures the unread badge stays fresh.
 */
(function () {
  "use strict";

  // Poll for unread count every 60s and update the badge
  if (typeof frappe !== "undefined" && frappe.user) {
    setInterval(function () {
      frappe.call({
        method: "frappe.client.get_count",
        args: {
          doctype: "Notification Log",
          filters: { for_user: frappe.session.user, read: 0 },
        },
        callback(r) {
          const count = r.message || 0;
          const badge = document.querySelector(".notification-count");
          if (badge) {
            badge.textContent = count > 99 ? "99+" : count;
            badge.style.display = count > 0 ? "inline-block" : "none";
          }
        },
      });
    }, 60_000);
  }
})();
