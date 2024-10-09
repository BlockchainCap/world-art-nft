
## World Art


```bash
pnpm i 
pnpm dev

```

Required env variables

```
APP_ID="app_" (found in World dev portal)
DEV_PORTAL_API_KEY="api_" (found in World dev portal)
WLD_CLIENT_ID="app_" (found in World dev portal)
WLD_CLIENT_SECRET="sk_" (found in World dev portal)
NEXTAUTH_URL=http://localhost:3000/ (update this link with production link)
```

To run as a mini app choose a production app in the dev portal and use NGROK to tunnel. Set the `NEXTAUTH_URL` and the redirect url if using sign in with worldcoin to that ngrok url 

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

View docs: [Docs](https://minikit-docs.vercel.app/mini-apps)

[Developer Portal](https://developer.worldcoin.org/)

Try it out here: https://world-art-eta.vercel.app/

----

