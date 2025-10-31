# Jacameno Messaging App

## Deployment (Vercel)

1) Create `.env.local` (or set Vercel Project Environment Variables) with:

- NEXT_PUBLIC_VAPID_PUBLIC_KEY
- NEXT_PUBLIC_WS_URL
- VAPID_PUBLIC_KEY
- VAPID_PRIVATE_KEY
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- TWITTER_API_KEY
- TWITTER_API_SECRET
- TWITTER_ACCESS_TOKEN
- TWITTER_ACCESS_TOKEN_SECRET
- EMAIL_HOST
- EMAIL_PORT
- EMAIL_SECURE (true/false)
- EMAIL_USER
- EMAIL_PASS
- ENABLE_FACEBOOK_API (default false)
- FACEBOOK_APP_ID
- FACEBOOK_APP_SECRET
- FACEBOOK_ACCESS_TOKEN
- TWILIO_ACCOUNT_SID
- TWILIO_AUTH_TOKEN
- TWILIO_PHONE_NUMBER

2) Build command: `next build` (default)
3) Output: Next.js default (no vercel.json required)

## Scripts

- dev: `next dev`
- build: `next build`
- start: `next start`
- lint: `next lint`
- lint:fix: `eslint . --fix`
- typecheck: `tsc --noEmit`

## Notes

- Facebook API routes are disabled unless `ENABLE_FACEBOOK_API=true`.
- `next.config.js` allows remote images from any https host. Tighten in production if needed.
