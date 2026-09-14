# Landon Shaffer — Portfolio

Static personal site for GitHub Pages. No build step.

## Test locally

From this folder:

```bash
py -3 -m http.server 8080
```

If `python` is on your PATH (and not the Microsoft Store stub):

```bash
python -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080).

## Host on GitHub Pages

1. Push this repo to GitHub (already set as `LandonShaffer/Portfolio`).
2. Repo **Settings → Pages**.
3. Source: **Deploy from a branch**.
4. Branch: `main`, folder: `/ (root)`.
5. Site URL: `https://landonshaffer.github.io/Portfolio/`
