module.exports = [
"[project]/lib/dictionaries.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ABBREVIATIONS",
    ()=>ABBREVIATIONS,
    "ALIAS_RULES",
    ()=>ALIAS_RULES,
    "BLANKETS_TABLE",
    ()=>BLANKETS_TABLE,
    "BLANKET_KEYS",
    ()=>BLANKET_KEYS,
    "BLANKET_REGEX_CACHE",
    ()=>BLANKET_REGEX_CACHE,
    "BULKY_ITEMS",
    ()=>BULKY_ITEMS,
    "DA_COMPLEX",
    ()=>DA_COMPLEX,
    "DA_KEYS",
    ()=>DA_KEYS,
    "DA_REGEX_CACHE",
    ()=>DA_REGEX_CACHE,
    "DA_SIMPLE",
    ()=>DA_SIMPLE,
    "DA_TIME_TABLE",
    ()=>DA_TIME_TABLE,
    "EFFORT_MULTIPLIER",
    ()=>EFFORT_MULTIPLIER,
    "FRAGILE_KEYWORDS",
    ()=>FRAGILE_KEYWORDS,
    "FRAGILE_REGEX_CACHE",
    ()=>FRAGILE_REGEX_CACHE,
    "INVERSIONS",
    ()=>INVERSIONS,
    "IRREGULAR_SIGNALS",
    ()=>IRREGULAR_SIGNALS,
    "KEY_REGEX",
    ()=>KEY_REGEX,
    "LEAGUE_1_ITEMS",
    ()=>LEAGUE_1_ITEMS,
    "LEAGUE_2_ITEMS",
    ()=>LEAGUE_2_ITEMS,
    "LIFT_GATE_ITEMS",
    ()=>LIFT_GATE_ITEMS,
    "NUMBERS_REGEX_CACHE",
    ()=>NUMBERS_REGEX_CACHE,
    "NUMBER_MAP",
    ()=>NUMBER_MAP,
    "SIZE_UNIT_PATTERNS",
    ()=>SIZE_UNIT_PATTERNS,
    "SORTED_KEYS",
    ()=>SORTED_KEYS,
    "STRICT_NO_BLANKET_ITEMS",
    ()=>STRICT_NO_BLANKET_ITEMS,
    "TRUE_HEAVY_ITEMS",
    ()=>TRUE_HEAVY_ITEMS,
    "VAGUE_SIGNALS",
    ()=>VAGUE_SIGNALS,
    "VOLUME_TABLE",
    ()=>VOLUME_TABLE,
    "buildKeyRegex",
    ()=>buildKeyRegex,
    "reEscape",
    ()=>reEscape
]);
const BLANKETS_TABLE = {
    "sectional": 6,
    "sectional sofa": 6,
    "sofa": 3,
    "couch": 3,
    "sleeper sofa": 4,
    "loveseat": 2,
    "recliner": 2,
    "armchair": 2,
    "accent chair": 2,
    "king bed": 3,
    "queen bed": 3,
    "full bed": 2,
    "twin bed": 2,
    "adjustable bed": 3,
    "adjustable base": 3,
    "headboard": 1,
    "footboard": 1,
    "dresser": 2,
    "chest of drawers": 2,
    "bureau": 2,
    "triple dresser": 3,
    "armoire": 4,
    "wardrobe": 3,
    "china cabinet": 4,
    "hutch": 3,
    "dining table": 2,
    "kitchen table": 2,
    "conference table": 4,
    "tv": 1,
    "tv stand": 2,
    "media console": 2,
    "entertainment center": 3,
    "fridge": 2,
    "refrigerator": 2,
    "washer": 1,
    "dryer": 1,
    "piano": 3,
    "upright piano": 3,
    "grand piano": 5,
    "grandfather clock": 2,
    "mirror": 1,
    "artwork": 1,
    "glass": 1
};
const DA_TIME_TABLE = {
    "king bed": 25,
    "cal king bed": 25,
    "queen bed": 20,
    "full bed": 18,
    "double bed": 18,
    "twin bed": 15,
    "bunk bed": 45,
    "loft bed": 45,
    "adjustable bed": 40,
    "adjustable base": 40,
    "crib": 20,
    "daybed": 15,
    "murphy bed": 60,
    "sectional": 20,
    "sectional sofa": 20,
    "sleeper sofa": 15,
    "sofa bed": 15,
    "treadmill": 30,
    "elliptical": 35,
    "peloton": 20,
    "exercise bike": 15,
    "rowing machine": 20,
    "multi gym": 60,
    "weight bench": 15,
    "bowflex": 45,
    "dining table": 15,
    "kitchen table": 12,
    "conference table": 20,
    "desk": 15,
    "l desk": 25,
    "standing desk": 20,
    "executive desk": 20,
    "armoire": 25,
    "wardrobe": 20,
    "china cabinet": 15,
    "hutch": 15,
    "pool table": 180,
    "arcade machine": 10,
    "pinball machine": 15,
    "trampoline": 40,
    "trampoline large": 60,
    "playset": 120,
    "piano": 0,
    "safe": 0
};
const EFFORT_MULTIPLIER = {
    "piano": 5.0,
    "safe": 4.0,
    "pool table": 4.5,
    "marble": 3.0,
    "stone": 3.0,
    "arcade": 3.0,
    "sectional": 1.5,
    "fridge": 1.5,
    "treadmill": 2.0,
    "adjustable": 2.0,
    "rolling toolbox": 2.0,
    "box": 0.5,
    "bin": 0.5,
    "bag": 0.3
};
const FRAGILE_KEYWORDS = [
    "mirror",
    "glass",
    "china",
    "lamp",
    "tv",
    "artwork",
    "picture",
    "wine",
    "vase",
    "crystal",
    "antique",
    "statue",
    "marble",
    "stone",
    "arcade",
    "pinball",
    "clock",
    "plant",
    "wine fridge",
    "wine cooler",
    "gaming console",
    "ps5",
    "xbox setup",
    "large pet enclosure",
    "hamster cage",
    "terrarium"
];
const TRUE_HEAVY_ITEMS = [
    "piano",
    "grand piano",
    "baby grand",
    "upright piano",
    "safe",
    "gun safe",
    "large safe",
    "pool table",
    "billiards table",
    "commercial fridge",
    "french door fridge",
    "double door fridge",
    "2-door fridge",
    "vending machine",
    "commercial oven",
    "server rack",
    "hot tub",
    "jacuzzi",
    "riding mower",
    "motorcycle",
    "marble",
    "stone",
    "granite",
    "large statue",
    "fountain",
    "grandfather clock",
    "arcade machine",
    "pinball",
    "slot machine",
    "lathe",
    "milling machine",
    "machinery",
    "treadmill",
    "elliptical",
    "adjustable bed",
    "adjustable base",
    "sleep number",
    "copier",
    "large copier",
    "china cabinet",
    "conference table",
    "armoire",
    "solid wood armoire"
];
const BULKY_ITEMS = [
    "rowing machine",
    "multi gym",
    "tool chest",
    "rolling toolbox",
    "pallet",
    "skid",
    "crate"
];
const LIFT_GATE_ITEMS = [
    ...TRUE_HEAVY_ITEMS,
    ...BULKY_ITEMS
];
const LEAGUE_1_ITEMS = [
    "treadmill",
    "elliptical",
    "peloton",
    "exercise bike",
    "spin bike",
    "rowing machine",
    "multi gym",
    "weight bench",
    "washer",
    "dryer",
    "stove",
    "dishwasher",
    "fridge",
    "refrigerator",
    "commercial fridge",
    "tool chest",
    "rolling toolbox",
    "adjustable bed",
    "adjustable base",
    "sleep number"
];
const LEAGUE_2_ITEMS = [
    "grand piano",
    "baby grand piano",
    "upright piano",
    "piano",
    "safe",
    "gun safe",
    "large safe",
    "pool table",
    "marble table",
    "stone table",
    "hot tub",
    "jacuzzi",
    "arcade machine",
    "pinball machine",
    "slot machine",
    "grandfather clock",
    "riding mower",
    "server rack"
];
const VOLUME_TABLE = {
    // --- Furniture ---
    "bed": 60,
    "shelf": 20,
    "shelves": 20,
    "rack": 20,
    "patio": 20,
    "patio item": 20,
    "shelving unit": 20,
    "plastic": 10,
    "linen": 10,
    "clothes": 10,
    "misc": 10,
    "item": 10,
    "table": 25,
    "tables": 25,
    "folding table": 15,
    "cafeteria table": 25,
    "sectional": 120,
    "sectional sofa": 120,
    "l shape sofa": 120,
    "sleeper sofa": 80,
    "sofa bed": 80,
    "sofa": 60,
    "couch": 60,
    "loveseat": 40,
    "futon": 55,
    "daybed": 55,
    "chaise": 25,
    "recliner": 25,
    "armchair": 25,
    "easy chair": 25,
    "chair": 7,
    "dining chair": 7,
    "office chair": 10,
    "conference chair": 10,
    "folding chair": 3,
    "stackable chair": 5,
    "cafeteria chair": 5,
    "accent chair": 15,
    "occasional chair": 15,
    "bench": 15,
    "storage bench": 20,
    "entry bench": 15,
    "ottoman": 10,
    "bean bag": 10,
    "bar stool": 5,
    "stool": 5,
    "seat": 7,
    "dining table": 35,
    "kitchen table": 30,
    "dining bench": 20,
    "coffee table": 15,
    "coffee table set": 25,
    "end table": 5,
    "side table": 5,
    "console table": 20,
    "tv stand": 20,
    "media console": 25,
    "entertainment center": 50,
    "cabinet": 25,
    "hutch": 35,
    "curio cabinet": 35,
    "glass cabinet": 40,
    "china cabinet": 40,
    "buffet": 30,
    "sideboard": 30,
    "credenza": 35,
    "bar cabinet": 25,
    "bar cart": 10,
    "chest": 35,
    "chest of drawers": 35,
    "rug": 10,
    "lamp": 5,
    "artwork": 5,
    "picture": 5,
    "floor lamp": 8,
    "table lamp": 5,
    "painting": 5,
    "canvas": 5,
    "frame": 5,
    "cal king bed": 75,
    "king bed": 70,
    "queen bed": 60,
    "full bed": 50,
    "double bed": 50,
    "twin bed": 40,
    "bunk bed": 90,
    "loft bed": 90,
    "crib": 30,
    "mattress": 25,
    "boxspring": 15,
    "bed frame": 15,
    "headboard": 10,
    "footboard": 5,
    "bed slats": 5,
    "mattress topper": 5,
    "adjustable bed": 40,
    "adjustable base": 40,
    "dresser": 35,
    "tall dresser": 35,
    "triple dresser": 50,
    "bureau": 35,
    "nightstand": 10,
    "wardrobe": 40,
    "armoire": 50,
    "vanity": 30,
    "vanity stool": 5,
    "makeup table": 25,
    "changing table": 15,
    "shoe rack": 8,
    "drawer unit": 15,
    "plastic drawer unit": 15,
    "mirror full length": 10,
    "mirror": 8,
    "glass": 5,
    "glass board": 8,
    "whiteboard": 5,
    // --- Kids & Sport ---
    "stroller": 15,
    "double stroller": 25,
    "baby carriage": 20,
    "pram": 15,
    "buggy": 15,
    "car seat": 5,
    "booster seat": 5,
    "pack n play": 10,
    "playpen": 10,
    "high chair": 10,
    "toy box": 10,
    "dollhouse": 15,
    "bicycle kids": 5,
    "tricycle": 5,
    "scooter": 3,
    "wagon": 10,
    "trampoline": 50,
    "trampoline large": 60,
    "skateboard": 2,
    "basketball hoop": 30,
    "basketball goal": 30,
    "pet cage": 15,
    "dog crate": 15,
    "cat tree": 15,
    "animal pen": 20,
    "large pet enclosure": 10,
    "hamster cage": 10,
    "terrarium": 10,
    "yoga mat": 2,
    "gymnastics mat": 15,
    "crash mat": 15,
    "tumbling mat": 15,
    "wall bars": 20,
    "swedish ladder": 20,
    "baby crib": 25,
    "nursery cot": 25,
    // --- Office & Electronics ---
    "desk": 35,
    "l desk": 50,
    "standing desk": 25,
    "adjustable desk": 25,
    "standing desk converter": 8,
    "executive desk": 45,
    "work desk": 35,
    "work table": 35,
    "reception desk": 50,
    "chair mat": 2,
    "bookshelf": 20,
    "bookcase": 20,
    "file cabinet": 20,
    "cubicle": 40,
    "cubicle panel": 15,
    "computer": 5,
    "computer tower": 5,
    "monitor": 5,
    "computer monitor": 5,
    "dual monitor": 8,
    "monitor stand": 2,
    "printer": 10,
    "scanner": 5,
    "shredder": 8,
    "paper shredder": 8,
    "multifunction printer": 35,
    "tv": 10,
    "speaker": 4,
    "soundbar": 5,
    "subwoofer": 8,
    "gaming console": 5,
    "ps5": 5,
    "xbox setup": 5,
    "typewriter": 2,
    "server rack": 45,
    "electronics": 10,
    "equipment": 15,
    // --- Appliances & Household ---
    "fridge": 60,
    "refrigerator": 60,
    "commercial fridge": 80,
    "freezer": 30,
    "chest freezer": 30,
    "upright freezer": 40,
    "deep freezer": 30,
    "washer": 30,
    "dryer": 30,
    "stove": 30,
    "dishwasher": 25,
    "wine cooler": 20,
    "wine fridge": 20,
    "mini fridge": 10,
    "ice maker": 10,
    "microwave": 10,
    "mini oven": 10,
    "air fryer": 5,
    "toaster": 3,
    "blender": 3,
    "coffee maker": 3,
    "kitchen appliance": 5,
    "air conditioner": 20,
    "portable ac": 20,
    "dehumidifier": 10,
    "fan": 5,
    "tower fan": 5,
    "box fan": 5,
    "floor fan": 5,
    "heater": 10,
    "radiator": 10,
    "space heater": 5,
    "humidifier": 5,
    "vacuum": 5,
    "roomba": 5,
    "dyson": 5,
    "ironing board": 5,
    "water dispenser": 10,
    "water cooler": 10,
    // --- Gym ---
    "treadmill": 45,
    "running machine": 45,
    "elliptical": 40,
    "cross trainer": 40,
    "peloton": 20,
    "stationary bike": 20,
    "exercise bike": 20,
    "spin bike": 20,
    "rowing machine": 25,
    "rower": 25,
    "multi gym": 80,
    "power rack": 50,
    "smith machine": 50,
    "squat rack": 50,
    "weight bench": 15,
    "gym bench": 15,
    "weight rack": 25,
    "dumbbells": 10,
    "kettlebells": 10,
    "weights": 10,
    "weight plate tree": 10,
    "weight plates": 10,
    "punching bag": 15,
    "heavy bag": 15,
    // --- Outdoor & Garage ---
    "bike": 10,
    "bicycle": 10,
    "motorcycle": 50,
    "bbq": 30,
    "gas grill": 30,
    "barbecue": 30,
    "grill": 30,
    "smoker": 80,
    "fire pit": 15,
    "patio heater": 15,
    "patio set": 150,
    "outdoor table": 40,
    "outdoor chair": 10,
    "patio umbrella": 20,
    "ladder": 10,
    "step ladder": 5,
    "extension ladder": 15,
    "step stool": 5,
    "hose": 5,
    "garden hose": 5,
    "cooler": 10,
    "yeti": 10,
    "ice chest": 10,
    "lawn mower": 20,
    "riding mower": 60,
    "leaf blower": 5,
    "weed whacker": 5,
    "wheelbarrow": 20,
    "shovel": 2,
    "rake": 2,
    "garden tools bundle": 10,
    "broom": 3,
    "tool chest": 20,
    "large tool kit": 20,
    "mechanic tools": 20,
    "workbench": 40,
    "storage cabinet": 30,
    "garage cabinet": 30,
    "toolbox": 5,
    "metal rack": 25,
    "garage shelving": 25,
    "rolling toolbox": 20,
    "small tool box": 5,
    "tire": 10,
    "saw": 5,
    "sewing machine": 5,
    "small safe": 10,
    "generator": 15,
    "golf bag": 10,
    "golf clubs": 10,
    "surfboard": 15,
    "paddleboard": 15,
    "paddle board": 15,
    "sup": 15,
    "kayak": 25,
    "canoe": 30,
    "ski bag": 5,
    "camping gear": 15,
    "tent": 5,
    "plant": 10,
    "large plant": 10,
    "small plant": 5,
    // --- Heavy/Specialty ---
    "statue": 15,
    "large statue": 40,
    "fountain": 30,
    "bird bath": 10,
    "arcade machine": 50,
    "pinball machine": 40,
    "slot machine": 40,
    "jukebox": 50,
    "pool table": 80,
    "piano": 60,
    "upright piano": 60,
    "baby grand piano": 120,
    "grand piano": 150,
    "safe": 30,
    "gun safe": 60,
    "large safe": 80,
    "grandfather clock": 40,
    "clock large": 25,
    "restaurant table": 25,
    "bar chair": 7,
    "bar equipment": 20,
    "keg": 15,
    "tap system": 20,
    "sink": 15,
    "wash station": 25,
    "commercial sink": 25,
    "commercial grill": 80,
    "copy machine": 35,
    "copier": 35,
    "copier large": 60,
    "plotter": 35,
    "vending machine": 65,
    "conference table": 50,
    "display cabinet": 40,
    "pallet": 50,
    "skid": 50,
    "crate": 20,
    "commercial bin": 15,
    "marble table": 60,
    "stone table": 60,
    "hot tub": 80,
    "jacuzzi": 80,
    // --- Boxes & Storage ---
    "boxes": 5,
    "box": 5,
    "bin": 5,
    "tote": 5,
    "small box": 3,
    "medium box": 5,
    "large box": 6,
    "plastic bin": 5,
    "storage bin": 5,
    "trash can": 5,
    "garbage bin": 5,
    "waste basket": 5,
    "laundry basket": 5,
    "hamper": 5,
    "dish barrel": 10,
    "dish box": 10,
    "suitcase": 10,
    "luggage": 10,
    "duffle bag": 5,
    "travel bag": 5,
    "wardrobe box": 15,
    "wardrobe carton": 15,
    "tv box": 10,
    "picture box": 10,
    "art crate": 15,
    "aquarium": 25,
    "fish tank": 25,
    "aquarium stand": 15,
    "christmas decor": 5,
    "christmas stuff": 5,
    "kitchen items": 5,
    "pantry items": 5,
    "pillow": 5,
    "towel": 5,
    "bag": 5,
    // --- New Items Task 3 ---
    "chandelier": 15,
    "acoustic panel": 2,
    "stand": 5,
    "shoe cabinet": 15,
    "pedestal": 5,
    "dumbbell": 2,
    "kettlebell": 2,
    "mower": 15,
    "trunk": 10,
    "guitar": 5,
    "amplifier": 10,
    "umbrella stand": 5,
    "ignore_item": 0
};
const STRICT_NO_BLANKET_ITEMS = [
    "box",
    "bin",
    "tote",
    "pack",
    "bag",
    "luggage",
    "suitcase",
    "crate",
    "carton",
    "ladder",
    "hose",
    "sink",
    "equipment",
    "electronics",
    "vacuum",
    "fan",
    "microwave",
    "generator",
    "compressor",
    "lawn mower",
    "aquarium",
    "plant",
    "rug",
    "tools",
    "dumbbells",
    "plates",
    "lamp",
    "pallet",
    "skid",
    "trash",
    "bucket",
    "toy",
    "bicycle",
    "tricycle",
    "scooter",
    "wagon",
    "stroller",
    "kayak",
    "canoe",
    "surfboard",
    "garden",
    "shovel",
    "rake",
    "wheelbarrow",
    "mower",
    "tent",
    "camping",
    "leaf blower",
    "weed whacker",
    "pet cage",
    "dog crate",
    "linen",
    "clothes",
    "plastic",
    "tire",
    "hamper",
    "basket",
    "yeti",
    "cooler",
    "dish barrel",
    "pillow",
    "towel",
    "christmas"
];
const ABBREVIATIONS = {
    "tbl": "table",
    "chr": "chair",
    "cab": "cabinet",
    "ctr": "center",
    "exec": "executive",
    "pbo": "",
    "cp": "",
    "reg": "",
    "osz": "large",
    "std": "",
    "k/d": "",
    "kd": "",
    "uprt": "upright",
    "frig": "fridge",
    "ref": "fridge",
    "sect": "sectional",
    "ctn": "box",
    "carton": "box",
    "dp": "dish barrel",
    "dishpack": "dish barrel",
    "uph": "",
    "occ": "accent",
    "wdrb": "wardrobe",
    "arm": "armoire",
    "hdbd": "headboard",
    "ftbd": "footboard",
    "mrbl": "marble",
    "gl": "glass",
    "kng": "king",
    "qn": "queen",
    "dbl": "double",
    "twn": "twin",
    "med": "medium",
    "sm": "small",
    "lg": "large",
    "flat screen": "",
    "t.v.": "tv",
    "appliance": "kitchen appliance",
    "appliances": "kitchen appliance"
};
const INVERSIONS = [
    {
        src: /table,\s*coffee/i,
        dest: "coffee table"
    },
    {
        src: /table,\s*end/i,
        dest: "end table"
    },
    {
        src: /table,\s*dining/i,
        dest: "dining table"
    },
    {
        src: /bed,\s*headboard/i,
        dest: "headboard"
    },
    {
        src: /bed,\s*footboard/i,
        dest: "footboard"
    },
    {
        src: /fan,\s*floor/i,
        dest: "floor fan"
    },
    {
        src: /dresser,\s*triple/i,
        dest: "triple dresser"
    },
    {
        src: /mirror,\s*regular/i,
        dest: "mirror"
    },
    {
        src: /work\s*bench,\s*reg\.?/i,
        dest: "workbench"
    },
    {
        src: /box,\s*lg/i,
        dest: "large box"
    },
    {
        src: /box,\s*med/i,
        dest: "medium box"
    },
    {
        src: /box,\s*sm(?:all)?/i,
        dest: "small box"
    },
    {
        src: /plastic\s*bin,\s*lg/i,
        dest: "large plastic bin"
    },
    {
        src: /suitcase,\s*lg/i,
        dest: "large suitcase"
    }
];
const ALIAS_RULES = [
    // Adjective Protection
    {
        re: /\b(patio\s*tables?|outdoor\s*tables?)\b/i,
        to: "table"
    },
    {
        re: /\b(patio\s*chairs?|outdoor\s*chairs?)\b/i,
        to: "chair"
    },
    {
        re: /\b(playroom\s*toy\s*box)\b/i,
        to: "toy box"
    },
    // Broker Shorthand Aliases
    {
        re: /\b(sfa)\b/i,
        to: "sofa"
    },
    {
        re: /\b(qun\s*bd)\b/i,
        to: "queen bed"
    },
    {
        re: /\b(drssr)\b/i,
        to: "dresser"
    },
    {
        re: /\b(ntstnd)\b/i,
        to: "nightstand"
    },
    {
        re: /\b(chrs)\b/i,
        to: "chair"
    },
    {
        re: /\b(bffet)\b/i,
        to: "buffet"
    },
    {
        re: /\b(dsk)\b/i,
        to: "desk"
    },
    {
        re: /\b(bkshlf|bkcses?)\b/i,
        to: "bookcase"
    },
    {
        re: /\b(mwr)\b/i,
        to: "mower"
    },
    {
        re: /\b(bns)\b/i,
        to: "medium box"
    },
    {
        re: /\b(hmpr)\b/i,
        to: "hamper"
    },
    {
        re: /\b(mir)\b/i,
        to: "mirror"
    },
    {
        re: /\b(grll)\b/i,
        to: "grill"
    },
    {
        re: /\b(bnch)\b/i,
        to: "bench"
    },
    {
        re: /\b(trnk)\b/i,
        to: "trunk"
    },
    {
        re: /\b(lggge)\b/i,
        to: "medium box"
    },
    {
        re: /\b(armre)\b/i,
        to: "armoire"
    },
    {
        re: /\b(wshr)\b/i,
        to: "washer"
    },
    {
        re: /\b(dryr)\b/i,
        to: "dryer"
    },
    {
        re: /\b(shlf)\b/i,
        to: "shelf"
    },
    {
        re: /\b(wghts)\b/i,
        to: "kettlebells"
    },
    {
        re: /\b(umblla\s*stnd)\b/i,
        to: "umbrella stand"
    },
    // Studio/Tech items to boxes
    {
        re: /\b(all\s*drives|drives|cables|random\s*studio\s*gear|studio\s*gear|gear)\b/i,
        to: "medium box"
    },
    // Ignore trailing abbreviations
    {
        re: /\b(etc\.?)\b/i,
        to: "ignore_item"
    },
    // Granular rules & unmapped
    {
        re: /\b(rocker)\b/i,
        to: "armchair"
    },
    {
        re: /\b(amp)\b/i,
        to: "amplifier"
    },
    {
        re: /\b(coats)\b/i,
        to: "wardrobe box"
    },
    {
        re: /\b(plates?|forks?|cabbage|groceries|globe)\b/i,
        to: "medium box"
    },
    {
        re: /\b(lmp)\b/i,
        to: "lamp"
    },
    {
        re: /\b(plnt\s*stnd)\b/i,
        to: "plant stand"
    },
    {
        re: /\b(glbe)\b/i,
        to: "globe"
    },
    {
        re: /\b(rck)\b/i,
        to: "rack"
    },
    {
        re: /\b(bks)\b/i,
        to: "bicycle"
    },
    {
        re: /\b(trdmll)\b/i,
        to: "treadmill"
    },
    {
        re: /\b(prss)\b/i,
        to: "weight bench"
    },
    {
        re: /\b(bd)\b/i,
        to: "bed"
    },
    {
        re: /\b(bx)\b/i,
        to: "box"
    },
    {
        re: /\b(wckr)\b/i,
        to: "wicker chair"
    },
    {
        re: /\b(rdng)\b/i,
        to: "reading chair"
    },
    {
        re: /\b(fn)\b/i,
        to: "fan"
    },
    {
        re: /\b(cffee)\b/i,
        to: "coffee table"
    },
    {
        re: /\b(playroom)\b/i,
        to: "ignore_item"
    },
    // Commercial office aliases
    {
        re: /\btables?\s*\/\s*desks?\b/i,
        to: "desk"
    },
    {
        re: /\bchairs?\s*\/\s*seats?\b/i,
        to: "office chair"
    },
    {
        re: /\bwork\s*tables?\b/i,
        to: "work table"
    },
    {
        re: /\boffice\s*chairs?\b/i,
        to: "office chair"
    },
    {
        re: /\bconference\s*chairs?\b/i,
        to: "conference chair"
    },
    {
        re: /\bglass\s*boards?\b/i,
        to: "glass board"
    },
    {
        re: /\bwhite\s*boards?\b/i,
        to: "whiteboard"
    },
    {
        re: /\boffice\s*printers?\b/i,
        to: "printer"
    },
    {
        re: /\b(tv|television)\s*\d{2,3}\b/i,
        to: "tv"
    },
    {
        re: /\b(lg|samsung|sony|tcl|vizio|hisense|panasonic|sharp|philips)\s*\d{2,3}\b/i,
        to: "tv"
    },
    {
        re: /\bweight\s*plates?\b/i,
        to: "weight plates"
    },
    {
        re: /\b(printer)\s*\/\s*(copier)\b/i,
        to: "multifunction printer"
    },
    {
        re: /\bmfp\b/i,
        to: "multifunction printer"
    },
    {
        re: /\b(tv|television)\s+(stand|unit)\b/i,
        to: "tv stand"
    },
    {
        re: /\b(tv|television)\s+(console|credenza|cabinet)\b/i,
        to: "media console"
    },
    {
        re: /\b(sleeper|pull[-\s]?out)\s*(sofa|couch)\b/i,
        to: "sleeper sofa"
    },
    {
        re: /\bsofa\s*bed\b/i,
        to: "sofa bed"
    },
    {
        re: /\bfuton\b/i,
        to: "futon"
    },
    {
        re: /\bday\s*bed\b/i,
        to: "daybed"
    },
    {
        re: /\bchaise\s*(lounge)?\b/i,
        to: "chaise"
    },
    {
        re: /\bstorage\s*bench\b/i,
        to: "storage bench"
    },
    {
        re: /\b(entry|entryway)\s*bench\b/i,
        to: "entry bench"
    },
    {
        re: /\bbar\s*cart\b/i,
        to: "bar cart"
    },
    {
        re: /\bcoffee\s*table\s*set\b/i,
        to: "coffee table set"
    },
    {
        re: /\b(entertainment)\s*(unit|center)\b/i,
        to: "entertainment center"
    },
    {
        re: /\bdining\s*bench\b/i,
        to: "dining bench"
    },
    {
        re: /\bbar\s*cabinet\b/i,
        to: "bar cabinet"
    },
    {
        re: /\bglass\s*cabinet\b/i,
        to: "glass cabinet"
    },
    {
        re: /\bside\s*board\b/i,
        to: "sideboard"
    },
    {
        re: /\bbuffet\s*(table)?\b/i,
        to: "buffet"
    },
    {
        re: /\bchina\s*(hutch|cabinet)\b/i,
        to: "china cabinet"
    },
    {
        re: /\bdisplay\s*(case|cabinet)\b/i,
        to: "display cabinet"
    },
    {
        re: /\bcurio\b/i,
        to: "curio cabinet"
    },
    {
        re: /\bcredenza\b/i,
        to: "credenza"
    },
    {
        re: /\bcrib\b/i,
        to: "crib"
    },
    {
        re: /\bchanging\s*table\b/i,
        to: "changing table"
    },
    {
        re: /\bvanity\b/i,
        to: "vanity"
    },
    {
        re: /\bfull\s*length\s*mirror\b/i,
        to: "mirror full length"
    },
    {
        re: /\bshoe\s*rack\b/i,
        to: "shoe rack"
    },
    {
        re: /\bplastic\s*drawer(s)?\b/i,
        to: "plastic drawer unit"
    },
    {
        re: /\bdrawer\s*unit\b/i,
        to: "drawer unit"
    },
    {
        re: /\bmattress\s*topper\b/i,
        to: "mattress topper"
    },
    {
        re: /\bchange\s*table\b/i,
        to: "changing table"
    },
    {
        re: /\bbed\s*side\s*table(\s*s)?\b|\bbedside\s*table(\s*s)?\b|\bnight\s*stand(\s*s)?\b/i,
        to: "nightstand"
    },
    {
        re: /\b(chest)\s*of\s*drawers\b/i,
        to: "chest of drawers"
    },
    {
        re: /\bchest\s*drawers\b/i,
        to: "chest of drawers"
    },
    {
        re: /\bdresser\b.*\bmirror\b/i,
        to: "dresser"
    },
    {
        re: /\bmake\s*up\s*table\b/i,
        to: "makeup table"
    },
    {
        re: /\bstanding\s*desk\s*converter\b/i,
        to: "standing desk converter"
    },
    {
        re: /\b(printer)\b/i,
        to: "printer"
    },
    {
        re: /\bscanner\b/i,
        to: "scanner"
    },
    {
        re: /\bshredder\b/i,
        to: "shredder"
    },
    {
        re: /\bpc\s*tower\b|\bcomputer\s*tower\b/i,
        to: "computer tower"
    },
    {
        re: /\bmonitor\b|\bcomputer\s*screen\b/i,
        to: "computer monitor"
    },
    {
        re: /\bsound\s*bar\b/i,
        to: "soundbar"
    },
    {
        re: /\bsub\s*woofer\b|\bsubwoofer\b/i,
        to: "subwoofer"
    },
    {
        re: /\b(conference)\s*(room\s*)?table\b/i,
        to: "conference table"
    },
    {
        re: /\boffice\s*table\b/i,
        to: "conference table"
    },
    {
        re: /\b(copy\s*machine|xerox)\b/i,
        to: "copier"
    },
    {
        re: /\bupright\s*freezer\b/i,
        to: "upright freezer"
    },
    {
        re: /\bdeep\s*freezer\b/i,
        to: "deep freezer"
    },
    {
        re: /\bwine\s*cooler\b/i,
        to: "wine cooler"
    },
    {
        re: /\bwine\s*(refrigerator|fridge)\b/i,
        to: "wine fridge"
    },
    {
        re: /\bice\s*maker\b/i,
        to: "ice maker"
    },
    {
        re: /\bmicrowave\b/i,
        to: "microwave"
    },
    {
        re: /\b(toaster\s*oven|mini\s*oven)\b/i,
        to: "mini oven"
    },
    {
        re: /\bportable\s*ac\b|\bportable\s*air\s*conditioner\b/i,
        to: "portable ac"
    },
    {
        re: /\bair\s*conditioner\b/i,
        to: "air conditioner"
    },
    {
        re: /\bdehumidifier\b/i,
        to: "dehumidifier"
    },
    {
        re: /\bfan\b/i,
        to: "fan"
    },
    {
        re: /\bmini\s*(refrigerator|fridge)\b/i,
        to: "mini fridge"
    },
    {
        re: /\browing\s*machine\b|\brower\b/i,
        to: "rowing machine"
    },
    {
        re: /\bexercise\s*bike\b|\bspin\s*bike\b/i,
        to: "exercise bike"
    },
    {
        re: /\bweight\s*bench\b|\bworkout\s*bench\b/i,
        to: "weight bench"
    },
    {
        re: /\bweight\s*rack\b/i,
        to: "weight rack"
    },
    {
        re: /\bdumbbells?\b/i,
        to: "dumbbells"
    },
    {
        re: /\bstorage\s*cabinet\b/i,
        to: "storage cabinet"
    },
    {
        re: /\bgarage\s*cabinet\b/i,
        to: "garage cabinet"
    },
    {
        re: /\bpatio\s*umbrella\b/i,
        to: "patio umbrella"
    },
    {
        re: /\bfire\s*pit\b/i,
        to: "fire pit"
    },
    {
        re: /\bcooler\b/i,
        to: "cooler"
    },
    {
        re: /\bgenerator\b/i,
        to: "generator"
    },
    {
        re: /\blawn\s*mower\b/i,
        to: "lawn mower"
    },
    {
        re: /\bgolf\s*bag\b/i,
        to: "golf bag"
    },
    {
        re: /\b(bbq\s*grill|barbecue)\b/i,
        to: "bbq"
    },
    {
        re: /\b(metal)\s*(shelving|shelf|rack)\b/i,
        to: "metal rack"
    },
    {
        re: /\b(garage)\s*(shelving|shelf|rack)\b/i,
        to: "garage shelving"
    },
    {
        re: /\b(shelves|shelving)\b/i,
        to: "shelving unit"
    },
    {
        re: /\bstorage\s*rack\b/i,
        to: "rack"
    },
    {
        re: /\baquarium\b|\bfish\s*tank\b/i,
        to: "aquarium"
    },
    {
        re: /\bart\s*crate\b/i,
        to: "art crate"
    },
    {
        re: /\bpicture\s*box\b/i,
        to: "picture box"
    },
    {
        re: /\btv\s*box\b/i,
        to: "tv box"
    },
    {
        re: /\bwardrobe\s*carton(s)?\b/i,
        to: "wardrobe carton"
    },
    {
        re: /\bwardrobe\s*box(es)?\b/i,
        to: "wardrobe box"
    },
    {
        re: /\bpbo\b/i,
        to: "box"
    },
    {
        re: /\b(books|records|vinyl|cds|dvds)\b/i,
        to: "box"
    },
    {
        re: /\b(kitchen\s*items|pantry\s*items|misc\s*items)\b/i,
        to: "boxes"
    },
    {
        re: /\b(sup|paddle\s*board)\b/i,
        to: "paddle board"
    },
    {
        re: /\b(lawnmower)\b/i,
        to: "lawn mower"
    },
    {
        re: /\b(skid)\b/i,
        to: "pallet"
    },
    {
        re: /\b(trash\s*can|garbage\s*bin|waste\s*basket)\b/i,
        to: "trash can"
    },
    {
        re: /\b(pet\s*cage|dog\s*cage)\b/i,
        to: "pet cage"
    },
    {
        re: /\b(trampoline)\b/i,
        to: "trampoline"
    },
    {
        re: /\b(pinball)\b/i,
        to: "pinball machine"
    },
    {
        re: /\b(slot\s*machine)\b/i,
        to: "slot machine"
    },
    {
        re: /\b(grandfather\s*clock)\b/i,
        to: "grandfather clock"
    },
    {
        re: /\b(roomba|dyson|shark)\b/i,
        to: "vacuum"
    },
    {
        re: /\b(air\s*fryer|instapot|crockpot)\b/i,
        to: "air fryer"
    },
    {
        re: /\b(adjustable\s*base|sleep\s*number|tempurpedic(\s*base)?)\b/i,
        to: "adjustable base"
    },
    {
        re: /\bcomputer\s*chair\b/i,
        to: "office chair"
    },
    {
        re: /\badjustable\s*bed\s*frame\b/i,
        to: "adjustable base"
    },
    {
        re: /\bdbl\/qn\b/i,
        to: "full bed"
    },
    {
        re: /\blarge\s*plastic\s*bin\b/i,
        to: "plastic bin"
    },
    {
        re: /\b(love\s*seat|loveseat)\b/i,
        to: "loveseat"
    },
    {
        re: /\b(couch|couches)\b/i,
        to: "sofa"
    },
    {
        re: /\b(sectional|sectionals)\b/i,
        to: "sectional sofa"
    },
    {
        re: /\bconsole\b/i,
        to: "media console"
    },
    {
        re: /^stand$/i,
        to: "tv stand"
    },
    {
        re: /\bclosets?\b/i,
        to: "wardrobe box"
    },
    {
        re: /\bdrawers?\b/i,
        to: "chest of drawers"
    },
    {
        re: /\b(seats?|seating)\b/i,
        to: "chair"
    },
    {
        re: /\b(pots|pans|dishes)\b/i,
        to: "kitchen items"
    },
    {
        re: /\b(christmas|xmas)\s*(stuff|decor(ations)?)\b/i,
        to: "christmas decor"
    },
    {
        re: /\bpantry\b/i,
        to: "pantry items"
    },
    {
        re: /\b(bags?|luggage)\b/i,
        to: "bag"
    },
    {
        re: /\b(towels?|linens?)\b/i,
        to: "towel"
    },
    {
        re: /\bpillows?\b/i,
        to: "pillow"
    },
    {
        re: /\bgarden\s*tools\b/i,
        to: "garden tools bundle"
    },
    {
        re: /\boled\b/i,
        to: "tv"
    },
    {
        re: /\bflat\s*screen\b/i,
        to: "tv"
    },
    {
        re: /\btelevision\b/i,
        to: "tv"
    },
    // Small appliances & missing items
    {
        re: /\b(coffee\s*machine|coffee\s*maker|grinder)\b/i,
        to: "medium box"
    },
    {
        re: /\b(air\s*filters?)\b/i,
        to: "medium box"
    },
    {
        re: /\b(footrest)\b/i,
        to: "ottoman"
    },
    {
        re: /\b(watering\s*can|bucket)\b/i,
        to: "medium box"
    },
    {
        re: /\b(flags?|poles?|flagpoles?)\b/i,
        to: "broom"
    },
    {
        re: /\bsmalls\b/i,
        to: "small box"
    },
    // 1. THE ROOM LEAK TRAP (Uses ^ and $ to match ONLY the isolated room names)
    {
        re: /^(living\s*room|dining\s*room|breakfast\s*nook|kitchen|hallways?|linen\s*closet|main\s*bedroom|bedroom|office|tv\s*room|storage\s*room|exterior|outside|patio|back\s*house|music\s*studio|back-house|back-house\s*music\s*studio|lvg\s*rm|gar|pat|gst\s*bdrm|mstr\s*bdrm|lndry|plyrm|gym|lib|mudrm|attic)$/i,
        to: "ignore_item"
    },
    // 2. Kitchen Micro-items (Pack them into boxes)
    {
        re: /\b(jars?|spices?|bowls?|utensils?|pots?|pans?|tea\s*kettles?|trays?)\b/i,
        to: "medium box"
    },
    // 3. Specific Hobby & Misc Items
    {
        re: /\b(air\s*rifle|turntable|yoga\s*mat|foam\s*roller|cooler)\b/i,
        to: "medium box"
    },
    {
        re: /\b(document\s*safes?)\b/i,
        to: "small safe"
    },
    // 4. Granular container mappings & hardware anomalies
    {
        re: /\b(baskets?|small\s*objects?|shoes?|clothes?|odds|ends)\b/i,
        to: "medium box"
    },
    {
        re: /\b(documents?)\b/i,
        to: "small box"
    },
    {
        re: /\b(keyboards?)\b/i,
        to: "large box"
    },
    {
        re: /\b(stepladders?|step\s*ladders?)\b/i,
        to: "step ladder"
    },
    // Fallbacks for vague "contents"
    {
        re: /\b(cabinet\s*pack|packed\s*smalls?|misc\s*storage|drawer\s*contents|cabinet\s*contents|closet\s*contents|shelf\s*contents|cleaning\s*supplies)\b/i,
        to: "medium box"
    },
    {
        re: /\b(dishware|wine\s*glasses|dishes)\b/i,
        to: "dish barrel"
    },
    {
        re: /\b(keyboard\s*boxes)\b/i,
        to: "large box"
    },
    // Commercial & Specific
    {
        re: /\b(rolling\s*rack\s*cabinet)\b/i,
        to: "server rack"
    },
    {
        re: /\b(amplifiers?|rack\s*units?|security\s*cameras?)\b/i,
        to: "medium box"
    },
    {
        re: /\b(mic\s*stand|keyboard\s*stand|speaker\s*stand)\b/i,
        to: "stand"
    },
    {
        re: /\b(paper\s*shredder)\b/i,
        to: "shredder"
    },
    {
        re: /\b(ent\s*center)\b/i,
        to: "entertainment center"
    },
    {
        re: /\b(bottle\s*display)\b/i,
        to: "display cabinet"
    },
    {
        re: /\b(wall\s*lights?)\b/i,
        to: "lamp"
    },
    {
        re: /\b(planters?|pots?)\b/i,
        to: "plant"
    },
    // TRAP FOR MOVER EQUIPMENT (0 Volume)
    {
        re: /\b(moving\s*blankets?|bubble\s*wrap|stretch\s*wrap|packing\s*paper|tape|piano\s*boards?|dolly|dollies|straps|furniture\s*pads?|corner\s*protectors?|mattress\s*bags?|wardrobe\s*bags?|speed\s*packs?|bin\s*boxes?)\b/i,
        to: "ignore_item"
    }
];
const reEscape = (s)=>s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
const BLANKET_KEYS = Object.keys(BLANKETS_TABLE).sort((a, b)=>b.length - a.length);
const DA_KEYS = Object.keys(DA_TIME_TABLE).sort((a, b)=>b.length - a.length);
const SORTED_KEYS = Object.keys(VOLUME_TABLE).sort((a, b)=>b.length - a.length);
function buildKeyRegex(key) {
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
const KEY_REGEX = Object.fromEntries(SORTED_KEYS.map((k)=>[
        k,
        buildKeyRegex(k)
    ]));
const BLANKET_REGEX_CACHE = Object.fromEntries(BLANKET_KEYS.map((k)=>[
        k,
        buildKeyRegex(k)
    ]));
const DA_REGEX_CACHE = Object.fromEntries(DA_KEYS.map((k)=>[
        k,
        buildKeyRegex(k)
    ]));
const FRAGILE_REGEX_CACHE = FRAGILE_KEYWORDS.map((k)=>new RegExp(`\\b${reEscape(k)}\\b`, "i"));
const NUMBER_MAP = {
    "one": 1,
    "two": 2,
    "three": 3,
    "four": 4,
    "five": 5,
    "six": 6,
    "seven": 7,
    "eight": 8,
    "nine": 9,
    "ten": 10,
    "eleven": 11,
    "twelve": 12,
    "dozen": 12,
    "multiple": 5,
    "several": 3,
    "few": 3,
    "pair": 2,
    "couple": 2,
    "half dozen": 6
};
const NUMBERS_REGEX_CACHE = Object.keys(NUMBER_MAP).map((key)=>({
        re: new RegExp(`\\b${key}\\b`, "gi"),
        val: NUMBER_MAP[key]
    }));
const IRREGULAR_SIGNALS = [
    "sectional",
    "bike",
    "bicycle",
    "peloton",
    "treadmill",
    "elliptical",
    "rowing",
    "rower",
    "weights",
    "plates",
    "dumbbell",
    "kayak",
    "bbq",
    "grill",
    "smoker",
    "patio",
    "umbrella",
    "outdoor",
    "large mirror",
    "piano",
    "safe",
    "generator",
    "statue",
    "arcade",
    "riding mower",
    "trampoline",
    "surfboard",
    "pallet",
    "skid",
    "adjustable"
];
const VAGUE_SIGNALS = [
    "misc",
    "miscellaneous",
    "some boxes",
    "garage stuff",
    "storage stuff",
    "tools",
    "seasonal",
    "attic",
    "shed",
    "stuff"
];
const DA_COMPLEX = [
    "bed",
    "bunk",
    "crib",
    "sectional",
    "gym",
    "treadmill",
    "elliptical",
    "peloton",
    "armoire",
    "wardrobe",
    "sleeper",
    "sofa bed",
    "pool table",
    "arcade",
    "trampoline",
    "adjustable"
];
const DA_SIMPLE = [
    "table",
    "desk",
    "crib"
];
const SIZE_UNIT_PATTERNS = [
    /\b(?:inch|inches)\b/i,
    /\d\s*(?:in)\b/i,
    /\b(?:ft|feet|foot)\b/i,
    /\d\s*(?:cm)\b/i,
    /\d\s*(?:mm)\b/i,
    /["″]/
];
}),
"[project]/lib/config.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CLIENT_CONFIG",
    ()=>CLIENT_CONFIG,
    "HV_TABLE",
    ()=>HV_TABLE,
    "PROTOCOL",
    ()=>PROTOCOL
]);
const PROTOCOL = {
    TRUCK_CAPACITY_SAFE: 1580,
    TRUCK_MAX_THEORETICAL: 1650,
    BORDERLINE_TRUCK_THRESHOLD: 0.88,
    LD_WEIGHT_LIMIT: 12000,
    MULTI_TRUCK_TIME_BUFFER: 1.10,
    LD_TIER_BUFFER: 1.15,
    HEAVY_PAYLOAD_SPEED_MULT: 0.85,
    LARGE_VOLUME_DRAG: 1.15,
    VOLUME_DRAG_THRESHOLD: 3500,
    SPLIT_RISK_THRESHOLD: 12.5,
    WEIGHT_STD: 7.0,
    WEIGHT_SAFETY: 7.3,
    LL_STANDARD: 0.15,
    LL_LD: 0.05,
    LL_IRREGULAR: 0.20,
    LL_VAGUE: 0.10,
    LL_CAP: 0.30,
    HIDDEN_VOL_GARAGE: 150,
    COMMERCIAL_BOX_RATIO: 0.05,
    COMMERCIAL_STACK_FACTOR: 5,
    SPEED_GROUND: 240,
    SPEED_ELEVATOR: 210,
    SPEED_STAIRS: 190,
    SPEED_COMMERCIAL: 220,
    COORDINATION_HRS: 0.5,
    CREW_EFFICIENCY_HIGH: 0.90,
    CREW_EFFICIENCY_LOW: 0.85,
    ACCESS_MULT_ELEVATOR: 1.25,
    ACCESS_MULT_STAIRS: 1.40,
    STAIRS_FLIGHT_PENALTY: 0.08,
    FRAGILE_DENSITY_THRESHOLD: 0.30,
    FRAGILE_WRAP_MULT: 1.20,
    BLANKET_DIVISOR: 35,
    BLANKET_CAP_MULTIPLIER: 2.2,
    MIN_BOXES: {
        0: 10,
        1: 20,
        2: 35,
        3: 50,
        4: 70,
        5: 90
    },
    MINS_PACK_BOX: 8,
    MINS_WRAP_FURNITURE: 6,
    MINS_DA_COMPLEX: 30,
    MINS_DA_SIMPLE: 15,
    MINS_DOCKING_PER_TRUCK: 30,
    MINS_TRUCK_LOGISTICS: 10,
    MAX_CREW_SIZE: 8,
    VOL_EST_SMALL: 5,
    VOL_EST_MEDIUM: 20,
    VOL_EST_LARGE: 30
};
const HV_TABLE = [
    {
        label: "Studio",
        min: 200,
        add: 200
    },
    {
        label: "1BDR",
        min: 300,
        add: 200
    },
    {
        label: "2BDR",
        min: 500,
        add: 300
    },
    {
        label: "3BDR",
        min: 750,
        add: 400
    },
    {
        label: "4BDR",
        min: 1000,
        add: 500
    },
    {
        label: "5BDR+",
        min: 1300,
        add: 600
    }
];
const CLIENT_CONFIG = {
    MAX_EXTRA_STOPS: 4
};
}),
"[project]/lib/parser.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "applyAliasesRegex",
    ()=>applyAliasesRegex,
    "clampInt",
    ()=>clampInt,
    "extractQty",
    ()=>extractQty,
    "extractWeightLbs",
    ()=>extractWeightLbs,
    "looksLikeSizeNotQty",
    ()=>looksLikeSizeNotQty,
    "matchLongestKey",
    ()=>matchLongestKey,
    "normalizeRowsFromText",
    ()=>normalizeRowsFromText,
    "normalizeTextNumbers",
    ()=>normalizeTextNumbers,
    "parseInventory",
    ()=>parseInventory,
    "parseOverrideValue",
    ()=>parseOverrideValue,
    "preProcessLine",
    ()=>preProcessLine,
    "roundUpTo",
    ()=>roundUpTo,
    "scrubNoise",
    ()=>scrubNoise,
    "summarizeNormalizedRows",
    ()=>summarizeNormalizedRows,
    "uid",
    ()=>uid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dictionaries.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-rsc] (ecmascript)");
