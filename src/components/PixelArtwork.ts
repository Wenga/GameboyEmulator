export const COLOR_PALETTE: Record<string, string> = {
  // Transparent / spaces
  '.': 'transparent',
  ' ': 'transparent',
  
  // Outer Outlines (Classic pixel black outlines)
  'Y': '#171217', 
  
  // Character colors (Cozy Teal sweater style)
  'H': '#503026', // Brown Hair
  'P': '#ffcab2', // Skin Peach
  'B': '#4167a3', // Sweater Blue
  'K': '#1a1d2e', // Pants Dark Blue
  'S': '#503026', // Brown Boots
  'W': '#ffffff', // Eye/Highlight White
  
  // Orange Cat (With clean black outline)
  'O': '#ea7538', // Orange Body
  'D': '#a24922', // Dark Orange shadow
  'L': '#ffe1cd', // Cream chest/paws
  'p': '#ff8e9b', // Pink nose
  
  // Grey Cat 
  'g': '#7fa1b6', // Grey Body
  'e': '#486273', // Dark Grey shadow
  'm': '#d3dfeb', // Light Grey cream
  
  // Kitchen White cooker / countertop
  'fc': '#def0f6', // Cooker body
  'gr': '#22242b', // Kitchen charcoal
  'ac': '#adcaca', // Steel highlight
  'rd': '#c44038', // Toaster/accent red
  
  // Dice & Pedestal Table (Center Zone)
  'T1': '#633931', // Table Wood Warm Brown
  'T2': '#40221c', // Table Wood Dark Shadow
  'X1': '#ff945b', // Peach/Orange plaid stripe
  'X2': '#adcaca', // Light Blue/teal stripe
  'X3': '#ffffff', // Plaid White
  'x': '#ffd85d',  // Dice numbers gold accent
  'd': '#ffffff',  // Dice face
  's': '#adcaca',  // Dice shadow
  'R': '#c44038',  // Dice dots red
  
  // Cauldron Fire Hearth (Sofa Replacement in Zone 3)
  'C1': '#1e2022', // Cauldron Matte Black
  'C2': '#44464d', // Cauldron highlight
  'F1': '#8a4f3e', // Fire Wood log brown
  'F2': '#d4453c', // Warm Hearth Red platform
  'F3': '#ffd85d', // Glowing ember yellow
  
  // Plants & Flowers
  'y': '#468648', // Plant Green
  'j': '#235025', // Dark green shadow
  'c': '#d07156', // Clay pot terracotta

  // New Packed Props Colors Grouping
  'fr': '#8ba2b5', // Retro Fridge Grey Blue
  'fd': '#5b7185', // Retro Fridge Dark shading
  'mg': '#dc362c', // Bright red fridge magnet
  'mb': '#3e73a8', // Bright blue fridge magnet
  'my': '#dfa237', // Bright yellow fridge magnet
  'mw': '#ffffff', // Notes paper white
  
  'ye': '#ffe07d', // Golden lamp warm glow light cone
  'yl': '#fff4bb', // Very light focus center of lamp
  'br': '#a3633b', // Brass / wood light pole brown
  'lp': '#e6ab33', // Brass lamp shade gold
  
  'or': '#df9127', // Clock Golden Frame
  'dg': '#a85b14', // Clock Gold Shadow
  
  'cr': '#9a6dbf', // Magically glowing amethyst purple crystal
  'cs': '#603185', // Shadow for mineral amethyst

  // Room map asset set
  'q': '#f3ead8', // warm cream
  'u': '#d6d6d6', // counter light grey
  'v': '#8ba2b5', // appliance blue grey
  'z': '#9d7656', // warm wood
  'a': '#684c37', // dark wood
  'n': '#2a2a2a', // charcoal
  'h': '#c27ab5', // pink bubble shadow
  'r': '#d4453c', // warm red accent
  'M': '#101214', // espresso machine black
  'G': '#303337', // espresso machine highlight
  'U': '#777b7e', // brushed steel
  'I': '#fff0d1', // gauge/cup cream
  'V': '#f26a2e', // hot indicator orange
  'E': '#4f9b2d', // ready indicator green
  'Q': '#7a3d16', // coffee fill
};

