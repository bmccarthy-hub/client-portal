# La Fête Studio — website + client proofing portal

A small Jekyll site, built for GitHub Pages, with two parts:

- **Public site** (`index.md`) — your studio homepage, hosted at your custom domain.
- **Client portal** — one private, unique page per client (`/clients/<slug>/`), gated by a
  username + passcode entered at `/login/`. Each client only sees their own proofs, project
  status, and an approve/request-changes form that emails straight to you.

Adding a client is one script (`scripts/new-client.sh`) plus dropping in their proof images —
no code changes needed for routine use.

## How it works

Every file in `_clients/` becomes its own static page (Jekyll's "collection" feature — the same
mechanism that powers most Jekyll blogs, just pointed at clients instead of posts). Each file's
front matter holds that client's name, wedding date, status, proof list, and a **hashed**
passcode. Nothing is generated dynamically on a server — it's still a plain static site, so it
stays free to host and works with GitHub Pages exactly like your personal site does.

The login page reads a small generated index of usernames + passcode hashes, checks the entered
passcode client-side (SHA-256, never sent anywhere), and redirects to the matching client page.

## 1. Set up the repo

1. Create a **new GitHub repository** and push this folder to it.
2. In **Settings → Pages**, set the source to the `main` branch, root folder.

**Repo visibility matters:** GitHub Pages on the free plan only serves sites from **public**
repositories — private-repo Pages requires GitHub Pro ($4/mo) or higher. If you keep this repo
public, anyone can view the source (including passcode *hashes*, never plain passcodes, and the
list of client usernames). If that's not acceptable, upgrade to GitHub Pro and make the repo
private, or ask about moving this to a small hosted backend later.

## 2. Connect your custom domain

1. Edit the `CNAME` file at the repo root — replace `www.lafetestudio.com` with your real domain.
2. At your DNS provider, add:
   - For `www.yourdomain.com`: a **CNAME** record pointing to `<your-github-username>.github.io`
   - For the bare/apex domain (`yourdomain.com`): four **A** records pointing to
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. In **Settings → Pages**, enter your custom domain and check **Enforce HTTPS** once the
   certificate is issued (can take up to a few hours).
4. Update `url:` in `_config.yml` to match your final domain.

## 3. Set up Formspree (for the approve / request-changes buttons)

1. Create a free account at [formspree.io](https://formspree.io) and add a new form — copy its
   form ID.
2. Put that ID in `feedback_form_id` for each client (or set one shared form for everyone).
3. The free plan covers **50 submissions/month**. Fine for a handful of clients; if you scale up,
   Formspree's paid tiers raise that cap.

## 4. Add a new client

From the repo root:

```
./scripts/new-client.sh
```

It asks for the client's name, URL slug, login username, wedding date, and a passcode — then
creates `_clients/<slug>.md` with the passcode already hashed (the plain passcode is never
written to disk). Then:

1. Drop their proof images into `assets/images/clients/<slug>/`.
2. List each proof under `proofs:` in their file (title, image path, optional notes).
3. Commit and push.
4. Send the client their **username** and **passcode** (send these separately — e.g. one by
   email, one by text — so a single intercepted message doesn't hand over both).

As the project moves along, just update that client's `status:` field to `design`, `proofing`,
`approved`, `printing`, or `complete` — the tracker on their page updates automatically.

## Security — what this does and doesn't protect against

This is a **static site**, so "private" here means *obscurity + a passcode check*, not real
authentication:

- The passcode gate runs in the client's browser. It stops casual snooping and link-guessing,
  but anyone who views page source on an *already-unlocked* page sees that client's own content
  (expected — that's what unlocking means) and the login page's index file lists all usernames
  and passcode *hashes* (not plain passcodes) for every client.
- Hashes are one-way, but a weak/short passcode could in theory be brute-forced offline by
  someone who really wanted to. Use passcodes that aren't trivially guessable, and rotate a
  client's passcode (just rerun the script with a new one, same slug) if you think it leaked.
- If you're handling something where this level of protection genuinely isn't enough (e.g.
  contracts with sensitive personal/financial data), consider GitHub Pro + a private repo, or a
  small hosted-auth service (Cloudflare Access, Netlify Identity) in front of the same pages.

For wedding proofs and artwork review, this tier — unlisted structure + passcode — is a common,
reasonable trade-off between effort and protection.

## Local preview (optional)

If you want to preview changes before pushing:

```
bundle install
bundle exec jekyll serve
```

Requires Ruby + Bundler installed locally. Otherwise, just push to a branch and check the
Pages deployment preview, the same way you've been working with your personal site.
