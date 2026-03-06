import "server-only";

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
  "grandfather clock",
  "arcade machine", "pinball", "slot machine",
  "lathe", "milling machine", "machinery",
  "treadmill", "elliptical",
  "adjustable bed", "adjustable base", "sleep number",
  "copier", "large copier",
  "china cabinet", "conference table", "armoire", "solid wood armoire"
];

// Items that need special equipment/space but do NOT trigger the HEAVY badge
export const BULKY_ITEMS = [
  "rowing machine", "multi gym",
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
  "tool chest", "rolling toolbox",
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
  "sleeper sofa": 50, "sofa bed": 80, "sofa": 35, "couch": 60, "loveseat": 30,
  "futon": 55, "daybed": 55, "chaise": 25, "recliner": 25, "armchair": 25, "easy chair": 25,
  "chair": 7, "dining chair": 7, "office chair": 10, "conference chair": 10, "folding chair": 3, "stackable chair": 5, "cafeteria chair": 5,
  "accent chair": 15, "occasional chair": 15, "overstuffed chair": 25,
  "bench": 15, "storage bench": 20, "entry bench": 15,
  "ottoman": 10, "bean bag": 10, "bar stool": 5, "stool": 5, "seat": 7, "glider settee": 20,
  "room divider": 20,
  "dining table": 30, "kitchen table": 20, "dining bench": 20, "picnic table": 20, "utility table": 5,
  "coffee table": 15, "coffee table set": 25, "end table": 5, "side table": 5, "console table": 20,
  "kitchen island": 45,
  "tv stand": 20, "media console": 25, "entertainment center": 40,
  "cabinet": 25, "hutch": 35, "curio cabinet": 10, "glass cabinet": 40, "corner cabinet": 20, "utility cabinet": 10,
  "china cabinet": 40,
  "buffet": 30, "sideboard": 30, "credenza": 35, "bar cabinet": 25, "bar cart": 10, "portable bar": 15, "server buffet": 15, "music cabinet": 15, "serving cart": 10,
  "chest": 35, "chest of drawers": 35,
  "rug": 10, "lamp": 5, "artwork": 5, "picture": 5, "floor lamp": 5, "table lamp": 5,
  "painting": 5, "canvas": 5, "frame": 5,
  "cal king bed": 75, "king bed": 70, "queen bed": 60, "full bed": 50, "double bed": 50, "twin bed": 40,
  "bunk bed": 90, "loft bed": 90, "crib": 30, "waterbed": 20, "folding cot": 10,
  "mattress": 25, "boxspring": 15, "bed frame": 15, "headboard": 10, "footboard": 5, "bed slats": 5, "mattress topper": 5,
  "adjustable bed": 40, "adjustable base": 40,
  "dresser": 35, "tall dresser": 35, "triple dresser": 50, "bureau": 35,
  "nightstand": 10, "wardrobe": 40, "small wardrobe": 20, "armoire": 40,
  "vanity": 30, "vanity stool": 5, "makeup table": 25,
  "changing table": 15, "shoe rack": 8, "drawer unit": 15, "plastic drawer unit": 15, "hall tree rack": 2, "hall tree large": 12,
  "mirror full length": 10, "mirror": 8, "glass": 5, "glass board": 8, "whiteboard": 5,

  // --- Kids & Sport ---
  "stroller": 15, "double stroller": 25, "baby carriage": 10, "pram": 15, "buggy": 15, "footlocker": 8,
  "car seat": 5, "booster seat": 5,
  "pack n play": 10, "playpen": 10,
  "high chair": 10, "toy box": 10, "dollhouse": 15,
  "bicycle kids": 5, "tricycle": 5, "scooter": 3, "wagon": 10,
  "trampoline": 50, "trampoline large": 60, "skateboard": 2, "basketball hoop": 30, "basketball goal": 30, // Updated CF
  "pet cage": 15, "dog crate": 15, "cat tree": 15, "animal pen": 20, "large pet enclosure": 10, "hamster cage": 10, "terrarium": 10, // Added pets
  "yoga mat": 2, "gymnastics mat": 15, "crash mat": 15, "tumbling mat": 15, "wall bars": 20, "swedish ladder": 20, // Added kids sport
  "baby crib": 10, "nursery cot": 25, // Added beds

  // --- Office & Electronics ---
  "desk": 35, "l desk": 50, "standing desk": 25, "adjustable desk": 25, "standing desk converter": 8, "executive desk": 45, "work desk": 35, "work table": 35, "reception desk": 50, "secretary desk": 35, "office desk": 10, "small desk": 22,
  "chair mat": 2, "bookshelf": 20, "bookcase": 20, "file cabinet": 20, "cubicle": 40, "cubicle panel": 15,
  "computer": 5, "computer tower": 5, "monitor": 5, "computer monitor": 5, "dual monitor": 8,
  "monitor stand": 2, "printer": 10, "scanner": 5, "shredder": 8, "paper shredder": 8, "multifunction printer": 35,
  "tv": 10, "big screen tv": 40, "combo tv": 25, "speaker": 4, "soundbar": 5, "subwoofer": 8,
  "gaming console": 5, "ps5": 5, "xbox setup": 5, "typewriter": 2, // Added tech
  "server rack": 45, "electronics": 10, "equipment": 15,

  // --- Appliances & Household ---
  "fridge": 60, "refrigerator": 60, "commercial fridge": 80,
  "freezer": 30, "chest freezer": 30, "upright freezer": 40, "deep freezer": 30,
  "washer": 30, "dryer": 30, "stove": 30, "dishwasher": 25,
  "wine cooler": 20, "wine fridge": 20, "mini fridge": 10, "ice maker": 10, // Updated CF
  "microwave": 10, "mini oven": 10,
  "air fryer": 5, "toaster": 3, "blender": 3, "coffee maker": 3, "kitchen appliance": 5,
  "air conditioner": 20, "portable ac": 20, "window ac small": 15, "window ac large": 20, "dehumidifier": 10, "fan": 5,
  "tower fan": 5, "box fan": 5, "floor fan": 5,
  "heater": 10, "radiator": 10, "space heater": 5, "humidifier": 5,
  "vacuum": 5, "roomba": 5, "dyson": 5, "ironing board": 5, "scale": 5, "canister": 2,
  "water dispenser": 10, "water cooler": 10,

  // --- Gym ---
  "treadmill": 45, "running machine": 45, "elliptical": 40, "cross trainer": 40, "peloton": 20, "stationary bike": 20, "exercise bike": 20, "spin bike": 20, // Updated CF
  "rowing machine": 25, "rower": 25, "multi gym": 80, "power rack": 50, "smith machine": 50, "squat rack": 50, "weight bench": 15, "gym bench": 15, "weight rack": 25, // Updated CF
  "dumbbells": 10, "kettlebells": 10, "weights": 10, "weight plate tree": 10, "weight plates": 10, "punching bag": 15, "heavy bag": 15, // Updated CF

  // --- Outdoor & Garage ---
  "bike": 7, "bicycle": 7, "motorcycle": 50,
  "walker": 5, "mobility scooter": 20,
  "bbq": 30, "gas grill": 30, "barbecue": 30, "grill": 30, "camping grill": 2, "large bbq": 10, "smoker": 80, "fire pit": 15, "patio heater": 15, // Updated CF
  "patio set": 150, "outdoor table": 40, "outdoor chair": 10, "aluminum chair": 1, "metal chair": 3, "wood chair": 5, "patio umbrella": 10,
  "ladder": 10, "step ladder": 5, "extension ladder": 15, "step stool": 5,
  "hose": 5, "garden hose": 5, "cooler": 10, "yeti": 10, "ice chest": 10,
  "lawn mower": 20, "riding mower": 35, "lawn roller": 15, "leaf blower": 5, "weed whacker": 5, "wheelbarrow": 10,
  "shovel": 2, "rake": 2, "garden tools bundle": 10, "broom": 3,
  "tool chest": 20, "small tool chest": 5, "medium tool chest": 10, "large tool chest": 15, "large tool kit": 20, "mechanic tools": 20, "workbench": 30, "storage cabinet": 30, "garage cabinet": 30, "toolbox": 5, // Updated CF
  "metal rack": 25, "garage shelving": 25, "rolling toolbox": 20,
  "small tool box": 5, "tire": 10, "tire with rim": 5, "saw": 5, "sewing machine": 5, "portable sewing machine": 5, "sewing machine cabinet": 20, "small safe": 10,
  "generator": 15, "golf bag": 10, "golf clubs": 10, // Updated CF
  "surfboard": 15, "paddleboard": 15, "paddle board": 15, "sup": 15, "kayak": 25, "canoe": 30, "ski bag": 5, // Updated CF
  "camping gear": 15, "tent": 5,
  "plant": 10, "large plant": 10, "small plant": 5, "plant stand": 2,

  // --- Heavy/Specialty ---
  "statue": 15, "large statue": 40, "fountain": 30, "bird bath": 10,
  "arcade machine": 50, "pinball machine": 40, "slot machine": 40, "jukebox": 50,
  "pool table": 80,
  "piano": 60, "upright piano": 60, "baby grand piano": 120, "grand piano": 150,
  "safe": 30, "gun safe": 60, "large safe": 80,
  "grandfather clock": 30, "clock large": 15,
  "restaurant table": 25, "bar chair": 7, "bar equipment": 20, "keg": 15, "tap system": 20,
  "sink": 15, "wash station": 25, "commercial sink": 25, "commercial grill": 80,
  "copy machine": 35, "copier": 35, "copier large": 60, "plotter": 35, "vending machine": 65,
  "conference table": 50, "display cabinet": 40,
  "pallet": 50, "skid": 50, "crate": 20, "commercial bin": 15,
  "marble table": 60, "stone table": 60,
  "hot tub": 80, "jacuzzi": 80,

  // --- Boxes & Storage ---
  "boxes": 5, "box": 5, "bin": 5, "tote": 5,
  "small box": 3, "medium box": 5, "large box": 6, "book box": 1.5,
  "plastic bin": 5, "storage bin": 5, "trash can": 3, "garbage bin": 3, "waste basket": 3,
  "laundry basket": 5, "hamper": 5,
  "dish barrel": 10, "dish box": 10,
  "suitcase": 10, "luggage": 10, "duffle bag": 5, "travel bag": 5,
  "wardrobe box": 15, "wardrobe carton": 15,
  "tv box": 10, "tv small box": 10, "tv large box": 16, "picture box": 10, "picture mirror box": 16, "mattress box": 5, "art crate": 15,
  "aquarium": 25, "fish tank": 25, "aquarium stand": 15,
  "christmas decor": 5, "christmas stuff": 5,
  "kitchen items": 5, "pantry items": 5,
  "pillow": 5, "towel": 5, "bag": 5,

  // --- New Items Task 3 ---
  "chandelier": 15,
  "acoustic panel": 8,
  "stand": 5,
  "shoe cabinet": 15,
  "pedestal": 5,
  "dumbbell": 2,
  "kettlebell": 2, "piano bench": 5, "picnic bench": 5,
  "mower": 15,
  "trunk": 10,
  "guitar": 5,
  "amplifier": 10,
  "umbrella stand": 5,
  "ignore_item": 0
};