// Character sprite matrix (14 px wide x 15 px high)
// Styled to look like a polished cozy RPG character with outlines
export const PLAYER_SPRITES: Record<string, string[]>[] = [
  // Frame 0: Idle
  {
    down: [
      "    YYYYYY    ",
      "   YHHHHHHY   ",
      "  YHHHHHHHHY  ",
      "  YHPYPPYPHY  ",
      "  YPPPPPPPPY  ",
      "   YPPPPPPY   ",
      "   YBBBBBBY   ",
      "  YBBBBBBBBY  ",
      "  YBBWBBWBYY  ",
      "  YBBBBBBBBY  ",
      "  YKKKKKKKKY  ",
      "   YKKKKKKY   ",
      "   YPP  PPY   ",
      "   YPP  PPY   ",
      "  YSSS  SSSY  "
    ],
    up: [
      "    YYYYYY    ",
      "   YHHHHHHY   ",
      "  YHHHHHHHHY  ",
      "  YHHHHHHHHY  ",
      "   YHHHHHHY   ",
      "   YBBBBBBY   ",
      "  YBBBBBBBBY  ",
      "  YBBBBBBBBY  ",
      "  YBBBBBBBBY  ",
      "  YKKKKKKKKY  ",
      "   YKKKKKKY   ",
      "   YKKKKKKY   ",
      "   YPP  PPY   ",
      "   YPP  PPY   ",
      "  YSSS  SSSY  "
    ],
    left: [
      "    YYYYY     ",
      "   YHHHHHY    ",
      "  YHPYPPYY    ",
      "  YPPPPPY     ",
      "   YPPPPY     ",
      "   YBBBBY     ",
      "  YBBBBBBY    ",
      "  YBBBBBBY    ",
      "  YBBBBBBY    ",
      "  YKKKKKKY    ",
      "   YKKKKY     ",
      "   YKKKKY     ",
      "   YPP PPY    ",
      "   YPP PPY    ",
      "  YSSS SSSY   "
    ],
    right: [
      "     YYYYY    ",
      "    YHHHHHY   ",
      "    YYPPYPHY  ",
      "     YPPPPPY  ",
      "     YPPPPY   ",
      "     YBBBBY   ",
      "    YBBBBBBY  ",
      "    YBBBBBBY  ",
      "    YBBBBBBY  ",
      "    YKKKKKKY  ",
      "     YKKKKY   ",
      "     YKKKKY   ",
      "    YPP PPY   ",
      "    YPP PPY   ",
      "   YSSS SSSY  "
    ]
  },
  // Frame 1: Walk Cycle 1
  {
    down: [
      "    YYYYYY    ",
      "   YHHHHHHY   ",
      "  YHHHHHHHHY  ",
      "  YHPYPPYPHY  ",
      "  YPPPPPPPPY  ",
      "   YPPPPPPY   ",
      "   YBBBBBBY   ",
      "  YBBBBBBBBY  ",
      "  YBBWBBWBYY  ",
      "  YBBBBBBBBY  ",
      "  YKKKKKKKKY  ",
      "   YKKKKKKY   ",
      "   YPP        ",
      "   YPP   PPY  ",
      "  YSSS  SSSY  "
    ],
    up: [
      "    YYYYYY    ",
      "   YHHHHHHY   ",
      "  YHHHHHHHHY  ",
      "  YHHHHHHHHY  ",
      "   YHHHHHHY   ",
      "   YBBBBBBY   ",
      "  YBBBBBBBBY  ",
      "  YBBBBBBBBY  ",
      "  YBBBBBBBBY  ",
      "  YKKKKKKKKY  ",
      "   YKKKKKKY   ",
      "   YPP        ",
      "   YPP   PPY  ",
      "  YSSS  SSSY  "
    ],
    left: [
      "    YYYYY     ",
      "   YHHHHHY    ",
      "  YHPYPPYY    ",
      "  YPPPPPY     ",
      "   YPPPPY     ",
      "   YBBBBY     ",
      "  YBBBBBBY    ",
      "  YBBBBBBY    ",
      "   YBBBBY     ",
      "  YKKKKY      ",
      "  YKKKKY      ",
      "  YK  KY      ",
      "  YP  Y       ",
      "  YP  PY      ",
      " YSS  SSSY    "
    ],
    right: [
      "     YYYYY    ",
      "    YHHHHHY   ",
      "    YYPPYPHY  ",
      "     YPPPPPY  ",
      "     YPPPPY   ",
      "     YBBBBY   ",
      "    YBBBBBBY  ",
      "    YBBBBBBY  ",
      "     YBBBBY   ",
      "      YKKKKY  ",
      "      YKKKKY  ",
      "      YK  KY  ",
      "       Y  PY  ",
      "      YP  PY  ",
      "    YSS  SSSY "
    ]
  },
  // Frame 2: Walk Cycle 2
  {
    down: [
      "    YYYYYY    ",
      "   YHHHHHHY   ",
      "  YHHHHHHHHY  ",
      "  YHPYPPYPHY  ",
      "  YPPPPPPPPY  ",
      "   YPPPPPPY   ",
      "   YBBBBBBY   ",
      "  YBBBBBBBBY  ",
      "  YBBWBBWBYY  ",
      "  YBBBBBBBBY  ",
      "  YKKKKKKKKY  ",
      "   YKKKKKKY   ",
      "         PPY  ",
      "   YPP   PPY  ",
      "  YSSS  SSSY  "
    ],
    up: [
      "    YYYYYY    ",
      "   YHHHHHHY   ",
      "  YHHHHHHHHY  ",
      "  YHHHHHHHHY  ",
      "   YHHHHHHY   ",
      "   YBBBBBBY   ",
      "  YBBBBBBBBY  ",
      "  YBBBBBBBBY  ",
      "  YBBBBBBBBY  ",
      "  YKKKKKKKKY  ",
      "   YKKKKKKY   ",
      "         PPY  ",
      "   YPP   PPY  ",
      "  YSSS  SSSY  "
    ],
    left: [
      "    YYYYY     ",
      "   YHHHHHY    ",
      "  YHPYPPYY    ",
      "  YPPPPPY     ",
      "   YPPPPY     ",
      "   YBBBBY     ",
      "  YBBBBBBY    ",
      "  YBBBBBBY    ",
      "   YBBBBY     ",
      "  YKKKKY      ",
      "  YKKKKY      ",
      "   YK  Y      ",
      "   YP  Y      ",
      "  YPP  Y      ",
      " YSSS  SSY    "
    ],
    right: [
      "     YYYYY    ",
      "    YHHHHHY   ",
      "    YYPPYPHY  ",
      "     YPPPPPY  ",
      "     YPPPPY   ",
      "     YBBBBY   ",
      "    YBBBBBBY  ",
      "    YBBBBBBY  ",
      "     YBBBBY   ",
      "      YKKKKY  ",
      "      YKKKKY  ",
      "      YK  KY  ",
      "      YP  PY  ",
      "      YP   Y  ",
      "    YSS  SSSY "
    ]
  }
];

