### Lesson — Silent disabled CTA (PostDetails) — 2026-11-13
**Symptom:** Publish Now disabled with no explanation when title, price, or required attributes were empty.
**Root Cause:** hasMissingParams blocked the button, but missingRequiredLabels only covered attributes and the screen never rendered them.
**Fix:** Include localized title and price in missingRequiredLabels; render MissingFieldsNotice above the CTA (same pattern as AI review path).
**Prevention:** Any disabled primary action must name the blocking condition in both languages. Reuse existing notice components rather than inventing new ones.
