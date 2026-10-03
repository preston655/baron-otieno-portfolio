# Baron Otieno Portfolio

A responsive static portfolio for Baron Otieno, built with HTML, CSS and JavaScript. It has no framework, package manager or build step.

## Project structure

```text
baron-portfolio/
├── index.html
├── styles.css
├── script.js
├── fonts/
│   ├── Manrope-Variable.ttf
│   ├── Syne-Variable.ttf
│   └── font licence files
├── .nojekyll
└── README.md
```

## Open the project in VS Code

1. Extract the downloaded ZIP file.
2. Open Visual Studio Code.
3. Choose **File > Open Folder**.
4. Select the extracted `baron-portfolio` folder.
5. Install the **Live Server** extension by Ritwick Dey from the Extensions panel.
6. Open `index.html` in VS Code.
7. Click **Go Live** in the lower-right corner, or right-click `index.html` and select **Open with Live Server**.

The portfolio should open in your browser. Edits will refresh automatically after you save a file.

## Main files to edit

- `index.html`: portfolio content and page structure
- `styles.css`: colours, typography, responsiveness and visual design
- `script.js`: droplets, ripples, counters, timeline and interactions

## Free deployment with GitHub Pages

GitHub Pages is a good fit because this is a static website and needs no server-side code.

### 1. Create a GitHub repository

1. Sign in at `https://github.com`.
2. Click **New repository**.
3. Name it `baron-otieno-portfolio`.
4. Set it to **Public**.
5. Do not add a README, `.gitignore` or licence on GitHub because those files already exist locally.
6. Click **Create repository**.

### 2. Publish from the VS Code terminal

Open **Terminal > New Terminal** in VS Code and run these commands one at a time:

```bash
git init
git add .
git commit -m "Launch Baron Otieno portfolio"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/baron-otieno-portfolio.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. GitHub or VS Code may ask you to sign in.

If Git asks for your identity before the commit, run:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-github-email@example.com"
```

Then run the commit and remaining commands again.

### 3. Turn on GitHub Pages

1. Open the repository on GitHub.
2. Select **Settings**.
3. Select **Pages** in the left sidebar.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder.
6. Click **Save**.
7. Wait one or two minutes, then refresh the Pages settings screen.

The public address will normally be:

```text
https://YOUR-USERNAME.github.io/baron-otieno-portfolio/
```

## Publish future updates

After changing and saving files in VS Code, run:

```bash
git add .
git commit -m "Update portfolio"
git push
```

GitHub Pages will update the live website automatically.

## Alternative deployment without Git

For a quick temporary deployment, visit `https://app.netlify.com/drop` and drag the extracted project folder into the page. Netlify will create a free public URL. GitHub Pages is recommended for easier version history and repeatable updates.
