# Vercel Deployment Instructions

Since the application has been pruned and restructured to use the isolated Next.js app located inside `/running-platform`, you need to configure your Vercel Project settings so Vercel knows where to look.

## How to Configure the Root Directory inside Vercel Dashboard

1. Push your latest code (with the `server/` and `client/` deletions) to GitHub.
2. Open your Vercel Project Dashboard.
3. Navigate to **Settings** > **General**.
4. Scroll down to **Root Directory**.
5. Click **Edit** and set the path to: `running-platform`
6. Save the settings. 
7. Re-deploy your project (or push a new commit to trigger a build).

> Note: Vercel will now automatically detect Next.js inside `/running-platform` and use `pnpm` gracefully mapping standard `next build` processes! 
> No custom install commands (`npm install ...`) or build overrides are necessary. Next.js handles serverless rendering natively without any custom Express `server.listen` logic.
