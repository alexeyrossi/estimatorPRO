export const BLANKETS_TABLE = {
  "sectional": 6, "sectional sofa": 6,
  "sofa": 3, "couch": 3, "sleeper sofa": 4, "loveseat": 2,
  "recliner": 2, "armchair": 2, "accent chair": 2,
  "king bed": 3, "queen bed": 3, "full bed": 2, "twin bed": 2,
  "adjustable bed": 3, "adjustable base": 3,
  "headboard": 1, "footboard": 1,
  "dresser": 2, "chest of drawers": 2, "bureau": 2, "triple dresser": 3,
  "armoire": 4, "wardrobe": 3, "china cabinet": 4, "hutch": 3,
  "dining table": 2, "kitchen table": 2, "conference table": 4,
  "tv": 1, "tv stand": 2, "media console": 2, "entertainment center": 3,
  "fridge": 2, "refrigerator": 2, "washer": 1, "dryer": 1,
  "piano": 3, "upright piano": 3, "grand piano": 5,
  "grandfather clock": 2,
  "mirror": 1, "artwork": 1, "glass": 1
};

export const DA_TIME_TABLE = {
  "king bed": 25, "cal king bed": 25, "queen bed": 20, "full bed": 18,
  "double bed": 18, "twin bed": 15, "bunk bed": 45, "loft bed": 45,
  "adjustable bed": 40, "adjustable base": 40,
  "crib": 20, "daybed": 15, "murphy bed": 60,
  "sectional": 20, "sectional sofa": 20, "sleeper sofa": 15, "sofa bed": 15,
  "treadmill": 30, "elliptical": 35, "peloton": 20, "exercise bike": 15,
  "rowing machine": 20, "multi gym": 60, "weight bench": 15, "bowflex": 45,
  "dining table": 15, "kitchen table": 12, "conference table": 20,
  "desk": 15, "l desk": 25, "standing desk": 20, "executive desk": 20,
  "armoire": 25, "wardrobe": 20, "china cabinet": 15, "hutch": 15,
  "pool table": 180, "arcade machine": 10, "pinball machine": 15,
  "trampoline": 40, "trampoline large": 60, "playset": 120,
  "piano": 0, "safe": 0
};

export const EFFORT_MULTIPLIER = {
  "piano": 5.0, "safe": 4.0, "pool table": 4.5,
  "marble": 3.0, "stone": 3.0, "arcade": 3.0,
  "sectional": 1.5, "fridge": 1.5, "treadmill": 2.0,
  "adjustable": 2.0, "rolling toolbox": 2.0,
  "box": 0.5, "bin": 0.5, "bag": 0.3
};

export const FRAGILE_KEYWORDS = ["mirror", "glass", "china", "lamp", "tv", "artwork", "picture", "wine", "vase", "crystal", "antique", "statue", "marble", "stone", "arcade", "pinball", "clock", "plant", "wine fridge", "wine cooler", "gaming console", "ps5", "xbox setup", "large pet enclosure", "hamster cage", "terrarium"];

// Items that REGULARLY require heavy lifting — trigger HEAVY badge
export const TRUE_HEAVY_ITEMS = [
  "piano", "grand piano", "baby grand", "upright piano",
  "safe", "gun safe", "large safe",
  "pool table", "billiards table",
  "commercial fridge", "french door fridge", "double door fridge", "2-door fridge",
  "vending machine", "commercial oven",
  "server rack",
  "hot tub", "jacuzzi",
  "riding mower",
  "motorcycle",
  "marble", "stone", "granite",
  "large statue", "fountain",
  "grandfather clock", "clock large",
  "arcade machine", "pinball", "slot machine",
  "lathe", "milling machine", "machinery",
  "treadmill", "elliptical", "running machine", "cross trainer",
  "adjustable bed", "adjustable base", "sleep number",
  "copier", "large copier",
  "china cabinet", "conference table", "armoire", "solid wood armoire"
];