export const STRICT_NO_BLANKET_ITEMS = [
  "box", "bin", "tote", "pack", "bag", "luggage", "suitcase", "crate", "carton",
  "ladder", "hose", "sink", "equipment", "electronics", "vacuum", "fan", "microwave",
  "generator", "compressor", "lawn mower", "aquarium", "plant", "rug", "tools",
  "dumbbells", "plates", "lamp", "pallet", "skid", "trash", "bucket", "toy",
  "bicycle", "tricycle", "scooter", "wagon", "stroller",
  "walker", "scale", "canister",
  "kayak", "canoe", "surfboard",
  "garden", "shovel", "rake", "wheelbarrow", "mower", "tent", "camping",
  "leaf blower", "weed whacker", "pet cage", "dog crate",
  "linen", "clothes", "plastic", "tire", "hamper", "basket", "yeti", "cooler",
  "dish barrel", "pillow", "towel", "christmas"
];

export const ABBREVIATIONS = {
  "tbl": "table", "chr": "chair", "cab": "cabinet", "ctr": "center",
  "exec": "executive", "pbo": "", "cp": "",
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
  { src: /table,\s*utility\b/i, dest: "utility table" },
  { src: /bed,\s*king/i, dest: "king bed" },
  { src: /bed,\s*queen/i, dest: "queen bed" },
  { src: /bed,\s*full/i, dest: "full bed" },
  { src: /bed,\s*double/i, dest: "double bed" },
  { src: /bed,\s*twin/i, dest: "twin bed" },
  { src: /bed,\s*headboard/i, dest: "headboard" },
  { src: /bed,\s*footboard/i, dest: "footboard" },
  { src: /lamp,\s*floor(?:\s+(?:large|lrg|lg|medium|med\.?|small|sm\.?))?/i, dest: "floor lamp" },
  { src: /lamp,\s*table(?:\s+(?:large|lrg|lg|medium|med\.?|small|sm\.?))?/i, dest: "table lamp" },
  { src: /chair,\s*office(?:\s*,?\s*\(?\s*(?:large|lrg|lg|medium|med\.?|small|sm\.?)\.?\)?)?/i, dest: "office chair" },
  { src: /chair,\s*rocker/i, dest: "armchair" },
  { src: /chair,\s*arm\b/i, dest: "armchair" },
  { src: /chair,\s*overstuffed\b/i, dest: "overstuffed chair" },
  { src: /chair,\s*occasional\b/i, dest: "occasional chair" },
  { src: /chair,\s*straight\b/i, dest: "chair" },
  { src: /fan,\s*floor/i, dest: "floor fan" },
  { src: /chairs?,\s*aluminum\b/i, dest: "aluminum chair" },
  { src: /chairs?,\s*metal\b/i, dest: "metal chair" },
  { src: /chairs?,\s*wood\b/i, dest: "wood chair" },
  { src: /dresser,\s*(?:double|single)\b/i, dest: "dresser" },
  { src: /dresser,\s*triple/i, dest: "triple dresser" },
  { src: /dresser,\s*mirror\b/i, dest: "dresser" },
  { src: /armoire,\s*jewelry\b/i, dest: "armoire" },
  { src: /cabinet,\s*curio\b/i, dest: "curio cabinet" },
  { src: /cabinet,\s*corner\b/i, dest: "corner cabinet" },
  { src: /clock,\s*grandfather\b/i, dest: "grandfather clock" },
  { src: /desk,\s*secretary\b/i, dest: "secretary desk" },
  { src: /desk,\s*office\b/i, dest: "office desk" },
  { src: /desk,\s*(?:sm|small)\s*\/?\s*winthrop\b/i, dest: "small desk" },
  { src: /sofa,\s*loveseat\b/i, dest: "loveseat" },
  { src: /sofa,\s*[23]\s*cush(?:ion)?s?\.?\b/i, dest: "sofa" },
  { src: /sofa,\s*hide(?:\s*,\s*\d+\s*cush(?:ion)?s?\.?\b)?/i, dest: "sleeper sofa" },
  { src: /sofa,\s*sec\b/i, dest: "sectional sofa" },
  { src: /tv,\s*big\s*screen\b/i, dest: "big screen tv" },
  { src: /tv,\s*combination\b/i, dest: "combo tv" },
  { src: /crib,\s*baby\b/i, dest: "baby crib" },
  { src: /bench,\s*piano\b/i, dest: "piano bench" },
  { src: /bar,\s*portable\b/i, dest: "portable bar" },
  { src: /server,\s*buffet\b/i, dest: "server buffet" },
  { src: /server,\s*cabinet\b/i, dest: "server buffet" },
  { src: /cart,\s*serving\b/i, dest: "serving cart" },
  { src: /cot,\s*folding\b/i, dest: "folding cot" },
  { src: /mirror,\s*regular/i, dest: "mirror" },
  { src: /work\s*bench,\s*reg\.?/i, dest: "workbench" },
  { src: /sewing\s*mach(?:ine)?\.?,?\s*port\b/i, dest: "portable sewing machine" },
  { src: /sewing\s*mach(?:ine)?\.?,?\s*(?:w\s*\/?\s*cabinet|console)\b/i, dest: "sewing machine cabinet" },
  { src: /box,\s*(?:china|dish)(?:\s*\/\s*|\s+)?(?:china|dish)?/i, dest: "dish barrel" },
  { src: /box,\s*linen(?:\s*\/\s*|\s+)(?:medium|med\.?)/i, dest: "medium box" },
  { src: /box,\s*linen(?:\s*\/\s*|\s+)(?:small|sm(?:all)?\.?)/i, dest: "small box" },
  { src: /box,\s*(?:picture|art)(?:\s+(?:large|lrg|lg|medium|med\.?|small|sm\.?))?/i, dest: "picture box" },
  { src: /box,\s*tv\b/i, dest: "tv box" },
  { src: /box,\s*lg/i, dest: "large box" },
  { src: /box,\s*large/i, dest: "large box" },
  { src: /box,\s*med/i, dest: "medium box" },
  { src: /box,\s*medium/i, dest: "medium box" },
  { src: /box,\s*sm(?:all)?/i, dest: "small box" },
  { src: /plastic\s*bin,\s*(?:medium|med\.?|small|sm(?:all)?\.?)(?:\s+\d+\s*-\s*\d+\s*gallons?)?/i, dest: "plastic bin" },
  { src: /plastic\s*bin,\s*lg/i, dest: "large plastic bin" },
  { src: /plastic\s*bin,\s*large/i, dest: "large plastic bin" },
  { src: /(?:bbq\s*grill|barbecue),\s*camping\b/i, dest: "camping grill" },
  { src: /(?:bbq\s*grill|barbecue),\s*large\b/i, dest: "large bbq" },
  { src: /tool\s*chest,\s*small\b/i, dest: "small tool chest" },
  { src: /tool\s*chest,\s*medium\b/i, dest: "medium tool chest" },
  { src: /tool\s*chest,\s*large\b/i, dest: "large tool chest" },
  { src: /wardrobe,\s*small\b/i, dest: "small wardrobe" },
  { src: /ladder,\s*\d+\s*['′]?\s*step\b/i, dest: "step ladder" },
  { src: /ladder,\s*(?:ext|extension)\.?\s*metal\b/i, dest: "extension ladder" },
  { src: /lawn\s*mower,\s*riding\b/i, dest: "riding mower" },
  { src: /roller,\s*lawn\b/i, dest: "lawn roller" },
  { src: /(?:sm|small)\s*,\s*safe\b/i, dest: "small safe" },
  { src: /(?:lg|large)\s*,\s*safe\b/i, dest: "large safe" },
  { src: /suitcase,\s*lg/i, dest: "large suitcase" }
];

export const ALIAS_RULES = [
  // Adjective Protection
  { re: /\b(patio\s*tables?|outdoor\s*tables?)\b/i, to: "table" },
  { re: /\b(patio\s*chairs?|outdoor\s*chairs?)\b/i, to: "chair" },
  { re: /\b(playroom\s*toy\s*box)\b/i, to: "toy box" },

  // Broker Shorthand Aliases
  { re: /\btv\s*bx\b/i, to: "tv box" },
  { re: /\blamp\s*,\s*flr\b/i, to: "floor lamp" },
  { re: /\b(sfa)\b/i, to: "sofa" },
  { re: /\b(qun\s*bd)\b/i, to: "queen bed" },
  { re: /\b(drssr)\b/i, to: "dresser" },
  { re: /\b(wardrob)\b/i, to: "wardrobe" },
  { re: /\b(ntstnd)\b/i, to: "nightstand" },
  { re: /\b(chrs)\b/i, to: "chair" },
  { re: /\b(bffet)\b/i, to: "buffet" },
  { re: /\b(dsk)\b/i, to: "desk" },
  { re: /\b(bkshlf|bkcses?)\b/i, to: "bookcase" },
  { re: /\b(mwr)\b/i, to: "mower" },
  { re: /\b(bxs)\b/i, to: "medium box" },
  { re: /\b(bns)\b/i, to: "medium box" },
  { re: /\b(hmpr)\b/i, to: "hamper" },
  { re: /\b(mir)\b/i, to: "mirror" },
  { re: /\b(grll)\b/i, to: "grill" },
  { re: /\b(bnch)\b/i, to: "bench" },
  { re: /\b(trnk)\b/i, to: "trunk" },
  { re: /\b(lggge)\b/i, to: "medium box" },
  { re: /\b(armre)\b/i, to: "armoire" },
  { re: /\b(wshr)\b/i, to: "washer" },
  { re: /\b(dryr)\b/i, to: "dryer" },
  { re: /\b(shlf)\b/i, to: "shelf" },
  { re: /\b(wghts)\b/i, to: "kettlebells" },
  { re: /\b(umblla\s*stnd)\b/i, to: "umbrella stand" },

  // Studio/Tech items to boxes
  { re: /\b(all\s*drives|drives|cables|random\s*studio\s*gear|studio\s*gear|gear)\b/i, to: "medium box" },

  // Ignore trailing abbreviations
  { re: /\b(etc\.?)\b/i, to: "ignore_item" },

  // Granular rules & unmapped
  { re: /\b(rocker)\b/i, to: "armchair" },
  { re: /\b(amp)\b/i, to: "amplifier" },
  { re: /\b(coats)\b/i, to: "wardrobe box" },
  { re: /\b(plates?|forks?|cabbage|groceries|globe)\b/i, to: "medium box" },
  { re: /\b(lmp)\b/i, to: "lamp" },
  { re: /\b(plnt\s*stnd)\b/i, to: "plant stand" },
  { re: /\b(glbe)\b/i, to: "globe" },
  { re: /\b(rck)\b/i, to: "rack" },
  { re: /\b(bks)\b/i, to: "bicycle" },
  { re: /\b(trdmll)\b/i, to: "treadmill" },
  { re: /\b(prss)\b/i, to: "weight bench" },
  { re: /\b(bd)\b/i, to: "bed" },
  { re: /\b(bx)\b/i, to: "box" },
  { re: /\b(wckr)\b/i, to: "wicker chair" },
  { re: /\b(rdng)\b/i, to: "reading chair" },
  { re: /\b(fn)\b/i, to: "fan" },
  { re: /\b(cffee)\b/i, to: "coffee table" },
  { re: /\b(playroom)\b/i, to: "ignore_item" },
  { re: /\bdish\s*pack\b/i, to: "dish barrel" },
  { re: /\bbook\s*box\b/i, to: "book box" },
  { re: /\bmattress\s*box\b/i, to: "mattress box" },
  { re: /\btv\s*large\s*box\b/i, to: "tv large box" },
  { re: /\btv\s*small\s*box\b/i, to: "tv small box" },
  { re: /\bpicture\s*\/?\s*mirror\s*box\b/i, to: "picture mirror box" },
  { re: /\bwork\s*bench\b/i, to: "workbench" },
  { re: /\bmusic\s*cabinet\b/i, to: "music cabinet" },
  { re: /\b(server\s*buffet|buffet\s*server|dining\s*server|server\s*cabinet)\b/i, to: "server buffet" },
  { re: /\b(serving\s*cart|serving\s*trolley|tea\s*cart)\b/i, to: "serving cart" },
  { re: /\bfoot\s*lock(?:er)?\b/i, to: "footlocker" },
  { re: /\bfolding\s*cot\b/i, to: "folding cot" },
  { re: /\bair\s*cond\.?\s*\/?\s*wind\.?\s*small\b/i, to: "window ac small" },
  { re: /\bair\s*cond\.?\s*\/?\s*wind\.?\s*sm\.?\b/i, to: "window ac small" },
  { re: /\bair\s*cond\.?\s*\/?\s*wind\.?\s*large\b/i, to: "window ac large" },
  { re: /\bair\s*cond\.?\s*\/?\s*wind\.?\s*lg\.?\b/i, to: "window ac large" },
  { re: /\bhall\s*tree\s*rack\b/i, to: "hall tree rack" },
  { re: /\bhall\s*tree\s*large\b/i, to: "hall tree large" },
  { re: /\bglider\s*or\s*settee\b/i, to: "glider settee" },
  { re: /\btire\s*w\s*\/?\s*rim\b/i, to: "tire with rim" },
  { re: /\bpicnic\s*bench\b/i, to: "picnic bench" },
  { re: /\bpicnic\s*table\b/i, to: "picnic table" },
  { re: /\bkitchen\s*chairs?\b/i, to: "dining chair" },
  { re: /\bsewing\s*mach\.?\b/i, to: "sewing machine" },
  { re: /\bwastepaper\s*basket\b/i, to: "trash can" },
  { re: /\bfan\s*\/?\s*plant\s*stands?\b/i, to: "plant stand" },
  { re: /\bwaterbed\b/i, to: "waterbed" },

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
  { re: /\bshoe\s*cabinet\b/i, to: "shoe cabinet" },
  { re: /\bbaby\s*crib\b/i, to: "baby crib" },
  { re: /\bcrib\b/i, to: "crib" },
  { re: /\bchanging\s*table\b/i, to: "changing table" },
  { re: /\bvanity\b/i, to: "vanity" },
  { re: /\bwall\s*decor\b/i, to: "artwork" },
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
  { re: /\bvacuum\s*cleaner\b/i, to: "vacuum" },
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
  { re: /\bkeyboard\s*boxes?\b/i, to: "large box" },
  { re: /\bkeyboard\s*stands?\b/i, to: "stand" },
  { re: /\bclosets?\b(?!\s*contents)/i, to: "wardrobe box" },
  { re: /\bdrawers?\b(?!\s*contents)/i, to: "chest of drawers" },
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
  { re: /\btelevision\b/i, to: "tv" },

  // Small appliances & missing items
  { re: /\b(coffee\s*machine|coffee\s*maker|grinder)\b/i, to: "medium box" },
  { re: /\b(air\s*filters?)\b/i, to: "medium box" },
  { re: /\b(footrest)\b/i, to: "ottoman" },
  { re: /\b(watering\s*can|bucket)\b/i, to: "medium box" },
  { re: /\b(flags?|poles?|flagpoles?)\b/i, to: "broom" },
  { re: /\bsmalls\b/i, to: "small box" },

  // 1. THE ROOM LEAK TRAP (Uses ^ and $ to match ONLY the isolated room names)
  { re: /^(living\s*room|dining\s*room|breakfast\s*nook|kitchen|hallways?|linen\s*closet|main\s*bedroom|bedroom|office|tv\s*room|storage\s*room|exterior|outside|patio|back\s*house|music\s*studio|back-house|back-house\s*music\s*studio|lvg\s*rm|gar|pat|gst\s*bdrm|mstr\s*bdrm|lndry|plyrm|gym|lib|mudrm|attic)$/i, to: "ignore_item" },

  // 2. Kitchen Micro-items (Pack them into boxes)
  { re: /\b(jars?|spices?|bowls?|utensils?|pots?|pans?|tea\s*kettles?|trays?)\b/i, to: "medium box" },

  // 3. Specific Hobby & Misc Items
  { re: /\b(air\s*rifle|turntable|yoga\s*mat|foam\s*roller|cooler)\b/i, to: "medium box" },
  { re: /\b(document\s*safes?)\b/i, to: "small safe" },

  // 4. Granular container mappings & hardware anomalies
  { re: /\b(baskets?|small\s*objects?|clothes?|odds|ends)\b/i, to: "medium box" },
  { re: /\bshoes?\b(?!\s*cabinet)/i, to: "medium box" },
  { re: /\b(documents?)\b/i, to: "small box" },
  { re: /\bkeyboards?\b(?!\s*(?:stands?|boxes?)\b)/i, to: "large box" }, // For musical keyboards
  { re: /\b(stepladders?|step\s*ladders?)\b/i, to: "step ladder" },

  // Fallbacks for vague "contents"
  { re: /\b(cabinet\s*pack|packed\s*smalls?|misc\s*storage|drawer\s*contents|cabinet\s*contents|closet\s*contents|shelf\s*contents|cleaning\s*supplies)\b/i, to: "medium box" },
  { re: /\b(dishware|wine\s*glasses|dishes)\b/i, to: "dish barrel" },

  // Commercial & Specific
  { re: /\b(rolling\s*rack\s*cabinet)\b/i, to: "server rack" },
  { re: /\b(amplifiers?|rack\s*units?|security\s*cameras?)\b/i, to: "medium box" },
  { re: /\b(mic\s*stand|speaker\s*stand)\b/i, to: "stand" },
  { re: /\b(paper\s*shredder)\b/i, to: "shredder" },
  { re: /\b(ent\s*center)\b/i, to: "entertainment center" },
  { re: /\b(bottle\s*display)\b/i, to: "display cabinet" },
  { re: /\b(wall\s*lights?)\b/i, to: "lamp" },
  { re: /\b(planters?|pots?)\b/i, to: "plant" },

  // TRAP FOR MOVER EQUIPMENT (0 Volume)
  { re: /\b(moving\s*blankets?|bubble\s*wrap|stretch\s*wrap|packing\s*paper|tape|piano\s*boards?|dolly|dollies|straps|furniture\s*pads?|corner\s*protectors?|mattress\s*bags?|wardrobe\s*bags?|speed\s*packs?|bin\s*boxes?)\b/i, to: "ignore_item" }
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
