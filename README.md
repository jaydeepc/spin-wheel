# BYOT · BYOA Showcase Wheel

A kiosk for Piramal Finance's Investor Day. Hit the red button to spin the wheel, hit it again to stop;
the wheel docks in the corner and the use case it landed on takes the screen: the old way, the problem,
the BYOT/BYOA solution, the new way, the impact and the people who built it.

- `/` the kiosk. Space or Enter is the red button; Esc or the docked wheel goes back.
- `/admin` add, edit, reorder and hide use cases (up to 20). Locked behind a PIN.

Built with Next.js (App Router), React and GSAP, on the Piramal.ai light theme.

## Run it

```bash
npm install
cp .env.example .env.local   # then set ADMIN_PIN (six or more characters)
npm run dev                  # http://localhost:5183
```

## Configuration

| Variable | What it does |
| --- | --- |
| `ADMIN_PIN` | Unlocks `/admin`. Without it the admin page stays locked. |
| `ADMIN_SESSION_SECRET` | Long random string that signs admin sessions. Required on Vercel. |
| `BLOB_READ_WRITE_TOKEN` | Set by Vercel when a Blob store is connected. Content is then saved there. |

Content saved from the admin page goes to Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set, otherwise to
`data/showcase.json` beside the app. Until something is saved, the kiosk shows the built-in examples in
`src/data/seed.ts`, which are illustrative placeholders and are labelled "Sample content" on screen.
