### 2026-11-13 — PostDetails validation feedback (PR pending)
- PostDetailsScreen uses useAiReview (not usePostDetails). Publish was disabled on missing title, price, or required attributes with no visible explanation.
- Competitor pattern (OpenSooq / Dubizzle / OLX): compact inline list of missing fields above the disabled CTA. Reused existing MissingFieldsNotice.
- useAiReview now includes localized title and price labels in missingRequiredLabels. Conditions unchanged (empty title, empty price, required attributes).
- PostDetailsScreen renders MissingFieldsNotice above the Publish button. Auth, publish, and market isolation untouched.
- Regression tests: missing title, missing price, missing required attribute, valid submission enables button and hides notice.
