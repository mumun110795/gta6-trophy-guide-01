// Leonida Legend — the roadmap to the platinum and the missable watch.
// Written for this guide from the official trophy descriptions: the stages
// follow the order the game itself hands the trophies out (chapters and
// named missions first, strands and activities alongside, the free-roam
// feats and the 100% grind last), and every missable note is anchored in
// what the trophy's own official description says.

export const ROADMAP = [
  {
    stage: 1,
    title: 'Arrival — the opening and Chapter 1',
    summary:
      'Play the campaign from the start and let the story trophies come to you. Gone Fishing and Chapter 1 ' +
      'cannot be missed, so this stage is about habits, not hunting: start a rotating manual save, get in ' +
      'every new vehicle you see for Whip It Good, and meditate at any spot you pass for Positive Mental ' +
      'Attitude — the one trophy PowerPyx flags as missable, and far easier to sweep district by district ' +
      'than in one endgame lap.',
    trophies: ['Just Like Paradise', 'Paradise Lost'],
    habits: ['Rotate a manual save from here on', 'Discover vehicles as you meet them', 'Meditate at spots while you pass them'],
  },
  {
    stage: 2,
    title: 'Making a name — Chapters 2 and 3',
    summary:
      'Chapters 2 and 3 open the map and the activity icons. Between story missions, try every activity ' +
      'type once for Master of None, begin the named missions (Breakfast Run, The Cartel Heist, Child’s ' +
      'Play, Headliners) as they appear, and start the long counters early: a collectible card set, WAiNK ' +
      'photo spots, and stunt jumps all reward steady progress over a final grind.',
    trophies: ['T**s Ass Drug Money', 'Vice City, Baby!', 'Trust', 'Break the Bank', 'Family Matters', 'DWNFALL', 'Master of None'],
    habits: ['One new activity type per session', 'Start card sets and WAiNK spots now', 'Open stranger strands as markers appear'],
  },
  {
    stage: 3,
    title: 'The big league — Chapter 4 and the strands',
    summary:
      'Chapter 4 plus the airport and military set pieces (VCIA Takedown, Operation Savage Glory) close ' +
      'out the mid-game. This is the stage to finish stranger strands: the finales for Andy, Kenton, ' +
      'Billy, Randy and Tyrone each carry their own trophy and count toward the eight strands of ' +
      'Strangers & Freaks. Keep an eye on the shooting range too — 42 gold medals for The Shootist is a ' +
      'marathon, and courses are easier learned while your aim is fresh from the story.',
    trophies: ['Top Of The World, Ma', 'Hi-Jacked', 'Snow Storm', 'Road to Rehabilitation', 'This Was No Boat Accident', 'The Lone Rider', 'Supply & Demand', 'Spin On This!', 'Strangers & Freaks'],
    habits: ['Finish strands before the finale', 'Chip away at Shooting Range golds', 'Bank a manual save before the endgame'],
  },
  {
    stage: 4,
    title: 'The finale — and the city is yours',
    summary:
      'Take the final mission with full armour and a save banked beforehand, in case a late choice ' +
      'matters for Actions Speak Louder. With the credits rolled, the world stays open: this is crime ' +
      'and commerce season. Vault robberies, the armoured truck, gang operations and the jewelry store ' +
      'feed Maximum Withdrawal, A Classic Blitz Play, Pest Control, Sneakthief and the Marked Bills ' +
      'laundering of Dime on the Dollar, while spending and garages close out Treat Yo Self and ' +
      'Little Boxes.',
    trophies: ['You Gotta Know When to Get Off', 'Maximum Withdrawal', 'A Classic Blitz Play', 'Pest Control', 'Sneakthief', 'Dime on the Dollar', 'Treat Yo Self', 'Little Boxes'],
    habits: ['Save before the final mission', 'Launder Marked Bills after every score', 'Register keepers in the Scooter Bros app'],
  },
  {
    stage: 5,
    title: 'The long road — 100% and the platinum',
    summary:
      'Everything left is a counter: 250 stunts, 20 race wins, a drone win at every location, 50 ' +
      'challenges, 100 vehicles, the whole map explored, and the remaining collectibles. Work the ' +
      'in-game completion checklist category by category until A Long Road pops at 100% — then the ' +
      'platinum, Vice Got a Price!, unlocks by itself. If a percentage stalls, compare categories ' +
      'rather than hunting at random; the last percent is always a category you forgot, not a secret.',
    trophies: ['A Long Road', 'Cunning Stunts', 'The Shootist', 'Earn Cash, Not Kudos', 'Top Fun', 'The Goodtime State', 'Vice Got a Price!'],
    habits: ['Grind counters district by district', 'Compare the completion checklist by category', 'The platinum pops on its own at 54/54'],
  },
];

export const MISSABLE_INTRO =
  'Five trophies on this list can be left behind by a careless run. One is flagged missable by PowerPyx; ' +
  'the other four earn their place from their own official descriptions — a choice, a one-off moment, a ' +
  'first attempt that has to go wrong. None of them needs a second playthrough if you know they are ' +
  'coming: keep a manual save before story branches, and clear each of these while the game has you in ' +
  'the right place.';

export const KIND_LABELS = {
  story: 'Story',
  side: 'Strangers & side missions',
  collectibles: 'Collectibles & exploration',
  activities: 'Activities & challenges',
  world: 'Free-roam feats',
  completion: 'Completion',
};
