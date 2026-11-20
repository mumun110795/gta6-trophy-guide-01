# Leonida Legend — GTA VI Trophy Guide & Tracker

![make.fun bounty](https://make.fun/badge/gta6-trophy-guide-01.svg)
![rank](https://make.fun/badge/gta6-trophy-guide-01/mumun110795/gta6-trophy-guide-01/rank.svg)
![reward](https://make.fun/badge/gta6-trophy-guide-01/mumun110795/gta6-trophy-guide-01/reward.svg)

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI, built for the make.fun bounty [GTA 6 Trophy Guide](https://make.fun/bounty/gta6-trophy-guide-01).

Every trophy is listed with its official name, description and grade exactly as PlayStation publishes them — 1 platinum, 2 gold, 6 silver, 46 bronze, 28 of them hidden — and a guide written for this page in our own words: what to do, where and how, and when it can be missed. Each guide names the references it draws on (PSNProfiles, Exophase, PowerPyx, GTA Zone, HowToVideoGame) right beside the text.

## What's inside

- **Checklist & guides** — all 55 trophies as cards with an earned checkbox, a kind and (where PlayStation tracks one) its counter, plus a detail panel with the full cited guide for whichever trophy you open.
- **Filters everywhere** — text search, grade filter, kind chips (story, strangers & side missions, collectibles & exploration, activities & challenges, free-roam feats, completion) plus a dedicated Missable chip, an earned/unearned status filter, and a hide-earned toggle.
- **Spoiler shield** — hidden trophies stay blurred until you earn them or choose to reveal one, so a first playthrough stays a surprise.
- **Roadmap to the platinum** — five stages in the order the game hands the trophies out, from Gone Fishing to the 100% completion grind, with the habits worth starting in stage 1.
- **Missable watch** — the five trophies that can be left behind, including Positive Mental Attitude (flagged missable by PowerPyx), each with its reasoning and its sources.
- **A tracker that keeps your progress** — earned state and overall percentage are saved in your browser (localStorage), and progress can be exported to a JSON file and imported back on any machine.

## Running it

The app is plain static files with no build step. Serve the `app/` folder with any static file server and open it in a browser:

```
node serve-like static server of your choice, or:
npx serve app
```

It works fully offline — the app loads nothing from the network; the only fetch it ever makes is its own `data/trophies.json` sitting beside it.

## Handing it in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library:

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see `LICENSE`.

---

Built for [make.fun/bounty/gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01) · Join make.fun with my referral link: https://make.fun/r/vdsf53gd
