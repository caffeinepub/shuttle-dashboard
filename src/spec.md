# Specification

## Summary
**Goal:** Add a center comparison chart for the selected month, remove center location everywhere, and persist per-coach center values in monthly records.

**Planned changes:**
- Add a responsive grouped bar chart on the dashboard to compare Revenue Done vs Target per Center for the currently selected month/year, driven by all persisted records matching that month/year (with an empty-state when no records exist).
- Remove Center Location across the UI and data flow: delete the input, validation, display, and backend storage so only Center Name remains.
- Update the Coaches editor to include a required per-row "Center" field, and persist/restore the full coaches array (name, salary, center) for each month/year record.
- Update backend record schema and queries to support multiple centers per month/year, chart data fetching (getAll + month/year filtering), and compatibility for existing metrics (keep/derive aggregated coachSalaries); include a migration/upgrade path so existing stored records still load.

**User-visible outcome:** Users can select a month and see a grouped bar chart comparing Revenue vs Target across all centers recorded for that month, manage monthly records using only Center Name (no location), and edit/save coach rows including each coach’s Center so they reload correctly.