// Coffee counter accessories / kettle and toaster (20px x 16px)
export const COFFEE_MACHINE = [
  "       YY      YY   ",
  "       YWY    YWY   ",
  "   YYYYYYYYYYYYYY   ",
  "  YgrgrgrgrgrgrgrY  ",
  "  YgrYYYYYYYYYYgrY  ",
  "  YgrYWWWWWWWWYgrY  ",
  "  YgrYWWWWWWWWYgrY  ",
  "  YgrYWWWWWWWWYgrY  ",
  "  YgrYYYYYYYYYYgrY  ",
  "  YYYYYYYYYYYYYY   ",
  "   YacacacacacY     ",
  "   YacYrdYacacY     ",
  "   YacYYYYacacY     ",
  "   YacacacacacY     ",
  "   YYYYYYYYYYYY     ",
  "                    "
];

// Checked dining wood table with dice support (22px x 16px)
export const DICE_PEDESTAL = [
  " YYYYYYYYYYYYYYYYYYYY ",
  "YXX3XX3XX3XX3XX3XX3XXY",
  "Y1X2X1X2X1X2X1X2X1X2XY",
  "YXX3XX3XX3XX3XX3XX3XXY",
  "Y1X2X1X2X1X2X1X2X1X2XY",
  "YXX3XX3XX3XX3XX3XX3XXY",
  " YTTTTTTTTTTTTTTTTTTY ",
  "  YTTTTTTTTTTTTTTTTY  ",
  "   YTT2TTTTTTTT2TTY   ",
  "   YT1  YT1  YTT  Y   ",
  "   YT1   YT1 YT1  Y   ",
  "   YT1   YT1 YT1  Y   ",
  "   YT1   YT1 YT1  Y   ",
  "   YT1   YT1 YT1  Y   ",
  "  YTT1  YTT1YTT1  Y   ",
  "  YYYY  YYYYYYYY  Y   "
];

// Orange Cat sitting sleeping (With outlines)
export const CAT_ORANGE_SLEEP = [
  "     YYYY       ",
  "    YOOOOpYY    ",
  "   YOOOOOYYYY   ",
  "  YOOOOOOOOY    ",
  " YODDDDOODOY    ",
  "YDDDDDDDOOYY    ",
  "YDDDDDDDDOY     ",
  " YDDDDDDDY      ",
  "  YYYYYYY       "
];

// Orange Cat awake staring (With outlines)
export const CAT_ORANGE_AWAKE = [
  "   Y   Y        ",
  "  YoYpYoY       ",
  "  YOWOWOY       ",
  "  YLLLLOY       ",
  "   YLLLY        ",
  "  YLLLLOY       ",
  " YOOOOOOOY      ",
  " YOODDDDOOY  YY ",
  " YDDDDDDODDYODY ",
  " YDDDDDDDDDYODY ",
  "  YDDDDDDDDY    ",
  "   YDDDDDDY     ",
  "   YDD YDDY     ",
  "   YYYYYYYY     "
];

// Grey Cat Sitting licking paw (With outlines)
export const CAT_GREY_SIT = [
  "    Y    Y        ",
  "   YgYppYgY       ",
  "  YggWmmWggY      ",
  "  YggmpmmggY      ",
  "   YgmmmmgY       ",
  "  YggmmmmggY      ",
  " YgggeeeegggY     ",
  " YggeeeeeeggY  YY ",
  " YeeeeeeeeegYeeY  ",
  " YeeeeeeeeeeeegY  ",
  "  YeeeeeeeeeeegY  ",
  "   YeeeeeeeeegY   ",
  "   YeeY  YeeY     ",
  "   YYYY  YYYY     "
];

// Grey Cat Stretch (With outlines)
export const CAT_GREY_STRETCH = [
  "        Y    Y      ",
  "       YgYppYgY     ",
  "       YgWmmWgY     ",
  "  YY   YgmpmgY      ",
  " Ygg YggmmmggY      ",
  " YgggggggggggY      ",
  "  YeeeeeeeeeeeY     ",
  "   YeeeeeeeeeeY     ",
  "    YeeY  YeeY      ",
  "    YYYY  YYYY      "
];

// Mini Dice faces 1 to 6 (10x10 px)
export const MINI_DICE_FACES: Record<number, string[]> = {
  1: [
    "YYYYYYYYYY",
    "YddddddddY",
    "Yd      dY",
    "Yd  RR  dY",
    "Yd  RR  dY",
    "Yd      dY",
    "Yd      dY",
    "YddddddddY",
    "YYYYYYYYYY",
    " sssssssss"
  ],
  2: [
    "YYYYYYYYYY",
    "Yd RR   dY",
    "Yd RR   dY",
    "Yd      dY",
    "Yd      dY",
    "Yd   RR dY",
    "Yd   RR dY",
    "YddddddddY",
    "YYYYYYYYYY",
    " sssssssss"
  ],
  3: [
    "YYYYYYYYYY",
    "Yd RR   dY",
    "Yd RR   dY",
    "Yd  RR  dY",
    "Yd  RR  dY",
    "Yd   RR dY",
    "Yd   RR dY",
    "YddddddddY",
    "YYYYYYYYYY",
    " sssssssss"
  ],
  4: [
    "YYYYYYYYYY",
    "Yd RR RRdY",
    "Yd RR RRdY",
    "Yd      dY",
    "Yd      dY",
    "Yd RR RRdY",
    "Yd RR RRdY",
    "YddddddddY",
    "YYYYYYYYYY",
    " sssssssss"
  ],
  5: [
    "YYYYYYYYYY",
    "Yd RR RRdY",
    "Yd RR RRdY",
    "Yd  RR  dY",
    "Yd  RR  dY",
    "Yd RR RRdY",
    "Yd RR RRdY",
    "YddddddddY",
    "YYYYYYYYYY",
    " sssssssss"
  ],
  6: [
    "YYYYYYYYYY",
    "Yd RR RRdY",
    "Yd RR RRdY",
    "Yd RR RRdY",
    "Yd RR RRdY",
    "Yd RR RRdY",
    "Yd RR RRdY",
    "YddddddddY",
    "YYYYYYYYYY",
    " sssssssss"
  ]
};

