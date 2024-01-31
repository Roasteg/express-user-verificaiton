import sheriff from "eslint-config-sheriff";

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
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/naming-convention": "off",
            "import/no-named-as-default": "off",
            "fp/no-class": "off",
            "@typescript-eslint/no-misused-promises": [
                "error",
                { checksVoidReturn: false },
            ],
        },
    },
];
