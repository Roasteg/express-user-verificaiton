import sheriff from "eslint-config-sheriff";
import { defineFlatConfig } from "eslint-define-config";

const sheriffOptions = {
    react: false,
    next: false,
    lodash: false,
    playwright: false,
    jest: false,
    vitest: false,
};

export default [
    ...sheriff(sheriffOptions),
    {
      rules: {
        "@typescript-eslint/no-unsafe-call": "off"
      }
    },
];
