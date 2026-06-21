# Movie App

A cross-platform movie discovery app built with **Expo** and **React Native**. Browse trending films, search the TMDB catalog, watch trailers in-app, and save favorites to a personal list after signing in.

## Features

- Home feed with trending and popular movies
- Search movies via TMDB
- Movie detail pages with ratings, overview, and production info
- In-app YouTube trailers
- Save and unsave movies (requires login)
- Email/password and Google sign-in via Appwrite
- Profile tab and saved-movies tab

## Tech Stack

- [Expo](https://expo.dev) + [React Native](https://reactnative.dev)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- [TMDB API](https://developer.themoviedb.org/docs) for movie data
- [Appwrite Cloud](https://cloud.appwrite.io) for auth and saved movies

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)
- npm (comes with Node.js)
- [Expo Go](https://expo.dev/go) on your phone, **or** Android Studio / Xcode for emulators
- A [TMDB](https://www.themoviedb.org/settings/api) API key (Bearer token)
- An [Appwrite Cloud](https://cloud.appwrite.io) project

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Nour-Mohsen/movie-app.git
cd movie-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_MOVIE_API_KEY` | TMDB API Bearer token |
| `EXPO_PUBLIC_APPWRITE_PROJECT_ID` | Appwrite project ID |
| `EXPO_PUBLIC_APPWRITE_DATABASE_ID` | Appwrite database ID |
| `EXPO_PUBLIC_APPWRITE_COLLECTION_ID` | Appwrite collection for search metrics |
| `EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID` | Appwrite collection for saved movies |

> **Note:** Never commit `.env` to Git. It is already listed in `.gitignore`.

### 4. Appwrite setup

In the [Appwrite Console](https://cloud.appwrite.io):

1. **Auth → Settings** — enable **Email/Password** (and **Google** if you want Google sign-in).
2. **Settings → Platforms** — add:
   - **Android:** `com.anonymous.app`
   - **Apple:** `com.anonymous.app`
   - **Web:** `localhost` (and your production domain when deploying)
3. Create a **`saved_movies`** collection with document security enabled:
   - Attributes: `userId` (String), `movie_id` (Integer), `title` (String), `poster_url` (String), `saved_at` (DateTime, optional)
   - Unique index on `userId` + `movie_id`
   - Collection permission: **Create → Users**
   - Document permissions: owner read/update/delete on create

### 5. Start the development server

```bash
npx expo start
```

Then:

- Press **`a`** for Android emulator
- Press **`w`** for web browser
- Scan the QR code with **Expo Go** on your phone (same Wi‑Fi as your PC)

Other useful commands:

```bash
npm run web      # Start web only
npm run android  # Run native Android build
npm run ios      # Run native iOS build (macOS only)
npm run lint     # Run ESLint
```

## Project Structure

```text
app/                 # Screens and UI components (Expo Router)
  (auth)/            # Login and register
  (tabs)/            # Home, search, save, profile
  movie/[id].tsx     # Movie details + trailer
  components/        # Reusable UI components
context/             # Auth and toast providers
hooks/               # useFetch, useSaveMovie
services/            # TMDB API, Appwrite, auth
utils/               # Shared helpers
```

## Deploying the Web Version

This app supports static web export. To build locally:

```bash
npx expo export --platform web
```

The output is in the `dist` folder. You can deploy it to [Vercel](https://vercel.com), Netlify, or Cloudflare Pages.

After deploying, add your production URL as a **Web platform** in Appwrite and update Google OAuth redirect URLs if needed.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Registration fails | Enable Email/Password in Appwrite Auth settings |
| Google sign-in fails | Check OAuth platform and redirect URLs in Appwrite + Google Cloud |
| Trailer won't play | YouTube embed restrictions — try another movie |
| Expo Go can't connect | Use `npx expo start --lan` on the same Wi‑Fi, or `--localhost` with USB |

## License

This project is for personal and educational use.
