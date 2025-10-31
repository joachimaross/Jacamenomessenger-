/** @type {import('next').NextConfig} */
const runtimeCaching = require('next-pwa/cache');
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching,
  disable: process.env.NODE_ENV === 'development'
})

module.exports = withPWA({
  reactStrictMode: true,
  images: {
    domains: ['cdn.sanity.io', 'source.unsplash.com', 'lh3.googleusercontent.com', 'platform-lookaside.fbsbx.com', 'i.scdn.co', 'pbs.twimg.com', 'scontent-sjc3-1.cdninstagram.com', 'scontent-sjc3-2.cdninstagram.com'],
  },
})