export const ROOM_COFFEE_MACHINE = [
  "..YYYYYYYYYYYY..",
  ".YMMMMMMMMMMMMY.",
  "YMMGGGGGGGGGGMMY",
  "YMVMMMMIIMMMEMMY",
  "YMMMMMIYYIMMMMMY",
  "YMMMMMYIIYMMMMMY",
  "YMMYYMMMYYMMMYY.",
  "YMMzzaYYYYUUMY..",
  "YMMzaaaYUUUUMY..",
  "YMMMMMMYUUMMMY..",
  "YMMMGMMYYYYMMY..",
  "YMMGMMYIQQIYMY..",
  "YMMMMMYIQQIYMY..",
  "YMMMMMMYYYYMMY..",
  ".YMGGGMGGGGMY...",
  "..YYYYYYYYYY....",
];

export const ROOM_SINK = [
  "                                ",
  "   YYYYYYYYYYYYYYYYYYYYYYYYYY   ",
  "  YYqqqqqqqqqqqqqqqqqqqqqqqqYY  ",
  "  YqQQYqqYUUUYqqqYYYYYYYYYqqY  .",
  "  YqQIQYqYUGUYqqYUUUUUUUUUYqY  .",
  "  YqQQYqqYUUUYqYUGGGGGGGGUYqY  .",
  "  YqqqqqqqqYUUYYYUGUUUUUGUYqY  .",
  "  YqqqqqqqqYUWWUUUGUUUUUGUYqY  .",
  "  YqqqqqqqqYUUUUUUGUWWUUGUYqY  .",
  "  YqqqqqqqqqYYYYYUGUUUUUGUYqY  .",
  "  YqqqqqqqqqqqqqYUGUUUUUGUYqY  .",
  "  YqqqqqqqqqqqqqYUGGGGGGGUYqY  .",
  "  YqqqqqqqqqqqqqqYUUUUUUUYqqY  .",
  "  YqqqqqqqqqqqqqqqYYYYYYYqqqY  .",
  "  YYqqqqqqqqqqqqqqqqqqqqqqqqYY  ",
  "   YYYYYYYYYYYYYYYYYYYYYYYYYY   ",
  "                                ",
  "                                ",
  "                                ",
  "                                ",
  "                                ",
  "                                ",
  "                                ",
  "                                ",
  "                                ",
  "                                ",
  "                                ",
  "                                ",
  "                                ",
  "                                ",
  "                                ",
  "                                ",
];

export const ROOM_STOVE_TOP = [
  "YYYYYYYYYYYYYYYYYYYYYYYY",
  "YqqqqqqqqqqqqqqqqqqqqqqY",
  "YqnnnnnnqqqqqqnnnnnnqqY".padEnd(24, " "),
  "YqnGGGnqqqqqqqnGGGnqqY".padEnd(24, " "),
  "YqnGWGnqqqqqqqnGWGnqqY".padEnd(24, " "),
  "YqnGGGnqqqqqqqnGGGnqqY".padEnd(24, " "),
  "YqnnnnnnqqqqqqnnnnnnqqY".padEnd(24, " "),
  "YqqqqqqqqUUUUqqqqqqqqY".padEnd(24, " "),
  "YqnnnnnnqUWWUqnnnnnnqY".padEnd(24, " "),
  "YqnGGGnqUWWUqnGGGnqY".padEnd(24, " "),
  "YqnGWGnqUUUUqnGWGnqY".padEnd(24, " "),
  "YqnnnnnnqrrrrqnnnnnnqY".padEnd(24, " "),
  "YqqqqqqqrrrrrrqqqqqqqY".padEnd(24, " "),
  "YqqqqqqqqqqqqqqqqqqqqY".padEnd(24, " "),
  "YYYYYYYYYYYYYYYYYYYYYYYY",
  "  YaaaaaaaaaaaaaaaaaaY  ",
];

export const ROOM_SOFA = [
  "  YYYYYYYYYYYYYYYYYYYYYYYYYYYY  ",
  " YYBBBBBBBBBBBBBBBBBBBBBBBBBBYY ",
  "YBBBWBBBBBBBBBBBBBBBBBBBBWBBBBY".padEnd(32, " "),
  "YBBBWWBBBBBBBBBBBBBBBBBBWWBBBBY".padEnd(32, " "),
  "YBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBY",
  "YBBBYYYYYYYYYYBBYYYYYYYYYYBBBBY".padEnd(32, " "),
  "YBBYBBBBBBBBBBYYBBBBBBBBBBYBBBY".padEnd(32, " "),
  "YBBYBBBBWBBBBBYYBBBBBWBBBBYBBBY".padEnd(32, " "),
  "YBBYBBBBBBBBBBYYBBBBBBBBBBYBBBY".padEnd(32, " "),
  "YBBBYYYYYYYYYYBBYYYYYYYYYYBBBBY".padEnd(32, " "),
  "YBKKKBBBBBBBBBBBBBBBBBBBBKKKBBY".padEnd(32, " "),
  "YBKKKBBBBBBBBBBBBBBBBBBBBKKKBBY".padEnd(32, " "),
  "YBBKBBBBBBBBBBBBBBBBBBBBBBKBBBY".padEnd(32, " "),
  "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY",
  "  YaaY                  YaaY  ".padEnd(32, " "),
  "  YYYY                  YYYY  ".padEnd(32, " "),
];