// Items that need special equipment/space but do NOT trigger the HEAVY badge
export const BULKY_ITEMS = [
  "rowing machine", "multi gym",
  "power rack", "smith machine", "squat rack",
  "tool chest", "rolling toolbox",
  "pallet", "skid", "crate"
];

// Combined list for lift-gate recommendation and logistics
export const LIFT_GATE_ITEMS = [...TRUE_HEAVY_ITEMS, ...BULKY_ITEMS];

export const LEAGUE_1_ITEMS = [
  "treadmill", "elliptical", "peloton", "exercise bike", "spin bike",
  "rowing machine", "multi gym", "weight bench",
  "washer", "dryer", "stove", "dishwasher",
  "fridge", "refrigerator", "commercial fridge",
  "tool chest", "workbench", "rolling toolbox",
  "adjustable bed", "adjustable base", "sleep number"
];

export const LEAGUE_2_ITEMS = [
  "grand piano", "baby grand piano", "upright piano", "piano",
  "safe", "gun safe", "large safe",
  "pool table", "marble table", "stone table",
  "hot tub", "jacuzzi",
  "arcade machine", "pinball machine", "slot machine",
  "grandfather clock", "riding mower", "server rack"
];

export const VOLUME_TABLE = {
  // --- Furniture ---
  "bed": 60, "shelf": 20, "shelves": 20, "rack": 20, "patio": 20, "patio item": 20,
  "shelving unit": 20,
  "plastic": 10, "linen": 10, "clothes": 10, "misc": 10, "item": 10,
  "table": 25, "tables": 25, "folding table": 15, "cafeteria table": 25,
  "sectional": 120, "sectional sofa": 120, "l shape sofa": 120,
  "sleeper sofa": 80, "sofa bed": 80, "sofa": 60, "couch": 60, "loveseat": 40,
  "futon": 55, "daybed": 55, "chaise": 25, "recliner": 25, "armchair": 25, "easy chair": 25,
  "chair": 7, "dining chair": 7, "office chair": 10, "conference chair": 10, "folding chair": 3, "stackable chair": 5, "cafeteria chair": 5,
  "accent chair": 15, "occasional chair": 15,
  "bench": 15, "storage bench": 20, "entry bench": 15,
  "ottoman": 10, "bean bag": 10, "bar stool": 5, "stool": 5, "seat": 7,
  "dining table": 35, "kitchen table": 30, "dining bench": 20,
  "coffee table": 15, "coffee table set": 25, "end table": 5, "side table": 5, "console table": 20,
  "tv stand": 20, "media console": 25, "entertainment center": 50,
  "cabinet": 25, "hutch": 35, "curio cabinet": 35, "glass cabinet": 40,
  "china cabinet": 40,
  "buffet": 30, "sideboard": 30, "credenza": 35, "bar cabinet": 25, "bar cart": 10, "trunk": 15,
  "chest": 35, "chest of drawers": 35,
  "rug": 10, "lamp": 5, "artwork": 5, "picture": 5, "floor lamp": 8, "table lamp": 5,
  "painting": 5, "canvas": 5, "frame": 5,
  "cal king bed": 75, "king bed": 70, "queen bed": 60, "full bed": 50, "double bed": 50, "twin bed": 40,
  "bunk bed": 90, "loft bed": 90, "crib": 30,
  "mattress": 25, "boxspring": 15, "bed frame": 15, "headboard": 10, "footboard": 5, "bed slats": 5, "mattress topper": 5,
  "adjustable bed": 40, "adjustable base": 40,
  "dresser": 35, "tall dresser": 35, "triple dresser": 50, "bureau": 35,
  "nightstand": 10, "wardrobe": 40, "armoire": 50,
  "vanity": 30, "vanity stool": 5, "makeup table": 25,
  "changing table": 15, "shoe rack": 8, "drawer unit": 15, "plastic drawer unit": 15,
  "mirror full length": 10, "mirror": 8, "glass": 5, "glass board": 8, "whiteboard": 8,

  // --- Kids & Sport ---
  "stroller": 15, "double stroller": 25, "baby carriage": 20, "pram": 15, "buggy": 15,
  "car seat": 5, "booster seat": 5,
  "pack n play": 10, "playpen": 10,
  "high chair": 10, "toy box": 10, "dollhouse": 15,
  "bicycle kids": 5, "tricycle": 5, "scooter": 3, "wagon": 10,
  "trampoline": 50, "trampoline large": 60, "skateboard": 2, "basketball hoop": 30, "basketball goal": 30, // Updated CF
  "pet cage": 15, "dog crate": 15, "cat tree": 15, "animal pen": 20, "large pet enclosure": 10, "hamster cage": 10, "terrarium": 10, // Added pets
  "yoga mat": 2, "gymnastics mat": 15, "crash mat": 15, "tumbling mat": 15, "wall bars": 20, "swedish ladder": 20, // Added kids sport
  "baby crib": 25, "nursery cot": 25, // Added beds

  // --- Office & Electronics ---
  "desk": 35, "l desk": 50, "standing desk": 25, "adjustable desk": 25, "standing desk converter": 8, "executive desk": 45, "work desk": 35, "work table": 35, "reception desk": 50,
  "chair mat": 2, "bookshelf": 20, "bookcase": 20, "file cabinet": 20, "cubicle": 40, "cubicle panel": 15,
  "computer": 5, "computer tower": 5, "monitor": 5, "computer monitor": 5, "dual monitor": 8,
  "monitor stand": 2, "printer": 10, "scanner": 5, "shredder": 8, "paper shredder": 8, "multifunction printer": 35,
  "tv": 10, "speaker": 4, "soundbar": 5, "subwoofer": 8,
  "gaming console": 5, "ps5": 5, "xbox setup": 5, // Added tech
  "server rack": 45, "electronics": 10, "equipment": 15,

  // --- Appliances & Household ---
  "fridge": 60, "refrigerator": 60, "commercial fridge": 80,
  "freezer": 30, "chest freezer": 30, "upright freezer": 40, "deep freezer": 30,
  "washer": 30, "dryer": 30, "stove": 30, "dishwasher": 25,
  "wine cooler": 20, "wine fridge": 20, "mini fridge": 10, "ice maker": 10, // Updated CF
  "microwave": 10, "mini oven": 10,
  "air fryer": 5, "toaster": 3, "blender": 3, "coffee maker": 3, "kitchen appliance": 5,
  "air conditioner": 20, "portable ac": 20, "dehumidifier": 10, "fan": 5,
  "tower fan": 5, "box fan": 5, "floor fan": 5,
  "heater": 10, "radiator": 10, "space heater": 5,
  "vacuum": 5, "roomba": 5, "dyson": 5, "ironing board": 5,
  "water dispenser": 10, "water cooler": 10,

  // --- Gym ---
  "treadmill": 45, "running machine": 45, "elliptical": 40, "cross trainer": 40, "peloton": 20, "stationary bike": 20, "exercise bike": 20, "spin bike": 20, // Updated CF
  "rowing machine": 25, "rower": 25, "multi gym": 80, "power rack": 50, "smith machine": 50, "squat rack": 50, "weight bench": 15, "gym bench": 15, "weight rack": 25, // Updated CF
  "dumbbells": 10, "kettlebells": 10, "weights": 10, "weight plate tree": 10, "weight plates": 10, "punching bag": 15, "heavy bag": 15, // Updated CF

  // --- Outdoor & Garage ---
  "bike": 10, "bicycle": 10, "motorcycle": 50,
  "bbq": 30, "gas grill": 30, "barbecue": 30, "grill": 30, "smoker": 80, "fire pit": 15, "patio heater": 15, // Updated CF
  "patio set": 150, "outdoor table": 40, "outdoor chair": 10, "patio umbrella": 20,
  "ladder": 10, "step ladder": 5, "extension ladder": 15, "step stool": 5,
  "hose": 5, "garden hose": 5, "cooler": 10, "yeti": 10, "ice chest": 10,
  "lawn mower": 20, "riding mower": 60, "leaf blower": 5, "weed whacker": 5, "wheelbarrow": 20,
  "shovel": 2, "rake": 2, "garden tools bundle": 10,
  "tool chest": 20, "large tool kit": 20, "mechanic tools": 20, "workbench": 40, "storage cabinet": 30, "garage cabinet": 30, // Updated CF
  "metal rack": 25, "garage shelving": 25, "rolling toolbox": 20,
  "small tool box": 5, "tire": 10, "saw": 5, "sewing machine": 5,
  "generator": 15, "golf bag": 10, "golf clubs": 10, // Updated CF
  "surfboard": 15, "paddleboard": 15, "paddle board": 15, "sup": 15, "kayak": 25, "canoe": 30, "ski bag": 5, // Updated CF
  "camping gear": 15, "tent": 5,
  "plant": 10, "large plant": 10, "small plant": 5,

  // --- Heavy/Specialty ---
  "statue": 15, "large statue": 40, "fountain": 30, "bird bath": 10,
  "arcade machine": 50, "pinball machine": 40, "slot machine": 40, "jukebox": 50,
  "pool table": 80,
  "piano": 60, "upright piano": 60, "baby grand piano": 120, "grand piano": 150,
  "safe": 30, "gun safe": 60, "large safe": 80,
  "grandfather clock": 40, "clock large": 25,
  "restaurant table": 25, "bar chair": 7, "bar equipment": 20, "keg": 15, "tap system": 20,
  "sink": 15, "wash station": 25, "commercial sink": 25, "commercial grill": 80,
  "copy machine": 35, "copier": 35, "copier large": 60, "plotter": 35, "vending machine": 65,
  "conference table": 50, "display cabinet": 40,
  "pallet": 50, "skid": 50, "crate": 20, "commercial bin": 15,
  "marble table": 60, "stone table": 60,
  "hot tub": 80, "jacuzzi": 80,

  // --- Boxes & Storage ---
  "boxes": 5, "box": 5, "bin": 5, "tote": 5,
  "small box": 3, "medium box": 5, "large box": 6,
  "plastic bin": 5, "storage bin": 5, "trash can": 5, "garbage bin": 5, "waste basket": 5,
  "laundry basket": 5, "hamper": 5,
  "dish barrel": 10, "dish box": 10,
  "suitcase": 10, "luggage": 10, "duffle bag": 5, "travel bag": 5,
  "wardrobe box": 15, "wardrobe carton": 15,
  "tv box": 10, "picture box": 10, "art crate": 15,
  "aquarium": 25, "fish tank": 25, "aquarium stand": 15,
  "christmas decor": 5, "christmas stuff": 5,
  "kitchen items": 5, "pantry items": 5,
  "pillow": 5, "towel": 5, "bag": 5
};

