import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI,

    LOGTO_ENDPOINT: process.env.LOGTO_ENDPOINT,
    LOGTO_APP_ID: process.env.LOGTO_APP_ID,
    LOGTO_APP_SECRET: process.env.LOGTO_APP_SECRET,
    LOGTO_BASE_URL: process.env.LOGTO_BASE_URL,
    LOGTO_COOKIE_SECRET: process.env.LOGTO_COOKIE_SECRET,
    LOGTO_COOKIE_SECURE: process.env.LOGTO_COOKIE_SECURE,
    LOGTO_RESOURCES: process.env.LOGTO_RESOURCES,
    LOGTO_WELL_KNOWN_URL: process.env.LOGTO_WELL_KNOWN_URL,
    LOGTO_ISSUER_ENDPOINT: process.env.LOGTO_ISSUER_ENDPOINT,
    LOGTO_JWKS_URI: process.env.LOGTO_JWKS_URI,
    LOGTO_USERINFO_ENDPOINT: process.env.LOGTO_USERINFO_ENDPOINT,
    LOGTO_SCOPE: process.env.LOGTO_SCOPE,
    LOGTO_OPENID_PROVIDER_CONFIG_ENDPOINT: process.env.LOGTO_OPENID_PROVIDER_CONFIG_ENDPOINT,
    LOGTO_AUTHORIZATION_ENDPOINT: process.env.LOGTO_AUTHORIZATION_ENDPOINT,
    LOGTO_TOKEN_ENDPOINT: process.env.LOGTO_TOKEN_ENDPOINT,

    BREVO_API_KEY: process.env.BREVO_API_KEY,

    CALENDLY_API_KEY: process.env.CALENDLY_API_KEY,
    CALENDLY_OWNER_URL: process.env.CALENDLY_OWNER_URL,
    CALENDLY_EVENT_TYPE_URL: process.env.CALENDLY_EVENT_TYPE_URL,
    CALENDLY_USER_ID: process.env.CALENDLY_USER_ID,
    CALENDLY_EVENT_TYPE_ID: process.env.CALENDLY_EVENT_TYPE_ID,

    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY: process.env.NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
      {
        protocol: "https",
        hostname: "ms-application-assets.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "stripe.com",
      },
      {
        protocol: "https",
        hostname: "sharetribe.imgix.net",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "cdn.prod.website-files.com",
      },
    ],
  },
};

export default nextConfig;