;
;
function matchLongestKey(nameLower, keys, cache) {
    for (const k of keys){
        if (cache[k].test(nameLower)) return k;
    }
    return null;
}
function looksLikeSizeNotQty(rawTok = "", cleanTok = "") {
    const s = (rawTok || "").toLowerCase();
    if (/\b(monitor|screen)s?\b/.test(cleanTok)) {
        if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SIZE_UNIT_PATTERNS"].some((re)=>re.test(s))) return true;
        return false;
    }
    if (/\b(tv|television)s?\b/.test(cleanTok)) {
        const m = s.match(/[:=]?\s*(\d{2,3})\b/);
        if (m) {
            const val = parseInt(m[1], 10);
            if (val >= 30 && val <= 100) return true;
        }
        return false;
    }
    if (/[:=]\s*\d+/.test(s)) return false;
    if (/\b(\~|≈|approx|approximately|total|qty|count|pcs|items|ea)\b/i.test(s)) return false;
    if (/\b\d+\s*[-–]\s*\d+\b/.test(s)) return false;
    if (/\b(?:qty|count|pcs)\s*[:=]?\s*\d+\b/i.test(s)) return false;
    if (/\b(?:x\s*\d+|\d+\s*x)\b/i.test(s)) return false;
    if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SIZE_UNIT_PATTERNS"].some((re)=>re.test(s))) return true;
    if (/\b\d+\s*'\b/.test(s)) return true;
    if (/\b\d+\s*x\s*\d+(\s*x\s*\d+)?\b/i.test(s)) return true;
    if (/\b(rug|carpet|mat|mirror)s?\b/.test(cleanTok)) {
        const m = s.match(/\b(\d{2,3})\b\s*$/);
        if (m) {
            const n = parseInt(m[1], 10);
            if (n >= 20) return true;
        }
    }
    return false;
}
function extractWeightLbs(rawTok = "") {
    const s = (rawTok || "").toLowerCase();
    let m = s.match(/(\d{1,4})\s*(?:lb|lbs|pound|pounds)\b/);
    if (m) return parseInt(m[1], 10);
    m = s.match(/(\d{1,4})\s*(?:kg|kgs)\b/);
    if (m) return Math.round(parseInt(m[1], 10) * 2.20462);
    return null;
}
function roundUpTo(n, step) {
    const x = Number(n);
    const s = Number(step);
    if (!Number.isFinite(x) || !Number.isFinite(s) || s <= 0) return Number(n);
    return Math.ceil(x / s) * s;
}
function uid() {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function clampInt(n, min = 0, max = 999) {
    const x = Number(n);
    if (!Number.isFinite(x)) return min;
    return Math.max(min, Math.min(max, Math.round(x)));
}
function parseOverrideValue(val, min = 0, max = 9999) {
    const str = String(val || "").trim();
    if (str === "") return null;
    const num = Number(str);
    if (!Number.isFinite(num)) return null;
    return Math.max(min, Math.min(max, Math.round(num)));
}
function normalizeTextNumbers(text) {
    let s = (text || "").toLowerCase();
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["NUMBERS_REGEX_CACHE"].forEach(({ re, val })=>{
        s = s.replace(re, String(val));
    });
    return s;
}
function scrubNoise(s) {
    return (s || "").replace(/\b\d+(\.\d+)?\s*(lb|lbs|pound|pounds|kg|kgs|in|inch|inches|ft|feet|foot|cm|mm)\b/gi, " ").replace(/\b\d+(\.\d+)?\s*['′](?=\s|$)/g, " ").replace(/\b\d+(\.\d+)?\s*["″](?=\s|$)/g, " ").replace(/['′"″]/g, " ").replace(/\s+/g, " ").trim();
}
function extractQty(text) {
    const s = (text || "").toLowerCase().trim().replace(/^[-*•>]\s*/, "").trim(); // strip leading bullet
    const safeParse = (str)=>{
        const val = parseInt(str, 10);
        return Math.min(500, Math.max(1, val));
    };
    let m = s.match(/\((\d+)\)\s*$/);
    if (m) return safeParse(m[1]);
    m = s.match(/\bx\s*(\d+)\b/i);
    if (m) return safeParse(m[1]);
    m = s.match(/\b(\d+)\s*x\b/i);
    if (m) return safeParse(m[1]);
    if (/\b\d+\s*x\s*\d+(\s*x\s*\d+)?\b/.test(s)) return 1;
    m = s.match(/\bset\s+of\s+(\d+)\b/);
    if (m) return safeParse(m[1]);
    m = s.match(/\bpair\s+of\b/);
    if (m) return 2;
    m = s.match(/(?:[:=\s]*[~≈-]+\s*|\s+)(\d+)(?:\s*[-–]\s*(\d+))?\s*(?:total|pcs|items|ea|est|approx)?\s*$/i);
    if (m) return Math.max(safeParse(m[1]), m[2] ? safeParse(m[2]) : 0);
    m = s.match(/\b(\d+)\s*dozen\b/);
    if (m) return Math.min(500, safeParse(m[1]) * 12);
    m = s.match(/^(\d+)\s*[-–—]\s*(\d+)\b/);
    if (m) return safeParse(m[2]);
    m = s.match(/^(\d+)\b/);
    if (m) return safeParse(m[1]);
    m = s.match(/:\s*(\d+)\s*$/);
    if (m) return safeParse(m[1]);
    m = s.match(/\b(qty|count|pcs)\s*(\d+)\s*$/);
    if (m) return safeParse(m[2]);
    m = s.match(/\bx(\d+)\b/i);
    if (m) return safeParse(m[1]);
    return 1;
}
function applyAliasesRegex(t) {
    const s = (t || "").toLowerCase();
    for (const rule of __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ALIAS_RULES"]){
        if (rule.re.test(s)) return rule.to;
    }
    return t;
}
function preProcessLine(line) {
    let s = line;
    // 1. Convert dash-separated rooms into standard colon-separated rooms so the engine catches them automatically
    s = s.replace(/^(patio|attic|playroom|garage|gar|gym|back-house music studio)\s*[-—–]\s*/gi, "$1: ");
    // 2. Strip fused broker room prefixes at the start of a line to isolate the actual items (e.g., "gar 2 bks" -> "2 bks")
    s = s.replace(/^(gar|att|gst\s*bdrm|mstr\s*bdrm|gym|plyrm|ent|lvg\s*rm)\s+(?=\d|[a-z])/gi, "");
    // 3. Fix special multiplication signs
    s = s.replace(/×/g, "x");
    // 2. Fix commas inside numbers (e.g., "1,000" -> "1000")
    s = s.replace(/(\d),(\d)/g, "$1$2");
    // 3. SMART PARENTHESES STRIPPER (Protects quantities!)
    // Removes noise like "(glass top)", but KEEPS "(4)", "(x4)", "(qty 2)", "(4x)"
    s = s.replace(/\((?!\s*(?:x|qty|#)?\s*\d+\s*x?\s*\))[^)]+\)/gi, " ");
    // 4. Strip broker jargon without destroying surrounding text
    s = s.replace(/\b(pre-removed|removed|empty|frame stays|boxed|packed|PBO|CP|KD|TBD)\b/gi, "");
    // 5. SPLIT MULTI-ITEMS: "w/d" means Washer AND Dryer. 
    // We replace with a comma so the tokenizer splits them into TWO items.
    s = s.replace(/\bw\/d\b/gi, "washer, dryer");
    // 6. SAFE SLASH HANDLING: "wardrobe/armoire" -> "wardrobe armoire"
    s = s.replace(/([a-zA-Z])\/([a-zA-Z])/g, "$1 $2");
    // Remove specific instructional noise that the dash-splitter turns into items
    s = s.replace(/[-—–]*\s*must be protected from crushing/gi, "");
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["INVERSIONS"].forEach((inv)=>{
        s = s.replace(inv.src, inv.dest);
    });
    s = s.replace(/\bt\.v\./gi, "tv");
    s = s.replace(/\bflat\s+screen\b/gi, "");
    const tokens = s.split(/([\s,]+)/);
    const processed = tokens.map((tok)=>{
        const lower = tok.toLowerCase().replace(/\.$/, "");
        // SAFE object call
        if (Object.prototype.hasOwnProperty.call(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ABBREVIATIONS"], lower)) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ABBREVIATIONS"][lower];
        }
        return tok;
    });
    s = processed.join("");
    s = s.replace(/\s+(w\/|with|plus)\s+/gi, " & ");
    return s;
}
function normalizeRowsFromText(text) {
    const parsed = parseInventory(text);
    const rows = (parsed.detectedItems || []).map((it)=>{
        const cfUnit = Math.max(1, Math.round((it.cf || 0) / Math.max(1, it.qty || 1)));
        const nameLower = (it.name || "").toLowerCase();
        const rawLower = (it.raw || "").toLowerCase();
        const isHeavy = it.isWeightHeavy || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TRUE_HEAVY_ITEMS"].some((h)=>new RegExp(`\\b${h}\\b`, 'i').test(nameLower) || new RegExp(`\\b${h}\\b`, 'i').test(rawLower));
        return {
            id: uid(),
            name: it.name,
            qty: clampInt(it.qty, 1, 500),
            cfUnit,
            raw: it.raw || "",
            room: it.room || "",
            flags: {
                heavy: !!isHeavy,
                heavyWeight: !!it.isWeightHeavy
            }
        };
    });
    return {
        rows,
        unmapped: 0
    };
}
function summarizeNormalizedRows(rows, rawTextForSignals = "") {
    // SAFE fallbacks for empty inputs during edit
    const validRows = (rows || []).filter((r)=>{
        const q = parseInt(String(r.qty), 10) || 0;
        return q > 0;
    });
    const detectedItems = validRows.map((r)=>({
            name: r.name,
            qty: clampInt(r.qty, 1, 500),
            cf: Math.max(1, Math.round((r.cfUnit || 1) * clampInt(r.qty, 1, 500))),
            raw: r.raw || "",
            room: r.room || "",
            isWeightHeavy: !!r.flags?.heavyWeight,
            isManualHeavy: !!r.flags?.heavy,
            wLbs: null,
            flags: r.flags
        }));
    const totalVol = (detectedItems || []).reduce((a, it)=>a + (it.cf || 0), 0);
    const detectedQtyTotal = (detectedItems || []).reduce((a, it)=>a + (it.qty || 0), 0);
    const boxCount = detectedItems.reduce((a, it)=>{
        const n = (it.name || "").toLowerCase();
        return new RegExp(`\\b(box|bin|tote)s?\\b`, 'i').test(n) ? a + it.qty : a;
    }, 0);
    const heavyCount = validRows.reduce((a, r)=>a + (r.flags?.heavy ? clampInt(r.qty, 1, 500) : 0), 0);
    let daComplexQty = 0, daSimpleQty = 0;
    detectedItems.forEach((it)=>{
        const n = (it.name || "").toLowerCase();
        // SAFE Bed Unit Check
        const isBedUnit = n.includes("bed") && !n.includes("frame") && !n.includes("mattress") && !n.includes("boxspring") && !n.includes("slat");
        if (isBedUnit) daComplexQty += it.qty;
        else if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_COMPLEX"].some((s)=>new RegExp(`\\b${s}\\b`, 'i').test(n))) daComplexQty += it.qty;
        else if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_SIMPLE"].some((s)=>new RegExp(`\\b${s}\\b`, 'i').test(n))) daSimpleQty += it.qty;
    });
    let furnitureCount = 0, noBlanketVol = 0;
    detectedItems.forEach((it)=>{
        const n = (it.name || "").toLowerCase();
        if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["STRICT_NO_BLANKET_ITEMS"].some((nb)=>new RegExp(`\\b${nb}\\b`, 'i').test(n))) noBlanketVol += it.cf;
        else furnitureCount += it.qty;
    });
    const irregularCount = detectedItems.reduce((a, it)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IRREGULAR_SIGNALS"].some((s)=>new RegExp(`\\b${s}\\b`, 'i').test((it.name || "").toLowerCase())) ? a + it.qty : a, 0);
    const rawLower = (rawTextForSignals || "").toLowerCase();
    return {
        detectedItems,
        totalVol,
        boxCount,
        heavyCount,
        furnitureCount,
        detectedQtyTotal,
        noBlanketVol,
        irregularCount,
        daComplexQty,
        daSimpleQty,
        unrecognized: [],
        estimatedItemCount: validRows.reduce((a, r)=>a + (/\(est\)$/.test((r.name || "").toLowerCase()) ? clampInt(r.qty, 1, 500) : 0), 0),
        hasVague: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VAGUE_SIGNALS"].some((s)=>new RegExp(`\\b${s}\\b`).test(rawLower)),
        mentionsGarageOrAttic: /\bgarage\b|\bpatio\b|\bchristmas\b|\battic\b|\bshed\b/i.test(rawLower)
    };
}
function parseInventory(text) {
    const rawNormalized = normalizeTextNumbers(text);
    const rawLines = rawNormalized.replace(/\r/g, "").split("\n").filter((l)=>l.trim().length > 0);
    let totalVol = 0, boxCount = 0, heavyCount = 0, detectedQtyTotal = 0, noBlanketVol = 0;
    let daComplexQty = 0, daSimpleQty = 0, furnitureCount = 0;
    let irregularCount = 0, estimatedItemCount = 0;
    const detectedItems = [];
    const unrecognized = [];
    const tokens = [];
    let currentRoom = "";
    rawLines.forEach((line)=>{
        const processedLine = preProcessLine(line);
        let clean = processedLine.trim().replace(/^[-*•>:]+\s*/, "");
        const isProtectedItem = /^(room divider|roomba|dining table|office chair|kitchen island|patio heater)\b/i.test(clean);
        const ROOM_ALIAS_REGEX_BASE = "living|dining|kitchen|master|bedroom|bath|garage|patio|study|office|basement|attic|nursery|guest|closet|laundry|den|foyer|hallway|mudroom|sunroom|bonus|master bedroom|master bdr|mbr|primary bedroom|primary bed|main bedroom|owner suite|home office|library|man cave|gym|home gym|fitness room|workout room|deck|backyard|storage|storage unit|shed|playroom|kids room|open office|conference|cafeteria|executive|equipment|reception|break room|server room|warehouse|breakfast nook|exterior|back house|music studio|tv room|storage room";
        const ROOM_ONLY = new RegExp(`^(${ROOM_ALIAS_REGEX_BASE})(\\s+room|\\s+area|\\s+rooms|\\s+offices|\\s+area)?(\\s*\/[\\w\\s\\-&]+)?\\s*:?$`, "i");
        const ROOM_PREFIX = new RegExp(`^(${ROOM_ALIAS_REGEX_BASE})\\b`, "i");
        // Generic section header: any text-only line ending in ':' with no digits (e.g. "Open Office Area:", "Cafeteria:")
        const GENERIC_SECTION_HEADER = /^[a-zA-Z][a-zA-Z\s\/\-]+:$/.test(clean.trim()) && !/\d/.test(clean);
        const normalizeRoomData = (room)=>{
            const lower = room.toLowerCase();
            if (/^(master bedroom|master bdr|mbr|primary bedroom|primary bed|main bedroom|owner suite|master)$/.test(lower)) return "Master Bedroom";
            if (/^(home office|study|den|library|man cave|office|executive offices?|executive)$/.test(lower)) return "Office";
            if (/^(gym|home gym|fitness room|workout room)$/.test(lower)) return "Gym";
            if (/^(garage|patio|deck|backyard|storage unit|attic|shed|storage)$/.test(lower)) return "Storage/Outdoor";
            if (/^(playroom|nursery|kids room)$/.test(lower)) return "Kids/Family";
            if (/^(open office|open office area)$/.test(lower)) return "Open Office";
            if (/^(conference rooms?|conference)$/.test(lower)) return "Conference Room";
            if (/^(cafeteria)$/.test(lower)) return "Cafeteria";
            if (/^(equipment|server room|reception|break room|warehouse)$/.test(lower)) return lower.charAt(0).toUpperCase() + lower.slice(1);
            return room.charAt(0).toUpperCase() + room.slice(1);
        };
        if (!isProtectedItem) {
            if ((ROOM_ONLY.test(clean) || GENERIC_SECTION_HEADER) && !/[0-9]/.test(clean)) {
                currentRoom = normalizeRoomData(clean.replace(/:$/, "").split("/")[0].trim());
                clean = "";
            } else {
                const colonHdr = clean.match(/^(.+?)\s*:\s*(.*)$/);
                if (colonHdr && ROOM_PREFIX.test(colonHdr[1])) {
                    currentRoom = normalizeRoomData(colonHdr[1].trim());
                    clean = colonHdr[2] || "";
                } else if (/^(master|bedroom|bath)\s*\d+$/i.test(clean)) {
                    currentRoom = normalizeRoomData(clean.trim());
                    clean = "";
                }
            }
        }
        if (!clean.trim()) return;
        clean = clean.replace(/\s+(w\/|with|plus|\+|and|&)\s+/gi, " & ");
        const lineTokens = clean.split(/[,;•+]+|\s+[\/—–]+\s+|&/gi).map((x)=>x.trim()).filter(Boolean);
        lineTokens.forEach((tok)=>tokens.push({
                text: tok,
                room: currentRoom
            }));
    });
    tokens.forEach(({ text: tok, room })=>{
        const rawTok = (tok || "").trim();
        let t = scrubNoise(rawTok.toLowerCase());
        if (!t) return;
        // Strip parenthetical notes that aren't quantities
        t = t.replace(/\s*\([^)]*(?:estimated|approx|ratio|mounted|commercial|light|heavy|uncertain|included|client)[^)]*\)\s*/gi, " ").trim();
        t = t.replace(/\s+/g, " ").trim();
        let qty = 1;
        const colonMatch = rawTok.match(/[:=]\s*(\d+)/);
        if (colonMatch) {
            const hasQtyWord = /\b(qty|count|pcs|items|ea)\b/i.test(rawTok);
            const sizeLike = looksLikeSizeNotQty(rawTok, t);
            qty = sizeLike && !hasQtyWord ? 1 : Math.min(500, Math.max(1, parseInt(colonMatch[1], 10)));
        } else {
            qty = looksLikeSizeNotQty(rawTok, t) ? 1 : extractQty(t);
        }
        const aliasFromRaw = applyAliasesRegex(rawTok.toLowerCase());
        const wLbs = extractWeightLbs(rawTok);
        const isWeightHeavy = wLbs && wLbs >= 300;
        if (aliasFromRaw !== rawTok.toLowerCase() && aliasFromRaw !== t) t = aliasFromRaw;
        const tClean = t.replace(/^\s*x\s*\d+\s*/i, "").replace(/^\s*\d+\s*x\s*/i, "").replace(/\s*x\s*\d+\s*$/i, "").replace(/\s*\(\s*\d+\s*\)\s*$/i, "").trim();
        let cleanName = tClean.replace(new RegExp(`^\\d+\\s*[-–—]?\\s*\\d*\\s*`, "i"), "").replace(new RegExp(`[:\\s]+${qty}\\s*$`, "i"), "").replace(/\b(qty|count|pcs|items|ea|est|approx)\b/gi, "").replace(/\s+/g, " ").trim();
        cleanName = applyAliasesRegex(cleanName);
        let matchedAny = false;
        for (const key of __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SORTED_KEYS"]){
            if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KEY_REGEX"][key].test(cleanName)) {
                matchedAny = true;
                const cf = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VOLUME_TABLE"][key] * qty;
                totalVol += cf;
                detectedQtyTotal += qty;
                detectedItems.push({
                    name: key,
                    qty,
                    cf,
                    raw: rawTok,
                    room,
                    wLbs,
                    isWeightHeavy: !!isWeightHeavy,
                    isManualHeavy: false,
                    flags: {
                        heavy: !!isWeightHeavy,
                        heavyWeight: !!isWeightHeavy
                    }
                });
                if (new RegExp(`\\b(box|bin|tote)s?\\b`, 'i').test(key)) boxCount += qty;
                if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LIFT_GATE_ITEMS"].some((h)=>new RegExp(`\\b${h}\\b`, 'i').test(key)) || isWeightHeavy) heavyCount += qty;
                if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IRREGULAR_SIGNALS"].some((s)=>new RegExp(`\\b${s}\\b`, 'i').test(key))) irregularCount += qty;
                // SAFE Bed Unit Check
                const isBedUnit = key.includes("bed") && !key.includes("frame") && !key.includes("mattress") && !key.includes("boxspring") && !key.includes("slat");
                if (isBedUnit) daComplexQty += qty;
                else if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_COMPLEX"].some((s)=>new RegExp(`\\b${s}\\b`, 'i').test(key))) daComplexQty += qty;
                else if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_SIMPLE"].some((s)=>new RegExp(`\\b${s}\\b`, 'i').test(key))) daSimpleQty += qty;
                if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["STRICT_NO_BLANKET_ITEMS"].some((nb)=>new RegExp(`\\b${nb}\\b`, 'i').test(key))) furnitureCount += qty;
                else noBlanketVol += cf;
                break;
            }
        }
        if (!matchedAny) {
            let estVol = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].VOL_EST_MEDIUM;
            const lowerName = cleanName.toLowerCase();
            let isBoxLike = false;
            if (/box|bin|tote|bag|pack|basket|shoe|lamp|small|mini/i.test(lowerName)) {
                estVol = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].VOL_EST_SMALL;
                isBoxLike = true;
            } else if (/table|desk|cabinet|shelf|rack|stand|unit|dresser/i.test(lowerName)) {
                estVol = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].VOL_EST_LARGE;
            }
            estVol = estVol * qty;
            totalVol += estVol;
            detectedQtyTotal += qty;
            if (!isBoxLike) furnitureCount += qty;
            estimatedItemCount += qty;
            detectedItems.push({
                name: `${cleanName} (est)`,
                qty,
                cf: estVol,
                raw: rawTok,
                room,
                wLbs,
                isWeightHeavy: !!isWeightHeavy,
                isManualHeavy: false,
                flags: {
                    heavy: !!isWeightHeavy,
                    heavyWeight: !!isWeightHeavy
                }
            });
            if (cleanName.length > 2 && !/^(item|qty|pcs|total|set|of)$/i.test(cleanName)) unrecognized.push(cleanName);
        }
    });
    const consolidationMap = new Map();
    for (const item of detectedItems){
        if (item.name === "ignore_item") continue;
        const key = `${item.name}::${item.room}`;
        const existing = consolidationMap.get(key);
        if (existing) {
            existing.qty += item.qty;
            existing.cf += item.cf;
        } else {
            consolidationMap.set(key, {
                ...item
            });
        }
    }
    const consolidatedItems = Array.from(consolidationMap.values());
    const rawLower = (text || "").toLowerCase();
    return {
        detectedItems: consolidatedItems,
        totalVol,
        boxCount,
        heavyCount,
        furnitureCount,
        detectedQtyTotal,
        noBlanketVol,
        irregularCount,
        daComplexQty,
        daSimpleQty,
        unrecognized,
        estimatedItemCount,
        hasVague: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VAGUE_SIGNALS"].some((s)=>new RegExp(`\\b${s}\\b`).test(rawLower)),
        mentionsGarageOrAttic: /\bgarage\b|\bpatio\b|\bchristmas\b|\battic\b|\bshed\b/i.test(rawLower)
    };
}
}),
"[project]/lib/engine.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildEstimate",
    ()=>buildEstimate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dictionaries.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/parser.ts [app-rsc] (ecmascript)");
