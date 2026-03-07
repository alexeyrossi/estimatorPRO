module.exports = [
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
;
const PROTOCOL = {
    TRUCK_CAPACITY_SAFE: 1580,
    TRUCK_MAX_THEORETICAL: 1650,
    BORDERLINE_TRUCK_THRESHOLD: 0.88,
    STORAGE_HEAVY_TRUCK_FLOOR_RATIO: 0.80,
    STORAGE_HEAVY_TRUCK_MIN_PIECES: 3,
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
    SPEED_ELEVATOR: 205,
    SPEED_STAIRS: 180,
    SPEED_COMMERCIAL: 220,
    COORDINATION_HRS: 0.5,
    CREW_EFFICIENCY_HIGH: 0.90,
    CREW_EFFICIENCY_LOW: 0.85,
    ACCESS_MULT_ELEVATOR: 1.25,
    ACCESS_MULT_STAIRS: 1.40,
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
    MINS_EXTRA_STOP_BASE: 25,
    MINS_EXTRA_STOP_GROUND: 10,
    MINS_EXTRA_STOP_ELEVATOR: 20,
    MINS_EXTRA_STOP_STAIRS: 30,
    EXTRA_STOP_TRUCK_THRESHOLD_REDUCTION_PER_STOP: 0.03,
    EXTRA_STOP_TRUCK_NON_GROUND_BONUS: 0.02,
    EXTRA_STOP_TRUCK_MAX_THRESHOLD_REDUCTION: 0.10,
    EXTRA_STOP_CREW_FLOOR_VOLUME: 900,
    EXTRA_STOP_CREW_COMPLEX_VOLUME: 1400,
    EXTRA_STOP_CREW_COMPLEXITY_HIGH: 6,
    MAX_CREW_SIZE: 8,
    VOL_EST_SMALL: 5,
    VOL_EST_MEDIUM: 20,
    VOL_EST_LARGE: 30
};
const HV_TABLE = [
    {
        label: "1BDR/Less",
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
    "BOX_LIKE_REGEX",
    ()=>BOX_LIKE_REGEX,
    "BULKY_ITEMS",
    ()=>BULKY_ITEMS,
    "DA_COMPLEX",
    ()=>DA_COMPLEX,
    "DA_COMPLEX_REGEX_CACHE",
    ()=>DA_COMPLEX_REGEX_CACHE,
    "DA_KEYS",
    ()=>DA_KEYS,
    "DA_REGEX_CACHE",
    ()=>DA_REGEX_CACHE,
    "DA_SIMPLE",
    ()=>DA_SIMPLE,
    "DA_SIMPLE_REGEX_CACHE",
    ()=>DA_SIMPLE_REGEX_CACHE,
    "DA_TIME_TABLE",
    ()=>DA_TIME_TABLE,
    "EFFORT_MULTIPLIER",
    ()=>EFFORT_MULTIPLIER,
    "FRAGILE_KEYWORDS",
    ()=>FRAGILE_KEYWORDS,
    "FRAGILE_REGEX_CACHE",
    ()=>FRAGILE_REGEX_CACHE,
    "GARAGE_ATTIC_REGEX",
    ()=>GARAGE_ATTIC_REGEX,
    "INVERSIONS",
    ()=>INVERSIONS,
    "IRREGULAR_REGEX_CACHE",
    ()=>IRREGULAR_REGEX_CACHE,
    "IRREGULAR_SIGNALS",
    ()=>IRREGULAR_SIGNALS,
    "KEY_REGEX",
    ()=>KEY_REGEX,
    "LEAGUE_1_ITEMS",
    ()=>LEAGUE_1_ITEMS,
    "LEAGUE_1_REGEX_CACHE",
    ()=>LEAGUE_1_REGEX_CACHE,
    "LEAGUE_2_ITEMS",
    ()=>LEAGUE_2_ITEMS,
    "LEAGUE_2_REGEX_CACHE",
    ()=>LEAGUE_2_REGEX_CACHE,
    "LIFT_GATE_ITEMS",
    ()=>LIFT_GATE_ITEMS,
    "LIFT_GATE_REGEX_CACHE",
    ()=>LIFT_GATE_REGEX_CACHE,
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
    "STRICT_NO_BLANKET_REGEX_CACHE",
    ()=>STRICT_NO_BLANKET_REGEX_CACHE,
    "TRUE_HEAVY_ITEMS",
    ()=>TRUE_HEAVY_ITEMS,
    "TRUE_HEAVY_REGEX_CACHE",
    ()=>TRUE_HEAVY_REGEX_CACHE,
    "VAGUE_REGEX_CACHE",
    ()=>VAGUE_REGEX_CACHE,
    "VAGUE_SIGNALS",
    ()=>VAGUE_SIGNALS,
    "VOLUME_TABLE",
    ()=>VOLUME_TABLE,
    "buildKeyRegex",
    ()=>buildKeyRegex,
    "buildLiteralRegexCache",
    ()=>buildLiteralRegexCache,
    "matchesAnyRegex",
    ()=>matchesAnyRegex,
    "matchesAnyRegexAcross",
    ()=>matchesAnyRegexAcross,
    "reEscape",
    ()=>reEscape
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
;
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
    "sleeper sofa": 50,
    "sofa bed": 80,
    "sofa": 35,
    "couch": 60,
    "loveseat": 30,
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
    "overstuffed chair": 25,
    "bench": 15,
    "storage bench": 20,
    "entry bench": 15,
    "ottoman": 10,
    "bean bag": 10,
    "bar stool": 5,
    "stool": 5,
    "seat": 7,
    "glider settee": 20,
    "room divider": 20,
    "dining table": 30,
    "kitchen table": 20,
    "dining bench": 20,
    "picnic table": 20,
    "utility table": 5,
    "coffee table": 15,
    "coffee table set": 25,
    "end table": 5,
    "side table": 5,
    "console table": 20,
    "kitchen island": 45,
    "tv stand": 20,
    "media console": 25,
    "entertainment center": 40,
    "cabinet": 25,
    "hutch": 35,
    "curio cabinet": 10,
    "glass cabinet": 40,
    "corner cabinet": 20,
    "utility cabinet": 10,
    "china cabinet": 40,
    "buffet": 30,
    "sideboard": 30,
    "credenza": 35,
    "bar cabinet": 25,
    "bar cart": 10,
    "portable bar": 15,
    "server buffet": 15,
    "music cabinet": 15,
    "serving cart": 10,
    "chest": 35,
    "chest of drawers": 35,
    "rug": 10,
    "lamp": 5,
    "artwork": 5,
    "picture": 5,
    "floor lamp": 5,
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
    "waterbed": 20,
    "folding cot": 10,
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
    "small wardrobe": 20,
    "armoire": 40,
    "vanity": 30,
    "vanity stool": 5,
    "makeup table": 25,
    "changing table": 15,
    "shoe rack": 8,
    "drawer unit": 15,
    "plastic drawer unit": 15,
    "hall tree rack": 2,
    "hall tree large": 12,
    "mirror full length": 10,
    "mirror": 8,
    "glass": 5,
    "glass board": 8,
    "whiteboard": 5,
    // --- Kids & Sport ---
    "stroller": 15,
    "double stroller": 25,
    "baby carriage": 10,
    "pram": 15,
    "buggy": 15,
    "footlocker": 8,
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
    "baby crib": 10,
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
    "secretary desk": 35,
    "office desk": 10,
    "small desk": 22,
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
    "big screen tv": 40,
    "combo tv": 25,
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
    "window ac small": 15,
    "window ac large": 20,
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
    "scale": 5,
    "canister": 2,
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
    "bike": 7,
    "bicycle": 7,
    "motorcycle": 50,
    "walker": 5,
    "mobility scooter": 20,
    "bbq": 30,
    "gas grill": 30,
    "barbecue": 30,
    "grill": 30,
    "camping grill": 2,
    "large bbq": 10,
    "smoker": 80,
    "fire pit": 15,
    "patio heater": 15,
    "patio set": 150,
    "outdoor table": 40,
    "outdoor chair": 10,
    "aluminum chair": 1,
    "metal chair": 3,
    "wood chair": 5,
    "patio umbrella": 10,
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
    "riding mower": 35,
    "lawn roller": 15,
    "leaf blower": 5,
    "weed whacker": 5,
    "wheelbarrow": 10,
    "shovel": 2,
    "rake": 2,
    "garden tools bundle": 10,
    "broom": 3,
    "tool chest": 20,
    "small tool chest": 5,
    "medium tool chest": 10,
    "large tool chest": 15,
    "large tool kit": 20,
    "mechanic tools": 20,
    "workbench": 30,
    "storage cabinet": 30,
    "garage cabinet": 30,
    "toolbox": 5,
    "metal rack": 25,
    "garage shelving": 25,
    "rolling toolbox": 20,
    "small tool box": 5,
    "tire": 10,
    "tire with rim": 5,
    "saw": 5,
    "sewing machine": 5,
    "portable sewing machine": 5,
    "sewing machine cabinet": 20,
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
    "plant stand": 2,
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
    "grandfather clock": 30,
    "clock large": 15,
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
    "book box": 1.5,
    "plastic bin": 5,
    "storage bin": 5,
    "trash can": 3,
    "garbage bin": 3,
    "waste basket": 3,
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
    "tv small box": 10,
    "tv large box": 16,
    "picture box": 10,
    "picture mirror box": 16,
    "mattress box": 5,
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
    "acoustic panel": 8,
    "stand": 5,
    "shoe cabinet": 15,
    "pedestal": 5,
    "dumbbell": 2,
    "kettlebell": 2,
    "piano bench": 5,
    "picnic bench": 5,
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
    "walker",
    "scale",
    "canister",
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
        src: /table,\s*utility\b/i,
        dest: "utility table"
    },
    {
        src: /bed,\s*king/i,
        dest: "king bed"
    },
    {
        src: /bed,\s*queen/i,
        dest: "queen bed"
    },
    {
        src: /bed,\s*full/i,
        dest: "full bed"
    },
    {
        src: /bed,\s*double/i,
        dest: "double bed"
    },
    {
        src: /bed,\s*twin/i,
        dest: "twin bed"
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
        src: /lamp,\s*floor(?:\s+(?:large|lrg|lg|medium|med\.?|small|sm\.?))?/i,
        dest: "floor lamp"
    },
    {
        src: /lamp,\s*table(?:\s+(?:large|lrg|lg|medium|med\.?|small|sm\.?))?/i,
        dest: "table lamp"
    },
    {
        src: /chair,\s*office(?:\s*,?\s*\(?\s*(?:large|lrg|lg|medium|med\.?|small|sm\.?)\.?\)?)?/i,
        dest: "office chair"
    },
    {
        src: /chair,\s*rocker/i,
        dest: "armchair"
    },
    {
        src: /chair,\s*arm\b/i,
        dest: "armchair"
    },
    {
        src: /chair,\s*overstuffed\b/i,
        dest: "overstuffed chair"
    },
    {
        src: /chair,\s*occasional\b/i,
        dest: "occasional chair"
    },
    {
        src: /chair,\s*straight\b/i,
        dest: "chair"
    },
    {
        src: /fan,\s*floor/i,
        dest: "floor fan"
    },
    {
        src: /chairs?,\s*aluminum\b/i,
        dest: "aluminum chair"
    },
    {
        src: /chairs?,\s*metal\b/i,
        dest: "metal chair"
    },
    {
        src: /chairs?,\s*wood\b/i,
        dest: "wood chair"
    },
    {
        src: /dresser,\s*(?:double|single)\b/i,
        dest: "dresser"
    },
    {
        src: /dresser,\s*triple/i,
        dest: "triple dresser"
    },
    {
        src: /dresser,\s*mirror\b/i,
        dest: "dresser"
    },
    {
        src: /armoire,\s*jewelry\b/i,
        dest: "armoire"
    },
    {
        src: /cabinet,\s*curio\b/i,
        dest: "curio cabinet"
    },
    {
        src: /cabinet,\s*corner\b/i,
        dest: "corner cabinet"
    },
    {
        src: /clock,\s*grandfather\b/i,
        dest: "grandfather clock"
    },
    {
        src: /desk,\s*secretary\b/i,
        dest: "secretary desk"
    },
    {
        src: /desk,\s*office\b/i,
        dest: "office desk"
    },
    {
        src: /desk,\s*(?:sm|small)\s*\/?\s*winthrop\b/i,
        dest: "small desk"
    },
    {
        src: /sofa,\s*loveseat\b/i,
        dest: "loveseat"
    },
    {
        src: /sofa,\s*[23]\s*cush(?:ion)?s?\.?\b/i,
        dest: "sofa"
    },
    {
        src: /sofa,\s*hide(?:\s*,\s*\d+\s*cush(?:ion)?s?\.?\b)?/i,
        dest: "sleeper sofa"
    },
    {
        src: /sofa,\s*sec\b/i,
        dest: "sectional sofa"
    },
    {
        src: /tv,\s*big\s*screen\b/i,
        dest: "big screen tv"
    },
    {
        src: /tv,\s*combination\b/i,
        dest: "combo tv"
    },
    {
        src: /crib,\s*baby\b/i,
        dest: "baby crib"
    },
    {
        src: /bench,\s*piano\b/i,
        dest: "piano bench"
    },
    {
        src: /bar,\s*portable\b/i,
        dest: "portable bar"
    },
    {
        src: /server,\s*buffet\b/i,
        dest: "server buffet"
    },
    {
        src: /server,\s*cabinet\b/i,
        dest: "server buffet"
    },
    {
        src: /cart,\s*serving\b/i,
        dest: "serving cart"
    },
    {
        src: /cot,\s*folding\b/i,
        dest: "folding cot"
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
        src: /sewing\s*mach(?:ine)?\.?,?\s*port\b/i,
        dest: "portable sewing machine"
    },
    {
        src: /sewing\s*mach(?:ine)?\.?,?\s*(?:w\s*\/?\s*cabinet|console)\b/i,
        dest: "sewing machine cabinet"
    },
    {
        src: /box,\s*(?:china|dish)(?:\s*\/\s*|\s+)?(?:china|dish)?/i,
        dest: "dish barrel"
    },
    {
        src: /box,\s*linen(?:\s*\/\s*|\s+)(?:medium|med\.?)/i,
        dest: "medium box"
    },
    {
        src: /box,\s*linen(?:\s*\/\s*|\s+)(?:small|sm(?:all)?\.?)/i,
        dest: "small box"
    },
    {
        src: /box,\s*(?:picture|art)(?:\s+(?:large|lrg|lg|medium|med\.?|small|sm\.?))?/i,
        dest: "picture box"
    },
    {
        src: /box,\s*tv\b/i,
        dest: "tv box"
    },
    {
        src: /box,\s*lg/i,
        dest: "large box"
    },
    {
        src: /box,\s*large/i,
        dest: "large box"
    },
    {
        src: /box,\s*med/i,
        dest: "medium box"
    },
    {
        src: /box,\s*medium/i,
        dest: "medium box"
    },
    {
        src: /box,\s*sm(?:all)?/i,
        dest: "small box"
    },
    {
        src: /plastic\s*bin,\s*(?:medium|med\.?|small|sm(?:all)?\.?)(?:\s+\d+\s*-\s*\d+\s*gallons?)?/i,
        dest: "plastic bin"
    },
    {
        src: /plastic\s*bin,\s*lg/i,
        dest: "large plastic bin"
    },
    {
        src: /plastic\s*bin,\s*large/i,
        dest: "large plastic bin"
    },
    {
        src: /(?:bbq\s*grill|barbecue),\s*camping\b/i,
        dest: "camping grill"
    },
    {
        src: /(?:bbq\s*grill|barbecue),\s*large\b/i,
        dest: "large bbq"
    },
    {
        src: /tool\s*chest,\s*small\b/i,
        dest: "small tool chest"
    },
    {
        src: /tool\s*chest,\s*medium\b/i,
        dest: "medium tool chest"
    },
    {
        src: /tool\s*chest,\s*large\b/i,
        dest: "large tool chest"
    },
    {
        src: /wardrobe,\s*small\b/i,
        dest: "small wardrobe"
    },
    {
        src: /ladder,\s*\d+\s*['′]?\s*step\b/i,
        dest: "step ladder"
    },
    {
        src: /ladder,\s*(?:ext|extension)\.?\s*metal\b/i,
        dest: "extension ladder"
    },
    {
        src: /lawn\s*mower,\s*riding\b/i,
        dest: "riding mower"
    },
    {
        src: /roller,\s*lawn\b/i,
        dest: "lawn roller"
    },
    {
        src: /(?:sm|small)\s*,\s*safe\b/i,
        dest: "small safe"
    },
    {
        src: /(?:lg|large)\s*,\s*safe\b/i,
        dest: "large safe"
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
        re: /\btv\s*bx\b/i,
        to: "tv box"
    },
    {
        re: /\blamp\s*,\s*flr\b/i,
        to: "floor lamp"
    },
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
        re: /\b(wardrob)\b/i,
        to: "wardrobe"
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
        re: /\b(bxs)\b/i,
        to: "medium box"
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
    {
        re: /\bdish\s*pack\b/i,
        to: "dish barrel"
    },
    {
        re: /\bbook\s*box\b/i,
        to: "book box"
    },
    {
        re: /\bmattress\s*box\b/i,
        to: "mattress box"
    },
    {
        re: /\btv\s*large\s*box\b/i,
        to: "tv large box"
    },
    {
        re: /\btv\s*small\s*box\b/i,
        to: "tv small box"
    },
    {
        re: /\bpicture\s*\/?\s*mirror\s*box\b/i,
        to: "picture mirror box"
    },
    {
        re: /\bwork\s*bench\b/i,
        to: "workbench"
    },
    {
        re: /\bmusic\s*cabinet\b/i,
        to: "music cabinet"
    },
    {
        re: /\b(server\s*buffet|buffet\s*server|dining\s*server|server\s*cabinet)\b/i,
        to: "server buffet"
    },
    {
        re: /\b(serving\s*cart|serving\s*trolley|tea\s*cart)\b/i,
        to: "serving cart"
    },
    {
        re: /\bfoot\s*lock(?:er)?\b/i,
        to: "footlocker"
    },
    {
        re: /\bfolding\s*cot\b/i,
        to: "folding cot"
    },
    {
        re: /\bair\s*cond\.?\s*\/?\s*wind\.?\s*small\b/i,
        to: "window ac small"
    },
    {
        re: /\bair\s*cond\.?\s*\/?\s*wind\.?\s*sm\.?\b/i,
        to: "window ac small"
    },
    {
        re: /\bair\s*cond\.?\s*\/?\s*wind\.?\s*large\b/i,
        to: "window ac large"
    },
    {
        re: /\bair\s*cond\.?\s*\/?\s*wind\.?\s*lg\.?\b/i,
        to: "window ac large"
    },
    {
        re: /\bhall\s*tree\s*rack\b/i,
        to: "hall tree rack"
    },
    {
        re: /\bhall\s*tree\s*large\b/i,
        to: "hall tree large"
    },
    {
        re: /\bglider\s*or\s*settee\b/i,
        to: "glider settee"
    },
    {
        re: /\btire\s*w\s*\/?\s*rim\b/i,
        to: "tire with rim"
    },
    {
        re: /\bpicnic\s*bench\b/i,
        to: "picnic bench"
    },
    {
        re: /\bpicnic\s*table\b/i,
        to: "picnic table"
    },
    {
        re: /\bkitchen\s*chairs?\b/i,
        to: "dining chair"
    },
    {
        re: /\bsewing\s*mach\.?\b/i,
        to: "sewing machine"
    },
    {
        re: /\bwastepaper\s*basket\b/i,
        to: "trash can"
    },
    {
        re: /\bfan\s*\/?\s*plant\s*stands?\b/i,
        to: "plant stand"
    },
    {
        re: /\bwaterbed\b/i,
        to: "waterbed"
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
        re: /\bshoe\s*cabinet\b/i,
        to: "shoe cabinet"
    },
    {
        re: /\bbaby\s*crib\b/i,
        to: "baby crib"
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
        re: /\bwall\s*decor\b/i,
        to: "artwork"
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
        re: /\bvacuum\s*cleaner\b/i,
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
        re: /\bkeyboard\s*boxes?\b/i,
        to: "large box"
    },
    {
        re: /\bkeyboard\s*stands?\b/i,
        to: "stand"
    },
    {
        re: /\bclosets?\b(?!\s*contents)/i,
        to: "wardrobe box"
    },
    {
        re: /\bdrawers?\b(?!\s*contents)/i,
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
        re: /\b(baskets?|small\s*objects?|clothes?|odds|ends)\b/i,
        to: "medium box"
    },
    {
        re: /\bshoes?\b(?!\s*cabinet)/i,
        to: "medium box"
    },
    {
        re: /\b(documents?)\b/i,
        to: "small box"
    },
    {
        re: /\bkeyboards?\b(?!\s*(?:stands?|boxes?)\b)/i,
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
        re: /\b(mic\s*stand|speaker\s*stand)\b/i,
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
function buildLiteralRegexCache(labels) {
    return labels.map((label)=>new RegExp(`\\b${reEscape(label)}\\b`, "i"));
}
function matchesAnyRegex(cache, text) {
    return cache.some((re)=>re.test(text));
}
function matchesAnyRegexAcross(cache, ...texts) {
    return texts.some((text)=>matchesAnyRegex(cache, text));
}
const BOX_LIKE_REGEX = /\b(box|bin|tote)s?\b/i;
const GARAGE_ATTIC_REGEX = /\bgarage\b|\bpatio\b|\bchristmas\b|\battic\b|\bshed\b/i;
const TRUE_HEAVY_REGEX_CACHE = buildLiteralRegexCache(TRUE_HEAVY_ITEMS);
const LIFT_GATE_REGEX_CACHE = buildLiteralRegexCache(LIFT_GATE_ITEMS);
const LEAGUE_1_REGEX_CACHE = buildLiteralRegexCache(LEAGUE_1_ITEMS);
const LEAGUE_2_REGEX_CACHE = buildLiteralRegexCache(LEAGUE_2_ITEMS);
const IRREGULAR_REGEX_CACHE = buildLiteralRegexCache(IRREGULAR_SIGNALS);
const VAGUE_REGEX_CACHE = buildLiteralRegexCache(VAGUE_SIGNALS);
const DA_COMPLEX_REGEX_CACHE = buildLiteralRegexCache(DA_COMPLEX);
const DA_SIMPLE_REGEX_CACHE = buildLiteralRegexCache(DA_SIMPLE);
const STRICT_NO_BLANKET_REGEX_CACHE = buildLiteralRegexCache(STRICT_NO_BLANKET_ITEMS);
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dictionaries.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-rsc] (ecmascript)");
;
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
    let m = s.match(/\(\s*(?:qty|count|pcs|#|x)?\s*(\d+)\s*x?\s*\)\s*$/i);
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
function getSyntheticBundleItems(rawTok) {
    const s = (rawTok || "").toLowerCase().replace(/\s+/g, " ").trim();
    if (!s) return null;
    if (/\bsmall\s*patio\s*set\b/.test(s)) return [
        {
            name: "outdoor table",
            qty: 1
        },
        {
            name: "outdoor chair",
            qty: 2
        }
    ];
    if (/\bfull\s*cabinet\s*pack\b/.test(s)) return [
        {
            name: "medium box",
            qty: 12
        }
    ];
    if (/\bcabinet\s*pack\b/.test(s)) return [
        {
            name: "medium box",
            qty: 8
        }
    ];
    if (/\bpacked\s*smalls?\b/.test(s)) return [
        {
            name: "medium box",
            qty: 6
        }
    ];
    if (/\blots?\s+of\b.*\b(?:packed\s+)?boxes?\b.*\bmisc\s*storage\b/.test(s)) return [
        {
            name: "medium box",
            qty: 12
        }
    ];
    if (/\bdocument\s*boxes?\s*books?\b/.test(s)) return [
        {
            name: "book box",
            qty: 8
        }
    ];
    if (/\bbooks?\s+shelves?\b/.test(s)) return [
        {
            name: "bookcase",
            qty: 1
        },
        {
            name: "book box",
            qty: 5
        }
    ];
    if (/\blinen\s*closet\s*contents\b/.test(s)) return [
        {
            name: "medium box",
            qty: 4
        }
    ];
    if (/\bcloset\s*contents\b/.test(s)) return [
        {
            name: "wardrobe box",
            qty: 3
        }
    ];
    if (/\bcabinet\s*(?:\/|\s+)?drawer\s*contents\b/.test(s) || /\bdrawer\s*contents\b/.test(s)) return [
        {
            name: "medium box",
            qty: 3
        }
    ];
    if (/\bcabinet\s*contents\b/.test(s)) return [
        {
            name: "medium box",
            qty: 4
        }
    ];
    if (/\bshelves?\s*contents\b/.test(s)) return [
        {
            name: "medium box",
            qty: 3
        }
    ];
    if (/\bcleaning\s*supplies\b/.test(s)) return [
        {
            name: "medium box",
            qty: 2
        }
    ];
    return null;
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
    s = s.replace(/\b(pre-removed|removed|empty|frame stays|PBO|CP|KD|TBD)\b/gi, "");
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
        const isHeavy = it.isWeightHeavy || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegexAcross"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TRUE_HEAVY_REGEX_CACHE"], nameLower, rawLower);
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
            rawExamples: r.raw ? [
                r.raw
            ] : [],
            room: r.room || "",
            sourceCount: 1,
            isSynthetic: false,
            isWeightHeavy: !!r.flags?.heavyWeight,
            isManualHeavy: !!r.flags?.heavy,
            wLbs: null,
            flags: r.flags
        }));
    const totalVol = (detectedItems || []).reduce((a, it)=>a + (it.cf || 0), 0);
    const detectedQtyTotal = (detectedItems || []).reduce((a, it)=>a + (it.qty || 0), 0);
    const boxCount = detectedItems.reduce((a, it)=>{
        const n = (it.name || "").toLowerCase();
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BOX_LIKE_REGEX"].test(n) ? a + it.qty : a;
    }, 0);
    const heavyCount = validRows.reduce((a, r)=>a + (r.flags?.heavy ? clampInt(r.qty, 1, 500) : 0), 0);
    let daComplexQty = 0, daSimpleQty = 0;
    detectedItems.forEach((it)=>{
        const n = (it.name || "").toLowerCase();
        // SAFE Bed Unit Check
        const isBedUnit = n.includes("bed") && !n.includes("frame") && !n.includes("mattress") && !n.includes("boxspring") && !n.includes("slat");
        if (isBedUnit) daComplexQty += it.qty;
        else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_COMPLEX_REGEX_CACHE"], n)) daComplexQty += it.qty;
        else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_SIMPLE_REGEX_CACHE"], n)) daSimpleQty += it.qty;
    });
    let furnitureCount = 0, noBlanketVol = 0;
    detectedItems.forEach((it)=>{
        const n = (it.name || "").toLowerCase();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["STRICT_NO_BLANKET_REGEX_CACHE"], n)) noBlanketVol += it.cf;
        else furnitureCount += it.qty;
    });
    const irregularCount = detectedItems.reduce((a, it)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IRREGULAR_REGEX_CACHE"], (it.name || "").toLowerCase()) ? a + it.qty : a, 0);
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
        hasVague: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VAGUE_REGEX_CACHE"], rawLower),
        mentionsGarageOrAttic: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GARAGE_ATTIC_REGEX"].test(rawLower)
    };
}
function parseInventory(text) {
    const rawNormalized = normalizeTextNumbers(text);
    const ROOM_ALIAS_REGEX_BASE = "main house|living|dining|kitchen|master|bedroom|bath|garage|patio|study|office|basement|attic|nursery|guest|closet|laundry|den|foyer|hallway|mudroom|sunroom|bonus|master bedroom|master bdr|mbr|primary bedroom|primary bed|main bedroom|owner suite|home office|library|man cave|gym|home gym|fitness room|workout room|deck|backyard|storage|storage unit|shed|playroom|kids room|open office|conference|cafeteria|executive|equipment|reception|break room|server room|warehouse|breakfast nook|exterior|back house|music studio|studio|tv room|storage room";
    const inlineRoomBreak = new RegExp(`\\.\\s+(?=(?:${ROOM_ALIAS_REGEX_BASE})(?:\\s+room|\\s+area|\\s+rooms|\\s+offices)?\\s*:)`, "gi");
    const rawLines = rawNormalized.replace(/\r/g, "").replace(inlineRoomBreak, ".\n").split("\n").filter((l)=>l?.trim()?.length > 0);
    let totalVol = 0, boxCount = 0, heavyCount = 0, detectedQtyTotal = 0, noBlanketVol = 0;
    let daComplexQty = 0, daSimpleQty = 0, furnitureCount = 0;
    let irregularCount = 0, estimatedItemCount = 0;
    const detectedItems = [];
    const unrecognized = [];
    const tokens = [];
    let currentRoom = "";
    const EXACT_ROOM_HEADERS = new Map([
        [
            "front door",
            "Front Entry/Porch"
        ],
        [
            "front porch",
            "Front Entry/Porch"
        ],
        [
            "front door / front porch",
            "Front Entry/Porch"
        ],
        [
            "boxes and bins",
            "Boxes/Bins"
        ],
        [
            "boxes & bins",
            "Boxes/Bins"
        ],
        [
            "storage closet",
            "Storage/Outdoor"
        ],
        [
            "bathroom",
            "Bathroom"
        ]
    ]);
    const getExactRoomHeader = (line)=>{
        const key = (line || "").toLowerCase().replace(/:$/, "").replace(/\s*&\s*/g, " and ").replace(/\s*\/\s*/g, " / ").replace(/\s+/g, " ").trim();
        return EXACT_ROOM_HEADERS.get(key) || null;
    };
    for (const line of rawLines){
        if (!/[a-zA-Z]/.test(line)) {
            continue;
        }
        const processedLine = preProcessLine(line);
        let clean = processedLine.trim().replace(/^[-*•>:]+\s*/, "");
        const isProtectedItem = /^(room divider|roomba|dining table|office chair|kitchen island|patio heater)\b/i.test(clean);
        const ROOM_ONLY = new RegExp(`^(${ROOM_ALIAS_REGEX_BASE})(\\s+room|\\s+area|\\s+rooms|\\s+offices|\\s+area)?(\\s*\/[\\w\\s\\-&]+)?\\s*:?$`, "i");
        const ROOM_PREFIX = new RegExp(`^(${ROOM_ALIAS_REGEX_BASE})\\b`, "i");
        // Generic section header: any text-only line ending in ':' with no digits (e.g. "Open Office Area:", "Cafeteria:")
        const GENERIC_SECTION_HEADER = /^[a-zA-Z][a-zA-Z\s\/\-]+:$/.test(clean.trim()) && !/\d/.test(clean);
        const normalizeRoomData = (room)=>{
            const lower = room.toLowerCase();
            if (/^(master bedroom|master bdr|mbr|primary bedroom|primary bed|main bedroom|owner suite|master)$/.test(lower)) return "Master Bedroom";
            if (/^(home office|study|den|library|man cave|office|executive offices?|executive)$/.test(lower)) return "Office";
            if (/^(gym|home gym|fitness room|workout room)$/.test(lower)) return "Gym";
            if (/^(studio|music studio|back house|back house music studio)$/.test(lower)) return "Studio";
            if (/^(garage|patio|deck|backyard|storage unit|attic|shed|storage)$/.test(lower)) return "Storage/Outdoor";
            if (/^(playroom|nursery|kids room)$/.test(lower)) return "Kids/Family";
            if (/^(open office|open office area)$/.test(lower)) return "Open Office";
            if (/^(conference rooms?|conference)$/.test(lower)) return "Conference Room";
            if (/^(cafeteria)$/.test(lower)) return "Cafeteria";
            if (/^(equipment|server room|reception|break room|warehouse)$/.test(lower)) return lower.charAt(0).toUpperCase() + lower.slice(1);
            return room.charAt(0).toUpperCase() + room.slice(1);
        };
        const exactRoomHeader = getExactRoomHeader(clean);
        if (!isProtectedItem && exactRoomHeader) {
            currentRoom = exactRoomHeader;
            clean = "";
        } else if (!isProtectedItem) {
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
        if (!clean?.trim()) continue;
        clean = clean.replace(/\s+(w\/|with|plus|\+|and|&)\s+/gi, " & ");
        const lineTokens = clean.split(/[,;•+]+|\s+[\/—–]+\s+|&/gi).map((x)=>x?.trim()).filter(Boolean);
        lineTokens.forEach((tok)=>tokens.push({
                text: tok,
                room: currentRoom
            }));
    }
    const registerMatchedItem = (name, qty, raw, room, wLbs, isWeightHeavy, isSynthetic = false)=>{
        const cf = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VOLUME_TABLE"][name] * qty;
        totalVol += cf;
        detectedQtyTotal += qty;
        detectedItems.push({
            name,
            qty,
            cf,
            raw,
            rawExamples: [
                raw
            ],
            room,
            sourceCount: 1,
            isSynthetic,
            wLbs,
            isWeightHeavy,
            isManualHeavy: false,
            flags: {
                heavy: isWeightHeavy,
                heavyWeight: isWeightHeavy
            }
        });
        if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BOX_LIKE_REGEX"].test(name)) boxCount += qty;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LIFT_GATE_REGEX_CACHE"], name) || isWeightHeavy) heavyCount += qty;
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["IRREGULAR_REGEX_CACHE"], name)) irregularCount += qty;
        const isBedUnit = name.includes("bed") && !name.includes("frame") && !name.includes("mattress") && !name.includes("boxspring") && !name.includes("slat");
        if (isBedUnit) daComplexQty += qty;
        else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_COMPLEX_REGEX_CACHE"], name)) daComplexQty += qty;
        else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_SIMPLE_REGEX_CACHE"], name)) daSimpleQty += qty;
        if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["STRICT_NO_BLANKET_REGEX_CACHE"], name)) furnitureCount += qty;
        else noBlanketVol += cf;
    };
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
        const wLbs = extractWeightLbs(rawTok);
        const isWeightHeavy = !!(wLbs && wLbs >= 300);
        const syntheticBundleItems = getSyntheticBundleItems(rawTok);
        if (syntheticBundleItems) {
            syntheticBundleItems.forEach((item)=>registerMatchedItem(item.name, item.qty, rawTok, room, wLbs, isWeightHeavy, true));
            return;
        }
        t = t.replace(/\b(boxed|packed)\b/gi, " ").replace(/\s+/g, " ").trim();
        const aliasFromRaw = applyAliasesRegex(rawTok.toLowerCase());
        if (aliasFromRaw !== rawTok.toLowerCase() && aliasFromRaw !== t) t = aliasFromRaw;
        const tClean = t.replace(/^\s*x\s*\d+\s*/i, "").replace(/^\s*\d+\s*x\s*/i, "").replace(/\s*x\s*\d+\s*$/i, "").replace(/\s*\(\s*\d+\s*\)\s*$/i, "").trim();
        let cleanName = tClean.replace(new RegExp(`^\\d+\\s*[-–—]?\\s*\\d*\\s*`, "i"), "").replace(new RegExp(`[:\\s]+${qty}\\s*$`, "i"), "").replace(/\b(qty|count|pcs|items|ea|est|approx)\b/gi, "").replace(/\s+/g, " ").trim();
        cleanName = applyAliasesRegex(cleanName);
        const findMatchedKey = (candidate)=>{
            for (const key of __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["SORTED_KEYS"]){
                if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["KEY_REGEX"][key].test(candidate)) return key;
            }
            return null;
        };
        const rescuedName = cleanName.replace(/\$\s*\d+(?:\.\d+)?/g, " ").replace(/\b\d+\s*-\s*\d+\s*gallons?\b/gi, " ").replace(/\b(?:bulk fee|fee|pkg|package|pbo|cp|reg|regular|std|standard)\b/gi, " ").replace(/\s+/g, " ").trim();
        const matchedKey = findMatchedKey(cleanName) || (rescuedName !== cleanName ? findMatchedKey(rescuedName) : null);
        let matchedAny = false;
        if (matchedKey) {
            matchedAny = true;
            registerMatchedItem(matchedKey, qty, rawTok, room, wLbs, isWeightHeavy);
        }
        if (!matchedAny) {
            const fallbackName = rescuedName || cleanName;
            if (/^(?:front door|front porch|boxes and bins|boxes & bins|storage closet|bathroom|queen|king|full|double|single|twin|jewelry|small|medium|large|sm|med|lg|lrg|reg|std|floor(?:\s+lrg)?)$/i.test(fallbackName)) return;
            let estVol = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].VOL_EST_MEDIUM;
            const lowerName = fallbackName.toLowerCase();
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
                name: `${fallbackName} (est)`,
                qty,
                cf: estVol,
                raw: rawTok,
                rawExamples: [
                    rawTok
                ],
                room,
                sourceCount: 1,
                isSynthetic: false,
                wLbs,
                isWeightHeavy: !!isWeightHeavy,
                isManualHeavy: false,
                flags: {
                    heavy: !!isWeightHeavy,
                    heavyWeight: !!isWeightHeavy
                }
            });
            if (fallbackName?.length > 2 && !/^(item|qty|pcs|total|set|of)$/i.test(fallbackName)) unrecognized.push(fallbackName);
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
            existing.sourceCount = (existing.sourceCount || 1) + (item.sourceCount || 1);
            existing.isSynthetic = !!(existing.isSynthetic || item.isSynthetic);
            const mergedExamples = [
                ...existing.rawExamples || [
                    existing.raw
                ],
                ...item.rawExamples || [
                    item.raw
                ]
            ];
            existing.rawExamples = Array.from(new Set(mergedExamples.filter(Boolean))).slice(0, 4);
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
        hasVague: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["VAGUE_REGEX_CACHE"], rawLower),
        mentionsGarageOrAttic: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["GARAGE_ATTIC_REGEX"].test(rawLower)
    };
}
}),
"[project]/lib/engine/context.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildEngineContext",
    ()=>buildEngineContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dictionaries.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/parser.ts [app-rsc] (ecmascript)");
