# Specification

## Summary
**Goal:** Let users pick existing center names (with autocomplete/options) in the Monthly Record editor while still allowing free-text entry.

**Planned changes:**
- Update the Monthly Record editor "Center Name" field to show selectable options populated from unique, non-empty `centerName` values found in already-loaded dashboards data, while still allowing manual typing of new values.
- Update the Coaches table editor so each coach row’s "Center" field also offers the same selectable options (including the current record’s `centerName` when present), while still allowing manual typing.
- Ensure both option lists update automatically when dashboard data is refreshed via React Query (e.g., after saving a new center name or deleting the last record for a center).

**User-visible outcome:** In the Monthly Record editor, users can select a center name from existing saved records (or type a new one) for both the main Center Name field and each coach’s Center field, and the options update automatically as records are saved or removed.
