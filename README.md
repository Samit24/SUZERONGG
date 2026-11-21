# Suzeron

Personal portfolio of **Samit Pudasaini**, Security Engineer (threat hunting, SIEM, incident response).

Live site: https://www.samitpudasaini.com.np

Built with React, TypeScript, Vite, Three.js (the 3D threat globe) and GSAP scroll animations.

## Edit content

Everything on the page (bio, career, projects, certifications, links) lives in `src/config.ts`.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs dist/
```

Pushing to `main` deploys `dist/` through `.github/workflows/deploy.yml`
(Settings → Pages → Source must be set to "GitHub Actions").

- `public/`: CNAME, robots.txt, sitemap.xml, manifest, 404 page, images and certificate PDFs

## Credits

Layout and animation code adapted from the MIT-licensed
[portfolio-website](https://github.com/red1-for-hek/portfolio-website) by Redoyanul Haque;
see `LICENSE-template.txt`.
