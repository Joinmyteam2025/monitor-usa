import type { TokenStorage } from "@convex-dev/auth/react";

/**
 * A TokenStorage that uses localStorage when it is actually usable, and
 * silently falls back to an in-memory store when it is not.
 *
 * Why this exists: ConvexAuthProvider defaults to `window.localStorage`.
 * Merely *touching* `window.localStorage` throws a SecurityError when the
 * document is in a sandboxed iframe without `allow-same-origin` (link
 * preview crawlers, embedded viewers, some in-app browsers). That throw
 * happens during render and takes down the whole app with
 * "An unexpected error occurred."
 *
 * Auth simply does not persist across reloads in those environments, which
 * is the correct tradeoff — the page renders instead of crashing.
 */

const memoryStore = new Map<string, string>();

function usableLocalStorage(): Storage | null {
  try {
    const ls = window.localStorage;
    const probe = "__storage_probe__";
    ls.setItem(probe, probe);
    ls.removeItem(probe);
    return ls;
  } catch {
    return null;
  }
}

// Resolved once at module load; the sandbox condition never changes mid-session.
const backing = typeof window === "undefined" ? null : usableLocalStorage();

export const safeTokenStorage: TokenStorage = {
  getItem: (key) => {
    if (backing) {
      try {
        return backing.getItem(key);
      } catch {
        /* fall through to memory */
      }
    }
    return memoryStore.get(key) ?? null;
  },
  setItem: (key, value) => {
    if (backing) {
      try {
        backing.setItem(key, value);
        return;
      } catch {
        /* fall through to memory */
      }
    }
    memoryStore.set(key, value);
  },
  removeItem: (key) => {
    if (backing) {
      try {
        backing.removeItem(key);
        return;
      } catch {
        /* fall through to memory */
      }
    }
    memoryStore.delete(key);
  },
};
