const prettierConfig = require("./.prettierrc.js")
module.exports = {
  root: true,
  extends: ["next/core-web-vitals", "plugin:prettier/recommended", "plugin:tailwindcss/recommended"],
  rules: {
    "prettier/prettier": ["warn", prettierConfig]
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.js", ".jsx"],
      parser: "@typescript-eslint/parser"
    }
  ]
}