export const ROOM_FRIDGE = [
  "  YYYYYYYYYYYY  ",
  " YYvvvvvvvvvvYY ",
  "YvvvvvvvvvvvvvvY",
  "YvvvvvvvvvvvvvvY",
  "YvvvvvvWWvvvvvvY",
  "YvvvvvvWWvvvrrvY",
  "YvvvvvvvvvvvvvvY",
  "YvvvvvvvvvvvvvvY",
  "YYYYYYYYYYYYYYYY",
  "YvvvvvvvvvvvvvvY",
  "YvvuuuuuvvvvvvvY",
  "YvvunnnuvvvvvvvY",
  "YvvuuuuuvvvvyyvY",
  "YvvvvvvvvvvvvvvY",
  "YvvvvvvvvvvvvvvY",
  "YvvvvvvvvvvvvvvY",
  "YvvvvvvvvvvvvvvY",
  "YvvYnnYvvvvvvvvY",
  "YvvYnnYvvvvvvvvY",
  "YvvvvvvvvvvvvvvY",
  "YvvvvvvvvvvvvvvY",
  "YvvvvvvvvvvvvvvY",
  "YYYYYYYYYYYYYYYY",
  "  YY        YY  ",
];

export const ROOM_FRIDGE_SHORT = [
  "  YYYYYYYYYYYY  ",
  " YYvvvvvvvvvvYY ",
  "YvvvvvvvvvvvvvvY",
  "YvvvWWvvvvrrvvvY",
  "YvvvvvvvvvvvvvvY",
  "YvvvvvvvvvvmyvvY",
  "YvvvvvYnnYvvvvvY",
  "YYYYYYYYYYYYYYYY",
  "YvvvvvvvvvvvvvvY",
  "YvvuuuuuvvvvvvvY",
  "YvvunnnuvvWWvvvY",
  "YvvuuuuuvvvvvvvY",
  "YvvvvvvvvvvvvvvY",
  "YvvvYnnYvvvvvvvY",
  "YYYYYYYYYYYYYYYY",
  "  YY        YY  ",
];

export const ROOM_CAT_HOUSE = [
  "    YYYYYYYYYYYY    ",
  "   YzzzzzzzzzzzzY   ",
  "  YzzaaaaaaaaaazzY  ",
  " YzzaaazzzzzzaaazzY ",
  "YzzaazzzzzzzzzzaazzY",
  "YzzazzzqqqqqqzzzazzY",
  "YzzazzqhhhhhhqzzazzY",
  "YzzazzqYYYYYYqzzazzY",
  "YzzazzqYnnnnYqzzazzY",
  "YzzazzqYnnnnYqzzazzY",
  "YzzazzqYnnnnYqzzazzY",
  "YzzazzqYYYYYYqzzazzY",
  "YzzazzzqqqqqqzzzazzY",
  "YzzaaaaaaaaaaaaaazzY",
  "YzzzzzzzzzzzzzzzzzzY",
  "YYYYYYYYYYYYYYYYYYYY",
];

const islandRow = (...parts: string[]) => parts.join('').padEnd(96, ' ').slice(0, 96);

