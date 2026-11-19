# App docs: the manual that ships with your app

Every app can carry a manual for the people who use it: how to set it up, how to use it day to day,
what its settings do, what to do when something looks wrong. The manual lives in the app's own repo,
ships with every release, and for first-party apps is published on
[docs.smartlinks.app](https://docs.smartlinks.app) straight from the stable release. Nobody copies it
anywhere: release the app and its manual is live.

## Where it goes

```
public/
  app.manifest.json
  docs/
    index.md          ← front page
    setup.md
    settings.md
    images/
      inbox.png
```

`public/docs/` is copied into the build like any static file, so it reaches the CDN with the release:
`https://smartlinks.app/apps/<appId>/<channel>/docs/index.md`.

Keep internal notes (designs, plans, decisions) in `src/docs/` or anywhere outside `public/`.
Everything in `public/docs/` is public.

## Declare it in the manifest

```jsonc
// public/app.manifest.json
"docs": {
  "pages": [
    { "file": "docs/index.md", "title": "Messages", "description": "Send campaigns and answer people in one inbox.", "audience": "team" },
    { "file": "docs/setup.md", "title": "Setting up", "description": "Senders, channels and who can reply.", "audience": "admin" },
    { "file": "docs/settings.md", "title": "Settings", "audience": "admin" }
  ]
}
```

| Field | |
|---|---|
| `pages[].file` | Path in the build, relative to `public/`. |
| `pages[].title` | Title in the docs menu. |
| `pages[].description` | One sentence: what the page helps with. Shown in listings and search. |
| `pages[].audience` | `team` (staff using the app, default), `admin` (setting it up), `customer` (the public), `developer` (building on it). |
| `listed` | `false` keeps the manual off docs.smartlinks.app. Default `true`. |

The first page is the front page. Pages appear in the order listed.

## Writing the pages

- Write for the person in front of the screen, in their words: "New campaign", not "the campaign
  creation flow". Name buttons and screens exactly as the app shows them.
- One page per job: getting started, setting up, each main task, settings, troubleshooting.
- Short numbered steps for anything done in order.
- Images: put them in `public/docs/images/` and link them relatively (`![The inbox](images/inbox.png)`).
  Links between pages are relative too (`[Setting up](setup.md)`). The docs site rewrites both.
- Start each page with a `# ` heading. No frontmatter needed: the manifest carries title and order.

## Keep it current

Update the manual in the same change as the behaviour. Forge checks at release time: an app with no
`docs`, or a release whose code changed while `public/docs/` did not, gets a prompt to look at the
manual. It never blocks a release.

## Related

- [`ai-guide.md`](ai-guide-template.md) is for the AI that configures the app, not for people. Keep
  both: the AI guide says what to set, the manual says how to use it.
- The manifest's `adminViews`, `functions` (with `agent` for [agent tools](agent-tools.md)) and
  `assistant` blocks describe the app to software. The docs site lists them on a generated
  reference page; the manual is the human-written part.
