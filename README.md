# Food Recipes

Food Recipes is a React dashboard for managing a recipe catalogue and saving personal favourites. A reader can search the catalogue and build a collection. An administrator can maintain recipes and categories and review user accounts. Both use the same frontend and external API.

[Open the demo](https://food-app-six-sepia.vercel.app) · [Browse the source](https://github.com/onisEg/food_app)

## Run locally

Use Node.js 24 and npm, then run the following commands from a terminal.

```sh
git clone https://github.com/onisEg/food_app.git
cd food_app
npm ci
npm run dev
```

Open the address Vite prints. A signed-out visit opens the login form. To review the reader experience, register an account with an email address that can receive the verification code. Reviewing the administration screens requires an account assigned the `SuperAdmin` group by the API.

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the versions recorded in the lockfile. |
| `npm run dev` | Run the development server with hot reload. |
| `npm run lint` | Run ESLint across the project. |
| `npm run build` | Bundle the frontend into `dist/`. |
| `npm run preview` | Serve the built files locally after a successful build. |

## Screens and roles

| URL | How to use it |
| --- | --- |
| `/`, `/login` | Sign in with email and password. The account layout redirects a visitor with a stored token to the dashboard. |
| `/register`, `/verify` | Create an account, then enter the verification code. The registration screen passes the email to verification through router state. |
| `/forget-password`, `/reset-password` | Request a reset, then submit the email, reset code and new password with confirmation. |
| `/dashboard` | Open the signed-in landing page and summary cards. |
| `/recipes` | Browse and filter recipes. Administrators manage recipes here. Readers can toggle favourites. |
| `/favorites` | View saved recipes for the signed-in reader and remove entries. |
| `/categories`, `/users` | Open category maintenance and the user directory from the administrator sidebar. |
| `/profile`, `/ChangePassword` | Review or edit account details and change the current password. |
| `/recipe-data` | Displays a placeholder. The implemented recipe editor opens inside the Recipes list. |

The sidebar selects links using the decoded `userGroup` claim. The shared route guard checks for decoded login data and sends signed-out visitors to `/login`. Role-specific controls are implemented in the UI, while the external API determines whether a request is permitted.

## Account and session lifecycle

| Action | API call | Details |
| --- | --- | --- |
| Register | `POST /Users/Register` | The form collects username, email, country, phone number, password and confirmation. On success it opens verification. |
| Verify or resend | `PUT /Users/verify` or `POST /Users/verify` | Verification sends email and code. Resending sends the email. Opening verification directly loses the registration email context. |
| Sign in | `POST /Users/Login` | Stores the returned token under `token` in local storage, decodes its claims and opens the dashboard. |
| Recover access | `POST /Users/Reset/Request`, then `POST /Users/Reset` | The reset request passes the email to the next screen. The reset form calls the code field `seed`. |
| Change password | `PUT /Users/ChangePassword` | Sends `oldPassword`, `newPassword` and `confirmNewPassword`. |
| Read or update profile | `GET /Users/currentUser`, `PUT /Users` | Updates use form data. An image update sends the selected file, existing profile details and password confirmation. |

On reload, AuthContext reads and decodes the stored token. The shared Axios client reads local storage before each request and attaches the bearer token when present. Logout clears both local storage's token and the in-memory login data. The sidebar's collapsed preference is stored separately under `sidebarCollapsed`.

## Recipe catalogue and editing

The recipe table starts at five records per page. Changing the name search, tag, category, page number or page size triggers another request. The API receives `name`, `tagId`, `categoryId`, `pageNumber` and `pageSize`. The component also retrieves the tag and category choices. A typical list request with a name filter looks like this:

```http
GET /api/v1/Recipe?name=soup&pageNumber=1&pageSize=5
```

The data provider uses the response body's `data` array for the rows and reads `totalNumberOfPages` and `totalNumberOfRecords` for pagination and counts. An administrator opens the add or edit modal in this same list. Saving sends multipart form data to `POST /Recipe` for a new recipe or `PUT /Recipe/{id}` for an existing one.

| Form field | What the client sends |
| --- | --- |
| Name and description | `name` and `description` as text |
| Price | `price` parsed as an integer. The editor displays EGP. Fractional input loses its fractional part during conversion. |
| Classification | A numeric `tagId` and the selected `categoriesIds` value |
| Image | The selected file as `recipeImage`. An edit without a replacement can send the existing `imagePath`. |

Deleting a recipe calls `DELETE /Recipe/{id}` and refreshes the list after success. For a repeatable review, create a disposable recipe, edit it once while keeping the image, then replace the image and inspect the saved result.

## Favourites, categories and users

**Favourites.** The API represents a saved item as a separate record containing a nested recipe. Adding recipe 42 sends `{"recipeId":42}` to `POST /userRecipe`. If `GET /userRecipe` returns a saved row with `id: 9` and `recipe.id: 42`, removing that saved item uses `DELETE /userRecipe/9`. This lets a reader remove an item from their collection while keeping the catalogue recipe.

**Categories.** The management table initially requests six rows per page and supports name filtering. Read and create use `GET /Category` and `POST /Category`. Edit and delete use `PUT /Category/{id}` and `DELETE /Category/{id}`. Successful mutations trigger a category refresh. Recipe tags are loaded separately from `GET /tag`.

**Users.** The directory starts with ten rows per page. Username, country, group and pagination go to `GET /Users`. Email filtering runs in the browser on the returned page, so an empty email match may mean the account is on a different page. The delete operation targets `DELETE /Users/{id}`.

## Code guide

| Source | Responsibility |
| --- | --- |
| `src/main.jsx`, `src/App.jsx` | Mount the app and define public and protected routes. |
| `src/context/AuthContext.jsx` | Restore login state, decode the JWT and clear the session. |
| `src/context/DataContext.jsx` | Coordinate catalogue, category, user, favourite and profile requests. Hold shared lists, loading flags and pagination metadata. |
| `src/services/api/index.js`, `src/services/api/urls.js` | Configure Axios, request authorization, API paths and the image origin. |
| `src/services/validations.js` | Field validation rules reused by the account forms. |
| `src/modules/authentication/`, `src/modules/shared/` | Account forms, layouts, sidebar, route guard and reusable UI. |
| `src/modules/recipes/`, `src/modules/categories/`, `src/modules/users/` | Feature screens, tables, editing modals and profile controls. |
| `src/modules/HomeModule/` | Dashboard and summary cards. |

The frontend uses React 18, React Router 6 and Vite 5. Forms use React Hook Form, requests use Axios, and interface components use Bootstrap, React Bootstrap and React Pro Sidebar. For a changed list result, trace the screen's filter state first, then the matching DataContext request, then the API response.

## Deployment and troubleshooting

Deploy the contents of `dist/` after building. Configure the host to serve `index.html` for browser routes such as `/login` and `/recipes`. The API base is configured in source as `https://upskilling-egypt.com:3006/api/v1`. Uploaded images use the same origin without `/api/v1`. A local build still depends on the external backend for login and data.

| Symptom | Where to look |
| --- | --- |
| Verification reports a missing email | Enter through registration so the verify screen receives the email in navigation state. |
| Dashboard has different sidebar links for two accounts | Check whether the signed-in user's group is `SuperAdmin` or `SystemUser`. |
| A recipe photo is missing | Inspect the image request against the image origin and the stored recipe image path. |
| A refresh on a nested URL returns a host 404 | Test a direct visit to `/login` and check the host's single-page fallback. |
| Pagination changes unexpectedly | Category, user and recipe fetches share a `totalPages` value in DataContext. Check which request last wrote the value. |

## Acceptance walkthrough

1. In a fresh browser session, open `/recipes` and confirm that login appears. Register a disposable reader, verify the code and sign in.
2. As a reader, apply a name and category filter, save one recipe, open Favorites and reload. Remove the entry and confirm the recipe still appears in the catalogue.
3. As an administrator, create a disposable category and recipe, edit the recipe, then delete the recipe before deleting its category. Verify the list after each operation.
4. Open Profile, edit the test account, revisit the page and check the returned details. Sign out and try a protected route again.

### Review results

The original lint run at `8a3aadb` reported 72 errors and 13 warnings. After the fixes, the production build passes and ESLint reports zero errors and eight warnings. Six warnings concern data-fetching effects and two concern Fast Refresh module boundaries. Vite still reports a JavaScript chunk over 500 kB. The attempted Chromium smoke test stopped before launch because the runtime blocked socket creation. The authenticated walkthrough remains pending.

The profile editor now attaches server errors to form fields via React Hook Form. Recipe and user tables read the provider's loading flag, the reader dashboard skips the administrator user-directory request, and registration revalidates password confirmation when either field changes. Duplicate endpoint definitions were removed, shared components declare their expected props, and registration and profile submissions no longer log their form payloads on success.

## Improvements to validate next

| Priority | Issue and impact | Implementation and acceptance check |
| --- | --- | --- |
| High | Lists share loading and pagination state. A slower category response can overwrite the recipe page count. Several effects reference provider callbacks recreated on render. | Give each resource its own request state, stabilize its fetch function and ignore stale responses. Delay category and recipe responses independently, change filters twice, and verify the latest rows, spinner and page count. Check that dependency changes do not cause repeated requests. |
| High | On a cold visit to a protected URL, the guard can redirect before AuthContext restores the stored token. Invalid tokens can also fail during decoding. | Resolve the initial session before routing and handle invalid or expired tokens. Test a direct recipe link with a valid session, an expired session and a fresh browser. |
| Medium | Dashboard counts depend on limited list responses. Filtering users by email searches only the current page. | Confirm backend support for aggregate counts and email queries. Test a dataset spanning multiple pages, including a match on the final page. Verify the dashboard count independently of page size. |
| Medium | The recipe editor converts a price to an integer. Decimal input can lose precision. | Agree on price units and precision with the API before changing the form. Save and reopen a whole-unit value and a fractional value and compare their displayed and stored prices. |
| Medium | Authenticated reader and administrator flows have no automated regression suite. | Add fixtures for both groups and cover login, favourites, recipe edits, profile rejection and logout. Verify integration separately with disposable accounts. |
| Low | The build emits a chunk-size warning. Context modules also export hooks alongside providers, triggering two Fast Refresh warnings. | Measure the initial login bundle before splitting routes. Separate hook/context exports from provider components and confirm both hot reload and direct route loading. |