export const ROOM_KITCHEN_ISLAND = [
  islandRow('  ', 'Y'.repeat(92), '  '),
  islandRow(' Y', 'q'.repeat(90), 'Y '),
  islandRow('Y', 'q'.repeat(68), 'Y'.repeat(10), 'q'.repeat(1), 'YBWIYzIaYjWyY', 'Y'),
  islandRow('Y', 'q'.repeat(68), 'Y', 'y'.repeat(8), 'Y', 'q'.repeat(1), 'YBWIYzIaYjWyY', 'Y'),
  islandRow('Y', 'u'.repeat(68), 'Y', 'y'.repeat(8), 'Y', 'u'.repeat(1), 'YBWIYzIaYjWyY', 'Y'),
  islandRow('Y', 'u'.repeat(68), 'Y', 'j'.repeat(8), 'Y', 'u'.repeat(1), 'YBYYYaIaYjYYy', 'Y'),
  islandRow('Y', 'u'.repeat(68), 'Y', 'I'.repeat(9), 'Y', 'u'.repeat(1), 'YBYYYzIaYjYYy', 'Y'),
  islandRow('Y', 'u'.repeat(68), 'Y', 'z'.repeat(9), 'Y', 'u'.repeat(1), 'YBnBYzIaYjWyY', 'Y'),
  islandRow('Y', 'u'.repeat(68), 'Y', 'a'.repeat(9), 'Y', 'u'.repeat(1), 'Y'.repeat(13), 'Y'),
  islandRow('Y', 'u'.repeat(92), 'Y'),
  islandRow('Y', 'u'.repeat(14), 'W'.repeat(12), 'u'.repeat(17), 'W'.repeat(12), 'u'.repeat(37), 'Y'),
  islandRow('Y', 'u'.repeat(92), 'Y'),
  islandRow('Y', 'u'.repeat(16), 'q'.repeat(14), 'u'.repeat(17), 'q'.repeat(14), 'u'.repeat(31), 'Y'),
  islandRow('Y', 'u'.repeat(92), 'Y'),
  islandRow('Y', 'u'.repeat(9), 'q'.repeat(5), 'u'.repeat(17), 'q'.repeat(5), 'u'.repeat(17), 'q'.repeat(5), 'u'.repeat(34), 'Y'),
  islandRow('Y', 'q'.repeat(92), 'Y'),
  islandRow('  ', 'Y'.repeat(92), '  '),
  islandRow('  ', 'Y'.repeat(92), '  '),
  islandRow(' Y', 'q'.repeat(90), 'Y '),
  islandRow('Y', 'q'.repeat(8), 'Y'.repeat(18), 'q'.repeat(6), 'Y'.repeat(18), 'q'.repeat(6), 'Y'.repeat(18), 'q'.repeat(6), 'Y'.repeat(12), 'Y'),
  islandRow('Y', 'q'.repeat(8), 'Y', 'W'.repeat(16), 'Y', 'q'.repeat(6), 'Y', 'W'.repeat(16), 'Y', 'q'.repeat(6), 'Y', 'W'.repeat(16), 'Y', 'q'.repeat(6), 'Y', 'W'.repeat(10), 'Y'),
  islandRow('Y', 'q'.repeat(8), 'Y', 'q'.repeat(16), 'Y', 'q'.repeat(6), 'Y', 'q'.repeat(16), 'Y', 'q'.repeat(6), 'Y', 'q'.repeat(16), 'Y', 'q'.repeat(6), 'Y', 'q'.repeat(10), 'Y'),
  islandRow('Y', 'q'.repeat(8), 'Y', 'q'.repeat(16), 'Y', 'q'.repeat(6), 'Y', 'q'.repeat(16), 'Y', 'q'.repeat(6), 'Y', 'q'.repeat(16), 'Y', 'q'.repeat(6), 'Y', 'q'.repeat(10), 'Y'),
  islandRow('Y', 'q'.repeat(8), 'Y', 'u'.repeat(16), 'Y', 'q'.repeat(6), 'Y', 'u'.repeat(16), 'Y', 'q'.repeat(6), 'Y', 'u'.repeat(16), 'Y', 'q'.repeat(6), 'Y', 'u'.repeat(10), 'Y'),
  islandRow('Y', 'q'.repeat(92), 'Y'),
  islandRow('Y', 'q'.repeat(42), 'UU', 'q'.repeat(6), 'UU', 'q'.repeat(42), 'Y'),
  islandRow('Y', 'q'.repeat(43), 'zz', 'q'.repeat(6), 'zz', 'q'.repeat(41), 'Y'),
  islandRow('Y', 'q'.repeat(92), 'Y'),
  islandRow(' ', 'Y'.repeat(94), ' '),
  islandRow('     ', 'YYYYYYYYYYYY', '      ', 'YYYYYYYYYYYY', '      ', 'YYYYYYYYYYYY', '      ', 'YYYYYYYYYYYY'),
  islandRow('    ', 'YGGGGGGGGGGGGY', '    ', 'YGGGGGGGGGGGGY', '    ', 'YGGGGGGGGGGGGY', '    ', 'YGGGGGGGGGGGGY'),
  islandRow('    ', 'YGUUUUUUUUUGY', '      ', 'YGUUUUUUUUUGY', '      ', 'YGUUUUUUUUUGY', '      ', 'YGUUUUUUUUUGY'),
  islandRow('     ', 'YGGGGGGGGGGY', '       ', 'YGGGGGGGGGGY', '       ', 'YGGGGGGGGGGY', '       ', 'YGGGGGGGGGGY'),
  islandRow('      ', 'YYYYYYYYYY', '        ', 'YYYYYYYYYY', '        ', 'YYYYYYYYYY', '        ', 'YYYYYYYYYY'),
  islandRow('       ', 'YMMMMMMMMY', '        ', 'YMMMMMMMMY', '        ', 'YMMMMMMMMY', '        ', 'YMMMMMMMMY'),
  islandRow('       ', 'YnnnnnnnnY', '        ', 'YnnnnnnnnY', '        ', 'YnnnnnnnnY', '        ', 'YnnnnnnnnY'),
  islandRow('       ', 'YMMY  YMMY', '        ', 'YMMY  YMMY', '        ', 'YMMY  YMMY', '        ', 'YMMY  YMMY'),
  islandRow('       ', 'YMMYYYYMMY', '        ', 'YMMYYYYMMY', '        ', 'YMMYYYYMMY', '        ', 'YMMYYYYMMY'),
  islandRow('       ', 'YMMY  YMMY', '        ', 'YMMY  YMMY', '        ', 'YMMY  YMMY', '        ', 'YMMY  YMMY'),
  islandRow('       ', 'YMMY  YMMY', '        ', 'YMMY  YMMY', '        ', 'YMMY  YMMY', '        ', 'YMMY  YMMY'),
  islandRow('      ', 'ssYY    YYss', '      ', 'ssYY    YYss', '      ', 'ssYY    YYss', '      ', 'ssYY    YYss'),
  islandRow(' '.repeat(96)),
  islandRow(' '.repeat(96)),
  islandRow(' '.repeat(96)),
  islandRow(' '.repeat(96)),
  islandRow(' '.repeat(96)),
  islandRow(' '.repeat(96)),
  islandRow(' '.repeat(96)),
];

