module.exports = {
  verbose: true,
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  collectCoverage: true,
  setupFiles: ["<rootDir>/tests/jest.setup.ts"],
  testMatch: [
    "<rootDir>/src/**/*.spec.(js|jsx|ts|tsx)",
    "<rootDir>/**/__tests__/*.(js|jsx|ts|tsx)",
  ],
};