;
;
;
const OFFICE_LIGHT_ITEM_REGEX = /\b(desk|office chair|conference chair|file cabinet|printer|copier|monitor|computer monitor|conference table|whiteboard|glass board|cubicle|bookshelf)\b/i;
const OFFICE_LIGHT_BLOCKER_REGEX = /\b(server rack|pallet|skid|exam table|medical|clinic|warehouse|gurney|patient|treatment)\b/i;
const MEDICAL_SIGNAL_REGEX = /\b(exam|medical|clinic|patient|treatment|waiting room|gurney|lab)\b/i;
const WAREHOUSE_SIGNAL_REGEX = /\b(warehouse|pallet|skid|rack|shelving|bin|tool|crate)\b/i;
const CONFERENCE_TABLE_ONLY_REGEX = /\bconference table\b/i;
function buildEngineContext(inputs, normalizedRows, overrides, notes) {
    const isCommercial = inputs.homeSize === "Commercial";
    const isLaborOnly = inputs.moveType === "Labor";
    const isLD = inputs.moveType === "LD";
    const bedroomCount = isCommercial ? 0 : parseInt(inputs.homeSize, 10) || 0;
    const scopeLabel = isCommercial ? "Commercial" : bedroomCount === 1 ? "1 BDR / Less" : `${bedroomCount} BDR`;
    const extraStops = !isLaborOnly && Array.isArray(inputs.extraStops) ? inputs.extraStops : [];
    const extraStopCount = extraStops.length;
    const useNormalized = inputs.inventoryMode === "normalized" && (normalizedRows && normalizedRows.length > 0 || Array.isArray(inputs.normalizedRows) && inputs.normalizedRows.length > 0);
    const parsed = useNormalized ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["summarizeNormalizedRows"])(normalizedRows || inputs.normalizedRows || [], inputs.inventoryText) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseInventory"])(inputs.inventoryText);
    if (!useNormalized) {
        parsed.detectedItems = parsed.detectedItems.map((item)=>{
            const nameLower = item.name.toLowerCase();
            const isTrueHeavy = item.isWeightHeavy || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TRUE_HEAVY_REGEX_CACHE"], nameLower);
            let finalHeavy = isTrueHeavy;
            if (normalizedRows && normalizedRows.length > 0) {
                const existingRow = normalizedRows.find((row)=>row.name.toLowerCase() === nameLower && (row.room || "").toLowerCase() === (item.room || "").toLowerCase());
                if (existingRow?.flags) {
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
    const commercialText = inputs.inventoryText.toLowerCase();
    const officeSignalQty = items.reduce((sum, item)=>OFFICE_LIGHT_ITEM_REGEX.test((item.name || "").toLowerCase()) ? sum + item.qty : sum, 0);
    const medicalSignalQty = items.reduce((sum, item)=>MEDICAL_SIGNAL_REGEX.test(`${item.name || ""} ${item.raw || ""}`.toLowerCase()) ? sum + item.qty : sum, 0);
    const warehouseSignalQty = items.reduce((sum, item)=>WAREHOUSE_SIGNAL_REGEX.test(`${item.name || ""} ${item.raw || ""}`.toLowerCase()) ? sum + item.qty : sum, 0);
    const hasOfficeBlocker = OFFICE_LIGHT_BLOCKER_REGEX.test(commercialText) || items.some((item)=>OFFICE_LIGHT_BLOCKER_REGEX.test(`${item.name || ""} ${item.raw || ""}`.toLowerCase()));
    const commercialSubtype = !isCommercial ? "generic" : MEDICAL_SIGNAL_REGEX.test(commercialText) || medicalSignalQty >= 3 ? "medical" : /\bwarehouse\b/i.test(commercialText) || /\bpallet\b|\bskid\b/i.test(commercialText) || warehouseSignalQty >= 3 ? "warehouse" : !hasOfficeBlocker && officeSignalQty >= Math.max(12, Math.ceil(parsed.detectedQtyTotal * 0.45)) ? "office_light" : "generic";
    const countBy = (re)=>items.reduce((sum, item)=>re.test((item.name || "").toLowerCase()) ? sum + item.qty : sum, 0);
    const hasHeavyByWeight = items.some((item)=>item.isWeightHeavy);
    const manualHeavy = items.some((item)=>item.flags?.heavy);
    const rawHasHeavy = useNormalized ? manualHeavy : items.some((item)=>{
        const nameLower = (item.name || "").toLowerCase();
        const rawLower = (item.raw || "").toLowerCase();
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegexAcross"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TRUE_HEAVY_REGEX_CACHE"], nameLower, rawLower);
    });
    const conferenceTableQty = items.reduce((sum, item)=>CONFERENCE_TABLE_ONLY_REGEX.test((item.name || "").toLowerCase()) ? sum + item.qty : sum, 0);
    const otherTrueHeavyQty = items.reduce((sum, item)=>{
        const nameLower = (item.name || "").toLowerCase();
        const rawLower = (item.raw || "").toLowerCase();
        if (CONFERENCE_TABLE_ONLY_REGEX.test(nameLower)) return sum;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegexAcross"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TRUE_HEAVY_REGEX_CACHE"], nameLower, rawLower) ? sum + item.qty : sum;
    }, 0);
    const suppressConferenceTableHeavy = commercialSubtype === "office_light" && conferenceTableQty > 0 && otherTrueHeavyQty === 0 && !(useNormalized && manualHeavy) && !hasHeavyByWeight;
    const hasHeavy = suppressConferenceTableHeavy ? false : rawHasHeavy;
    const effectiveHeavyCount = suppressConferenceTableHeavy ? Math.max(0, parsed.heavyCount - conferenceTableQty) : parsed.heavyCount;
    const anyHeavySignal = effectiveHeavyCount > 0 || hasHeavy || useNormalized && manualHeavy || hasHeavyByWeight;
    const extraStopMinutesTotal = extraStops.reduce((sum, stop)=>{
        const accessMinutes = stop.access === "stairs" ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MINS_EXTRA_STOP_STAIRS : stop.access === "elevator" ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MINS_EXTRA_STOP_ELEVATOR : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MINS_EXTRA_STOP_GROUND;
        return sum + __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MINS_EXTRA_STOP_BASE + accessMinutes;
    }, 0);
    const extraStopHours = extraStopMinutesTotal / 60;
    const hasNonGroundExtraStop = extraStops.some((stop)=>stop.access !== "ground");
    const extraStopComplexityScore = extraStops.reduce((sum, stop)=>sum + (stop.access === "stairs" ? 3 : stop.access === "elevator" ? 2 : 1), 0);
    notes.logs.push(`Config: ${inputs.moveType}, ${scopeLabel}`);
    notes.logs.push(`Inventory: ${parsed.detectedQtyTotal} items. Vol: ${parsed.totalVol} cf.`);
    if (extraStopCount > 0) {
        notes.logs.push(`Route: ${extraStopCount} extra stop${extraStopCount > 1 ? "s" : ""}. +${extraStopMinutesTotal} min route complexity.`);
    }
    let fragileCount = 0;
    parsed.detectedItems.forEach((item)=>{
        const itemName = item.name.toLowerCase();
        if (/\btv\b/.test(itemName) && /\btv stand\b|\bmedia console\b|\bentertainment center\b/.test(itemName)) return;
        if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["FRAGILE_REGEX_CACHE"].some((re)=>re.test(itemName))) fragileCount += item.qty;
    });
    const fragileDensity = parsed.detectedQtyTotal > 0 ? fragileCount / parsed.detectedQtyTotal : 0;
    const estimatedRatio = (parsed.estimatedItemCount || 0) / Math.max(1, parsed.detectedQtyTotal);
    const hasGenericCatchall = items.some((item)=>/\bitem\b/i.test(item.name || ""));
    const sizeUnits = isCommercial ? 4 : Math.max(1, bedroomCount);
    const itemDensity = parsed.detectedQtyTotal / Math.max(1, sizeUnits);
    const expectedBoxesBase = isCommercial ? 20 : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MIN_BOXES[Math.min(bedroomCount, 5)] || 10;
    const boxCoverage = parsed.boxCount / Math.max(1, expectedBoxesBase);
    const smallItemSignals = countBy(/\blamp|nightstand|end table|coffee table|shelf|bin|box|chair|stool|mirror|wall decor|vacuum|bag\b/i);
    const storageFurnitureQty = countBy(/\bdresser(?:es)?|chest(?:s)?|cabinet(?:s)?|armoire(?:s)?|wardrobe(?:s)?|credenza(?:s)?|buffet(?:s)?|file cabinet(?:s)?\b/i);
    const largeHome = !isCommercial && bedroomCount >= 4;
    const largeInventoryForLD = parsed.detectedQtyTotal >= (largeHome ? 45 : 40) || parsed.totalVol >= (bedroomCount >= 4 ? 900 : 700);
    const ldFullPackLargeHome = isLD && inputs.packingLevel === "Full" && bedroomCount >= 4 && largeInventoryForLD;
    const syntheticBundleItems = items.filter((item)=>item.isSynthetic);
    const syntheticBundleVolume = syntheticBundleItems.reduce((sum, item)=>sum + (item.cf || 0), 0);
    const syntheticBundleRatio = parsed.totalVol > 0 ? syntheticBundleVolume / parsed.totalVol : 0;
    const syntheticBundleGroups = syntheticBundleItems.length;
    const syntheticBundleBoxQty = syntheticBundleItems.reduce((sum, item)=>/\b(box|barrel|carton|bin|tote)\b/i.test(item.name || "") ? sum + item.qty : sum, 0);
    const estateHeavyPieceQty = countBy(/\bpiano|safe|pool table|server rack|commercial fridge|marble table|stone table\b/i);
    const storageHeavyTruckPieceQty = countBy(/\b(?:piano|safe|gun safe|large safe|pool table|server rack|hot tub|jacuzzi|treadmill|elliptical|multi gym|squat rack|tool chest|rolling toolbox|marble table|stone table)\b/i);
    const ldFullPackComplexityScore = ldFullPackLargeHome ? (bedroomCount >= 5 ? 1 : 0) + (parsed.detectedQtyTotal >= 80 ? 1 : 0) + (storageFurnitureQty >= 8 ? 1 : 0) + (syntheticBundleGroups >= 4 ? 1 : 0) + (syntheticBundleBoxQty >= 20 ? 1 : 0) + (estateHeavyPieceQty >= 2 ? 1 : 0) : 0;
    const storageContentsHandled = /\b(empty cabinets?|empty drawers?|drawers empty|cabinet contents packed|dresser contents packed|contents already packed|contents packed|packed separately)\b/i.test(inputs.inventoryText || "");
    const highConfidenceDetailedInventory = estimatedRatio <= 0.02 && !parsed.hasVague && parsed.detectedQtyTotal >= (largeHome ? 50 : 25) && parsed.boxCount >= (largeHome ? 35 : 20) && (!largeHome || smallItemSignals >= 10);
    const microDetailedLocal = inputs.moveType === "Local" && !isCommercial && !isLaborOnly && bedroomCount <= 1 && inputs.packingLevel === "None" && parsed.totalVol <= 120 && parsed.detectedQtyTotal <= 6 && parsed.boxCount <= 5 && estimatedRatio === 0 && !parsed.hasVague && !parsed.mentionsGarageOrAttic && !anyHeavySignal && parsed.irregularCount === 0 && !hasGenericCatchall;
    const inventoryCompleteness = highConfidenceDetailedInventory || microDetailedLocal || estimatedRatio <= 0.05 && !parsed.hasVague && itemDensity >= (largeHome ? 20 : 18) && boxCoverage >= (largeHome ? 0.45 : 0.35) && smallItemSignals >= (largeHome ? 10 : 8) ? "detailed" : estimatedRatio > 0.15 || parsed.hasVague || itemDensity < 8 || boxCoverage < 0.10 || parsed.mentionsGarageOrAttic && smallItemSignals < 4 ? "sparse" : "coarse";
    return {
        inputs,
        normalizedRows,
        overrides,
        notes,
        useNormalized,
        parsed,
        items,
        countBy,
        isCommercial,
        commercialSubtype,
        isLaborOnly,
        isLD,
        bedroomCount,
        scopeLabel,
        extraStops,
        extraStopCount,
        extraStopMinutesTotal,
        extraStopHours,
        hasNonGroundExtraStop,
        extraStopComplexityScore,
        hasHeavyByWeight,
        manualHeavy,
        hasHeavy,
        suppressConferenceTableHeavy,
        anyHeavySignal,
        fragileCount,
        fragileDensity,
        estimatedRatio,
        hasGenericCatchall,
        sizeUnits,
        itemDensity,
        expectedBoxesBase,
        boxCoverage,
        smallItemSignals,
        storageFurnitureQty,
        largeHome,
        largeInventoryForLD,
        ldFullPackLargeHome,
        syntheticBundleItems,
        syntheticBundleVolume,
        syntheticBundleRatio,
        syntheticBundleGroups,
        syntheticBundleBoxQty,
        estateHeavyPieceQty,
        storageHeavyTruckPieceQty,
        ldFullPackComplexityScore,
        storageContentsHandled,
        highConfidenceDetailedInventory,
        microDetailedLocal,
        inventoryCompleteness
    };
}
}),
"[project]/lib/engine/finalize.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildEstimateResult",
    ()=>buildEstimateResult
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dictionaries.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/parser.ts [app-rsc] (ecmascript)");
;
;
;
function buildEstimateResult(context, volumePlan, truckPlan, laborPlan) {
    const { inputs, parsed, notes, countBy, useNormalized, isCommercial, commercialSubtype, isLaborOnly, isLD, bedroomCount, scopeLabel, extraStopCount, parsed: { hasVague }, anyHeavySignal, fragileCount, estimatedRatio, syntheticBundleRatio, syntheticBundleGroups, ldFullPackLargeHome, suppressConferenceTableHeavy } = context;
    const { hiddenVolume, missingBoxesCount, llPct, rawVolume, billableCF, truckSpaceCF, finalVolume, weight } = volumePlan;
    const { trucksFinal, truckSizeLabel, highCapRisk, hasPallets, league, leagueItems } = truckPlan;
    const { crew, timeMin, timeMax, splitRecommended, crewSuggestion, totalManHours, daMins, boxDensity, calcDuration, safeDayLimit } = laborPlan;
    const baseFloor = isLaborOnly ? 10 : 20;
    const itemFloor = Math.ceil((parsed.furnitureCount || 0) / 2);
    let blankets = 0;
    (parsed.detectedItems || []).forEach((item)=>{
        const itemName = (item.name || "").toLowerCase();
        let blanketCount = 0;
        const longestKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchLongestKey"])(itemName, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BLANKET_KEYS"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BLANKET_REGEX_CACHE"]);
        if (longestKey) blanketCount = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["BLANKETS_TABLE"][longestKey];
        else if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["STRICT_NO_BLANKET_REGEX_CACHE"], itemName)) blanketCount = 1;
        const isChairLike = (itemName.includes("chair") || itemName.includes("stool")) && !itemName.includes("chair mat") && !itemName.includes("mat");
        const isArmchair = itemName.includes("arm") || itemName.includes("recliner") || itemName.includes("sofa");
        if (isCommercial && isChairLike && !isArmchair) {
            blankets += Math.ceil(item.qty / __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].COMMERCIAL_STACK_FACTOR);
        } else {
            blankets += blanketCount * item.qty;
        }
    });
    const noBlanketCF = (parsed.detectedItems || []).reduce((sum, item)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["STRICT_NO_BLANKET_REGEX_CACHE"], (item.name || "").toLowerCase()) ? sum + (item.cf || 0) : sum, 0);
    const noBlanketWithLL = Math.round((noBlanketCF + missingBoxesCount * 5) * (1 + llPct));
    const blanketVolume = Math.max(0, finalVolume - noBlanketWithLL);
    blankets = Math.max(blankets, Math.ceil(blanketVolume / __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].BLANKET_DIVISOR));
    const blanketCap = Math.min(Math.ceil((parsed.furnitureCount || 0) * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].BLANKET_CAP_MULTIPLIER) + 15, Math.ceil(blanketVolume / 12));
    blankets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roundUpTo"])(Math.max(Math.min(blankets, blanketCap), Math.max(baseFloor, itemFloor)), 5);
    let confidenceScore = 100;
    const confidenceReasons = [];
    if (estimatedRatio > 0.05) {
        const penalty = Math.min(30, Math.round(estimatedRatio * 40));
        confidenceScore -= penalty;
        confidenceReasons.push(`Estimated items: ${Math.round(estimatedRatio * 100)}% (-${penalty})`);
    }
    if (estimatedRatio > 0.40) {
        confidenceScore = Math.min(confidenceScore, 50);
        confidenceReasons.push("Too many unrecognized items (Low Confidence).");
    }
    if (hasVague) {
        confidenceScore -= 7;
        confidenceReasons.push("Vague inventory description.");
    }
    if (syntheticBundleRatio >= 0.10) {
        const penalty = Math.min(15, Math.max(5, Math.round(syntheticBundleRatio * 40)));
        confidenceScore -= penalty;
        confidenceReasons.push(`Inferred packed bundles: ${Math.round(syntheticBundleRatio * 100)}% (-${penalty})`);
    } else if (syntheticBundleGroups >= 3) {
        confidenceScore -= 4;
        confidenceReasons.push("Multiple packed-content bundles inferred.");
    }
    confidenceScore = Math.max(40, Math.min(100, confidenceScore));
    const confidenceLabel = confidenceScore >= 80 ? "High" : confidenceScore >= 60 ? "Medium" : "Low";
    if (!isCommercial && (inputs.moveType === "Local" || inputs.moveType === "LD")) {
        let volumeDriver = "Volume Driver: Inventory volume was adjusted for safe loading.";
        if (isLD && billableCF && truckSpaceCF) volumeDriver = "Volume Driver: Safety margin and truck-space buffer applied.";
        else if (hasVague) volumeDriver = "Volume Driver: Vague inventory increased handling allowance.";
        else if (missingBoxesCount > 0) volumeDriver = "Volume Driver: Missing box allowance increased the volume baseline.";
        else if (hiddenVolume > 0) volumeDriver = "Volume Driver: Room-size floor increased the baseline volume.";
        else if (llPct > __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LL_STANDARD) volumeDriver = "Volume Driver: Bulky or irregular items increased truck-space needs.";
        let timeDriver = "Time Driver: Loading speed is based on volume, access, and item mix.";
        if (inputs.packingLevel === "Full") timeDriver = "Time Driver: Full packing and prep time are driving the estimate.";
        else if (inputs.packingLevel === "Partial") timeDriver = "Time Driver: Packing prep adds handling time.";
        else if (isLD) timeDriver = "Time Driver: Estimate covers origin labor and prep, not transit time.";
        else if (extraStopCount > 0) timeDriver = "Time Driver: Extra stops added routing, staging, and access time.";
        else if (inputs.accessOrigin === "stairs" || inputs.accessDest === "stairs") timeDriver = "Time Driver: Stair access reduces handling speed.";
        else if (inputs.accessOrigin === "elevator" || inputs.accessDest === "elevator") timeDriver = "Time Driver: Elevator coordination reduces handling speed.";
        else if (daMins >= 60) timeDriver = "Time Driver: Assembly/disassembly time is materially affecting the move.";
        else if (highCapRisk || trucksFinal >= 2) timeDriver = "Time Driver: Multi-truck coordination is adding handling time.";
        let crewDriver = "Crew Driver: Crew size is based on volume and expected move duration.";
        if (league === 2 || anyHeavySignal) crewDriver = "Crew Driver: Heavy or oversized items increased crew needs.";
        else if (extraStopCount >= 2 && crew >= 4) crewDriver = "Crew Driver: Multi-stop routing increased coordination needs.";
        else if (trucksFinal >= 2) crewDriver = "Crew Driver: Multi-truck volume requires a larger crew.";
        else if (finalVolume >= 1800) crewDriver = "Crew Driver: Large shipment volume pushed the crew size up.";
        else if (ldFullPackLargeHome && crew >= 7) crewDriver = "Crew Driver: Estate-scale full packing requires a larger crew.";
        else if (inputs.packingLevel === "Full" && crew >= 4) crewDriver = "Crew Driver: Packing workload supports a larger crew.";
        else if (calcDuration > safeDayLimit || crewSuggestion && crew >= 3) crewDriver = "Crew Driver: Crew size was increased to keep the move within a workable day.";
        notes.advice.push(volumeDriver, timeDriver, crewDriver);
    }
    if (isCommercial && commercialSubtype === "office_light") {
        if (inputs.accessOrigin === "elevator" || inputs.accessDest === "elevator") {
            notes.advice.push("Confirm building move window, freight elevator booking, and COI requirements.");
        } else {
            notes.advice.push("Confirm building access, parking, and loading-zone rules.");
        }
        if (trucksFinal >= 2) notes.advice.push("Reserve loading dock time and truck staging in advance.");
        if (inputs.packingLevel !== "None") notes.advice.push("Comm. Packing: Label all boxes by office/room number.");
    } else {
        if (isCommercial && (inputs.accessOrigin === "elevator" || inputs.accessDest === "elevator")) {
            notes.advice.push("Confirm freight elevator access, move window, and cab dimensions.");
        }
        if (isCommercial && trucksFinal >= 2) notes.advice.push("Reserve loading dock time and truck staging in advance.");
        if (isCommercial && anyHeavySignal) notes.advice.push("Pre-measure oversized equipment, cabinets, and appliance paths.");
        if (inputs.packingLevel !== "None" && isCommercial) notes.advice.push("Comm. Packing: Label all boxes by office/room number.");
    }
    if (isCommercial && commercialSubtype === "warehouse") {
        notes.advice.push("Confirm dock door access, pallet counts, and receiving window before dispatch.");
    }
    if (extraStopCount > 0) notes.advice.push("Multi-stop route: confirm stop order, parking, and stop-level access before dispatch.");
    if (finalVolume > 1800 && trucksFinal === 1) notes.advice.push("High Volume: Ensure parking spot is 40ft+ for large truck maneuvering.");
    const uniqueAdvice = [];
    const seenAdvice = new Set();
    notes.advice.forEach((adviceLine)=>{
        if (splitRecommended && adviceLine.includes("2-Day Split")) return;
        if (!seenAdvice.has(adviceLine)) {
            seenAdvice.add(adviceLine);
            uniqueAdvice.push(adviceLine);
        }
    });
    let boxesBring = parsed.boxCount || 0;
    const minBoxesBySize = !isCommercial ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MIN_BOXES[Math.min(bedroomCount, 5)] || 10 : 20;
    if (inputs.packingLevel === "Full") boxesBring = Math.max(boxesBring, minBoxesBySize) + 10 + Math.max(1, trucksFinal) * 5;
    else if (inputs.packingLevel === "Partial") boxesBring = Math.max(boxesBring, isCommercial ? 25 : Math.max(25, Math.ceil(minBoxesBySize * 0.35)));
    else boxesBring = Math.max(boxesBring, isCommercial ? 15 : 10);
    if (fragileCount > 5) boxesBring += 5;
    if (hasVague) boxesBring += 5;
    boxesBring = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roundUpTo"])(Math.ceil(Math.min(boxesBring, inputs.packingLevel === "Full" ? Math.ceil(finalVolume / 12 + 40) : Math.ceil(finalVolume / 20 + 20))), 10);
    const wardrobes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roundUpTo"])(!isCommercial ? bedroomCount * 4 : 0, 5);
    if (context.overrides.blankets !== undefined && context.overrides.blankets !== null) {
        const overriddenBlankets = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOverrideValue"])(context.overrides.blankets, 0, 500);
        if (overriddenBlankets !== null) {
            blankets = overriddenBlankets;
            notes.overridesApplied.push("blankets");
            notes.auditSummary.push(`Manager Override: Blankets = ${blankets}`);
        }
    }
    if (context.overrides.boxes !== undefined && context.overrides.boxes !== null) {
        const overriddenBoxes = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOverrideValue"])(context.overrides.boxes, 0, 500);
        if (overriddenBoxes !== null) {
            boxesBring = overriddenBoxes;
            notes.overridesApplied.push("boxes");
            notes.auditSummary.push(`Manager Override: Boxes = ${boxesBring}`);
        }
    }
    const smartEquipment = [];
    if (hasPallets) smartEquipment.push("Pallet Jack");
    if (countBy(/piano/i) > 0) smartEquipment.push("Piano Board");
    if (countBy(/fridge|washer|dryer|safe/i) > 0) smartEquipment.push("Appliance Dolly");
    if (fragileCount > 2) smartEquipment.push("Protective Wrap");
    const heavyMap = new Map();
    (parsed.detectedItems || []).forEach((item)=>{
        const itemName = (item.name || "").toLowerCase();
        if (useNormalized) {
            if (!item.isManualHeavy) return;
        } else {
            if (suppressConferenceTableHeavy && itemName === "conference table") return;
            const isTrueHeavy = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["TRUE_HEAVY_ITEMS"].some((label)=>itemName.includes(label));
            if (!isTrueHeavy && !item.isWeightHeavy) return;
        }
        const label = item.isWeightHeavy ? `${item.name} (>300lb)` : item.name;
        heavyMap.set(label, (heavyMap.get(label) || 0) + (item.qty || 1));
    });
    let effortScore = 0;
    (parsed.detectedItems || []).forEach((item)=>{
        const itemName = (item.name || "").toLowerCase();
        const multiplier = Object.entries(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["EFFORT_MULTIPLIER"]).find(([label])=>itemName.includes(label));
        effortScore += (item.cf || 0) * (multiplier ? multiplier[1] : 1.0);
    });
    const distVal = parseInt(inputs.distance, 10) || 0;
    const effectiveDist = inputs.moveType === "LD" || isLaborOnly ? 0 : distVal;
    return {
        finalVolume,
        weight,
        trucksFinal,
        truckSizeLabel,
        crew,
        timeMin,
        timeMax,
        logs: notes.logs,
        risks: notes.risks,
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
            reasons: confidenceReasons
        },
        auditSummary: notes.auditSummary,
        advice: uniqueAdvice,
        overridesApplied: notes.overridesApplied,
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
        boxDensity,
        truckFitNote: null,
        netVolume: rawVolume,
        billableCF,
        truckSpaceCF,
        extraStopCount
    };
}
}),
"[project]/lib/engine/labor.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeLaborPlan",
    ()=>computeLaborPlan
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dictionaries.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/parser.ts [app-rsc] (ecmascript)");
;
;
;
function computeLaborPlan(context, volumePlan, truckPlan) {
    const { inputs, parsed, overrides, notes, isCommercial, commercialSubtype, isLaborOnly, isLD, bedroomCount, anyHeavySignal, fragileDensity, extraStopCount, extraStopComplexityScore, extraStopHours, extraStopMinutesTotal, hasNonGroundExtraStop, ldFullPackLargeHome, ldFullPackComplexityScore } = context;
    const { finalVolume } = volumePlan;
    const { trucksFinal, truckSizeLabel, highCapRisk, league, hasPallets } = truckPlan;
    const isLocalResidential = inputs.moveType === "Local" && !isCommercial && !isLaborOnly;
    const isLDResidential = isLD && !isCommercial;
    const isLaborSimple = isLaborOnly && !isCommercial;
    const isOfficeLightCommercial = isCommercial && commercialSubtype === "office_light";
    const isWarehouseCommercial = isCommercial && commercialSubtype === "warehouse";
    let speedOrigin = isCommercial ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPEED_COMMERCIAL : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPEED_GROUND;
    let speedDest = isCommercial ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPEED_COMMERCIAL : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPEED_GROUND;
    if (!isCommercial) {
        if (inputs.accessOrigin === "elevator") speedOrigin = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPEED_ELEVATOR;
        else if (inputs.accessOrigin === "stairs") speedOrigin = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPEED_STAIRS;
        if (inputs.accessDest === "elevator") speedDest = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPEED_ELEVATOR;
        else if (inputs.accessDest === "stairs") speedDest = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPEED_STAIRS;
    }
    if (isLaborOnly && inputs.accessOrigin === "stairs") speedOrigin = Math.round(speedOrigin * 0.85);
    if (inputs.moveType === "LD" && finalVolume * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].WEIGHT_SAFETY > 10000) speedOrigin *= __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].HEAVY_PAYLOAD_SPEED_MULT;
    let movementManHours = isLaborOnly || inputs.moveType === "LD" ? finalVolume / speedOrigin : finalVolume / speedOrigin + finalVolume / speedDest;
    if (highCapRisk) movementManHours *= __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MULTI_TRUCK_TIME_BUFFER;
    if (inputs.moveType === "LD") movementManHours *= __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LD_TIER_BUFFER;
    const isWrapExcluded = (name)=>/\b(box|bin|tote|bag|carton|dish barrel|picture box|tv box|wardrobe box|plastic bin|lamp|clock|scale|walker|vacuum|canister|stool)\b/i.test(name);
    const isChairLike = (name)=>/chair|stool|bench|seat/i.test(name) && !/arm|reclin|sofa|couch/i.test(name);
    let wrapMinsTotal = (parsed.detectedItems || []).reduce((sum, item)=>{
        const itemName = (item.name || "").toLowerCase();
        if (isWrapExcluded(itemName)) return sum;
        const cfUnit = item.cf / Math.max(1, item.qty);
        let mins = cfUnit > 15 ? 10 : 5;
        if (isCommercial && isChairLike(item.name)) mins = 1.0;
        return sum + mins * item.qty;
    }, 0);
    if (fragileDensity > __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].FRAGILE_DENSITY_THRESHOLD) {
        wrapMinsTotal = Math.round(wrapMinsTotal * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].FRAGILE_WRAP_MULT);
    }
    let daMins = 0;
    (parsed.detectedItems || []).forEach((item)=>{
        const itemName = (item.name || "").toLowerCase();
        const longestKey = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchLongestKey"])(itemName, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_KEYS"], __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_REGEX_CACHE"]);
        if (longestKey) {
            daMins += __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_TIME_TABLE"][longestKey] * item.qty;
        } else {
            const isBedUnit = itemName.includes("bed") && !itemName.includes("frame") && !itemName.includes("mattress") && !itemName.includes("boxspring") && !itemName.includes("slat");
            if (isBedUnit) daMins += (isCommercial ? 20 : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MINS_DA_COMPLEX) * item.qty;
            else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_COMPLEX_REGEX_CACHE"], itemName)) daMins += (isCommercial ? 20 : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MINS_DA_COMPLEX) * item.qty;
            else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["DA_SIMPLE_REGEX_CACHE"], itemName)) daMins += (isCommercial ? 5 : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MINS_DA_SIMPLE) * item.qty;
        }
    });
    const totalBoxes = parsed.boxCount + volumePlan.missingBoxesCount;
    let packingAddonMH = 0;
    if (inputs.packingLevel === "Full") {
        packingAddonMH = totalBoxes * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MINS_PACK_BOX / 60;
    } else if (inputs.packingLevel === "Partial") {
        packingAddonMH = 2.0 + Math.min(totalBoxes, Math.max(10, Math.ceil(totalBoxes * 0.25))) * 0.08;
    }
    const ldFullPackLaborBufferMH = ldFullPackLargeHome ? ldFullPackComplexityScore >= 5 ? 2.5 : ldFullPackComplexityScore >= 3 ? 1.5 : 1.0 : 0;
    const totalManHours = movementManHours + daMins / 60 + wrapMinsTotal / 60 + packingAddonMH + ldFullPackLaborBufferMH;
    let crew = isLocalResidential ? finalVolume <= 650 ? 2 : finalVolume <= 900 ? 3 : finalVolume <= 1600 ? 4 : finalVolume <= 2500 ? 5 : finalVolume <= 3600 ? 6 : 7 : isLDResidential ? finalVolume <= 900 ? 3 : finalVolume <= 1800 ? 4 : finalVolume <= 2800 ? 5 : finalVolume <= 3800 ? 6 : 7 : isOfficeLightCommercial ? finalVolume <= 900 ? 3 : finalVolume <= 1800 ? 4 : finalVolume <= 2800 ? 5 : 6 : isLaborSimple ? finalVolume <= 900 ? 2 : finalVolume <= 1800 ? 3 : finalVolume <= 3000 ? 4 : 5 : Math.max(2, Math.ceil(Math.sqrt(finalVolume / 100)));
    if (!isLocalResidential && !isLDResidential && !isLaborSimple && (finalVolume >= 800 || trucksFinal > 1 || bedroomCount >= 3)) crew = Math.max(3, crew);
    if (bedroomCount >= 4) crew = Math.max(4, crew);
    if (bedroomCount >= 5) crew = Math.max(5, crew);
    if (anyHeavySignal) crew = Math.max(crew, 3);
    if (league === 2) crew = Math.max(crew, 4);
    if (finalVolume > 3000) crew = Math.max(crew, 6);
    if (finalVolume > 4000) crew = Math.max(crew, 7);
    if (inputs.packingLevel === "Full" && bedroomCount >= 3) crew = Math.max(crew, 4);
    if (isWarehouseCommercial && (hasPallets || trucksFinal >= 2)) crew = Math.max(crew, 4);
    if (!isLaborOnly && extraStopCount >= 2 && finalVolume >= __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].EXTRA_STOP_CREW_FLOOR_VOLUME) crew = Math.max(crew, 4);
    if (!isLaborOnly && extraStopComplexityScore >= __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].EXTRA_STOP_CREW_COMPLEXITY_HIGH && finalVolume >= __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].EXTRA_STOP_CREW_COMPLEX_VOLUME) crew = Math.max(crew, 5);
    if (ldFullPackLargeHome) {
        const ldFullPackCrewFloor = ldFullPackComplexityScore >= 5 ? 8 : 7;
        crew = Math.max(crew, ldFullPackCrewFloor);
    }
    if (!isLaborOnly && trucksFinal >= 2) crew = Math.max(crew, 5);
    if (crew > __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MAX_CREW_SIZE) crew = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MAX_CREW_SIZE;
    const distVal = parseInt(inputs.distance, 10) || 0;
    const effectiveDist = inputs.moveType === "LD" || isLaborOnly ? 0 : distVal;
    const dockingHours = !isLaborOnly && !(isLD && trucksFinal === 1) ? trucksFinal * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MINS_DOCKING_PER_TRUCK / 60 : 0;
    const truckLogisticsHours = !isLaborOnly && trucksFinal >= 2 ? trucksFinal * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MINS_TRUCK_LOGISTICS / 60 : 0;
    const fixedTime = (effectiveDist > 0 ? effectiveDist / 30 + 0.6 : 0) + __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].COORDINATION_HRS + dockingHours + truckLogisticsHours + extraStopHours;
    if (extraStopCount > 0) {
        notes.auditSummary.push(`Added +${extraStopMinutesTotal} min (${extraStopCount} extra stop${extraStopCount > 1 ? "s" : ""}${hasNonGroundExtraStop ? ", mixed access" : ""}).`);
    }
    const isSmallHome = !isCommercial && bedroomCount <= 2;
    let spaceCap = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MAX_CREW_SIZE;
    if (isSmallHome) {
        if (finalVolume > 2000) spaceCap = 6;
        else if (anyHeavySignal || finalVolume > 1500) spaceCap = 5;
        else spaceCap = 4;
        if (crew > spaceCap) crew = spaceCap;
    }
    let crewHardCap = Math.min(spaceCap, isCommercial ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MAX_CREW_SIZE : finalVolume < 2600 ? 6 : finalVolume < 3400 ? 7 : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MAX_CREW_SIZE);
    if (ldFullPackLargeHome && ldFullPackComplexityScore >= 5) {
        crewHardCap = Math.min(spaceCap, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MAX_CREW_SIZE);
    } else if (ldFullPackLargeHome && ldFullPackComplexityScore >= 3) {
        crewHardCap = Math.min(spaceCap, Math.max(crewHardCap, 7));
    }
    crewHardCap = Math.max(crewHardCap, Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MAX_CREW_SIZE, crew));
    const computeDuration = (crewValue)=>totalManHours / (crewValue * (crewValue > 6 ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].CREW_EFFICIENCY_LOW : crewValue > 4 ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].CREW_EFFICIENCY_HIGH : 1.0)) * (finalVolume > __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].VOLUME_DRAG_THRESHOLD ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LARGE_VOLUME_DRAG : 1.0) + fixedTime;
    let calcDuration = computeDuration(crew);
    const safeDayLimit = inputs.moveType === "Local" && inputs.packingLevel === "Full" ? 11.5 : 10.5;
    const smallLocalTwoCrewEligible = isLocalResidential && bedroomCount <= 1 && trucksFinal === 1 && finalVolume <= 650 && inputs.packingLevel === "None" && extraStopCount === 0 && league === 0 && !anyHeavySignal && inputs.accessOrigin !== "stairs" && inputs.accessDest !== "stairs";
    const smallLdThreeCrewEligible = isLDResidential && trucksFinal === 1 && finalVolume <= 900 && bedroomCount <= 2 && inputs.packingLevel !== "Full" && extraStopCount === 0 && league < 2 && !anyHeavySignal && computeDuration(3) <= 6.5;
    const officeLightThreeCrewEligible = isOfficeLightCommercial && trucksFinal === 1 && finalVolume <= 900 && extraStopCount === 0 && league < 2 && !anyHeavySignal && computeDuration(3) <= 6.5;
    const smallLaborTwoCrewEligible = isLaborSimple && finalVolume <= 900 && bedroomCount <= 2 && inputs.packingLevel === "None" && league === 0 && !anyHeavySignal && computeDuration(2) <= 6.5;
    const midLaborThreeCrewCapEligible = isLaborSimple && finalVolume <= 1800 && bedroomCount <= 3 && inputs.packingLevel !== "Full" && league < 2 && !anyHeavySignal;
    const officeLightFiveCrewCapEligible = isOfficeLightCommercial && trucksFinal <= 2 && finalVolume <= 2400 && league < 2 && !anyHeavySignal && inputs.packingLevel !== "Full";
    const preserveTwoCrewCorridor = crew === 2 && (smallLocalTwoCrewEligible || smallLaborTwoCrewEligible);
    const preserveThreeCrewCorridor = crew === 3 && (smallLdThreeCrewEligible || officeLightThreeCrewEligible);
    if (!preserveTwoCrewCorridor && !preserveThreeCrewCorridor) {
        while(crew < crewHardCap){
            const nextDuration = computeDuration(crew + 1);
            const timeSaved = calcDuration - nextDuration;
            if (calcDuration <= safeDayLimit && timeSaved < 1.0) break;
            if (Math.ceil(calcDuration * 1.1) < __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPLIT_RISK_THRESHOLD && timeSaved < 0.5) break;
            crew += 1;
            calcDuration = nextDuration;
        }
    }
    if (midLaborThreeCrewCapEligible && crew > 3) {
        crew = 3;
        calcDuration = computeDuration(crew);
    }
    if (officeLightFiveCrewCapEligible && crew > 5) {
        crew = 5;
        calcDuration = computeDuration(crew);
    }
    let crewSuggestion = calcDuration > 8.0 && crew < crewHardCap && calcDuration - computeDuration(crew + 1) >= 0.5 ? `+1 Mover saves ~${(calcDuration - computeDuration(crew + 1)).toFixed(1)}h` : null;
    const boxDensity = parsed.detectedQtyTotal > 0 ? (parsed.boxCount || 0) / parsed.detectedQtyTotal : 0;
    if (boxDensity > 0.60 && inputs.accessOrigin === "ground" && (inputs.moveType !== "Local" || inputs.accessDest === "ground") && finalVolume < 1200 && league < 2 && !notes.overridesApplied.includes("crew") && crew > 3) {
        crew = 3;
        calcDuration = computeDuration(crew);
    }
    if (!isLaborOnly && !isWarehouseCommercial && trucksFinal === 1 && /^18ft|^16ft/.test(truckSizeLabel) && league < 2 && !notes.overridesApplied.includes("crew") && crew > 3) {
        crew = 3;
        calcDuration = computeDuration(crew);
    }
    let timeMin = Math.max(3, Math.floor(calcDuration));
    let timeMax = Math.max(timeMin + 1, Math.ceil(calcDuration * 1.1));
    let splitRecommended = false;
    if (isSmallHome && timeMax > 12.0 && crew === spaceCap) splitRecommended = true;
    else if (timeMax >= __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].SPLIT_RISK_THRESHOLD && crew === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MAX_CREW_SIZE) splitRecommended = true;
    if (overrides.crew !== undefined && overrides.crew !== null) {
        const overriddenCrew = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOverrideValue"])(overrides.crew, 2, 20);
        if (overriddenCrew !== null) {
            crew = overriddenCrew;
            crewSuggestion = null;
            notes.overridesApplied.push("crew");
        }
    }
    if (!(overrides.timeMin !== undefined && overrides.timeMin !== null || overrides.timeMax !== undefined && overrides.timeMax !== null) && notes.overridesApplied.includes("crew")) {
        const duration = computeDuration(crew);
        timeMin = Math.max(3, Math.floor(duration));
        timeMax = Math.max(timeMin + 1, Math.ceil(duration * 1.1));
    }
    if (overrides.timeMin !== undefined && overrides.timeMin !== null) {
        const overriddenTimeMin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOverrideValue"])(overrides.timeMin, 1, 99);
        if (overriddenTimeMin !== null) {
            timeMin = overriddenTimeMin;
            notes.overridesApplied.push("timeMin");
        }
    }
    if (overrides.timeMax !== undefined && overrides.timeMax !== null) {
        const overriddenTimeMax = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOverrideValue"])(overrides.timeMax, 1, 99);
        if (overriddenTimeMax !== null) {
            timeMax = overriddenTimeMax;
            notes.overridesApplied.push("timeMax");
        }
    }
    if (timeMax >= 13) splitRecommended = true;
    if (finalVolume > 4000) {
        const additionalCrewAvailable = crew < crewHardCap && crew < __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MAX_CREW_SIZE;
        if (additionalCrewAvailable) notes.advice.push(`Large Move: Recommend splitting into 2 days OR ${Math.max(6, crew + 1)}+ movers.`);
        else notes.advice.push("Large Move: Recommend splitting into 2 days.");
    }
    return {
        movementManHours,
        wrapMinsTotal,
        daMins,
        totalManHours,
        crew,
        crewSuggestion,
        timeMin,
        timeMax,
        splitRecommended,
        boxDensity: Math.round(boxDensity * 100),
        calcDuration,
        safeDayLimit
    };
}
}),
"[project]/lib/engine/trucks.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeTruckPlan",
    ()=>computeTruckPlan
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dictionaries.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/parser.ts [app-rsc] (ecmascript)");
;
;
;
function computeTruckPlan(context, volumePlan) {
    const { inputs, parsed, overrides, notes, items, useNormalized, manualHeavy, hasHeavy, hasHeavyByWeight, isLaborOnly, suppressConferenceTableHeavy } = context;
    const { finalVolume, weight } = volumePlan;
    let trucksFinal = 0;
    let truckSizeLabel = "N/A";
    let highCapRisk = false;
    const hasPallets = (parsed.detectedItems || []).some((item)=>{
        const nameLower = (item.name || "").toLowerCase();
        const rawLower = (item.raw || "").toLowerCase();
        return nameLower.includes("pallet") || nameLower.includes("skid") || rawLower.includes("pallet") || rawLower.includes("skid");
    });
    let truckFeatureLabel = "";
    const needsLiftGate = useNormalized ? manualHeavy || (parsed.detectedItems || []).some((item)=>{
        const nameLower = (item.name || "").toLowerCase();
        if (suppressConferenceTableHeavy && nameLower === "conference table") return false;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LIFT_GATE_REGEX_CACHE"], nameLower);
    }) : (parsed.detectedItems || []).some((item)=>{
        const nameLower = (item.name || "").toLowerCase();
        if (suppressConferenceTableHeavy && nameLower === "conference table") return false;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegex"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LIFT_GATE_REGEX_CACHE"], nameLower);
    });
    if (hasHeavy || hasPallets || hasHeavyByWeight || needsLiftGate) {
        truckFeatureLabel = " + Lift-gate";
        if (hasPallets) notes.advice.push("Commercial: Palletjack & Lift-gate required for skids.");
        if (hasHeavyByWeight) notes.advice.push("Item >300lb detected: Heavy lifting gear needed.");
    }
    if (!isLaborOnly) {
        const safeCapacity = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].TRUCK_CAPACITY_SAFE;
        const extraStopTruckThresholdReduction = context.extraStopCount > 0 ? Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].EXTRA_STOP_TRUCK_MAX_THRESHOLD_REDUCTION, context.extraStopCount * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].EXTRA_STOP_TRUCK_THRESHOLD_REDUCTION_PER_STOP + (context.hasNonGroundExtraStop ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].EXTRA_STOP_TRUCK_NON_GROUND_BONUS : 0)) : 0;
        const borderlineTruckThreshold = Math.max(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].BORDERLINE_TRUCK_THRESHOLD - __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].EXTRA_STOP_TRUCK_MAX_THRESHOLD_REDUCTION, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].BORDERLINE_TRUCK_THRESHOLD - extraStopTruckThresholdReduction);
        const defaultSingleTruckFloor = Math.floor(safeCapacity * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].BORDERLINE_TRUCK_THRESHOLD);
        const adjustedSingleTruckFloor = Math.floor(safeCapacity * borderlineTruckThreshold);
        trucksFinal = Math.max(1, Math.ceil(finalVolume / safeCapacity));
        if (trucksFinal === 1 && finalVolume >= adjustedSingleTruckFloor) {
            trucksFinal = 2;
            highCapRisk = true;
            if (extraStopTruckThresholdReduction > 0 && finalVolume < defaultSingleTruckFloor) {
                notes.risks.push({
                    text: "Multi-stop routing reduces practical 1-truck capacity: 2 trucks recommended.",
                    level: "caution"
                });
                notes.auditSummary.push("Extra truck added (multi-stop routing).");
            } else {
                notes.risks.push({
                    text: "Borderline capacity: 2 trucks recommended.",
                    level: "caution"
                });
            }
        }
        if (trucksFinal >= 2) truckSizeLabel = "26ft Truck";
        else if (finalVolume < 800) truckSizeLabel = "18ft Truck";
        else if (finalVolume < 1300) truckSizeLabel = "24ft Truck";
        else truckSizeLabel = "26ft Truck";
        truckSizeLabel += truckFeatureLabel;
        if (inputs.moveType === "LD") {
            const weightTrucks = Math.ceil(weight / __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LD_WEIGHT_LIMIT);
            if (weightTrucks > trucksFinal) {
                trucksFinal = weightTrucks;
                notes.auditSummary.push("Extra truck added (weight limit).");
            }
        }
    }
    if (!isLaborOnly && overrides.trucks !== undefined && overrides.trucks !== null) {
        const overriddenTrucks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOverrideValue"])(overrides.trucks, 1, 20);
        if (overriddenTrucks !== null) {
            trucksFinal = overriddenTrucks;
            highCapRisk = false;
            const label = trucksFinal >= 2 ? "26ft Truck" : finalVolume < 800 ? "18ft Truck" : finalVolume < 1300 ? "24ft Truck" : "26ft Truck";
            truckSizeLabel = label + truckFeatureLabel;
            notes.overridesApplied.push("trucks");
            notes.auditSummary.push(`Manager Override: Trucks = ${trucksFinal}`);
        }
    }
    let league = 0;
    const leagueItems = {
        l1: [],
        l2: []
    };
    items.forEach((item)=>{
        const nameLower = (item.name || "").toLowerCase();
        const rawLower = (item.raw || "").toLowerCase();
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegexAcross"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LEAGUE_2_REGEX_CACHE"], nameLower, rawLower)) {
            league = 2;
            leagueItems.l2.push(item.name);
        } else if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["matchesAnyRegexAcross"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dictionaries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["LEAGUE_1_REGEX_CACHE"], nameLower, rawLower)) {
            if (league < 1) league = 1;
            leagueItems.l1.push(item.name);
        }
    });
    return {
        trucksFinal,
        truckSizeLabel,
        highCapRisk,
        truckFeatureLabel,
        hasPallets,
        needsLiftGate,
        league,
        leagueItems
    };
}
}),
"[project]/lib/engine/volume.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeVolumePlan",
    ()=>computeVolumePlan
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/config.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/parser.ts [app-rsc] (ecmascript)");
;
;
function computeVolumePlan(context) {
    const { inputs, overrides, notes, parsed, isCommercial, commercialSubtype, isLD, bedroomCount, inventoryCompleteness, microDetailedLocal, largeInventoryForLD, ldFullPackLargeHome, ldFullPackComplexityScore, storageFurnitureQty, storageContentsHandled, boxCoverage, highConfidenceDetailedInventory, parsed: { hasVague }, storageHeavyTruckPieceQty } = context;
    let hiddenVolume = 0;
    let missingBoxesCount = 0;
    let baseHomeHiddenVolume = 0;
    const isTinyScope = bedroomCount === 0 && parsed.totalVol < 120;
    if (!isCommercial) {
        if (!isTinyScope && !isLD) {
            const hvRow = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["HV_TABLE"][Math.min(bedroomCount, 5)];
            if (parsed.totalVol < hvRow.min) {
                const deficit = Math.max(0, hvRow.min - parsed.totalVol);
                const hvFactor = microDetailedLocal ? 0 : inventoryCompleteness === "detailed" ? 0.25 : inventoryCompleteness === "coarse" ? 0.45 : 0.65;
                const computedHvAdd = Math.max(25, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roundUpTo"])(deficit * hvFactor, 25));
                const localHvMinimum = inputs.moveType !== "Local" || inventoryCompleteness === "detailed" ? 0 : bedroomCount === 2 ? 150 : bedroomCount === 3 ? 200 : bedroomCount === 4 ? 250 : bedroomCount >= 5 ? 350 : 0;
                const hvAdd = microDetailedLocal ? 100 : Math.max(computedHvAdd, localHvMinimum);
                const usedLocalMinimum = !microDetailedLocal && localHvMinimum > 0 && hvAdd === localHvMinimum && localHvMinimum > computedHvAdd;
                const hvNotes = microDetailedLocal ? [
                    "micro local reduced floor"
                ] : [
                    ...inventoryCompleteness === "sparse" ? [] : [
                        `${inventoryCompleteness} inventory`
                    ],
                    ...usedLocalMinimum ? [
                        "local minimum floor"
                    ] : []
                ];
                baseHomeHiddenVolume += hvAdd;
                hiddenVolume += hvAdd;
                notes.logs.push(`Volume Check: +${hvAdd} cf added.`);
                notes.auditSummary.push(`Added +${hvAdd} cf (low volume for ${hvRow.label}${hvNotes.length ? `, ${hvNotes.join(", ")}` : ""}).`);
            }
        }
        const minBoxes = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].MIN_BOXES[Math.min(bedroomCount, 5)] || 10;
        if (inputs.packingLevel !== "None" && !isTinyScope) {
            const boxDeficit = Math.max(0, minBoxes - parsed.boxCount);
            if (boxDeficit > 0) {
                const boxFactor = inventoryCompleteness === "detailed" ? 0.20 : inventoryCompleteness === "coarse" ? 0.40 : 0.60;
                const boxCap = bedroomCount <= 1 ? 15 : bedroomCount === 2 ? 20 : bedroomCount === 3 ? 30 : bedroomCount === 4 ? 40 : 50;
                missingBoxesCount = Math.min(boxCap, Math.ceil(boxDeficit * boxFactor));
                if (inventoryCompleteness === "sparse" && baseHomeHiddenVolume > 0) missingBoxesCount = Math.ceil(missingBoxesCount * 0.5);
                else if (hiddenVolume > 0) missingBoxesCount = Math.ceil(missingBoxesCount * 0.6);
                if (missingBoxesCount > 0) {
                    missingBoxesCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roundUpTo"])(missingBoxesCount, 5);
                    hiddenVolume += missingBoxesCount * 5;
                    notes.auditSummary.push(`Added ${missingBoxesCount} boxes (${inventoryCompleteness === "sparse" ? "coverage gap" : `${inventoryCompleteness} inventory coverage`}).`);
                }
            }
        } else if (!isTinyScope && !microDetailedLocal) {
            const softCap = Math.min(minBoxes, parsed.boxCount + 10);
            const softDeficit = Math.max(0, softCap - parsed.boxCount);
            if (softDeficit > 0) {
                const softBoxFactor = inventoryCompleteness === "detailed" ? 0.10 : inventoryCompleteness === "coarse" ? 0.20 : 0.35;
                const softBoxCap = bedroomCount <= 1 ? 5 : bedroomCount === 2 ? 10 : bedroomCount === 3 ? 15 : 20;
                missingBoxesCount = Math.min(softBoxCap, Math.ceil(softDeficit * softBoxFactor));
                if (inventoryCompleteness === "sparse" && baseHomeHiddenVolume > 0) missingBoxesCount = Math.ceil(missingBoxesCount * 0.5);
                else if (hiddenVolume > 0) missingBoxesCount = Math.ceil(missingBoxesCount * 0.6);
                if (missingBoxesCount > 0) {
                    missingBoxesCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roundUpTo"])(missingBoxesCount, 5);
                    hiddenVolume += missingBoxesCount * 5;
                    notes.auditSummary.push(`Soft top-up +${missingBoxesCount} boxes (${inventoryCompleteness === "sparse" ? "coverage gap" : `${inventoryCompleteness} inventory coverage`}).`);
                }
            }
        }
    } else if (parsed.totalVol > 0) {
        if (inventoryCompleteness === "sparse" || commercialSubtype === "office_light") {
            const commercialBaseline = commercialSubtype === "office_light" ? inventoryCompleteness === "detailed" ? 0 : inventoryCompleteness === "coarse" ? 75 : 125 : 200;
            hiddenVolume += commercialBaseline;
            if (commercialBaseline > 0) {
                notes.auditSummary.push(`Added +${commercialBaseline} cf (${commercialSubtype === "office_light" ? `${inventoryCompleteness} office inventory` : "sparse commercial inventory"}).`);
            }
        }
        const shouldAddCommercialBoxTopUp = parsed.boxCount === 0 && parsed.totalVol > 500 && !(commercialSubtype === "office_light" && inputs.packingLevel === "None") && !(commercialSubtype === "warehouse" && /\bpallet\b|\bskid\b|\brack\b|\bbin\b/i.test(inputs.inventoryText));
        if (shouldAddCommercialBoxTopUp) {
            const commercialBoxFactor = inventoryCompleteness === "detailed" ? 0.25 : inventoryCompleteness === "coarse" ? 0.50 : 0.75;
            missingBoxesCount = Math.ceil(parsed.totalVol * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].COMMERCIAL_BOX_RATIO / 5 * commercialBoxFactor);
            if (missingBoxesCount > 0) missingBoxesCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roundUpTo"])(missingBoxesCount, 5);
            hiddenVolume += missingBoxesCount * 5;
            if (missingBoxesCount > 0) notes.auditSummary.push(`Added ${missingBoxesCount} boxes (${inventoryCompleteness} commercial coverage).`);
        }
    }
    if (parsed.mentionsGarageOrAttic) {
        const baseZoneHiddenVolume = inventoryCompleteness === "detailed" ? 50 : inventoryCompleteness === "coarse" ? 100 : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].HIDDEN_VOL_GARAGE;
        const zoneHiddenVolume = inventoryCompleteness === "sparse" && baseHomeHiddenVolume > 0 ? Math.max(50, (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roundUpTo"])(baseZoneHiddenVolume * 0.5, 25)) : baseZoneHiddenVolume;
        hiddenVolume += zoneHiddenVolume;
        notes.auditSummary.push(`Added +${zoneHiddenVolume} cf (${inventoryCompleteness === "sparse" ? "zones mentioned" : `zones mentioned, ${inventoryCompleteness} inventory`}).`);
    }
    if (!isLD && !isCommercial && bedroomCount >= 4 && parsed.mentionsGarageOrAttic && storageHeavyTruckPieceQty >= __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].STORAGE_HEAVY_TRUCK_MIN_PIECES) {
        const storageHeavyMixHV = inventoryCompleteness === "detailed" ? 125 : inventoryCompleteness === "coarse" ? 200 : 250;
        hiddenVolume += storageHeavyMixHV;
        notes.auditSummary.push(`Added +${storageHeavyMixHV} cf (heavy garage/gym/storage mix).`);
    }
    if (isLD && bedroomCount >= 3 && largeInventoryForLD && storageFurnitureQty >= 4 && !storageContentsHandled && parsed.boxCount < Math.max(20, storageFurnitureQty * 2) && boxCoverage < 0.65) {
        const cabinetContentsHV = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roundUpTo"])(Math.min(75, storageFurnitureQty * 5), 25);
        hiddenVolume += cabinetContentsHV;
        notes.auditSummary.push(`Added +${cabinetContentsHV} cf (LD cabinet contents risk).`);
    }
    if (ldFullPackLargeHome) {
        let ldFullPackPrepHV = bedroomCount >= 5 ? 100 : 75;
        if (ldFullPackComplexityScore >= 3) ldFullPackPrepHV += 25;
        if (ldFullPackComplexityScore >= 5) ldFullPackPrepHV += 25;
        hiddenVolume += ldFullPackPrepHV;
        notes.auditSummary.push(`Added +${ldFullPackPrepHV} cf (LD full-pack prep).`);
    }
    let llPct = isLD ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LL_LD : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LL_STANDARD;
    if (highConfidenceDetailedInventory) {
        llPct = isLD ? 0.02 : 0.10;
        notes.auditSummary.push(`Loose load base reduced (${isLD ? "detailed LD inventory" : "detailed local inventory"}).`);
    } else if (microDetailedLocal) {
        llPct = 0.05;
        notes.auditSummary.push("Loose load base reduced (micro local inventory).");
    }
    const llBasePct = llPct;
    const irregularRatio = parsed.detectedQtyTotal > 0 ? parsed.irregularCount / parsed.detectedQtyTotal : 0;
    const vagueHandledByHV = inventoryCompleteness === "sparse" && (baseHomeHiddenVolume > 0 || missingBoxesCount > 0 || parsed.mentionsGarageOrAttic);
    const llReasons = [];
    if (hasVague && !vagueHandledByHV) {
        llPct += __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LL_VAGUE;
        llReasons.push("vague inventory");
    }
    if (irregularRatio > 0.15) {
        llPct += __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LL_IRREGULAR;
        llReasons.push("bulky items");
    } else if (parsed.irregularCount > 0) {
        const shouldAddSmallIrregularUplift = !highConfidenceDetailedInventory || parsed.irregularCount >= 3 || irregularRatio >= 0.05;
        if (shouldAddSmallIrregularUplift) {
            const irregularUplift = isLD && bedroomCount < 3 ? 0.05 : 0.10;
            llPct += irregularUplift;
            llReasons.push("irregular items");
        }
    }
    llPct = Math.min(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].LL_CAP, llPct);
    const appliedLLDelta = Math.max(0, llPct - llBasePct);
    if (appliedLLDelta > 0 && llReasons.length > 0) {
        notes.auditSummary.push(`Loose load +${Math.round(appliedLLDelta * 100)}% (${llReasons.join(", ")}).`);
    }
    const round25 = (num)=>Math.round(num / 25) * 25;
    const rawVolume = parsed.totalVol + hiddenVolume;
    const billableCF = round25(rawVolume * 1.05);
    const truckSpaceCF = round25(billableCF * (1 + llPct));
    let finalVolume = truckSpaceCF;
    let volumeOverridden = false;
    if (overrides.volume !== undefined && overrides.volume !== null) {
        const overriddenVolume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["parseOverrideValue"])(overrides.volume, 1, 10000);
        if (overriddenVolume !== null) {
            finalVolume = overriddenVolume;
            notes.overridesApplied.push("volume");
            notes.auditSummary.push(`Manager Override: Volume = ${finalVolume} cf`);
            volumeOverridden = true;
        }
    }
    if (!volumeOverridden) finalVolume = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["roundUpTo"])(finalVolume, 25);
    const weight = Math.round(finalVolume * __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$config$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["PROTOCOL"].WEIGHT_STD);
    notes.logs.push(`Raw Inventory: ${rawVolume} cf.`);
    notes.logs.push(`Net Total (+5% broker safety, rounded to 25): ${billableCF} cf.`);
    notes.logs.push(`Actual Space (+LL gaps, rounded to 25): ${truckSpaceCF} cf.`);
    return {
        hiddenVolume,
        missingBoxesCount,
        llPct,
        rawVolume,
        billableCF,
        truckSpaceCF,
        finalVolume,
        weight
    };
}
}),
"[project]/lib/engine.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildEstimate",
    ()=>buildEstimate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/context.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$finalize$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/finalize.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$labor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/labor.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$trucks$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/trucks.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$volume$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/engine/volume.ts [app-rsc] (ecmascript)");
