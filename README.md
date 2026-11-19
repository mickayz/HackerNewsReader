# Hacker News

A small, installable Hacker News reader built as a single-page web app.

## Features

- Top, New, Best, Ask, Show and Jobs feeds, plus a local Saved list
- Story search (through the Algolia HN Search API)
- Infinite scroll and pull to refresh
- Threaded comments that collapse with a tap, with a button to jump to the next top-level thread
- Navigation at the bottom of the screen for one-handed use, with Back on the right and swipe right to go back
- Two-pane layout on wide screens and unfolded foldables, with the split aligned to the fold (uses the Viewport Segments API where the browser supports it)
- Light theme by default, an optional night mode, and adjustable text size
- Read tracking with a count of new comments since your last visit
- Offline support through a service worker that caches the app and recently loaded stories
- Installable as a home screen app (web app manifest and icons)

## Data

Stories come from the official Hacker News API (`hacker-news.firebaseio.com/v0`). Comment trees come from the Algolia HN Search API (`hn.algolia.com/api/v1`), with a fallback to the official API. Comment HTML is rebuilt from an allowlist of tags before display.

## Running

There is no build step. Serve the folder over HTTPS (or `localhost`) with any static file server, for example:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.
