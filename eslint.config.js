import { default as eslint } from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";
import hooksPlugin from "eslint-plugin-react-hooks";

/** @type {import('@typescript-eslint/utils/ts-eslint').FlatConfig[]} */
export default tseslint.config(
  eslint.configs.recommended,

  reactPlugin.configs.flat.all,

  reactPlugin.configs.flat["jsx-runtime"],
  ...tseslint.configs.stylisticTypeChecked,
  ...tseslint.configs.strictTypeChecked,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      "node_modules/",
      "dist/",
      "build/",
      "storybook-static/",
      "coverage/",
    ],
  },
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      "react-hooks": hooksPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    rules: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      ...hooksPlugin.configs.recommended.rules,
      "react/destructuring-assignment": "off",
      "react/function-component-definition": "off",
      "react/prop-types": "off",
      "react/no-unused-prop-types": "warn",
      "react/no-array-index-key": "warn",
      "react/jsx-filename-extension": [
        "error",
        { extensions: [".tsx", ".ts"] },
      ],
      "react/jsx-props-no-spreading": [
        "warn",
        {
          html: "ignore",
        },
      ],
      "react/prefer-read-only-props": "off",
      "react/jsx-no-bind": ["warn", { ignoreDOMComponents: true }],
      "react/require-default-props": "off",
      "react/jsx-no-literals": "off",
      "react/forbid-component-props": "off",
      "react/no-multi-comp": "off",
      "react/jsx-max-depth": "off",
      "react/button-has-type": "off",
      "react/hook-use-state": "warn",
      "react/jsx-no-useless-fragment": "warn",
      "@typescript-eslint/require-await": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/unbound-method": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/prefer-find": "warn",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/use-unknown-in-catch-callback-variable": "warn",
      "@typescript-eslint/restrict-plus-operands": "warn",
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowNumber: true,
        },
      ],
      "@typescript-eslint/no-unnecessary-type-assertion": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/consistent-indexed-object-style": "off",
      "@typescript-eslint/no-duplicate-type-constituents": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/prefer-function-type": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unnecessary-condition": "warn",
      "@typescript-eslint/no-unnecessary-type-parameters": "warn",
    },
  },
  {
    files: ["**/*.stories.tsx", "**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "react/jsx-props-no-spreading": [
        "warn",
        {
          html: "ignore",
        },
      ],
      "react/jsx-no-bind": "warn",
    },
  },
);
