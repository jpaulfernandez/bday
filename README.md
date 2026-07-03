# Dana's Blossom Festival 🌸

A tiny Coral Island–inspired birthday game for Dana. The whole island threw a
festival for her birthday: lanterns on the lake, a sack-race field with bunting,
her own thatched beach house, a blossom garden, a fortune tent, and a matcha stall.
Visit all 5 stops to unlock the Grand Festival Prize on the main stage.

All art is hand-drawn SVG (no external asset packs) in `public/assets/festival/`,
including Dana's sprite and a "dateables"-style portrait. Progress is saved in the
browser via localStorage — no database.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Best experienced on a phone-sized viewport.

## Deploy (so Dana can play on her phone)

Push to GitHub and import into Vercel (zero config), then send her the link.
Progress persists on her device.

## Customize

- `src/data/config.ts` — names, titles, guide dialogue
- `src/data/treasures.ts` — the 5 festival stops + final prize: letter text,
  memories (swap the Unsplash placeholders for real photos!), compliments,
  fortunes, inside jokes, matcha menu, and the real-gift reveal
- `src/data/treasures.ts` -> `playlistUrl` — link a real Spotify/Apple Music playlist

## Controls

Joystick, tap-to-walk, or WASD/arrows. Space/Enter or the action button to
interact. Toggle to play as Bubbles the turtle 🐢 with the "Play as" button.