export const ROOM_DICE = [
  "YYYYYYYYYYYY",
  "YddddddddddY",
  "YdRRdddddddY",
  "YdRRdddddddY",
  "YddddddddddY",
  "YddddddddddY",
  "YddddddddddY",
  "YddddddddddY",
  "YdddddddRRdY",
  "YdddddddRRdY",
  "YddddddddddY",
  "YYYYYYYYYYYY",
];

export const ROOM_OBI_FIGURE = [
  "    YYYYYYYYYYYYYYYY    ",
  "   YnnnnnnnnnnnnnnnnY   ",
  "  YnnGGGGGGGGGGGGGGnnY  ",
  " YnnGYvvvvvvvvvvvvYGnnY ",
  " YnnGYvvyyvvvvyyvvYGnnY ",
  "YnnnGYvyjjyyyyjjyvYGnnnY",
  "YnnnGYvjyWyyyyWyjvYGnnnY",
  "YnnnGYvyyyyppyyyyvYGnnnY",
  "YnnnGYvvjyyyyyyjvvYGnnnY",
  "YnnnGYvvvyyyyyyvvvYGnnnY",
  "YnnnGYvvvvvvvvvvvvYGnnnY",
  " YnnGGGGGGGGGGGGGGnnY ".padEnd(24, " "),
  "  YnnnnnnnnnnnnnnnnY  ".padEnd(24, " "),
  "   YYYYYYYYYYYYYYYY   ".padEnd(24, " "),
  "        YnnnnY        ".padEnd(24, " "),
  "        YnnnnY        ".padEnd(24, " "),
  "      YYYnnnnYYY      ".padEnd(24, " "),
  "     YnnnnnnnnnnY     ".padEnd(24, " "),
  "    YnnGGGGGGGGnnY    ".padEnd(24, " "),
  "    YnnnnnnnnnnnnY    ".padEnd(24, " "),
  "    YnnnYYYYYYnnnY    ".padEnd(24, " "),
  "    YnnY      YnnY    ".padEnd(24, " "),
  "    YYYY      YYYY    ".padEnd(24, " "),
  "                        ",
];

export const ROOM_BLACK_WHITE_CAT = [
  "    Y    Y       ",
  "   YnYppYnY      ",
  "  YnnWnnWnnY     ",
  "  YnWWppWWnY     ",
  "   YnWWWWnY      ",
  "  YnnnWWnnnY     ",
  " YnnWnnnnWnnY    ",
  " YnWnnnnnnWnY YY ",
  " YnnnnWWnnnnYnnY ",
  " YnnnnnnnnnnnnY  ",
  "  YnnWnnnnWnnY   ",
  "   YnnnnnnnnY    ",
  "   YnY    YnY    ",
  "   YYY    YYY    ",
];

export const STEAM_PARTICLES = [
  "   Y    ",
  "  YWY   ",
  " Yd dY  ",
  "  YWY   ",
  "   Y    "
];

// Dark fire cauldron logs & fire embers structure (34 px x 18 px)
export const COZY_SOFA = [
  "       YYYYYYYYYYYYYYYYY            ",
  "      YCC2CC2CC2CC2CC2CCY           ",
  "     YC1C1C1C1C1C1C1C1C1CY          ",
  "     YC1              C1Y           ",
  "     YC1              C1Y           ",
  "      YC1            C1Y            ",
  "       YCC2C2C2C2C2C2CY             ",
  "     YYYYYYYYYYYYYYYYYYYY           ",
  "    YF2F2F2F2F2F2F2F2F2F2Y          ",
  "   YF2F3F3F3F3F3F3F3F3F2F2Y         ",
  "   YF2F2F2F2F2F2F2F2F2F2F2Y         ",
  "    YYYYYYYYYYYYYYYYYYYYY           ",
  "      YF1F1Y      YF1F1Y            ",
  "      YF1F1Y      YF1F1Y            ",
  "      YYYYYY      YYYYYY            "
];

// Left Retro Kitchen Cabinet structure (28x20px)
export const RETRO_WINDOW = [
  "YYYYYYYYYYYYYYYYYYYYYYYYYYYY",
  "YgrgrgrgrgrgrgrgrgrgrgrgrgrY",
  "Yg   g   g   g   g   g   g Y",
  "Yg                         Y",
  "Yg                         Y",
  "Yg      YYYYYYYYYYY        Y",
  "Yg     YacacacacacY        Y",
  "Yg     YacWWWWacacY        Y",
  "Yg     YacWWWWacacY        Y",
  "Yg     YacacacacacY        Y",
  "Yg      YYYYYYYYYYY        Y",
  "Yg                         Y",
  "YgrgrgrgrgrgrgrgrgrgrgrgrgrY",
  "YYYYYYYYYYYYYYYYYYYYYYYYYYYY",
  "  YacacacacacacacacacacacY  ",
  "  Yac                  acY  ",
  "  YYYYYYYYYYYYYYYYYYYYYYYY  ",
  "                            "
];