export const STRICT_NO_BLANKET_ITEMS = [
  "box", "bin", "tote", "pack", "bag", "luggage", "suitcase", "crate", "carton",
  "ladder", "hose", "sink", "equipment", "electronics", "vacuum", "fan", "microwave",
  "generator", "compressor", "lawn mower", "aquarium", "plant", "rug", "tools",
  "dumbbells", "plates", "lamp", "pallet", "skid", "trash", "bucket", "toy",
  "bicycle", "tricycle", "scooter", "wagon", "stroller",
  "kayak", "canoe", "surfboard",
  "garden", "shovel", "rake", "wheelbarrow", "mower", "tent", "camping",
  "leaf blower", "weed whacker", "pet cage", "dog crate",
  "linen", "clothes", "plastic", "tire", "hamper", "basket", "yeti", "cooler",
  "dish barrel", "pillow", "towel", "christmas"
];

export const ABBREVIATIONS = {
  "tbl": "table", "chr": "chair", "cab": "cabinet", "ctr": "center",
  "ent": "entertainment", "exec": "executive", "pbo": "", "cp": "",
  "reg": "", "osz": "large", "std": "", "k/d": "", "kd": "",
  "uprt": "upright", "frig": "fridge", "ref": "fridge", "sect": "sectional",
  "ctn": "box", "carton": "box", "dp": "dish barrel", "dishpack": "dish barrel",
  "uph": "", "occ": "accent", "wdrb": "wardrobe", "arm": "armoire",
  "hdbd": "headboard", "ftbd": "footboard", "mrbl": "marble", "gl": "glass",
  "kng": "king", "qn": "queen", "dbl": "double", "twn": "twin",
  "med": "medium", "sm": "small", "lg": "large", "flat screen": "",
  "t.v.": "tv", "appliance": "kitchen appliance", "appliances": "kitchen appliance"
};

