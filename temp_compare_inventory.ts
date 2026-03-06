// @ts-nocheck
import { buildEstimate } from './lib/engine';

const inventoryText = `Living Room: upright piano + bench, sofa, 2 armchairs, heavy concrete coffee table, rug, shoe cabinet, wardrobe/armoire, delicate bar cabinet, small table, lamps, paintings/art, shelving + packed smalls
Dining Room: dining table, 8 dining chairs (incl. 2 from closet), rug, lamp, books/shelves (packed), wine glasses (packed), chandelier (pre-removed), 2 pictures
Breakfast Nook: small table, 2 chairs, dishware (packed), bottle display (packed), small ladder/step ladder
Kitchen: FULL cabinet pack (no fridge/stove/dishwasher), small appliances (coffee machine + grinder boxed), 2 small step ladders, trash can
Hallway / Laundry / Cleaning: laundry basket, cleaning supplies + shelves contents (packed), extra trash can, misc baskets
Hallway Office Storage: printer, document boxes/books, linen closet contents (towels/linens), misc drawer contents (packed)
Bedroom: king mattress ONLY (frame stays), dresser, wall lights (pre-removed), closet contents (packed)
Office: bookcase, nightstand, desk/table + chair, office chair, typewriter, chair + footrest, pedestal, shelf, 9x12 rug, suitcases, books, kettlebells/weights, lamps (3 total across house)
Bathrooms: towels + cabinet/drawer contents (packed), 2 stools
TV Room / Storage Room: large sofa, TV (boxed), TV stand/console, wine fridge, 2 lamps, weight bench, 2x adjustable 80-lb dumbbells + stand, shredder, vacuums, dehumidifier, subwoofer, lots of packed boxes/misc storage
Exterior / Patio: small patio set (table + 2 chairs), grill, 2 long planters (~6 ft, empty), 3 small pots, bench, 2 plastic cabinets, shelf system, watering can/bucket, flags/poles, misc exercise items, 4 security cameras (pre-removed)
Back House — Music Studio (client pre-packs small items/gear): 2nd upright piano (52\") + bench, 10 large keyboard boxes + 2 small keyboard boxes, studio desk (legs removed), rolling rack cabinet on wheels, 2 wall cabinets (to be removed), cabinet(s), multiple storage cabinets, side cabinet, 2 speaker sets + stands (stands broken down), amplifiers/rack units, 3 mic stands + misc stands, 2 keyboard stands, whiteboard, office chair, 9x12 rug, acoustic panels: ~30 total (10 loose + ~20 wall-mounted, pre-removed) — MUST be protected from crushing, toolbox, 2 air filters (boxed), dehumidifier`;

const res = buildEstimate({
  homeSize: '5',
  moveType: 'LD',
  distance: '5',
  packingLevel: 'Full',
  accessOrigin: 'ground',
  accessDest: 'ground',
  inventoryText,
  extraStops: [],
  inventoryMode: 'raw'
});

const rawInventoryVolume = (res.parsedItems || []).reduce((s, it) => s + it.cf, 0);
const grouped = Array.from((res.parsedItems || []).reduce((m, it) => {
  m.set(it.name, (m.get(it.name) || 0) + it.cf);
  return m;
}, new Map()).entries()).sort((a,b)=>b[1]-a[1]).slice(0,50);

console.log(JSON.stringify({
  rawInventoryVolume,
  billableCF: res.billableCF,
  truckSpaceCF: res.truckSpaceCF,
  finalVolume: res.finalVolume,
  totalManHours: res.totalManHours,
  crew: res.crew,
  timeMin: res.timeMin,
  timeMax: res.timeMax,
  confidence: res.confidence,
  auditSummary: res.auditSummary,
  unrecognized: res.unrecognizedDetails,
  topGroups: grouped,
  topItems: (res.parsedItems || []).sort((a,b)=>b.cf-a.cf).slice(0,30)
}, null, 2));
