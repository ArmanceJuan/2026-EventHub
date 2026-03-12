/** @type {import('jest').Config} */
const config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  testMatch: ["**/?(*.)+(test).[tj]s?(x)"],

  rootDir: ".",

  coverageDirectory: "<rootDir>/coverage",
  coverageProvider: "v8",

  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },

  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};

export default config;
