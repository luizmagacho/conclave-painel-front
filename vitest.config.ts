import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    env: {
      TZ: "UTC",
    },
  },
  resolve: {
    alias: [
      {
        find: /^@\/public\/(.+)$/,
        replacement: path.resolve(__dirname, "./public/$1"),
      },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
});