// Retro Dome Fridge with colorful magnets & sticky notes (18px x 32px)
export const RETRO_FRIDGE = [
  "     YYYYYYYY     ",
  "   YYfrfrfrfrYY   ",
  "  YfrfrfrfrfrfrY  ",
  " YfrfrfrfrfrfrfrY ",
  "YfrfrfrfrfrfrfrfrY",
  "YfrfrfrfrfrfrfrfrY",
  "YfrYffffffYfrfrfrY",
  "YfrYffffffYfrfrfrY",
  "YfrYffffffYfrfrfrY",
  "YfrYffffffYfrfrfrY",
  "YfrfrfrfrfrfrfrfrY",
  "YfrfrmgmgfrfrfrfrY",
  "YfrfrfrfrfrfrfrfrY",
  "YYYYYYYYYYYYYYYYYY",
  "YfdfdfdfdfdfdfdfdY",
  "YfdfdfdfdfdfdfdfdY",
  "YfdfdfdfdfdfdfdfdY",
  "YfdfdmwmwmwfdfdfdY",
  "YfdfdmwmwmwfdfdfdY",
  "YfdfdmwmbmwfdfdfdY",
  "YfdfdfdfdfdfdfdfdY",
  "YfdfYffffffYfdfdfY",
  "YfdfYffffffYfdfdfY",
  "YfdfYffffffYfdfdfY",
  "YfdfdfdfdfdfdfdfdY",
  "YfdfdfdfdfdfdfdfdY",
  "YfdfdfdfdfdfdfdfdY",
  "YfdfdfdfdfdfdfdfdY",
  "YfdfdfdfdfdfdfdfdY",
  "YYYYYYYYYYYYYYYYYY",
  "  YY        YY    ",
  "  YY        YY    "
];

// Kitchen Oven stove cooker with cooking pots (20px x 22px)
export const KITCHEN_OVEN = [
  "   YYYY     YYYY    ",
  "   YacY     YacY    ",
  "   YYYY     YYYY    ",
  " YYYYYYYYYYYYYYYYYY ",
  "YgrgrgrgrgrgrgrgrgrY",
  "YgrYacacYgrYacacYgrY",
  "YYYYYYYYYYYYYYYYYYYY",
  "YfcYmyYfcYmyYfcYmyYcY",
  "YfcYYYYfcYYYYfcYYYYcY",
  "YfcfcfcfcfcfcfcfcfcY",
  "YfcfcfcfcfcfcfcfcfcY",
  "YfcYYYYYYYYYYYYYYfcY",
  "YfcYgrgrgrgrgrgrYfcY",
  "YfcYgrgrgrgrgrgrYfcY",
  "YfcYgrgrgrgrgrgrYfcY",
  "YfcYgrgrgrgrgrgrYfcY",
  "YfcYYYYYYYYYYYYYYfcY",
  "YfcfcfcfcfcfcfcfcfcY",
  "YfcfcfcfcfcfcfcfcfcY",
  "YYYYYYYYYYYYYYYYYYYY",
  " YY              YY ",
  " YY              YY "
];

// Round Golden Wall Clock (10px x 8px)
export const WALL_CLOCK = [
  "  YYYYYYYY  ",
  " YororororY ",
  "YorWWWWWWorY",
  "YorW  Y  orY",
  "YorW  YY orY",
  "YorWWWWWWorY",
  " YddddddddY ",
  "  YYYYYYYY  "
];

// Glowing Mineral Crystal Wall Ornament (8px x 10px)
export const MINERAL_CRYSTAL = [
  "   YYYY   ",
  "  YcrcrY  ",
  " YcrcrcrY ",
  " YcscscrY ",
  "YcrcrcrcrY",
  "YcscscscrY",
  " YcscscrY ",
  "  YcscsY  ",
  "   YcsY   ",
  "    YY    "
];

// Warm standing floor lamp with yellow shade (14px x 30px)
export const WARM_FLOOR_LAMP = [
  "     YYYY     ",
  "    YlplpY    ",
  "   YlpWWlpY   ",
  "   YYYYYYYY   ",
  "     YbrY     ",
  "     YbrY     ",
  "     YbrY     ",
  "     YbrY     ",
  "     YbrY     ",
  "     YbrY     ",
  "     YbrY     ",
  "     YbrY     ",
  "     YbrY     ",
  "     YbrY     ",
  "     YbrY     ",
  "     YbrY     ",
  "     YbrY     ",
  "     YbrY     ",
  "     YbrY     ",
  "     YbrY     ",
  "     YbrY     ",
  "     YbrY     ",
  "    YYYYYY    ",
  "   YbrbrbrY   ",
  "   YYYYYYYY   ",
  "    YshshY    ",
  "    YshshY    "
];

// Indoor Plant in terracotta pot with outlined style (14px x 16px)
export const INDOOR_PLANT = [
  "      yy      ",
  "     yyyy     ",
  "    yyjjyy    ",
  "   yyyjjyyyy  ",
  "   jjYjjYjjj  ",
  "  jjYjjYjjjjj ",
  "  jjjjjjjjjjj ",
  "   ccccccccc  ",
  "   cYWWWWWYc  ",
  "    cYWWWYc   ",
  "    cYWWWYc   ",
  "    YcccccY   ",
  "    YcccccY   ",
  "     YYYYY    "
];

/**
 * Draws a pixel art matrix onto the canvas context.
 */
export function drawPixelSprite(
  ctx: CanvasRenderingContext2D,
  sprite: string[],
  startX: number,
  startY: number,
  pixelSize: number = 1,
  flipHorizontal: boolean = false
) {
  const height = sprite.length;
  if (height === 0) return;
  const width = sprite[0].length;

  for (let r = 0; r < height; r++) {
    const rowStr = sprite[r];
    for (let c = 0; c < width; c++) {
      const char = rowStr[c];
      if (char === undefined) continue;
      const color = COLOR_PALETTE[char];
      if (!color || color === 'transparent') continue;

      ctx.fillStyle = color;
      
      const drawC = flipHorizontal ? (width - 1 - c) : c;
      ctx.fillRect(
        Math.floor(startX + drawC * pixelSize),
        Math.floor(startY + r * pixelSize),
        pixelSize,
        pixelSize
      );
    }
  }
}