;
;
;
;
;
;
function createEngineNotes() {
    return {
        logs: [],
        risks: [],
        auditSummary: [],
        advice: [],
        overridesApplied: []
    };
}
function buildEstimate(inputs, normalizedRows, overridesObj) {
    try {
        const notes = createEngineNotes();
        const overrides = overridesObj || inputs?.overrides || {};
        const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$context$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildEngineContext"])(inputs, normalizedRows, overrides, notes);
        const volumePlan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$volume$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeVolumePlan"])(context);
        const truckPlan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$trucks$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeTruckPlan"])(context, volumePlan);
        const laborPlan = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$labor$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["computeLaborPlan"])(context, volumePlan, truckPlan);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2f$finalize$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildEstimateResult"])(context, volumePlan, truckPlan, laborPlan);
    } catch (err) {
        console.error("Engine Crash:", err);
        throw err instanceof Error ? err : new Error("Unknown engine crash");
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

/* __next_internal_action_entry_do_not_use__ [{"009047fe9654c828be38ae390f3e769d9da2b28fc6":"fetchHistoryAction","401d8558eef460ef18bba5ec1a7440887feeffe2d0":"suggestItemsAction","4089042fcfa95524a198dab65b9211a1727afade48":"deleteEstimateAction","40a2a3c7a7350b88dcbccdc99138858016913e31d8":"loadEstimateAction","40cd010855f5e8ccc19d46ab8b3c76e9d625791c7c":"normalizeInventoryAction","40dba74bf828995a737e94833644634fb9dd7802f5":"resolveItemAction","70b2c43613fd9c55ad336729f9ab21b36445befadb":"getEstimate","7c88bc1bbe9beb9a3b44b7dcede4cf3f195b45cf67":"saveEstimateAction"},"",""] */ __turbopack_context__.s([
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
const HOME_SIZE_OPTIONS = new Set([
    "1",
    "2",
    "3",
    "4",
    "5",
    "Commercial"
]);
const MOVE_TYPE_OPTIONS = new Set([
    "Local",
    "LD",
    "Labor"
]);
const PACKING_LEVEL_OPTIONS = new Set([
    "None",
    "Partial",
    "Full"
]);
const ACCESS_OPTIONS = new Set([
    "ground",
    "elevator",
    "stairs"
]);
const OVERRIDE_KEYS = new Set([
    "volume",
    "trucks",
    "crew",
    "timeMin",
    "timeMax",
    "blankets",
    "boxes"
]);
const MAX_INVENTORY_CHARS = 12000;
const MAX_EXTRA_STOPS = 4;
const MAX_ROWS = 500;
function sanitizeInventoryMode(mode) {
    return mode === "normalized" ? "normalized" : "raw";
}
function normalizeLegacyMoveType(moveType) {
    return moveType === "LD" || moveType === "Labor" ? moveType : "Local";
}
function sanitizeEstimateInputs(inputs, inventoryMode) {
    const requestedMoveType = String(inputs.moveType ?? "");
    const safeMoveType = MOVE_TYPE_OPTIONS.has(requestedMoveType) ? requestedMoveType : normalizeLegacyMoveType(requestedMoveType);
    const safeInventoryMode = inventoryMode ?? sanitizeInventoryMode(inputs.inventoryMode);
    const normalizedHomeSize = inputs.homeSize === "0" ? "1" : inputs.homeSize;
    const safeAccessOrigin = ACCESS_OPTIONS.has(inputs.accessOrigin) ? inputs.accessOrigin : "ground";
    const safeAccessDest = safeMoveType === "Local" && ACCESS_OPTIONS.has(inputs.accessDest) ? inputs.accessDest : "ground";
    const extraStops = Array.isArray(inputs.extraStops) ? inputs.extraStops.slice(0, MAX_EXTRA_STOPS).map((stop)=>({
            label: String(stop?.label ?? "").trim().slice(0, 30),
            access: ACCESS_OPTIONS.has(stop?.access) ? stop.access : "ground"
        })) : [];
    return {
        homeSize: HOME_SIZE_OPTIONS.has(normalizedHomeSize) ? normalizedHomeSize : "3",
        moveType: safeMoveType,
        distance: String((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clampInt"])(inputs.distance, 0, 10000)),
        packingLevel: PACKING_LEVEL_OPTIONS.has(inputs.packingLevel) ? inputs.packingLevel : "None",
        accessOrigin: safeAccessOrigin,
        accessDest: safeAccessDest,
        inventoryText: String(inputs.inventoryText ?? "").slice(0, MAX_INVENTORY_CHARS),
        inventoryMode: safeInventoryMode,
        normalizedRows: undefined,
        overrides: undefined,
        extraStops
    };
}
function sanitizeNormalizedRows(rows) {
    if (!Array.isArray(rows)) return [];
    return rows.slice(0, MAX_ROWS).map((row, index)=>({
            id: String(row?.id ?? `row_${index}`).slice(0, 120),
            name: String(row?.name ?? "").trim().slice(0, 120),
            qty: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clampInt"])(row?.qty ?? 1, 1, 500),
            cfUnit: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["clampInt"])(row?.cfUnit ?? 1, 1, 500),
            raw: String(row?.raw ?? "").slice(0, 240),
            room: String(row?.room ?? "").trim().slice(0, 80),
            flags: {
                heavy: !!row?.flags?.heavy,
                heavyWeight: !!row?.flags?.heavyWeight
            }
        })).filter((row)=>row.name.length > 0);
}
function sanitizeOverrides(overrides) {
    if (!overrides) return {};
    return Object.fromEntries(Object.entries(overrides).filter(([key])=>OVERRIDE_KEYS.has(key)).map(([key, value])=>[
            key,
            String(value ?? "").trim().slice(0, 8)
        ]).filter(([, value])=>value.length > 0));
}
function buildTrustedEstimate(inputs, normalizedRows, overrides) {
    const safeInventoryMode = sanitizeInventoryMode(inputs.inventoryMode);
    const safeInputs = sanitizeEstimateInputs(inputs, safeInventoryMode);
    const safeRows = sanitizeNormalizedRows(normalizedRows);
    const safeOverrides = sanitizeOverrides(overrides);
    const estimate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$engine$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["buildEstimate"])({
        ...safeInputs,
        inventoryMode: safeInventoryMode
    }, safeInventoryMode === "normalized" ? safeRows : undefined, safeOverrides);
    return {
        estimate,
        inputs: safeInputs,
        normalizedRows: safeRows,
        overrides: safeOverrides
    };
}
async function getEstimate(inputs, normalizedRows, overrides) {
    return buildTrustedEstimate(inputs, normalizedRows, overrides).estimate;
}
async function normalizeInventoryAction(text) {
    const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$parser$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeRowsFromText"])(String(text ?? "").slice(0, MAX_INVENTORY_CHARS));
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
async function saveEstimateAction(clientName, inputs, normalizedRows, inventoryMode, overrides) {
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
        const safeClientName = clientName.trim().slice(0, 120);
        const { estimate, inputs: safeInputs, normalizedRows: safeRows, overrides: safeOverrides } = buildTrustedEstimate({
            ...inputs,
            inventoryMode
        }, normalizedRows, overrides);
        const { homeSize, moveType, distance, packingLevel, accessOrigin, accessDest, inventoryText, extraStops } = safeInputs;
        const inputsState = {
            inputs: {
                homeSize,
                moveType,
                distance,
                packingLevel,
                accessOrigin,
                accessDest,
                inventoryText,
                extraStops
            },
            normalizedRows: safeRows,
            inventoryMode: safeInputs.inventoryMode ?? "raw",
            overrides: safeOverrides
        };
        const payload = {
            manager_id: user.id,
            client_name: safeClientName,
            final_volume: estimate.finalVolume,
            net_volume: estimate.netVolume || null,
            truck_space_cf: estimate.truckSpaceCF || null,
            inputs_state: inputsState
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
            move_type: item.inputs_state?.inputs?.moveType ? normalizeLegacyMoveType(String(item.inputs_state.inputs.moveType)) : null
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
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveEstimateAction, "7c88bc1bbe9beb9a3b44b7dcede4cf3f195b45cf67", null);
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
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/estimate.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/auth.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/estimate.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/auth.ts [app-rsc] (ecmascript)");
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
"[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/estimate.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/app/actions/auth.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
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
    "40cd010855f5e8ccc19d46ab8b3c76e9d625791c7c",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["normalizeInventoryAction"],
    "40dba74bf828995a737e94833644634fb9dd7802f5",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["resolveItemAction"],
    "70b2c43613fd9c55ad336729f9ab21b36445befadb",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getEstimate"],
    "7c88bc1bbe9beb9a3b44b7dcede4cf3f195b45cf67",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveEstimateAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/estimate.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/app/actions/auth.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$estimate$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/estimate.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/auth.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_3237b9c7._.js.map