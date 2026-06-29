**Frontend Integration Report — Issues & Recommendations**

- **Scope**: quick audit of frontend API usage, auth persistence, and UI flags related to backend integration.

**Summary**

- Reviewed frontend API configuration, services, auth handling, and report/mood screens. Identified inconsistencies and UI flags that prevent features from showing or using real backend data.

**Files Reviewed**

- `src/config/api.ts` — base URL and endpoint constants
- `src/config/axiosInstance.js` — axios setup, interceptors, logging
- `src/store/authStorage.ts` — token/user persistence
- `src/context/AuthContext.tsx` — auth init and storage use
- `src/services/authService.ts` — login/register
- `src/services/habitService.ts` — habits endpoints
- `src/services/moodService.ts` — POST/GET `/api/moods`
- `src/services/reportService.ts` — GET `/api/reports`
- `app/(tabs)/report.tsx` — report UI and charts
- `app/(tabs)/mood.tsx` — mood UI and save flow

**Findings (Bugs / Non-working or Disabled Features)**

- `report.tsx` mood chart is disabled: it uses `{false && renderMoodChart()}` so the mood chart is never rendered. The chart also uses mock data (`moodData = [2,3,5,8,6]`) instead of calling `getMoods()`.

- Inconsistent endpoint usage:
  - `src/services/habitService.ts` and `src/services/authService.ts` use `API_ENDPOINTS` from `src/config/api.ts`.
  - `src/services/reportService.ts` and `src/services/moodService.ts` use hard-coded strings (`"/api/reports"`, `"/api/moods"`). `API_ENDPOINTS` currently lacks `REPORTS` and `MOODS` entries. This inconsistency makes global base URL and path changes error-prone.

- No frontend health-check: app doesn't call `/api/health` on startup to detect backend availability (backend defines this route). Without it, users may see silent failures or generic error messages when the backend is down or sleeping.

- Token persistence and usage appear implemented correctly:
  - `AuthContext` reads `getAuthToken()` and `getUserData()` on init and exposes `setAuth()` to save token/user.
  - `axiosInstance` attaches the token via request interceptor using `getAuthToken()`.
  - Recommendation: avoid logging sensitive data. Current logs print request URL and body; they do not print Authorization header, but confirm no secrets leak in production logs.

- UI/backend data shape assumptions:
  - `report.tsx` computes calendar and completion stats by calling `new Date(date)` on `completionHistory` items. Backend `completionHistory` is stored as `Date[]` in Mongo (and serialized), so ensure the frontend handles both ISO strings and Date objects (current code converts strings via `new Date(date)` which is acceptable).

**Recommendations / Next Steps**

- Add `REPORTS` and `MOODS` to `src/config/api.ts` and update services to use `API_ENDPOINTS` for consistency.
  - e.g. `API_ENDPOINTS.REPORTS.GET: "/api/reports"`, `API_ENDPOINTS.MOODS = { GET: "/api/moods", CREATE: "/api/moods" }`.

- Re-enable the mood chart in `app/(tabs)/report.tsx` and replace the mock `moodData` with data fetched from `getMoods()`.

- Add a startup health-check in the app (call `/api/health` via `axiosInstance` or a small helper) and surface a user-friendly offline UI when unreachable.

- Standardize error messages across services by using `getApiErrorMessage` helper (already present in `authService` / `habitService`) and apply it to `moodService` / `reportService`.

- Once backend endpoint consistency is fixed, test these flows in this order:
  1. Register/login (confirm token saved and sent in headers).
  2. Create a habit and mark it complete (verify `completionHistory` entries).
  3. Save a mood and fetch moods (verify `mood` entries appear and chart updates).
  4. Open `Report` screen and verify stats and charts (completion rate, calendar).

**Optional Improvements**

- Reduce verbose console logging in `axiosInstance` for production; keep a debug flag.
- Add defensive checks where frontend assumes non-null arrays/strings from backend.

If you want, I can:

- Add `REPORTS` and `MOODS` to `src/config/api.ts` and update `reportService.ts` and `moodService.ts` to use them.
- Enable the mood chart and hook it up to `getMoods()`.
- Add a simple `/api/health` check on app startup and show an offline banner.
