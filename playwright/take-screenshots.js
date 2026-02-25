/**
 * General-purpose Screenshot Script for E2E Documentation
 *
 * Auto-discovers all REQ-* folders under docs/requirements/ and creates
 * responsive screenshots (Desktop, Tablet, Mobile) for each.
 *
 * Usage:
 *   node playwright/take-screenshots.js                        # All REQs
 *   node playwright/take-screenshots.js REQ-002-Markenauswahl  # Single REQ
 *   node playwright/take-screenshots.js REQ-001-Header --all-langs  # All languages
 *
 * Adding a new feature:
 *   1. Add an entry to SCREENSHOT_CONFIG below
 *   2. Define route + optional setup function
 *   3. Run the script
 *
 * Prerequisites:
 *   - Dev server running on http://localhost:4200 (or started via npm start)
 *   - Playwright + Chromium installed (npx playwright install chromium)
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:4200';
const HASH = `${BASE_URL}/#`;
const DOCS = path.resolve(__dirname, '..', 'docs', 'requirements');

const VIEWPORTS = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'mobile',  width: 375,  height: 667 },
];

const ALL_LANGUAGES = ['de', 'en', 'uk', 'fr', 'ar'];

// ---------------------------------------------------------------------------
// Screenshot Config — one entry per REQ
//
// route:  the hash-route to screenshot
// setup:  optional async fn(page) to run BEFORE the final navigation
//         (e.g. select a brand so a guard lets you through)
//
// If a REQ folder exists but has no config entry it will be skipped
// with a warning so you know to add one.
// ---------------------------------------------------------------------------

const SCREENSHOT_CONFIG = {

  'REQ-001-Header': {
    route: '/home/brand',
  },

  'REQ-002-Markenauswahl': {
    route: '/home/brand',
  },

  'REQ-003-Standortwahl': {
    route: '/home/location',
    setup: async (page) => {
      await page.goto(`${HASH}/home/brand`);
      await page.waitForLoadState('networkidle');
      await page.locator('button', { hasText: 'Audi' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
    },
  },

  'REQ-004-Serviceauswahl': {
    route: '/home/services',
    setup: async (page) => {
      await page.goto(`${HASH}/home/brand`);
      await page.waitForLoadState('networkidle');
      await page.locator('button', { hasText: 'Audi' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
      await page.locator('button', { hasText: 'München' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
    },
  },

  'REQ-005-Hinweisfenster': {
    route: '/home/notes',
    setup: async (page) => {
      // Brand -> Location -> Services -> select HU/AU -> Continue to Notes
      await page.goto(`${HASH}/home/brand`);
      await page.waitForLoadState('networkidle');
      await page.locator('button', { hasText: 'Audi' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
      await page.locator('button', { hasText: 'München' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
      // Select HU/AU service
      await page.locator('.service-card', { hasText: 'HU/AU' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
      // Click Continue button to navigate to notes
      await page.locator('.summary-bar__continue-button').click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
    },
  },

  'REQ-006-Terminauswahl': {
    route: '/home/appointment',
    setup: async (page) => {
      // Brand -> Location -> Services -> select HU/AU -> Continue to Notes -> Continue to Appointment
      await page.goto(`${HASH}/home/brand`);
      await page.waitForLoadState('networkidle');
      await page.locator('button', { hasText: 'Audi' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
      await page.locator('button', { hasText: 'München' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
      // Select HU/AU service
      await page.locator('.service-card', { hasText: 'HU/AU' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
      // Click Continue on services -> notes
      await page.locator('.summary-bar__continue-button').click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      // Click Continue on notes -> appointment
      await page.locator('.notes__continue-button').click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
    },
  },

  'REQ-007-WizardStateSync': {
    route: '/home/services',
    setup: async (page) => {
      // REQ-007 is a cross-cutting requirement with no own UI.
      // Screenshot shows the services page after back-navigation from notes:
      // Brand -> Location -> Services -> select HU/AU -> Continue to Notes -> Back to Services
      // This demonstrates the back-navigation that clears bookingNote and returns to services.
      await page.goto(`${HASH}/home/brand`);
      await page.waitForLoadState('networkidle');
      await page.locator('button', { hasText: 'Audi' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
      await page.locator('button', { hasText: 'München' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
      // Select HU/AU service
      await page.locator('.service-card', { hasText: 'HU/AU' }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(300);
      // Click Continue on services -> notes
      await page.locator('.summary-bar__continue-button').click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
      // Click Back on notes -> services (demonstrates REQ-007 back navigation)
      await page.locator('.notes__back-button').click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(500);
    },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function setLanguage(page, lang = 'de') {
  const url = page.url();
  if (!url || url === 'about:blank') {
    await page.goto(`${HASH}/home/brand`);
    await page.waitForLoadState('networkidle');
  }
  await page.evaluate((l) => localStorage.setItem('app-language', l), lang);
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(300);
}

function discoverReqs() {
  if (!fs.existsSync(DOCS)) return [];
  return fs.readdirSync(DOCS).filter((d) =>
    d.startsWith('REQ-') && fs.statSync(path.join(DOCS, d)).isDirectory()
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

(async () => {
  const args = process.argv.slice(2);
  const allLangs = args.includes('--all-langs');
  const filter = args.find((a) => !a.startsWith('--')) || null;
  const allReqs = discoverReqs();
  const reqs = filter ? allReqs.filter((r) => r === filter) : allReqs;

  if (reqs.length === 0) {
    console.error(filter
      ? `REQ "${filter}" not found. Available: ${allReqs.join(', ')}`
      : 'No REQ-* folders found under docs/requirements/');
    process.exit(1);
  }

  // Check dev server
  try {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch {
    console.error(`Dev server not reachable at ${BASE_URL}. Start with: npm start`);
    process.exit(1);
  }

  console.log(`Taking screenshots for ${reqs.length} REQ(s)...\n`);

  const browser = await chromium.launch();
  let total = 0;
  const skipped = [];

  for (const reqId of reqs) {
    const config = SCREENSHOT_CONFIG[reqId];
    if (!config) {
      skipped.push(reqId);
      console.log(`  ⏭️  ${reqId} — no config entry, skipping`);
      continue;
    }

    const dir = path.join(DOCS, reqId, 'screenshots');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const languages = allLangs ? ALL_LANGUAGES : ['de'];

    for (const lang of languages) {
      const langSuffix = languages.length > 1 ? `-${lang}` : '';
      if (languages.length > 1) {
        console.log(`  🌍 Language: ${lang}`);
      }

      for (const vp of VIEWPORTS) {
        const ctx = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
        });
        const page = await ctx.newPage();

        await setLanguage(page, lang);

        if (config.setup) {
          await config.setup(page);
        } else {
          await page.goto(`${HASH}${config.route}`);
          await page.waitForLoadState('networkidle');
          await page.waitForTimeout(300);
        }

        const fileName = `e2e-responsive-${vp.name}${langSuffix}.png`;
        const file = path.join(dir, fileName);
        await page.screenshot({ path: file, fullPage: true });
        console.log(`  ✅ ${reqId}/screenshots/${fileName}`);
        total++;

        await ctx.close();
      }
    }
  }

  await browser.close();

  console.log(`\nDone — ${total} screenshots saved.`);
  if (skipped.length) {
    console.log(`Skipped (no config): ${skipped.join(', ')}`);
    console.log('Add entries to SCREENSHOT_CONFIG in playwright/take-screenshots.js');
  }
})();
