# Darkrest Next.js Project Documentation

## Getting Started

1. Fork the repository.
2. Run `npm install` or `yarn install`.
3. Run `npm run dev` or `yarn dev`.
4. Open `http://localhost:3000` in your browser.

## Project Structure

- `app`: Next.js pages
- `components`: Reusable UI components
- `constants`: Static and mock data
- `lib`: Utility functions and classes
- `public`: Static files
- `src`: TypeScript source code
- `types`: Type definitions

## Key Dependencies

- `next`
- `@supabase/auth-helpers-react`
- `@supabase/supabase-js`
- `tailwindcss`

## Setup

1. Create `supabase_anon_key` and `supabase_url` environment variables.
2. Install dependencies.
3. Start the development server.

## Environment Variables

### Required Environment Variables

- `BLOB_READ_WRITE_TOKEN`: your-supabase-service-role-key
- `NEXT_PUBLIC_SUPABASE_URL`: https://your-supabase-instance.supabase.co
- `NEXT_PUBLIC_SUPABASE_KEY`: your-supabase-anon-public-key
- `NEXT_PUBLIC_GROQ_API_KEY`: your-groq-api-key
