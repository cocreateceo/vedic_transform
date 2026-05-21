import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // SST generated platform sources.
    ".sst/**",
  ]),
  {
    rules: {
      // Downgraded from error → warn so the build isn't blocked by pre-existing
      // technical debt while leaving the signal visible in dev / CI logs.
      "@typescript-eslint/no-explicit-any": "warn",
      // Effect bodies that hydrate state from localStorage / cookies are the
      // canonical client-side pattern; this React 19 rule fires on every one
      // of them. Keep as a warning rather than a block.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
      // `window.location.href = ...` is a legitimate navigation pattern.
      "react-hooks/immutability": "warn",
    },
  },
]);

export default eslintConfig;
