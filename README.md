# leveluper.com

Brand site for Leveluper / Mohamed Elghazali Mellaoui. Static Astro site.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
```

## Editing content

- **Projects**: one Markdown file per project in `src/content/projects/`.
  Copy `_template.md` to `my-project.md` and fill it in. It appears in the
  Projects window, on `/projects/`, at `/projects/my-project/` and in every
  agent file below automatically. The build fails if a required field is
  missing or `status` isn't one of `idea | validating | building | coming-soon | live | paused | archived`.
- **Everything else** (name, about text, socials, now, posts, email): `src/data/site.ts`.

## Agent-friendly outputs (generated at build time)

| URL | What it is |
|---|---|
| `/llms.txt` | Summary for AI agents ([llmstxt.org](https://llmstxt.org) format) |
| `/llms-full.txt` | About, now and every project in one Markdown file |
| `/projects.json` | All projects as structured JSON |
| `/projects/<id>.md` | Each project page as raw Markdown |
| `/sitemap.xml`, `/robots.txt` | Crawling; all agents allowed |

Every HTML page also carries schema.org JSON-LD (Person, Organization,
project list / SoftwareApplication) and `<link rel="alternate">` to its Markdown twin.

## Deploying (Coolify)

The repo includes a `Dockerfile` (Node 24 build, then nginx serving `dist/`).
In Coolify: **New Resource → Public/Private Repository** → this repo, branch `main`,
**Build Pack: Dockerfile**, **Port: 80**, domains `https://leveluper.com,https://www.leveluper.com`.
Every push to `main` redeploys.
