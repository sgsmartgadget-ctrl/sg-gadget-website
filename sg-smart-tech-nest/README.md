# SG SMART TECH NEST online store starter

A responsive static storefront with product categories/search, a working browser-side cart, checkout form, WhatsApp order handoff, and Cloudflare Pages Functions for Paystack transaction initialization and verification.

## What's working out of the box
- Responsive storefront and product cards
- Product search and category filters
- Add/remove products and quantity changes in the cart
- Checkout form validation in the browser
- WhatsApp order message handoff to `+234 805 877 5042`
- Checkout gracefully falls back to WhatsApp if the payment backend is not configured

## What requires your setup before public launch
- Register/sign in to Cloudflare and deploy this folder as a Pages project (or deploy through a connected Git repository).
- Add the Cloudflare Pages environment variable `PAYSTACK_SECRET_KEY` using your **Paystack test secret key first**. Do not put the secret key in `app.js`, HTML, or any public file.
- Configure Paystack test/live mode and verify a successful payment end-to-end. Only switch to the live secret key after testing.
- Create/verify your Paystack merchant account and complete whatever business verification Paystack requires.
- Register a domain after checking availability, then connect it to the Pages project in Cloudflare.
- Confirm product stock, photos, descriptions, current prices, delivery fees, returns policy, privacy notice, and customer support process.
- Add durable order storage and notifications (for example, an order database/email notification) before relying on this as a full order-management system. This starter does not store orders in a database.

## Deploy on Cloudflare Pages (no build step)
1. Sign in at https://dash.cloudflare.com/ and open **Workers & Pages**.
2. Choose **Create application → Pages**. For a direct upload, choose **Upload assets / Direct Upload** if available in your dashboard and upload the site folder/zip. Alternatively push these files to a GitHub repository and import it into Pages.
3. The top-level `index.html` must be included. For a static/no-build project use no build command (or `exit 0`) and the root folder as the output directory.
4. In your Pages project settings, add `PAYSTACK_SECRET_KEY` as an environment variable. Use a Paystack test secret for the first deployment. Redeploy after changing variables.
5. Test a full payment in test mode. The `/api/paystack/initialize` function calculates totals from its own server-side price table; the browser does not decide the charged amount. `/api/paystack/verify` checks transaction status with Paystack.
6. Register your chosen domain with a registrar after checking availability. In Cloudflare Pages, open **Custom domains → Set up a domain** and follow the instructions. Apex domains need their DNS zone/nameservers configured as Cloudflare describes.

Cloudflare static deployment docs: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
Custom domains docs: https://developers.cloudflare.com/pages/configuration/custom-domains/
Paystack payment docs: https://paystack.com/docs/payments/accept-payments/

## Business details in this starter
- Brand: SG SMART TECH NEST
- Slogan: If it's not smart, then it's not SG SMART TECH NEST.
- WhatsApp: 08058775042
- Calling line: 08141100222
- Email: sgsmartgadget@gmail.com
- Delivery statement: Nigeria's 36 states and Ghana
- Website previously shared: https://sg-smart-tech-nest.pages.textmint.ai (confirm ownership/current status before replacing or redirecting it)

## Product data
Starter products/prices are in `app.js`; payment prices are separately duplicated in `functions/api/paystack/initialize.js` for server-side trust. Keep the two price lists in sync. The laptop example intentionally has no price and opens WhatsApp. Update product descriptions/specifications and confirm all prices before going live.

## Important limitations
This is a starter storefront, not yet a complete commerce backend: it does not persist carts across devices, store orders, manage inventory, calculate delivery charges, send receipts, or provide an admin product dashboard. Paystack initialization and verification code are included but online payments are not active until configured and tested with your account. Verification displays transaction status; an operator should still reconcile paid orders and delivery details.
