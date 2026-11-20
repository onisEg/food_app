# Food Recipes

A recipe dashboard with account verification, an authenticated application layout, recipe administration and personal favourites.

[Open the live demo](https://food-app-six-sepia.vercel.app) · [View screenshot](https://raw.githubusercontent.com/onisEg/resume/23df91e50f87b60e1360d79edcc24cf77eb09b07/public/projects/food-recipes.webp)

## How the two views work

1. The authentication screens cover registration, email verification, login, forgotten passwords and password resets.
2. After login, the sidebar checks the user group. The `SuperAdmin` view exposes recipe administration, categories and user management. The regular user journey centres on browsing recipes and saving favourites.
3. Shared recipe data and authentication state live in separate contexts. The API URL module and validation helpers keep request paths and form rules outside the page components.

## Run locally

Use Node.js 22.12 or later and npm. From the repository root, run:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To build the distributable files in `dist/`, run `npm run build`. To serve that build locally, run `npm run preview`.

## Source guide

| File or directory | What to look for |
| --- | --- |
| [src/App.jsx](src/App.jsx) | Authentication routes and protected application layout. |
| [src/context/AuthContext.jsx](src/context/AuthContext.jsx) | Authentication state. |
| [src/modules/shared/components/SideBar/SideBar.jsx](src/modules/shared/components/SideBar/SideBar.jsx) | Navigation choices for each user group. |
| [src/modules/recipes/components](src/modules/recipes/components) | Recipe list, editor and favourites screens. |
| [src/services/api/urls.js](src/services/api/urls.js) | API addresses for the feature modules. |

## Manual walkthrough

With a regular test account, open Recipes, save a favourite and revisit Favourites. With an admin account, open Categories and the recipe editor and compare the sidebar. Testing both views requires accounts assigned the relevant groups by the service.
