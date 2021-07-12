module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  collectCoverage: true,
  testMatch: [
    "<rootDir>/(tests/unit/**/*.spec.(js|jsx|ts|tsx)",
    "<rootDir>/src/**/*.spec.(js|jsx|ts|tsx)",
    "<rootDir>/**/__tests__/*.(js|jsx|ts|tsx))",
  ],
};
