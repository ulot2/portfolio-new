# Portfolio checklist

What changed in the redesign, and what still needs you. Tick things off as you
go, and delete this file once it is all done.

## Waiting on you

- [ ] **Screenshots of the projects.** The biggest thing still missing. Once
      you have them, the plan is: tilted "pasted into a notebook" frames, big on
      `/projects`, small on the home cards.
- [ ] **SoloStack description.** It repeats its question ("An all-in-one
      workspace for African freelancers"). One sentence on what makes it stand
      out. Edit in `src/data/projects.ts`.
- [ ] **LaseTales description.** Same problem ("A portfolio for an event
      videographer and editor"). Edit in `src/data/projects.ts`.
- [ ] **SecondLook link.** Not deployed yet, so it shows "In progress" with no
      link. When it goes live, set `liveUrl` and remove `inProgress: true` in
      `src/data/projects.ts`.
- [ ] **The "Now" note.** A first draft from your repos: SecondLook, Roost,
      Museum of Ordinary Things and Ferry. The Roost line comes from its code,
      not your LinkedIn (I can't reach LinkedIn from here), so check it.
      Rewrite it in your own words in `src/data/now.ts`, and move
      `NOW_UPDATED` forward each time you change it. The hero's "Now:" line
      names the first two entries, so put the ones you most want seen first.
      Keep it current (about once a month) or take the section out; a stale
      "now" looks worse than none.
- [ ] **GitHub loops above the footer.** It reads your public contributions
      page once a day and hides itself if that fails. I couldn't reach GitHub
      from my session, so check it shows on the live site after deploying.
      For a sturdier source, add a `GITHUB_TOKEN` environment variable in
      Vercel (a fine-grained token with no extra permissions is enough); it
      then uses GitHub's official API. Turn on "Private contributions" in
      your GitHub profile settings so private repos count. To work on the
      design locally without GitHub, run `CONTRIBUTIONS_SAMPLE=1 pnpm dev`.
- [ ] **Delete the showreel video** from Vercel Blob (store "portfolio-media")
      if you don't want to keep it. The reel was removed from the site.

## Check these are right

- [ ] **Project stacks** on `/projects`. Read from each repo's `package.json`;
      I picked four or five tools per project. Edit `stack` in
      `src/data/projects.ts`.
- [ ] **Project kinds** (Web app, Website, Command-line tool, Chrome extension,
      GitHub Action). Assigned from the descriptions.
- [ ] **Rewritten project descriptions.** cowrite, gitmop, Readtrail and
      hallway come from their READMEs. Dee's Agora is now just its tagline; a
      line about how debates are structured would say more. For BAMSSALADS,
      check "the host runs the contest on stage" is how it works.
- [ ] **Museum of Ordinary Things link** points to `https://moot.tnuell.sbs`,
      the address in the repo's deploy config.
- [ ] **Home page shows 6 projects** before "All 10 projects". Change
      `HOME_PROJECT_COUNT` in `src/data/projects.ts` for a different number.
      The order in that file is the order on the site.
- [ ] **CV:** the header, phone menu and footer now say "CV" and link to
      `/cv.pdf` (the new file). The old `/resume.pdf` address redirects there,
      so links you've already shared still work. The CV includes your phone
      number, so it's public on the site.
- [ ] **Copy I changed:** the blog intro now reads "Thoughts, technical deep
      dives, and lessons from building for the web." The role under your photo
      on articles now says "Software developer", not "Frontend Engineer".

## New on the site, to look over

### Home page
- [ ] Hero: bigger title on wide screens; "what's next." writes itself in
      stroke by stroke; the note, buttons and status line rise in after it.
- [ ] Say hello button outlined in yellow; "See my work ↓" replaces the reel.
- [ ] Projects: description, kind label and a Code link (where the code is
      public) under each name; only the first six show.
- [ ] New **Now** section between Projects and Writing, and a "Now: …" line
      under the Spotify line in the hero that jumps to it.
- [ ] Tools & Skills section removed.
- [ ] Above the footer: a looping pen line, like a line of handwriting, drawn
      from your GitHub commits (one loop per week; phones show the last six
      months). It writes itself in and ends in the yellow wordmark arrow, with
      a small caption saying what it's made from.

### Navigation
- [ ] Floating button (narrow screens) is a pen-drawn box showing the name and
      doodle of the section you're in; the panel has a doodle per section.
- [ ] Wide screens: the "Top" button has the same pen box.
- [ ] Side rail and floating button now list: Hello, Projects, Now, Writing,
      Contact, Blog.

### `/projects` (new page)
- [ ] Numbered catalogue: hand-lettered title with a tally, filters (All, Web
      apps, Tools, Websites), number, kind and stack in the margin, separate
      Visit and Code links, and a closing "Say hello".
- [ ] Phone layout: the number, kind and stack fold into lines above each entry.

### Blog index
- [ ] Portfolio header with "← Portfolio"; hand-lettered "writing" with a tally.
- [ ] Search is a pen line; topics are words underlined in pen; dates sit in
      the margin; RSS link at the foot.

### Blog articles
- [ ] Larger title; plain-text date, topics and share links with pen icons.
- [ ] Quotes and callouts marked with a yellow pen stroke down the margin.
- [ ] Your signature signs itself at the end, then your photo and links, then
      Earlier / Later posts.
- [ ] Light theme now works on articles (text, code and the quote toolbar).

## Known issues

- [ ] Markdown tables don't render in blog posts (they show as raw text). This
      was already the case; your one post doesn't use a table.

## Ideas for later

- [ ] A page per project (`/projects/<name>`): the "what if", what was hard,
      one or two decisions, screenshots, stack, links. Start with your best
      three.
- [ ] Feature two or three projects on the home page with a larger card and a
      screenshot.
- [ ] Share preview images for `/projects` and each project page.
- [ ] More writing; each project page could start as a "how I built it" post.