export const INVERSIONS = [
  { src: /table,\s*coffee/i, dest: "coffee table" },
  { src: /table,\s*end/i, dest: "end table" },
  { src: /table,\s*dining/i, dest: "dining table" },
  { src: /bed,\s*headboard/i, dest: "headboard" },
  { src: /bed,\s*footboard/i, dest: "footboard" },
  { src: /fan,\s*floor/i, dest: "floor fan" },
  { src: /dresser,\s*triple/i, dest: "triple dresser" },
  { src: /mirror,\s*regular/i, dest: "mirror" },
  { src: /work\s*bench,\s*reg\.?/i, dest: "workbench" },
  { src: /box,\s*lg/i, dest: "large box" },
  { src: /box,\s*med/i, dest: "medium box" },
  { src: /box,\s*sm(?:all)?/i, dest: "small box" },
  { src: /plastic\s*bin,\s*lg/i, dest: "large plastic bin" },
  { src: /suitcase,\s*lg/i, dest: "large suitcase" }
];

export const ALIAS_RULES = [
  // Commercial office aliases
  { re: /\btables?\s*\/\s*desks?\b/i, to: "desk" },
  { re: /\bchairs?\s*\/\s*seats?\b/i, to: "office chair" },
  { re: /\bwork\s*tables?\b/i, to: "work table" },
  { re: /\boffice\s*chairs?\b/i, to: "office chair" },
  { re: /\bconference\s*chairs?\b/i, to: "conference chair" },
  { re: /\bglass\s*boards?\b/i, to: "glass board" },
  { re: /\bwhite\s*boards?\b/i, to: "whiteboard" },
  { re: /\boffice\s*printers?\b/i, to: "printer" },
  { re: /\b(tv|television)\s*\d{2,3}\b/i, to: "tv" },
  { re: /\b(lg|samsung|sony|tcl|vizio|hisense|panasonic|sharp|philips)\s*\d{2,3}\b/i, to: "tv" },
  { re: /\bweight\s*plates?\b/i, to: "weight plates" },
  { re: /\b(printer)\s*\/\s*(copier)\b/i, to: "multifunction printer" },
  { re: /\bmfp\b/i, to: "multifunction printer" },
  { re: /\b(tv|television)\s+(stand|unit)\b/i, to: "tv stand" },
  { re: /\b(tv|television)\s+(console|credenza|cabinet)\b/i, to: "media console" },
  { re: /\b(sleeper|pull[-\s]?out)\s*(sofa|couch)\b/i, to: "sleeper sofa" },
  { re: /\bsofa\s*bed\b/i, to: "sofa bed" },
  { re: /\bfuton\b/i, to: "futon" },
  { re: /\bday\s*bed\b/i, to: "daybed" },
  { re: /\bchaise\s*(lounge)?\b/i, to: "chaise" },
  { re: /\bstorage\s*bench\b/i, to: "storage bench" },
  { re: /\b(entry|entryway)\s*bench\b/i, to: "entry bench" },
  { re: /\bbar\s*cart\b/i, to: "bar cart" },
  { re: /\bcoffee\s*table\s*set\b/i, to: "coffee table set" },
  { re: /\b(entertainment)\s*(unit|center)\b/i, to: "entertainment center" },
  { re: /\bdining\s*bench\b/i, to: "dining bench" },
  { re: /\bbar\s*cabinet\b/i, to: "bar cabinet" },
  { re: /\bglass\s*cabinet\b/i, to: "glass cabinet" },
  { re: /\bside\s*board\b/i, to: "sideboard" },
  { re: /\bbuffet\s*(table)?\b/i, to: "buffet" },
  { re: /\bchina\s*(hutch|cabinet)\b/i, to: "china cabinet" },
  { re: /\bdisplay\s*(case|cabinet)\b/i, to: "display cabinet" },
  { re: /\bcurio\b/i, to: "curio cabinet" },
  { re: /\bcredenza\b/i, to: "credenza" },
  { re: /\bcrib\b/i, to: "crib" },
  { re: /\bchanging\s*table\b/i, to: "changing table" },
  { re: /\bvanity\b/i, to: "vanity" },
  { re: /\bfull\s*length\s*mirror\b/i, to: "mirror full length" },
  { re: /\bshoe\s*rack\b/i, to: "shoe rack" },
  { re: /\bplastic\s*drawer(s)?\b/i, to: "plastic drawer unit" },
  { re: /\bdrawer\s*unit\b/i, to: "drawer unit" },
  { re: /\bmattress\s*topper\b/i, to: "mattress topper" },
  { re: /\bchange\s*table\b/i, to: "changing table" },
  { re: /\bbed\s*side\s*table(\s*s)?\b|\bbedside\s*table(\s*s)?\b|\bnight\s*stand(\s*s)?\b/i, to: "nightstand" },
  { re: /\b(chest)\s*of\s*drawers\b/i, to: "chest of drawers" },
  { re: /\bchest\s*drawers\b/i, to: "chest of drawers" },
  { re: /\bdresser\b.*\bmirror\b/i, to: "dresser" },
  { re: /\bmake\s*up\s*table\b/i, to: "makeup table" },
  { re: /\bstanding\s*desk\s*converter\b/i, to: "standing desk converter" },
  { re: /\b(printer)\b/i, to: "printer" },
  { re: /\bscanner\b/i, to: "scanner" },
  { re: /\bshredder\b/i, to: "shredder" },
  { re: /\bpc\s*tower\b|\bcomputer\s*tower\b/i, to: "computer tower" },
  { re: /\bmonitor\b|\bcomputer\s*screen\b/i, to: "computer monitor" },
  { re: /\bsound\s*bar\b/i, to: "soundbar" },
  { re: /\bsub\s*woofer\b|\bsubwoofer\b/i, to: "subwoofer" },
  { re: /\b(conference)\s*(room\s*)?table\b/i, to: "conference table" },
  { re: /\boffice\s*table\b/i, to: "conference table" },
  { re: /\b(copy\s*machine|xerox)\b/i, to: "copier" },
  { re: /\bupright\s*freezer\b/i, to: "upright freezer" },
  { re: /\bdeep\s*freezer\b/i, to: "deep freezer" },
  { re: /\bwine\s*cooler\b/i, to: "wine cooler" },
  { re: /\bwine\s*(refrigerator|fridge)\b/i, to: "wine fridge" },
  { re: /\bice\s*maker\b/i, to: "ice maker" },
  { re: /\bmicrowave\b/i, to: "microwave" },
  { re: /\b(toaster\s*oven|mini\s*oven)\b/i, to: "mini oven" },
  { re: /\bportable\s*ac\b|\bportable\s*air\s*conditioner\b/i, to: "portable ac" },
  { re: /\bair\s*conditioner\b/i, to: "air conditioner" },
  { re: /\bdehumidifier\b/i, to: "dehumidifier" },
  { re: /\bfan\b/i, to: "fan" },
  { re: /\bmini\s*(refrigerator|fridge)\b/i, to: "mini fridge" },
  { re: /\browing\s*machine\b|\brower\b/i, to: "rowing machine" },
  { re: /\bexercise\s*bike\b|\bspin\s*bike\b/i, to: "exercise bike" },
  { re: /\bweight\s*bench\b|\bworkout\s*bench\b/i, to: "weight bench" },
  { re: /\bweight\s*rack\b/i, to: "weight rack" },
  { re: /\bdumbbells?\b/i, to: "dumbbells" },
  { re: /\bstorage\s*cabinet\b/i, to: "storage cabinet" },
  { re: /\bgarage\s*cabinet\b/i, to: "garage cabinet" },
  { re: /\bpatio\s*umbrella\b/i, to: "patio umbrella" },
  { re: /\bfire\s*pit\b/i, to: "fire pit" },
  { re: /\bcooler\b/i, to: "cooler" },
  { re: /\bgenerator\b/i, to: "generator" },
  { re: /\blawn\s*mower\b/i, to: "lawn mower" },
  { re: /\bgolf\s*bag\b/i, to: "golf bag" },
  { re: /\b(bbq\s*grill|barbecue)\b/i, to: "bbq" },
  { re: /\b(metal)\s*(shelving|shelf|rack)\b/i, to: "metal rack" },
  { re: /\b(garage)\s*(shelving|shelf|rack)\b/i, to: "garage shelving" },
  { re: /\b(shelves|shelving)\b/i, to: "shelving unit" },
  { re: /\bstorage\s*rack\b/i, to: "rack" },
  { re: /\baquarium\b|\bfish\s*tank\b/i, to: "aquarium" },
  { re: /\bart\s*crate\b/i, to: "art crate" },
  { re: /\bpicture\s*box\b/i, to: "picture box" },
  { re: /\btv\s*box\b/i, to: "tv box" },
  { re: /\bwardrobe\s*carton(s)?\b/i, to: "wardrobe carton" },
  { re: /\bwardrobe\s*box(es)?\b/i, to: "wardrobe box" },
  { re: /\bpbo\b/i, to: "box" },
  { re: /\b(books|records|vinyl|cds|dvds)\b/i, to: "box" },
  { re: /\b(kitchen\s*items|pantry\s*items|misc\s*items)\b/i, to: "boxes" },
  { re: /\b(sup|paddle\s*board)\b/i, to: "paddle board" },
  { re: /\b(lawnmower)\b/i, to: "lawn mower" },
  { re: /\b(skid)\b/i, to: "pallet" },
  { re: /\b(trash\s*can|garbage\s*bin|waste\s*basket)\b/i, to: "trash can" },
  { re: /\b(pet\s*cage|dog\s*cage)\b/i, to: "pet cage" },
  { re: /\b(trampoline)\b/i, to: "trampoline" },
  { re: /\b(pinball)\b/i, to: "pinball machine" },
  { re: /\b(slot\s*machine)\b/i, to: "slot machine" },
  { re: /\b(grandfather\s*clock)\b/i, to: "grandfather clock" },
  { re: /\b(roomba|dyson|shark)\b/i, to: "vacuum" },
  { re: /\b(air\s*fryer|instapot|crockpot)\b/i, to: "air fryer" },
  { re: /\b(adjustable\s*base|sleep\s*number|tempurpedic(\s*base)?)\b/i, to: "adjustable base" },
  { re: /\bcomputer\s*chair\b/i, to: "office chair" },
  { re: /\badjustable\s*bed\s*frame\b/i, to: "adjustable base" },
  { re: /\bdbl\/qn\b/i, to: "full bed" },
  { re: /\blarge\s*plastic\s*bin\b/i, to: "plastic bin" },
  { re: /\b(love\s*seat|loveseat)\b/i, to: "loveseat" },
  { re: /\b(couch|couches)\b/i, to: "sofa" },
  { re: /\b(sectional|sectionals)\b/i, to: "sectional sofa" },
  { re: /\bconsole\b/i, to: "media console" },
  { re: /^stand$/i, to: "tv stand" },
  { re: /\bclosets?\b/i, to: "wardrobe box" },
  { re: /\bdrawers?\b/i, to: "chest of drawers" },
  { re: /\b(seats?|seating)\b/i, to: "chair" },
  { re: /\b(pots|pans|dishes)\b/i, to: "kitchen items" },
  { re: /\b(christmas|xmas)\s*(stuff|decor(ations)?)\b/i, to: "christmas decor" },
  { re: /\bpantry\b/i, to: "pantry items" },
  { re: /\b(bags?|luggage)\b/i, to: "bag" },
  { re: /\b(towels?|linens?)\b/i, to: "towel" },
  { re: /\bpillows?\b/i, to: "pillow" },
  { re: /\bgarden\s*tools\b/i, to: "garden tools bundle" },
  { re: /\boled\b/i, to: "tv" },
  { re: /\bflat\s*screen\b/i, to: "tv" },
  { re: /\btelevision\b/i, to: "tv" }
];

