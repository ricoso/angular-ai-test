# Check Styling Command

**Command:** `/check-styling <feature-name>`

**Description:** Validates HTML & SCSS styling rules for a feature

**ARGUMENTS:**
- `feature-name`: Name of the feature to check (e.g., "shopping-cart", "product-list")

---

## What this command checks:

### HTML Rules:
1. ❌ No inline styles (`style=""`)
2. ✅ Semantic HTML elements
3. ✅ ARIA labels for accessibility
4. ✅ Alt text for images
5. ✅ Lazy loading for images

### SCSS Rules:
1. ✅ em/rem units (NOT pixels!)
2. ✅ BEM with nesting
3. ✅ @extend usage
4. ✅ Spacing utilities (m-4, p-8, gap-2)
5. ✅ CSS Flexbox/Grid (NO Angular Flex Layout)
6. ✅ Material overrides in central file
7. ✅ Responsive breakpoints in em

---

## Usage:

```
/check-styling shopping-cart
```

---

## Implementation:

Check these files in the feature:
- All `.html` files for inline styles
- All `.scss` files for pixel values
- SCSS files for BEM naming
- Material component usage
- Utility class usage
- Layout patterns (Flexbox/Grid)

Report violations with file path and line number.
