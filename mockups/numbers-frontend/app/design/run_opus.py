"""Call Claude Opus to produce the design plan for TERP Numbers mockups (streaming)."""
import pathlib, anthropic
here = pathlib.Path(__file__).parent
brief = (here / "context_brief.md").read_text()
client = anthropic.Anthropic(timeout=600.0)
system = ("You are a senior product designer and frontend architect. "
          "You are rigorous, concrete, and you never hand-wave. "
          "You write for a coding agent that will implement your plan verbatim, "
          "so specify file paths, component names, and exact data shapes when useful.")
user = f"""{brief}

---

Produce four deliverables in order, each clearly headed. Be concrete, dense, and actionable.

# 1. Information Architecture Tree
Indented plain-text tree of every Sheet -> Table -> default View -> alt Views -> key Modals.
Cover every one of the 30+ custom DocTypes AND the listed ERPNext builtins. Include VIP Portal
and Shared Sales Sheet.

# 2. Design System
Color scale, typography pairing (exact font + weights + sizes), spacing, radius, shadow,
motion, iconography, and seven Sheet accent hues. Tight, CSS-ready.

# 3. Screen Inventory (12-15 routes)
Numbered list of routes: path, components, TypeScript data-shape sketch, interactions,
Tables covered. Remaining DocTypes reachable via a Table Browser + right-rail Inspector.

# 4. Build Plan
Ordered actionable steps for a coding agent: shared components first (SheetTable, CellEditor,
FilterBar, Inspector, SheetTabBar, SidebarRail, CommandPalette, KanbanBoard, CalendarView,
FormOverlay, ChartCard, NotificationBell), then pages. Include a "simulated data" list of
JSON files to place under client/src/data/."""
with client.messages.stream(model="claude-opus-4-5", max_tokens=12000,
                            system=system,
                            messages=[{"role":"user","content":user}]) as s:
    out = []
    for chunk in s.text_stream:
        out.append(chunk)
text = "".join(out)
(here / "opus_plan.md").write_text(text)
print("wrote chars:", len(text))