export const reEscape = (s: string) => s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");

export const BLANKET_KEYS = Object.keys(BLANKETS_TABLE).sort((a, b) => b.length - a.length);

export const DA_KEYS = Object.keys(DA_TIME_TABLE).sort((a, b) => b.length - a.length);

export const SORTED_KEYS = Object.keys(VOLUME_TABLE).sort((a, b) => b.length - a.length);

export function buildKeyRegex(key: string) {
  if (key === "tv") return /\btv('?s)?\b/i;
  const parts = key.split(" ");
  const last = parts[parts.length - 1];
  const head = parts.slice(0, -1).join(" ");
  let lastRe = "";
  if (last.endsWith("s")) lastRe = reEscape(last);
  else lastRe = `${reEscape(last)}(?:s|es)?`;
  const full = head ? `${reEscape(head)}\\s+${lastRe}` : lastRe;
  return new RegExp(`\\b${full}\\b`, "i");
}

export const KEY_REGEX = Object.fromEntries(SORTED_KEYS.map((k) => [k, buildKeyRegex(k)]));

export const BLANKET_REGEX_CACHE = Object.fromEntries(BLANKET_KEYS.map(k => [k, buildKeyRegex(k)]));

export const DA_REGEX_CACHE = Object.fromEntries(DA_KEYS.map(k => [k, buildKeyRegex(k)]));

export const FRAGILE_REGEX_CACHE = FRAGILE_KEYWORDS.map(k => new RegExp(`\\b${reEscape(k)}\\b`, "i"));

export const NUMBER_MAP = {
  "one": 1, "two": 2, "three": 3, "four": 4, "five": 5,
  "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10,
  "eleven": 11, "twelve": 12, "dozen": 12,
  "multiple": 5, "several": 3, "few": 3, "pair": 2, "couple": 2,
  "half dozen": 6
};

export const NUMBERS_REGEX_CACHE = Object.keys(NUMBER_MAP).map(key => ({
  re: new RegExp(`\\b${key}\\b`, "gi"),
  val: NUMBER_MAP[key as keyof typeof NUMBER_MAP]
}));

export const IRREGULAR_SIGNALS = [
  "sectional", "bike", "bicycle", "peloton", "treadmill", "elliptical",
  "rowing", "rower", "weights", "plates", "dumbbell",
  "kayak", "bbq", "grill", "smoker", "patio", "umbrella", "outdoor",
  "large mirror", "piano", "safe", "generator", "statue", "arcade",
  "riding mower", "trampoline", "surfboard", "pallet", "skid",
  "adjustable"
];

export const VAGUE_SIGNALS = ["misc", "miscellaneous", "some boxes", "garage stuff", "storage stuff", "tools", "seasonal", "attic", "shed", "stuff"];

export const DA_COMPLEX = ["bed", "bunk", "crib", "sectional", "gym", "treadmill", "elliptical", "peloton", "armoire", "wardrobe", "sleeper", "sofa bed", "pool table", "arcade", "trampoline", "adjustable"];

export const DA_SIMPLE = ["table", "desk", "crib"];

export const SIZE_UNIT_PATTERNS = [
  /\b(?:inch|inches)\b/i, /\d\s*(?:in)\b/i, /\b(?:ft|feet|foot)\b/i,
  /\d\s*(?:cm)\b/i, /\d\s*(?:mm)\b/i, /["″]/,
];