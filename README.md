# CACA PACK Website

Responsive multi-page starter website based on the supplied CACA PACK UI reference.

## Pages
- `index.html` — Homepage
- `about.html` — About Us
- `products.html` — Our Products
- `solutions.html` — Packaging Solutions
- `sustainability.html` — Sustainability
- `blog.html` — Blog / Insight
- `contact.html` — Contact Us

## Preview locally
Open `index.html` in a browser. For a local development server, run:
```bash
python -m http.server 8000
```
Then visit http://localhost:8000.

## Publish with GitHub Pages
1. Create a new repository on GitHub (for example `caca-pack-website`).
2. Upload all files and folders from this project to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then Save.
6. Wait for deployment. GitHub will show the public website URL in the Pages section.

## Before publishing
- Replace sample address and phone number in `contact.html` with the company's real details.
- Update the email address if needed.
- Replace sample article content in `blog.html`.
- Replace remote demo photos with your own product/factory photos where available.
- The contact form currently opens the visitor's email application using `mailto:`. For direct form submissions without an email app, connect a form backend such as Formspree or a custom API.
- This is a static front-end website; user accounts, database, admin dashboard, and order management require a backend service.
