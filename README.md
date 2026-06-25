# NutriLook

A React app for looking up nutrition data — calories, macros, ingredients, allergens, and food photos — for both packaged products and whole foods.

---

## What it does

- Search any food by name (e.g. "Nutella", "chicken breast", "oat milk", "tofu")
- Shows calories, protein, fat, carbs, fiber, sugar, saturated fat, and salt
- Displays the Nutri-Score grade and NOVA processing group where available
- Lists allergens and full ingredients text for packaged products
- Shows which database answered the query (Open Food Facts, USDA)

---

## Data sources

The app queries two nutrition APIs in order, falling back to the next if no result is found:

| Priority | Source | Best for | API key |
|---|---|---|---|
| 1 | [Open Food Facts](https://world.openfoodfacts.org) | Packaged & branded products | Not required |
| 2 | [USDA FoodData Central](https://fdc.nal.usda.gov) | Raw whole ingredients (chicken, rice, tofu) | Free |


---

## Project structure

```
food-nutrition/
├── api/
│   └── nutrition.js          # Vercel serverless function (USDA proxy)
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── constants/
│   │   └── macros.js         # Macro colour/label config
│   ├── hooks/
│   │   └── useOpenFoodFacts.js  # Data fetching logic (OFF → Nutritionix → USDA)
│   └── components/
│       ├── Navbar.jsx
│       ├── MacroBar.jsx
│       ├── BenefitChip.jsx
│       └── NutritionCard.jsx # Main results display
├── .env.example
├── package.json
└── vite.config.js
```

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/biminkoju/NutriLook.git
cd NutriLook
npm install
```

### 2. Set up environment variables

Copy the example env file:

```bash
cp .env.example .env
```

Fill in your keys (all optional — see below for where to get them):

```env
USDA_API_KEY=
```

### 3. Run locally

The app uses a Vercel serverless function to proxy the USDA API, so use `vercel dev` instead of `npm run dev`:

```bash
npm install -g vercel
vercel dev
```

This runs both the Vite frontend and the `api/` functions together at `http://localhost:3000`.

If you don't have a USDA key yet and just want to test with packaged foods, `npm run dev` works fine — only the USDA fallback won't function.

---

## API keys

### USDA FoodData Central 
- Sign up at [fdc.nal.usda.gov/api-key-signup](https://fdc.nal.usda.gov/api-key-signup)
- Free, instant, no credit card
- Used server-side via the `/api/nutrition` proxy — never exposed to the browser

---
## Why the USDA key is server-side only

`VITE_` prefixed variables are bundled into the client-side JavaScript at build time, making them visible to anyone who inspects the page source. The USDA key is proxied through `api/nutrition.js` instead, so it lives only in Vercel's encrypted environment and is never sent to the browser.

---

## Tech stack

- [React](https://react.dev) + [Vite](https://vitejs.dev)
- Vercel serverless functions (for the USDA proxy)
- No UI component libraries — all styles are inline