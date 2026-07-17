# La Fête Studio — website + client proofing portal

A Jekyll site built for GitHub Pages, with three parts:

- **Homepage** — a portfolio-style landing page: hero, a "Recent Work" teaser grid, and a
  quick inquiry form.
- **Full portfolio page** (`/portfolio/`) — every work sample, grouped by category.
- **Client portal** — one private page per client (`/clients/<slug>/`), gated by a
  username + passcode entered at `/login/`, with proofs, a status tracker, and
  approve/request-changes buttons that email you.

## Adding a portfolio piece

Add a file to `_portfolio/` (copy an existing one, e.g. `piece-01.md`):

```yaml
---
title: "Gold Foil Invitation Suite"
category: "Invitation Suites"
image: /assets/images/portfolio/your-image.jpg
featured: true   # true = eligible for the homepage teaser (first 6 featured pieces show)
---
```

Drop the image into `assets/images/portfolio/`. No layout/CSS changes needed — new pieces
automatically show up on both the homepage teaser (if `featured: true`) and grouped by
`category` on `/portfolio/`.

## Adding a new client

From the repo root:

```
./scripts/new-client.sh
```

Creates `_clients/<slug>.md` with the passcode already hashed. Then:

1. Drop proof images into `assets/images/clients/<slug>/`.
2. List each proof under `proofs:` in that file (title, image path, optional notes).
3. Commit and push.
4. Send the client their username and passcode separately (e.g. one by email, one by text).

Update `status:` (`design` → `proofing` → `approved` → `printing` → `complete`) as the
project moves along — the tracker on their page updates automatically.

## Set up the repo

1. Create a GitHub repository, push this folder.
2. Settings → Pages → source: `main` branch, root folder.

Free GitHub Pages only serves **public** repos — private-repo Pages needs GitHub Pro or
higher. On a public repo, the source is viewable (including hashed, never plain-text,
client passcodes).

## Custom domain

1. `CNAME` file at the repo root already has `www.lafetestudio.com`.
2. DNS: a **CNAME** for `www` → `<your-github-username>.github.io`; four **A** records
   for the bare domain → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`,
   `185.199.111.153`.
3. Settings → Pages → enter the custom domain, check **Enforce HTTPS** once available.

Note: after DNS is correct, GitHub's own edge network still needs time to fully propagate
the domain → Pages-site mapping (separate from DNS propagation). It's normal to see
intermittent errors for a few hours after first connecting a custom domain.

## Formspree (inquiry form + client approve/request-changes buttons)

1. Create a free account at [formspree.io](https://formspree.io), add a form, copy its ID.
2. Put that ID in `inquiry_form_id` in `_config.yml` (homepage inquiry form) and in
   `feedback_form_id` for each client (proof approvals).
3. Free plan: 50 submissions/month.

## Fonts & palette

Headings use **Cormorant Garamond** (serif, romantic), body text uses **Karla** (clean
sans), loaded from Google Fonts in `_includes/head.html`. Colors live as CSS variables at
the top of `assets/css/style.css` (`--rosewood`, `--blush`, `--gold`, etc.) — change them
there to retheme the whole site at once.

## Security — what the passcode gate does and doesn't protect against

Static site, so "private" means obscurity + a passcode check, not real authentication:
passcodes are hashed (SHA-256), never stored in plain text, but a public repo means anyone
can see client usernames and hashes. Reasonable for wedding proofs; not for anything more
sensitive. See in-file comments in `assets/js/` for exactly how the check works.

## Local preview (optional)

```
bundle install
bundle exec jekyll serve
```
