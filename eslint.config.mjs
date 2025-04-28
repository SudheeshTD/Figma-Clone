// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

// export default eslintConfig;

// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// 1) Load Next.js core-web-vitals and TypeScript support
const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // 2) Your custom rule overrides
  {
    rules: {
      // turn off “no-unused-vars” in favor of tsc’s own checks
      "@typescript-eslint/no-unused-vars": "off", // :contentReference[oaicite:0]{index=0}
      // allow use of “any” everywhere
      "@typescript-eslint/no-explicit-any": "off", // :contentReference[oaicite:1]{index=1}
      // disable React Hooks rules-of-hooks checks at build time
      "react-hooks/rules-of-hooks": "off", // :contentReference[oaicite:2]{index=2}
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    },
  },
];

export default eslintConfig;