;
;
;
function buildEstimate(inputs, normalizedRows, overridesObj) {
    try {
        const logs = [], risks = [], auditSummary = [], advice = [];
        const o = overridesObj || inputs?.overrides || {};
        const overridesApplied = [];
        const isCommercial = inputs.homeSize === "Commercial";
        const isLaborOnly = inputs.moveType === "Labor";
        const isLD = inputs.moveType === "LD";
        const bedroomCount = isCommercial ? 0 : parseInt(inputs.homeSize) || 0;
        const scopeLabel = isCommercial ? "Commercial" : inputs.homeSize === "0" ? "Studio / Less" : `${bedroomCount} BDR`;
        const useNormalized = inputs.inventoryMode === "normalized" && (normalizedRows && normalizedRows.length > 0 || Array.isArray(inputs.normalizedRows) && inputs.normalizedRows.length > 0);
        const parsed = useNormalized ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["summarizeNormalizedRows"])(normalizedRows || inputs.normalizedRows || [], inputs.inventoryText) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseInventory"])(inputs.inventoryText);
        // Deep merge flags from previous normalizedRows if available (preserving Client View manual flags)
        if (!useNormalized) {
            parsed.detectedItems = parsed.detectedItems.map((item)=>{
                const n = item.name.toLowerCase();
                const isTrueHeavy = item.isWeightHeavy || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TRUE_HEAVY_ITEMS"].some((h)=>new RegExp(`\\b${h}\\b`, 'i').test(n));
                let finalHeavy = isTrueHeavy;
                if (normalizedRows && normalizedRows.length > 0) {
                    const existingRow = normalizedRows.find((r)=>r.name.toLowerCase() === n && (r.room || "").toLowerCase() === (item.room || "").toLowerCase());
                    if (existingRow && existingRow.flags) {
                        // Only trust the stored heavy flag if the item is actually a TRUE_HEAVY_ITEM or has heavy weight.
                        // This prevents stale flags from old saves (e.g. workbench) from persisting incorrectly.
                        finalHeavy = isTrueHeavy ? !!existingRow.flags.heavy : false;
                        return {
                            ...item,
                            isManualHeavy: finalHeavy,
                            flags: {
                                ...item.flags,
                                ...existingRow.flags,
                                heavy: finalHeavy
                            }
                        };
                    }
                }
                return {
                    ...item,
                    isManualHeavy: finalHeavy,
                    flags: {
                        ...item.flags,
                        heavy: finalHeavy
                    }
                };
            });
        }
        const items = parsed.detectedItems || [];
        const countBy = (re)=>items.reduce((a, it)=>a + (re.test((it.name || "").toLowerCase()) ? it.qty : 0), 0);
        logs.push(`Config: ${inputs.moveType}, ${scopeLabel}`);
        logs.push(`Inventory: ${parsed.detectedQtyTotal} items. Vol: ${parsed.totalVol} cf.`);
        let fragileCount = 0;
        (parsed.detectedItems || []).forEach((it)=>{
            const n = it.name.toLowerCase();
            if (/\btv\b/.test(n) && /\btv stand\b|\bmedia console\b|\bentertainment center\b/.test(n)) return;
            if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FRAGILE_REGEX_CACHE"].some((re)=>re.test(n))) fragileCount += it.qty;
        });
        const fragileDensity = parsed.detectedQtyTotal > 0 ? fragileCount / parsed.detectedQtyTotal : 0;
        let hiddenVolume = 0;
        let missingBoxesCount = 0;
        const isTinyScope = bedroomCount === 0 && parsed.totalVol < 120;
        if (!isCommercial) {
            if (!isTinyScope && !isLD) {
                const hvRow = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HV_TABLE"][Math.min(bedroomCount, 5)];
                if (parsed.totalVol < hvRow.min) {
                    hiddenVolume += hvRow.add;
                    logs.push(`Volume Check: +${hvRow.add} cf added.`);
                    auditSummary.push(`Added +${hvRow.add} cf (low volume for ${hvRow.label}).`);
                }
            }
            const minBoxes = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MIN_BOXES[Math.min(bedroomCount, 5)] || 10;
            if (inputs.packingLevel !== "None" && !isTinyScope) {
                if (parsed.boxCount < minBoxes) {
                    missingBoxesCount = minBoxes - parsed.boxCount;
                    hiddenVolume += missingBoxesCount * 5;
                    auditSummary.push(`Added ${missingBoxesCount} boxes (min expected).`);
                }
            } else if (!isTinyScope) {
                const softCap = Math.min(minBoxes, parsed.boxCount + 10);
                if (parsed.boxCount < softCap) {
                    missingBoxesCount = softCap - parsed.boxCount;
                    hiddenVolume += missingBoxesCount * 5;
                    auditSummary.push(`Soft top-up +${missingBoxesCount} boxes.`);
                }
            }
        } else {
            if (parsed.boxCount === 0 && parsed.totalVol > 500) {
                missingBoxesCount = Math.ceil(parsed.totalVol * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].COMMERCIAL_BOX_RATIO / 5);
                hiddenVolume += missingBoxesCount * 5;
            }
        }
        if (parsed.mentionsGarageOrAttic) {
            hiddenVolume += __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].HIDDEN_VOL_GARAGE;
            auditSummary.push(`Added +${__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].HIDDEN_VOL_GARAGE} cf (zones mentioned).`);
        }
        let llPct = isLD ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LL_LD : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LL_STANDARD;
        const irregularRatio = parsed.detectedQtyTotal > 0 ? parsed.irregularCount / parsed.detectedQtyTotal : 0;
        if (parsed.hasVague) {
            llPct += __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LL_VAGUE;
            auditSummary.push("Loose load increased (vague).");
        }
        if (irregularRatio > 0.15) {
            llPct += __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LL_IRREGULAR;
            auditSummary.push("Loose load +20% (bulky items).");
        } else if (parsed.irregularCount > 0) llPct += 0.05;
        llPct = Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LL_CAP, llPct);
        const round25 = (num)=>Math.round(num / 25) * 25;
        const volumeBeforeLL = parsed.totalVol + hiddenVolume;
        const rawVolume = volumeBeforeLL;
        // B. Broker Safety Padding
        const BROKER_PADDING_MULTIPLIER = 1.05;
        const billableCF = round25(rawVolume * BROKER_PADDING_MULTIPLIER);
        // C. Actual Truck Space
        const truckSpaceCF = round25(billableCF * (1 + llPct));
        let finalVolume = truckSpaceCF;
        let volumeOverridden = false;
        if (o.volume !== undefined && o.volume !== null) {
            const v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOverrideValue"])(o.volume, 1, 10000);
            if (v !== null) {
                finalVolume = v;
                overridesApplied.push("volume");
                auditSummary.push(`Manager Override: Volume = ${finalVolume} cf`);
                volumeOverridden = true;
            }
        }
        if (!volumeOverridden) finalVolume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roundUpTo"])(finalVolume, 25);
        const weight = Math.round(finalVolume * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].WEIGHT_STD);
        logs.push(`Raw Inventory: ${rawVolume} cf.`);
        logs.push(`Net Total (+5% broker safety, rounded to 25): ${billableCF} cf.`);
        logs.push(`Actual Space (+LL gaps, rounded to 25): ${truckSpaceCF} cf.`);
        let effortScore = 0;
        (parsed.detectedItems || []).forEach((it)=>{
            const n = (it.name || "").toLowerCase();
            const mult = Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EFFORT_MULTIPLIER"]).find(([k])=>n.includes(k));
            effortScore += (it.cf || 0) * (mult ? mult[1] : 1.0);
        });
        let trucksFinal = 0;
        let truckSizeLabel = "N/A";
        let highCapRisk = false;
        const norm = (s)=>(s || "").toLowerCase();
        const hasPallets = (parsed.detectedItems || []).some((it)=>{
            const n = norm(it.name);
            const r = norm(it.raw);
            return n.includes("pallet") || n.includes("skid") || r.includes("pallet") || r.includes("skid");
        });
        const hasHeavyByWeight = (parsed.detectedItems || []).some((it)=>it.isWeightHeavy);
        const manualHeavy = (parsed.detectedItems || []).some((r)=>r.flags?.heavy);
        // In normalized mode, only respect manual flags for heavy detection
        const hasHeavy = useNormalized ? manualHeavy : (parsed.detectedItems || []).some((it)=>{
            const n = norm(it.name);
            const r = norm(it.raw);
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TRUE_HEAVY_ITEMS"].some((lg)=>new RegExp(`\\b${lg}\\b`, 'i').test(n) || new RegExp(`\\b${lg}\\b`, 'i').test(r));
        });
        let truckFeatureLabel = "";
        // Lift-gate: in normalized mode, only trigger if user checked heavy OR item is bulky by name
        const needsLiftGate = useNormalized ? manualHeavy || (parsed.detectedItems || []).some((it)=>{
            const n = norm(it.name);
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LIFT_GATE_ITEMS"].some((lg)=>new RegExp(`\\b${lg}\\b`, 'i').test(n));
        }) : (parsed.detectedItems || []).some((it)=>{
            const n = norm(it.name);
            return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LIFT_GATE_ITEMS"].some((lg)=>new RegExp(`\\b${lg}\\b`, 'i').test(n));
        });
        if (hasHeavy || hasPallets || hasHeavyByWeight || needsLiftGate) {
            truckFeatureLabel = " + Lift-gate";
            if (hasPallets) advice.push("Commercial: Palletjack & Lift-gate required for skids.");
            if (hasHeavyByWeight) advice.push("Item >300lb detected: Heavy lifting gear needed.");
        }
        if (!isLaborOnly) {
            const safeCapacity = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].TRUCK_CAPACITY_SAFE;
            trucksFinal = Math.max(1, Math.ceil(finalVolume / safeCapacity));
            if (trucksFinal === 1 && finalVolume >= Math.floor(safeCapacity * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].BORDERLINE_TRUCK_THRESHOLD)) {
                trucksFinal = 2;
                highCapRisk = true;
                risks.push({
                    text: "Borderline capacity: 2 trucks recommended.",
                    level: "caution"
                });
            }
            if (trucksFinal >= 2) truckSizeLabel = "26ft Truck";
            else if (finalVolume < 800) truckSizeLabel = "18ft Truck";
            else if (finalVolume < 1300) truckSizeLabel = "24ft Truck";
            else truckSizeLabel = "26ft Truck";
            truckSizeLabel += truckFeatureLabel;
            if (finalVolume > 4000) advice.push("Large Move: Recommend splitting into 2 days OR 6+ movers.");
            if (inputs.moveType === "LD") {
                const wTrucks = Math.ceil(weight / __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LD_WEIGHT_LIMIT);
                if (wTrucks > trucksFinal) {
                    trucksFinal = wTrucks;
                    auditSummary.push("Extra truck added (weight limit).");
                }
            }
        }
        if (!isLaborOnly && o.trucks !== undefined && o.trucks !== null) {
            const t = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOverrideValue"])(o.trucks, 1, 20);
            if (t !== null) {
                trucksFinal = t;
                highCapRisk = false;
                const label = trucksFinal >= 2 ? "26ft Truck" : finalVolume < 800 ? "18ft Truck" : finalVolume < 1300 ? "24ft Truck" : "26ft Truck";
                truckSizeLabel = label + truckFeatureLabel;
                overridesApplied.push("trucks");
                auditSummary.push(`Manager Override: Trucks = ${trucksFinal}`);
            }
        }
        const baseFloor = isLaborOnly ? 10 : 20;
        const itemFloor = Math.ceil((parsed.furnitureCount || 0) / 2);
        let blankets = 0;
        (parsed.detectedItems || []).forEach((it)=>{
            const n = (it.name || "").toLowerCase();
            let b = 0;
            const k = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchLongestKey"])(n, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BLANKET_KEYS"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BLANKET_REGEX_CACHE"]);
            if (k) b = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BLANKETS_TABLE"][k];
            else if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["STRICT_NO_BLANKET_ITEMS"].some((nb)=>new RegExp(`\\b${nb}\\b`, 'i').test(n))) b = 1;
            const isChairLike = (n.includes("chair") || n.includes("stool")) && !n.includes("chair mat") && !n.includes("mat");
            const isArmchair = n.includes("arm") || n.includes("recliner") || n.includes("sofa");
            if (isCommercial && isChairLike && !isArmchair) blankets += Math.ceil(it.qty / __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].COMMERCIAL_STACK_FACTOR);
            else blankets += b * it.qty;
        });
        const noBlanketCF = (parsed.detectedItems || []).reduce((a, it)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["STRICT_NO_BLANKET_ITEMS"].some((nb)=>new RegExp(`\\b${nb}\\b`, 'i').test((it.name || "").toLowerCase())) ? a + (it.cf || 0) : a, 0);
        const noBlanketWithLL = Math.round((noBlanketCF + missingBoxesCount * 5) * (1 + llPct));
        const blanketVolume = Math.max(0, finalVolume - noBlanketWithLL);
        blankets = Math.max(blankets, Math.ceil(blanketVolume / __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].BLANKET_DIVISOR));
        const cap = Math.min(Math.ceil((parsed.furnitureCount || 0) * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].BLANKET_CAP_MULTIPLIER) + 15, Math.ceil(blanketVolume / 12));
        blankets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roundUpTo"])(Math.max(Math.min(blankets, cap), Math.max(baseFloor, itemFloor)), 5);
        let speedOrigin = isCommercial ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPEED_COMMERCIAL : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPEED_GROUND;
        let speedDest = isCommercial ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPEED_COMMERCIAL : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPEED_GROUND;
        if (!isCommercial) {
            if (inputs.accessOrigin === "elevator") speedOrigin = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPEED_ELEVATOR;
            else if (inputs.accessOrigin === "stairs") speedOrigin = Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPEED_STAIRS * Math.max(0.5, 1 - (Math.min(6, Math.max(1, parseInt(String(inputs.stairsFlightsOrigin)) || 1)) - 1) * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].STAIRS_FLIGHT_PENALTY));
            if (inputs.accessDest === "elevator") speedDest = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPEED_ELEVATOR;
            else if (inputs.accessDest === "stairs") speedDest = Math.round(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPEED_STAIRS * Math.max(0.5, 1 - (Math.min(6, Math.max(1, parseInt(String(inputs.stairsFlightsDest)) || 1)) - 1) * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].STAIRS_FLIGHT_PENALTY));
        }
        if (isLaborOnly && inputs.accessOrigin === "stairs") speedOrigin = Math.round(speedOrigin * 0.85);
        if (inputs.moveType === "LD" && finalVolume * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].WEIGHT_SAFETY > 10000) speedOrigin *= __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].HEAVY_PAYLOAD_SPEED_MULT;
        let movementManHours = isLaborOnly || inputs.moveType === "LD" ? finalVolume / speedOrigin : finalVolume / speedOrigin + finalVolume / speedDest;
        if (highCapRisk) movementManHours *= __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MULTI_TRUCK_TIME_BUFFER;
        if (inputs.moveType === "LD") movementManHours *= __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LD_TIER_BUFFER;
        const isChairLikeFn = (name)=>/chair|stool|bench|seat/i.test(name) && !/arm|reclin|sofa|couch/i.test(name);
        let wrapMinsTotal = (parsed.detectedItems || []).reduce((acc, it)=>{
            const cfUnit = it.cf / Math.max(1, it.qty);
            let mins = cfUnit > 15 ? 10 : 5;
            if (isCommercial && isChairLikeFn(it.name)) mins = 1.0;
            return acc + mins * it.qty;
        }, 0);
        if (fragileDensity > __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].FRAGILE_DENSITY_THRESHOLD) wrapMinsTotal = Math.round(wrapMinsTotal * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].FRAGILE_WRAP_MULT);
        let daMins = 0;
        (parsed.detectedItems || []).forEach((it)=>{
            const n = (it.name || "").toLowerCase();
            const k = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchLongestKey"])(n, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_KEYS"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_REGEX_CACHE"]);
            if (k) daMins += __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_TIME_TABLE"][k] * it.qty;
            else {
                // SAFE Bed Unit Check
                const isBedUnit = n.includes("bed") && !n.includes("frame") && !n.includes("mattress") && !n.includes("boxspring") && !n.includes("slat");
                if (isBedUnit) daMins += (isCommercial ? 20 : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MINS_DA_COMPLEX) * it.qty;
                else if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_COMPLEX"].some((s)=>new RegExp(`\\b${s}\\b`, 'i').test(n))) daMins += (isCommercial ? 20 : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MINS_DA_COMPLEX) * it.qty;
                else if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_SIMPLE"].some((s)=>new RegExp(`\\b${s}\\b`, 'i').test(n))) daMins += (isCommercial ? 5 : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MINS_DA_SIMPLE) * it.qty;
            }
        });
        const totalBoxes = parsed.boxCount + missingBoxesCount;
        let packingAddonMH = 0;
        if (inputs.packingLevel === "Full") {
            packingAddonMH = totalBoxes * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MINS_PACK_BOX / 60;
            advice.push(`Tip: Pre-packing loose items saves time.`);
        } else if (inputs.packingLevel === "Partial") packingAddonMH = 2.0 + Math.min(totalBoxes, Math.max(10, Math.ceil(totalBoxes * 0.25))) * 0.08;
        const totalManHours = movementManHours + daMins / 60 + wrapMinsTotal / 60 + packingAddonMH;
        let crew = Math.max(2, Math.ceil(Math.sqrt(finalVolume / 100)));
        if (finalVolume >= 800 || trucksFinal > 1 || bedroomCount >= 3) crew = Math.max(3, crew);
        if (bedroomCount >= 4) crew = Math.max(4, crew);
        if (bedroomCount >= 5) crew = Math.max(5, crew);
        const anyHeavySignal = parsed.heavyCount > 0 || hasHeavy || manualHeavy || hasHeavyByWeight;
        if (anyHeavySignal) crew = Math.max(crew, 3);
        let league = 0;
        const leagueItems = {
            l1: [],
            l2: []
        };
        (parsed.detectedItems || []).forEach((it)=>{
            const n = (it.name || "").toLowerCase(), r = (it.raw || "").toLowerCase();
            if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LEAGUE_2_ITEMS"].some((lg)=>new RegExp(`\\b${lg}\\b`, 'i').test(n) || new RegExp(`\\b${lg}\\b`, 'i').test(r))) {
                league = 2;
                leagueItems.l2.push(it.name);
            } else if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LEAGUE_1_ITEMS"].some((lg)=>new RegExp(`\\b${lg}\\b`, 'i').test(n) || new RegExp(`\\b${lg}\\b`, 'i').test(r))) {
                if (league < 1) league = 1;
                leagueItems.l1.push(it.name);
            }
        });
        if (league === 2) crew = Math.max(crew, 4);
        if (finalVolume > 3000) crew = Math.max(crew, 6);
        if (finalVolume > 4000) crew = Math.max(crew, 7);
        if (inputs.packingLevel === "Full" && bedroomCount >= 3) crew = Math.max(crew, 4);
        if (!isLaborOnly && trucksFinal >= 2) crew = Math.max(crew, 5);
        if (crew > __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MAX_CREW_SIZE) crew = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MAX_CREW_SIZE;
        const distVal = parseInt(inputs.distance, 10) || 0;
        const effectiveDist = inputs.moveType === "LD" || isLaborOnly ? 0 : distVal;
        const fixedTime = (effectiveDist > 0 ? effectiveDist / 30 + 0.6 : 0) + __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].COORDINATION_HRS + (!isLaborOnly ? trucksFinal * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MINS_DOCKING_PER_TRUCK / 60 : 0) + (!isLaborOnly && trucksFinal >= 2 ? trucksFinal * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MINS_TRUCK_LOGISTICS / 60 : 0);
        // SAFE spaceCap Logic (Option 2 applied)
        const isSmallHome = !isCommercial && bedroomCount <= 2;
        let spaceCap = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MAX_CREW_SIZE;
        if (isSmallHome) {
            if (finalVolume > 2000) {
                spaceCap = 6;
            } else if (anyHeavySignal || finalVolume > 1500) {
                spaceCap = 5;
            } else {
                spaceCap = 4;
            }
            if (crew > spaceCap) crew = spaceCap;
        }
        const crewHardCap = Math.min(spaceCap, isCommercial ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MAX_CREW_SIZE : finalVolume < 2600 ? 6 : finalVolume < 3400 ? 7 : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MAX_CREW_SIZE);
        const computeDuration = (crewVal)=>totalManHours / (crewVal * (crewVal > 6 ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].CREW_EFFICIENCY_LOW : crewVal > 4 ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].CREW_EFFICIENCY_HIGH : 1.0)) * (finalVolume > __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].VOLUME_DRAG_THRESHOLD ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LARGE_VOLUME_DRAG : 1.0) + fixedTime;
        let calcDuration = computeDuration(crew);
        const SAFE_DAY_LIMIT = (inputs.moveType === "Local" || inputs.moveType === "Storage") && inputs.packingLevel === "Full" ? 11.5 : 10.5;
        while(crew < crewHardCap){
            const nextDuration = computeDuration(crew + 1);
            const timeSaved = calcDuration - nextDuration;
            if (calcDuration <= SAFE_DAY_LIMIT && timeSaved < 1.0) break;
            if (Math.ceil(calcDuration * 1.1) < __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPLIT_RISK_THRESHOLD && timeSaved < 0.5) break;
            crew++;
            calcDuration = nextDuration;
        }
        let crewSuggestion = calcDuration > 8.0 && crew < crewHardCap && calcDuration - computeDuration(crew + 1) >= 0.5 ? `+1 Mover saves ~${(calcDuration - computeDuration(crew + 1)).toFixed(1)}h` : null;
        const boxDensity = parsed.detectedQtyTotal > 0 ? (parsed.boxCount || 0) / parsed.detectedQtyTotal : 0;
        if (boxDensity > 0.60 && inputs.accessOrigin === "ground" && (inputs.moveType !== "Local" || inputs.accessDest === "ground") && finalVolume < 1200 && league < 2 && !overridesApplied.includes("crew") && crew > 3) {
            crew = 3;
            calcDuration = computeDuration(crew);
        }
        if (!isLaborOnly && trucksFinal === 1 && /^18ft|^16ft/.test(truckSizeLabel) && league < 2 && !overridesApplied.includes("crew") && crew > 3) {
            crew = 3;
            calcDuration = computeDuration(crew);
        }
        let timeMin = Math.max(3, Math.floor(calcDuration));
        let timeMax = Math.max(timeMin + 1, Math.ceil(calcDuration * 1.1));
        let splitRecommended = false;
        if (isSmallHome && timeMax > 12.0 && crew === spaceCap) {
            advice.push("Space Constraint: Duration is high. 2-Day Split HIGHLY Recommended.");
            splitRecommended = true;
        } else if (timeMax >= __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPLIT_RISK_THRESHOLD && crew === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MAX_CREW_SIZE) {
            advice.push("Extremely long duration. 2-Day Split Recommended.");
            splitRecommended = true;
        }
        if (o.crew !== undefined && o.crew !== null) {
            const c = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOverrideValue"])(o.crew, 2, 20);
            if (c !== null) {
                crew = c;
                crewSuggestion = null;
                overridesApplied.push("crew");
            }
        }
        if (!(o.timeMin !== undefined && o.timeMin !== null || o.timeMax !== undefined && o.timeMax !== null) && overridesApplied.includes("crew")) {
            const d = computeDuration(crew);
            timeMin = Math.max(3, Math.floor(d));
            timeMax = Math.max(timeMin + 1, Math.ceil(d * 1.1));
        }
        if (o.timeMin !== undefined && o.timeMin !== null) {
            const tm = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOverrideValue"])(o.timeMin, 1, 99);
            if (tm !== null) {
                timeMin = tm;
                overridesApplied.push("timeMin");
            }
        }
        if (o.timeMax !== undefined && o.timeMax !== null) {
            const tx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOverrideValue"])(o.timeMax, 1, 99);
            if (tx !== null) {
                timeMax = tx;
                overridesApplied.push("timeMax");
            }
        }
        if (timeMax >= 13) splitRecommended = true;
        let confidenceScore = 100;
        const reasons = [];
        const estimatedRatio = (parsed.estimatedItemCount || 0) / Math.max(1, parsed.detectedQtyTotal);
        if (estimatedRatio > 0.05) {
            const penalty = Math.min(30, Math.round(estimatedRatio * 40));
            confidenceScore -= penalty;
            reasons.push(`Estimated items: ${Math.round(estimatedRatio * 100)}% (-${penalty})`);
        }
        if (estimatedRatio > 0.40) {
            confidenceScore = Math.min(confidenceScore, 50);
            reasons.push("Too many unrecognized items (Low Confidence).");
        }
        if (parsed.hasVague) {
            confidenceScore -= 7;
            reasons.push("Vague inventory description.");
        }
        confidenceScore = Math.max(40, Math.min(100, confidenceScore));
        const confidenceLabel = confidenceScore >= 80 ? "High" : confidenceScore >= 60 ? "Medium" : "Low";
        const uniqueAdvice = [];
        const seenAdvice = new Set();
        if (inputs.packingLevel !== "None") advice.push(isCommercial ? "Comm. Packing: Label all boxes by office/room number." : "Packing: Personal valuables & documents must be moved by client.");
        if (finalVolume > 1800 && trucksFinal === 1) advice.push("High Volume: Ensure parking spot is 40ft+ for large truck maneuvering.");
        advice.forEach((a)=>{
            if (splitRecommended && a.includes("Large Move")) return;
            if (!seenAdvice.has(a)) {
                seenAdvice.add(a);
                uniqueAdvice.push(a);
            }
        });
        let boxesBring = parsed.boxCount || 0;
        const minBoxesBySize = !isCommercial ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MIN_BOXES[Math.min(bedroomCount, 5)] || 10 : 20;
        if (inputs.packingLevel === "Full") boxesBring = Math.max(boxesBring, minBoxesBySize) + 10 + Math.max(1, trucksFinal) * 5;
        else if (inputs.packingLevel === "Partial") boxesBring = Math.max(boxesBring, isCommercial ? 25 : Math.max(25, Math.ceil(minBoxesBySize * 0.35)));
        else boxesBring = Math.max(boxesBring, isCommercial ? 15 : 10);
        if (fragileCount > 5) boxesBring += 5;
        if (parsed.hasVague) boxesBring += 5;
        boxesBring = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roundUpTo"])(Math.ceil(Math.min(boxesBring, inputs.packingLevel === "Full" ? Math.ceil(finalVolume / 12 + 40) : Math.ceil(finalVolume / 20 + 20))), 10);
        const wardrobes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roundUpTo"])(!isCommercial ? bedroomCount * 4 : 0, 5);
        if (o.blankets !== undefined && o.blankets !== null) {
            const b = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOverrideValue"])(o.blankets, 0, 500);
            if (b !== null) {
                blankets = b;
                overridesApplied.push("blankets");
                auditSummary.push(`Manager Override: Blankets = ${blankets}`);
            }
        }
        if (o.boxes !== undefined && o.boxes !== null) {
            const bx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOverrideValue"])(o.boxes, 0, 500);
            if (bx !== null) {
                boxesBring = bx;
                overridesApplied.push("boxes");
                auditSummary.push(`Manager Override: Boxes = ${boxesBring}`);
            }
        }
        const smartEquipment = [];
        if (hasPallets) smartEquipment.push("Pallet Jack");
        if (countBy(/piano/i) > 0) smartEquipment.push("Piano Board");
        if (countBy(/fridge|washer|dryer|safe/i) > 0) smartEquipment.push("Appliance Dolly");
        if (fragileCount > 2) smartEquipment.push("Protective Wrap");
        const heavyMap = new Map();
        (parsed.detectedItems || []).forEach((it)=>{
            const n = (it.name || "").toLowerCase();
            // In normalized (manager) mode, user's checkbox is the ONLY authority
            if (useNormalized) {
                if (!it.isManualHeavy) return;
            } else {
                // In raw text mode, use automatic detection via TRUE_HEAVY_ITEMS
                const isTrueHeavy = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TRUE_HEAVY_ITEMS"].some((h)=>n.includes(h));
                if (!isTrueHeavy && !it.isWeightHeavy) return;
            }
            const label = it.isWeightHeavy ? `${it.name} (>300lb)` : it.name;
            heavyMap.set(label, (heavyMap.get(label) || 0) + (it.qty || 1));
        });
        return {
            finalVolume,
            weight,
            trucksFinal,
            truckSizeLabel,
            crew,
            timeMin,
            timeMax,
            logs,
            risks,
            splitRecommended,
            crewSuggestion,
            parsedItems: parsed.detectedItems,
            detectedQtyTotal: parsed.detectedQtyTotal,
            unrecognized: parsed.unrecognized,
            materials: {
                blankets,
                boxes: boxesBring,
                wardrobes
            },
            smartEquipment,
            homeLabel: scopeLabel,
            confidence: {
                score: confidenceScore,
                label: confidenceLabel,
                reasons
            },
            auditSummary,
            advice: uniqueAdvice,
            overridesApplied,
            unrecognizedDetails: parsed.unrecognized.slice(0, 10),
            effortScore: Math.round(effortScore),
            deadheadMiles: effectiveDist,
            isDDT: inputs.moveType === "Local" && distVal > 10,
            totalManHours: Math.round(totalManHours * 10) / 10,
            daMins: Math.round(daMins),
            anyHeavySignal,
            heavyItemNames: [
                ...heavyMap.entries()
            ].map(([name, qty])=>qty > 1 ? `${name} x${qty}` : name),
            league,
            leagueItems,
            boxDensity: Math.round(boxDensity * 100),
            truckFitNote: null,
            netVolume: rawVolume,
            billableCF: billableCF,
            truckSpaceCF: truckSpaceCF,
            extraStopCount: 0
        };
    } catch (err) {
        console.error("Engine Crash:", err);
        return {
            finalVolume: 0,
            weight: 0,
            trucksFinal: 0,
            truckSizeLabel: "Error",
            crew: 0,
            timeMin: 0,
            timeMax: 0,
            logs: [
                "Critical Engine Error"
            ],
            risks: [
                {
                    text: "System Error. Reset config.",
                    level: "critical"
                }
            ],
            splitRecommended: false,
            crewSuggestion: null,
            parsedItems: [],
            detectedQtyTotal: 0,
            unrecognized: [],
            materials: {
                blankets: 0,
                boxes: 0,
                wardrobes: 0
            },
            smartEquipment: [],
            homeLabel: "Error",
            confidence: {
                score: 0,
                label: "Error",
                reasons: []
            },
            auditSummary: [],
            advice: [],
            overridesApplied: [],
            unrecognizedDetails: [],
            anyHeavySignal: false,
            heavyItemNames: [],
            league: 0,
            leagueItems: {
                l1: [],
                l2: []
            },
            boxDensity: 0,
            truckFitNote: null,
            netVolume: null,
            billableCF: null,
            truckSpaceCF: null,
            extraStopCount: 0,
            effortScore: 0,
            deadheadMiles: 0,
            isDDT: false,
            totalManHours: 0,
            daMins: 0
        };
    }
}
}),
"[project]/lib/supabase/server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
async function createClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(("TURBOPACK compile-time value", "https://jxlvlhieahahutkwcabb.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4bHZsaGllYWhhaHV0a3djYWJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4MDUyMDksImV4cCI6MjA4NzM4MTIwOX0.DrGwv_NGnVmNxBBdIKbS3IpWjVPBBp3jUsLy4E8UDIM"), {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
}
}),
"[project]/app/actions/estimate.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"009047fe9654c828be38ae390f3e769d9da2b28fc6":"fetchHistoryAction","401d8558eef460ef18bba5ec1a7440887feeffe2d0":"suggestItemsAction","4089042fcfa95524a198dab65b9211a1727afade48":"deleteEstimateAction","40a2a3c7a7350b88dcbccdc99138858016913e31d8":"loadEstimateAction","40cd010855f5e8ccc19d46ab8b3c76e9d625791c7c":"normalizeInventoryAction","40dba74bf828995a737e94833644634fb9dd7802f5":"resolveItemAction","70b2c43613fd9c55ad336729f9ab21b36445befadb":"getEstimate","7e88bc1bbe9beb9a3b44b7dcede4cf3f195b45cf67":"saveEstimateAction"},"",""] */ __turbopack_context__.s([
    "deleteEstimateAction",
    ()=>deleteEstimateAction,
    "fetchHistoryAction",
    ()=>fetchHistoryAction,
    "getEstimate",
    ()=>getEstimate,
    "loadEstimateAction",
    ()=>loadEstimateAction,
    "normalizeInventoryAction",
    ()=>normalizeInventoryAction,
    "resolveItemAction",
    ()=>resolveItemAction,
    "saveEstimateAction",
    ()=>saveEstimateAction,
    "suggestItemsAction",
    ()=>suggestItemsAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/parser.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dictionaries.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function getEstimate(inputs, normalizedRows, overrides) {
    try {
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildEstimate"])(inputs, normalizedRows, overrides);
        // DEBUG LOG
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dbg = result;
        console.log("[PARSER DEBUG]", {
            detectedQtyTotal: dbg.detectedQtyTotal,
            totalVol: dbg.netVolume,
            itemCount: dbg.detectedItems?.length,
            firstItems: dbg.detectedItems?.slice(0, 8).map((i)=>`${i.name} x${i.qty}`),
            unrecognized: dbg.unrecognized?.slice(0, 5)
        });
        if (inputs.moveType === "LD") {
            console.log("[LD DEBUG] billableCF:", result.billableCF, "truckSpaceCF:", result.truckSpaceCF, "netVolume:", result.netVolume);
        }
        return JSON.parse(JSON.stringify(result));
    } catch (err) {
        throw err;
    }
}
async function normalizeInventoryAction(text) {
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeRowsFromText"])(text);
    return result.rows;
}
async function resolveItemAction(name) {
    const alias = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["applyAliasesRegex"])((name || "").trim().toLowerCase());
    const volKey = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SORTED_KEYS"].find((k)=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KEY_REGEX"][k].test(alias)) || null;
    const resolvedName = volKey || `${name} (est)`;
    const cfUnit = volKey ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VOLUME_TABLE"][volKey] : 25;
    const isHeavy = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TRUE_HEAVY_ITEMS"].some((h)=>resolvedName.includes(h));
    return {
        resolvedName,
        cfUnit,
        isHeavy
    };
}
async function suggestItemsAction(prefix) {
    const p = (prefix || "").trim().toLowerCase();
    if (p.length < 2) return [];
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SORTED_KEYS"].filter((k)=>k.includes(p)).slice(0, 20);
}
async function saveEstimateAction(clientName, estimate, inputs, normalizedRows, inventoryMode, overrides) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return {
                success: false,
                error: "Unauthorized: You must be logged in to save estimates."
            };
        }
        if (!clientName || !clientName.trim()) {
            return {
                success: false,
                error: "Client Name is required."
            };
        }
        const { homeSize, moveType, distance, packingLevel, accessOrigin, accessDest, stairsFlightsOrigin, stairsFlightsDest, inventoryText, extraStops } = inputs;
        const payload = {
            manager_id: user.id,
            client_name: clientName.trim(),
            final_volume: estimate.finalVolume,
            net_volume: estimate.netVolume || null,
            truck_space_cf: estimate.truckSpaceCF || null,
            inputs_state: {
                inputs: {
                    homeSize,
                    moveType,
                    distance,
                    packingLevel,
                    accessOrigin,
                    accessDest,
                    stairsFlightsOrigin,
                    stairsFlightsDest,
                    inventoryText,
                    extraStops
                },
                normalizedRows,
                inventoryMode,
                overrides
            }
        };
        const { data, error } = await supabase.from('estimates').insert([
            payload
        ]).select('id').single();
        if (error) {
            console.error("Supabase insert error:", error);
            return {
                success: false,
                error: error.message
            };
        }
        return {
            success: true,
            id: data.id
        };
    } catch (err) {
        console.error("Save estimate action error:", err);
        return {
            success: false,
            error: err instanceof Error ? err.message : "An unexpected error occurred."
        };
    }
}
async function fetchHistoryAction() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data, error } = await supabase.from('estimates').select('id, client_name, final_volume, net_volume, inputs_state, created_at').eq('manager_id', user.id).order('created_at', {
        ascending: false
    }).limit(30);
    if (error) {
        console.error("fetchHistoryAction error:", error);
        return [];
    }
    return (data || []).map((item)=>({
            ...item,
            home_size: item.inputs_state?.inputs?.homeSize || null,
            move_type: item.inputs_state?.inputs?.moveType || null
        }));
}
async function loadEstimateAction(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data, error } = await supabase.from('estimates').select('*').eq('id', id).eq('manager_id', user.id).single();
    if (error) {
        console.error("loadEstimateAction error:", error);
        return null;
    }
    return data;
}
async function deleteEstimateAction(id) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {
        success: false,
        error: "Unauthorized"
    };
    const { error } = await supabase.from('estimates').delete().eq('id', id).eq('manager_id', user.id);
    if (error) {
        console.error("deleteEstimateAction error:", error);
        return {
            success: false,
            error: error.message
        };
    }
    return {
        success: true
    };
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getEstimate,
    normalizeInventoryAction,
    resolveItemAction,
    suggestItemsAction,
    saveEstimateAction,
    fetchHistoryAction,
    loadEstimateAction,
    deleteEstimateAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getEstimate, "70b2c43613fd9c55ad336729f9ab21b36445befadb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(normalizeInventoryAction, "40cd010855f5e8ccc19d46ab8b3c76e9d625791c7c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(resolveItemAction, "40dba74bf828995a737e94833644634fb9dd7802f5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(suggestItemsAction, "401d8558eef460ef18bba5ec1a7440887feeffe2d0", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveEstimateAction, "7e88bc1bbe9beb9a3b44b7dcede4cf3f195b45cf67", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(fetchHistoryAction, "009047fe9654c828be38ae390f3e769d9da2b28fc6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(loadEstimateAction, "40a2a3c7a7350b88dcbccdc99138858016913e31d8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteEstimateAction, "4089042fcfa95524a198dab65b9211a1727afade48", null);
}),
"[project]/app/actions/auth.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"0026ba1c07f9105d552e7e5dfeca774e839e5c0d88":"signOutAction"},"",""] */ __turbopack_context__.s([
    "signOutAction",
    ()=>signOutAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function signOutAction() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    await supabase.auth.signOut();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    signOutAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signOutAction, "0026ba1c07f9105d552e7e5dfeca774e839e5c0d88", null);
}),
"[project]/app/actions/extractText.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"40c186eb30d55550dbf5e28d0f66796e2747d36cea":"extractTextFromPDF"},"",""] */ __turbopack_context__.s([
    "extractTextFromPDF",
    ()=>extractTextFromPDF
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$parse$2f$dist$2f$pdf$2d$parse$2f$esm$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/pdf-parse/dist/pdf-parse/esm/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$parse$2f$dist$2f$pdf$2d$parse$2f$esm$2f$PDFParse$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pdf-parse/dist/pdf-parse/esm/PDFParse.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
async function extractTextFromPDF(formData) {
    try {
        const file = formData.get("file");
        if (!file) return "";
        const buffer = Buffer.from(await file.arrayBuffer());
        const parser = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$parse$2f$dist$2f$pdf$2d$parse$2f$esm$2f$PDFParse$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PDFParse"]({
            data: buffer
        });
        const textResult = await parser.getText();
        return textResult.text.split("\n").map((l)=>l.trim()).filter((l)=>l.length > 0 && !/^page \d+/i.test(l)).join("\n");
    } catch (error) {
        console.error("PDF extraction error:", error);
        return "";
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    extractTextFromPDF
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(extractTextFromPDF, "40c186eb30d55550dbf5e28d0f66796e2747d36cea", null);
}),
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/estimate.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/app/actions/extractText.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/estimate.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$extractText$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/extractText.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
}),
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/estimate.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/auth.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE2 => \"[project]/app/actions/extractText.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "0026ba1c07f9105d552e7e5dfeca774e839e5c0d88",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signOutAction"],
    "009047fe9654c828be38ae390f3e769d9da2b28fc6",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["fetchHistoryAction"],
    "401d8558eef460ef18bba5ec1a7440887feeffe2d0",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["suggestItemsAction"],
    "4089042fcfa95524a198dab65b9211a1727afade48",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteEstimateAction"],
    "40a2a3c7a7350b88dcbccdc99138858016913e31d8",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["loadEstimateAction"],
    "40c186eb30d55550dbf5e28d0f66796e2747d36cea",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$extractText$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["extractTextFromPDF"],
    "40cd010855f5e8ccc19d46ab8b3c76e9d625791c7c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeInventoryAction"],
    "40dba74bf828995a737e94833644634fb9dd7802f5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resolveItemAction"],
    "70b2c43613fd9c55ad336729f9ab21b36445befadb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEstimate"],
    "7e88bc1bbe9beb9a3b44b7dcede4cf3f195b45cf67",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveEstimateAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE2__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$extractText$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/estimate.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/app/actions/auth.ts [app-rsc] (ecmascript)", ACTIONS_MODULE2 => "[project]/app/actions/extractText.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/estimate.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$extractText$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/extractText.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_7d037c5a._.js.map