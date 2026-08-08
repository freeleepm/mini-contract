# Guest Home And On-Demand Login Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the mobile app open on a safe guest homepage and request login only when the user invokes protected functionality, preserving the original destination after login.

**Architecture:** Extend the existing auth utility as the single navigation guard, keep the homepage responsible for separating guest and authenticated initialization, and centralize all post-login destination handling in the login page. Existing backend APIs and token formats remain unchanged.

**Tech Stack:** uni-app x, Vue 3 Options API, UTS, Node.js source checks.

## Global Constraints

- Do not modify backend code or database schema.
- Do not proactively compile the mobile application.
- Preserve existing WeChat agreement-consent behavior.
- Preserve unrelated dirty-worktree changes.

---

### Task 1: Guest-home regression check

**Files:**
- Create: `scripts/check-guest-home-auth.js`
- Modify: `package.json`

**Interfaces:**
- Consumes: mobile route and page source files.
- Produces: `npm run check:guest-home` returning zero only when guest-home routing and login return rules are present.

- [ ] Write source assertions for homepage-first routing, guest initialization, guarded actions, and TabBar redirect handling.
- [ ] Run `node scripts/check-guest-home-auth.js` and confirm it fails against the current implementation.
- [ ] Register the checker as `check:guest-home` in `package.json`.

### Task 2: Unified authentication navigation

**Files:**
- Modify: `api/auth.uts`
- Modify: `pages/login/index.uvue`

**Interfaces:**
- Produces: `requireLogin(redirectUrl: string, showToast?: boolean): boolean`.
- Produces: post-login routing that distinguishes external URLs, TabBar pages, and ordinary pages.

- [ ] Add redirect URL construction without changing existing token storage.
- [ ] Add TabBar-aware login completion and use it for password, WeChat, and mini-program phone login.
- [ ] Keep external Seal Token callbacks unchanged.

### Task 3: Homepage guest mode

**Files:**
- Modify: `pages.json`
- Modify: `pages/index/index.uvue`

**Interfaces:**
- Consumes: `requireLogin()` from Task 2.
- Produces: homepage startup with no private API calls for guests.

- [ ] Move the homepage route to the first position in `pages.json`.
- [ ] Split homepage lifecycle initialization into guest and authenticated paths.
- [ ] Guard status cards, quick-start actions, templates, features, and identity actions with their exact destination.

### Task 4: Protected TabBar entry and verification

**Files:**
- Modify: `pages/contract-manage/index.uvue`
- Modify: `pages/profile/index.uvue`

**Interfaces:**
- Consumes: `checkAuthAndRedirect(showToast, redirectUrl)` compatibility API.

- [ ] Preserve the destination when unauthenticated users enter either protected TabBar.
- [ ] Run `node scripts/check-guest-home-auth.js` and expect PASS.
- [ ] Run `npm run check:login-consent` and expect PASS.
- [ ] Inspect the final diff for unrelated changes and do not run a mobile build.
