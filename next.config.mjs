/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: { domains: ["cdn.discordapp.com", "uploadthing.com", "utfs.io", "lh3.googleusercontent.com", "avatars.githubusercontent.com"]},

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  experimental: {
    esmExternals: false, // THIS IS THE FLAG THAT MATTERS
  },
};

export default config;
