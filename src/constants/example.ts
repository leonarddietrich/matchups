import type { RankedMatchCollection } from "@/types/roa2Types";

export const EXAMPLE_COLLECTION_NAME = 'Example Ranked Collection'

export const EXAMPLE_MATCH_COLLECTION: RankedMatchCollection = {
  "createdAt": "2025-07-23T19:48:40.330Z",
  "updatedAt": "2025-07-25T17:12:19.914Z",
  "name": EXAMPLE_COLLECTION_NAME,
  "type": "ranked",
  "description": "ranked matches alles ",
  "matches": [
    {
      "id": 1,
      "playerElo": 666,
      "opponentElo": 849,
      "opponentName": "Whalekitty",
      "rounds": [
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": false
        },
        {
          "stage": "Fire Capital",
          "playerRival": "Orcane",
          "opponentRival": "Orcane",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/xCBwkKSn9xk"
        }
      ]
    },
    {
      "id": 2,
      "playerElo": 660,
      "opponentElo": 928,
      "opponentName": "grogfunk",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": true
        },
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/wU8zyUQ8Oak"
        }
      ]
    },
    {
      "id": 3,
      "playerElo": 656,
      "opponentElo": -1,
      "opponentName": "alph_58",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": true
        },
        {
          "stage": "Fire Capital",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/fJoFL4ZeR5k"
        }
      ]
    },
    {
      "id": 4,
      "playerElo": 668,
      "opponentElo": 656,
      "opponentName": "AlEmerich",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": false
        },
        {
          "stage": "Fire Capital",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        },
        {
          "stage": "Rock Wall",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/o_zbHWRqda4"
        }
      ]
    },
    {
      "id": 5,
      "playerElo": 680,
      "opponentElo": 645,
      "opponentName": "AlEmerich",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/AF2tVG5iq7s"
        }
      ]
    },
    {
      "id": 6,
      "playerElo": 691,
      "opponentElo": 933,
      "opponentName": "Chaler",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Maypul",
          "won": false
        },
        {
          "stage": "Merchant Port",
          "playerRival": "Orcane",
          "opponentRival": "Maypul",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/RfX1AcJ1QJY"
        }
      ]
    },
    {
      "id": 7,
      "playerElo": 686,
      "opponentElo": 584,
      "opponentName": "KHagge",
      "rounds": [],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/GsoXpAeigpo"
        }
      ]
    },
    {
      "id": 8,
      "playerElo": 695,
      "opponentElo": 886,
      "opponentName": "LA-Z Rider",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": false
        },
        {
          "stage": "Merchant Port",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/gyUt99ilwhU"
        }
      ]
    },
    {
      "id": 9,
      "playerElo": 689,
      "opponentElo": 497,
      "opponentName": "Ezementyl",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": true
        },
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/trMTiRBJ1pQ"
        }
      ]
    },
    {
      "id": 10,
      "playerElo": 695,
      "opponentElo": 1076,
      "opponentName": "bkdorumon",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Kragg",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Kragg",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/UTqxSIE_gFU"
        }
      ]
    },
    {
      "id": 11,
      "playerElo": 693,
      "opponentElo": 680,
      "opponentName": "Pog",
      "rounds": [
        {
          "stage": "Aetherian Forest",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        },
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/vqLSWq4gfQc"
        }
      ]
    },
    {
      "id": 12,
      "playerElo": 705,
      "opponentElo": 633,
      "opponentName": "x-gex",
      "rounds": [
        {
          "stage": "Merchant Port",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/cFkPLuAqrF8"
        }
      ]
    },
    {
      "id": 13,
      "playerElo": 714,
      "opponentElo": 729,
      "opponentName": "Gilhyan",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Orcane",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Orcane",
          "won": true
        },
        {
          "stage": "Merchant Port",
          "playerRival": "Orcane",
          "opponentRival": "Orcane",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/STCky7oxmsQ"
        }
      ]
    },
    {
      "id": 14,
      "playerElo": 726,
      "opponentElo": 787,
      "opponentName": "TDB",
      "rounds": [
        {
          "stage": "Merchant Port",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        },
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/DoVu7VI7swg"
        }
      ]
    },
    {
      "id": 15,
      "playerElo": 740,
      "opponentElo": 789,
      "opponentName": "Melninja",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": true
        },
        {
          "stage": "Rock Wall",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Orcane",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/zD7tCTCpEro"
        }
      ]
    },
    {
      "id": 16,
      "playerElo": 753,
      "opponentElo": 848,
      "opponentName": "Ney",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": true
        },
        {
          "stage": "Rock Wall",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": false
        },
        {
          "stage": "Merchant Port",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/bd1SkWrQV9E"
        }
      ]
    },
    {
      "id": 17,
      "playerElo": 744,
      "opponentElo": 814,
      "opponentName": "the Sigman",
      "rounds": [
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Etalus",
          "won": true
        },
        {
          "stage": "Fire Capital",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/dB28P09doFk"
        }
      ]
    },
    {
      "id": 18,
      "playerElo": 758,
      "opponentElo": 489,
      "opponentName": "scholar.of.nothing",
      "rounds": [
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Forsburn",
          "won": true
        },
        {
          "stage": "Rock Wall",
          "playerRival": "Orcane",
          "opponentRival": "Forsburn",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/ImbjMWqtWd0"
        }
      ]
    },
    {
      "id": 19,
      "playerElo": 762,
      "opponentElo": 853,
      "opponentName": "Martoni",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": false
        },
        {
          "stage": "Merchant Port",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/DpRCdmeANbQ"
        }
      ]
    },
    {
      "id": 20,
      "playerElo": 753,
      "opponentElo": 880,
      "opponentName": "raxmo",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        },
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/syj1M5bv4qE"
        }
      ]
    },
    {
      "id": 21,
      "playerElo": 768,
      "opponentElo": 666,
      "opponentName": "Shiro",
      "rounds": [
        {
          "stage": "Merchant Port",
          "playerRival": "Orcane",
          "opponentRival": "Zetterburn",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Zetterburn",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/rlFdyWbQ9tQ"
        }
      ]
    },
    {
      "id": 22,
      "playerElo": 753,
      "opponentElo": 921,
      "opponentName": "gamergurl",
      "rounds": [
        {
          "stage": "Merchant Port",
          "playerRival": "Orcane",
          "opponentRival": "Maypul",
          "won": false
        },
        {
          "stage": "Air Armada",
          "playerRival": "Orcane",
          "opponentRival": "Maypul",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/j5r1zp8g8Zk"
        }
      ]
    },
    {
      "id": 23,
      "playerElo": 747,
      "opponentElo": 811,
      "opponentName": "keys",
      "rounds": [],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/j5r1zp8g8Zk"
        }
      ]
    },
    {
      "id": 24,
      "playerElo": 738,
      "opponentElo": 797,
      "opponentName": "Riopine",
      "rounds": [
        {
          "stage": "Merchant Port",
          "playerRival": "Orcane",
          "opponentRival": "Fleet",
          "won": true
        },
        {
          "stage": "Merchant Port",
          "playerRival": "Orcane",
          "opponentRival": "Fleet",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Fleet",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/z-fwJPDyaHs"
        }
      ]
    },
    {
      "id": 25,
      "playerElo": 752,
      "opponentElo": 917,
      "opponentName": "Dydou",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Fleet",
          "won": true
        },
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Fleet",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Fleet",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/E9LTPS3Hehs"
        }
      ]
    },
    {
      "id": 26,
      "playerElo": 769,
      "opponentElo": 1099,
      "opponentName": "Stormghetti",
      "rounds": [
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Etalus",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Etalus",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/b06UppVdbEw"
        }
      ]
    },
    {
      "id": 27,
      "playerElo": 766,
      "opponentElo": 910,
      "opponentName": "Sinnsai",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Etalus",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Etalus",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/w3w_HPn8J0E"
        }
      ]
    },
    {
      "id": 28,
      "playerElo": 759,
      "opponentElo": 782,
      "opponentName": "Sppoyk",
      "rounds": [
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        },
        {
          "stage": "Hodojo",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/YsBo9qyrnnI"
        }
      ]
    },
    {
      "id": 29,
      "playerElo": 772,
      "opponentElo": 928,
      "opponentName": "ki2",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": true
        },
        {
          "stage": "Fire Capital",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": false
        },
        {
          "stage": "Rock Wall",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/JEwGe767TmY"
        }
      ]
    },
    {
      "id": 30,
      "playerElo": 765,
      "opponentElo": 769,
      "opponentName": "Masig_ssb",
      "rounds": [
        {
          "stage": "Merchant Port",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": true
        },
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/rWUytALyNuE"
        }
      ]
    },
    {
      "id": 31,
      "playerElo": 777,
      "opponentElo": 833,
      "opponentName": "RICHMISTER",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": false
        },
        {
          "stage": "Rock Wall",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        },
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/FBQ18Ceg3v4"
        }
      ]
    },
    {
      "id": 32,
      "playerElo": 791,
      "opponentElo": 876,
      "opponentName": "massy",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": true
        },
        {
          "stage": "Fire Capital",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/Y1-ITsiI0Rk"
        }
      ]
    },
    {
      "id": 33,
      "playerElo": 805,
      "opponentElo": 927,
      "opponentName": "Orik",
      "rounds": [
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        },
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/1X8uQ8ozxkg"
        }
      ]
    },
    {
      "id": 34,
      "playerElo": 821,
      "opponentElo": 933,
      "opponentName": "Théotime",
      "rounds": [
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/xbSI9rxYxZk"
        }
      ]
    },
    {
      "id": 35,
      "playerElo": 813,
      "opponentElo": 796,
      "opponentName": "Burstate",
      "rounds": [
        {
          "stage": "Hodojo",
          "playerRival": "Orcane",
          "opponentRival": "Zetterburn",
          "won": true
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Zetterburn",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/-Mq7AR5Wh-o"
        }
      ]
    },
    {
      "id": 36,
      "playerElo": 824,
      "opponentElo": 785,
      "opponentName": "Burstate",
      "rounds": [
        {
          "stage": "Merchant Port",
          "playerRival": "Orcane",
          "opponentRival": "Zetterburn",
          "won": true
        },
        {
          "stage": "Rock Wall",
          "playerRival": "Orcane",
          "opponentRival": "Zetterburn",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/PGifdRcnTtI"
        }
      ]
    },
    {
      "id": 37,
      "playerElo": 835,
      "opponentElo": 781,
      "opponentName": "Stress",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        },
        {
          "stage": "Hodojo",
          "playerRival": "Orcane",
          "opponentRival": "Kragg",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/RYlGInVnNMA"
        }
      ]
    },
    {
      "id": 38,
      "playerElo": 845,
      "opponentElo": 906,
      "opponentName": "TheGingerHeed",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Kragg",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Kragg",
          "won": true
        },
        {
          "stage": "Air Armada",
          "playerRival": "Orcane",
          "opponentRival": "Kragg",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/72DICNCcC6k"
        }
      ]
    },
    {
      "id": 39,
      "playerElo": 835,
      "opponentElo": 760,
      "opponentName": "-MIGHT",
      "rounds": [
        {
          "stage": "Merchant Port",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": true
        },
        {
          "stage": "Hodojo",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/4aF2GrNc5Yg"
        }
      ]
    },
    {
      "id": 40,
      "playerElo": 844,
      "opponentElo": 861,
      "opponentName": "Kezakoopa",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": true
        },
        {
          "stage": "Hodojo",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/sYm6obuEVjY"
        }
      ]
    },
    {
      "id": 41,
      "playerElo": 857,
      "opponentElo": 965,
      "opponentName": "MatKura",
      "rounds": [
        {
          "stage": "Merchant Port",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": true
        },
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/5hWQYjZ4r4o"
        }
      ]
    },
    {
      "id": 42,
      "playerElo": 873,
      "opponentElo": 950,
      "opponentName": "MatKura",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": true
        },
        {
          "stage": "Air Armada",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/r7uv9jU4yMw"
        }
      ]
    },
    {
      "id": 43,
      "playerElo": 887,
      "opponentElo": 639,
      "opponentName": "Vajoj",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Fleet",
          "won": true
        },
        {
          "stage": "Air Armada",
          "playerRival": "Orcane",
          "opponentRival": "Fleet",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/0_efXyFhN_I"
        }
      ]
    },
    {
      "id": 44,
      "playerElo": 892,
      "opponentElo": 803,
      "opponentName": "OnihC",
      "rounds": [
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        },
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/kvscN_UXN3Q"
        }
      ]
    },
    {
      "id": 45,
      "playerElo": -1,
      "opponentElo": 918,
      "opponentName": "The Gypsy",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Wrastor",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Wrastor",
          "won": true
        },
        {
          "stage": "Hodojo",
          "playerRival": "Orcane",
          "opponentRival": "Wrastor",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/Fsv6fWEPKrY"
        }
      ]
    },
    {
      "id": 46,
      "playerElo": -1,
      "opponentElo": 891,
      "opponentName": "Asmo",
      "rounds": [
        {
          "stage": "Hodojo",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Ranno",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/tAzUNt-7Vcw"
        }
      ]
    },
    {
      "id": 47,
      "playerElo": -1,
      "opponentElo": 793,
      "opponentName": "DutchCheese",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Kragg",
          "won": true
        },
        {
          "stage": "Hodojo",
          "playerRival": "Orcane",
          "opponentRival": "Olympia",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/nz1U_r2LBvQ"
        }
      ]
    },
    {
      "id": 48,
      "playerElo": -1,
      "opponentElo": 1030,
      "opponentName": "Tixo",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Fleet",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Fleet",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/7ho3vwrefHs"
        }
      ]
    },
    {
      "id": 49,
      "playerElo": -1,
      "opponentElo": 986,
      "opponentName": "Don Koala",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": false
        },
        {
          "stage": "Rock Wall",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/V4g97yKtylA"
        }
      ]
    },
    {
      "id": 50,
      "playerElo": -1,
      "opponentElo": 669,
      "opponentName": "Smeggo",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Etalus",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Etalus",
          "won": true
        },
        {
          "stage": "Tempest Peak",
          "playerRival": "Orcane",
          "opponentRival": "Etalus",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/mvvu8QrVDOM"
        }
      ]
    },
    {
      "id": 51,
      "playerElo": -1,
      "opponentElo": 1013,
      "opponentName": "Gintoniko",
      "rounds": [
        {
          "stage": "Merchant Port",
          "playerRival": "Orcane",
          "opponentRival": "Olympia",
          "won": true
        },
        {
          "stage": "Air Armada",
          "playerRival": "Orcane",
          "opponentRival": "Olympia",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/tadxo2iFLyU"
        }
      ]
    },
    {
      "id": 52,
      "playerElo": 916,
      "opponentElo": 1027,
      "opponentName": "pink_mantis",
      "rounds": [
        {
          "stage": "Hodojo",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": false
        },
        {
          "stage": "Rock Wall",
          "playerRival": "Orcane",
          "opponentRival": "Olympia",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/5xDQOq-IcoQ"
        }
      ]
    },
    {
      "id": 53,
      "playerElo": 902,
      "opponentElo": 1050,
      "opponentName": "Tubbi",
      "rounds": [
        {
          "stage": "Hodojo",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": false
        },
        {
          "stage": "Fire Capital",
          "playerRival": "Orcane",
          "opponentRival": "Loxodont",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/HhXMrYLXfE4"
        }
      ]
    },
    {
      "id": 54,
      "playerElo": 890,
      "opponentElo": 949,
      "opponentName": "Blueblood",
      "rounds": [
        {
          "stage": "Hodojo",
          "playerRival": "Orcane",
          "opponentRival": "Kragg",
          "won": true
        },
        {
          "stage": "Air Armada",
          "playerRival": "Orcane",
          "opponentRival": "Kragg",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/xWVNKBUwXzA"
        }
      ]
    },
    {
      "id": 55,
      "playerElo": 912,
      "opponentElo": 719,
      "opponentName": "Jon_The_Fox",
      "rounds": [
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Wrastor",
          "won": true
        },
        {
          "stage": "Air Armada",
          "playerRival": "Orcane",
          "opponentRival": "Wrastor",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/KgvI4-ywFwQ"
        }
      ]
    },
    {
      "id": 56,
      "playerElo": 923,
      "opponentElo": 854,
      "opponentName": "Balto",
      "rounds": [
        {
          "stage": "Aetherian Forest",
          "playerRival": "Orcane",
          "opponentRival": "Maypul",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Maypul",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/f8w12OFHVy0"
        }
      ]
    },
    {
      "id": 57,
      "playerElo": 900,
      "opponentElo": 941,
      "opponentName": "Brucie118",
      "rounds": [
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Olympia",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Olympia",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/D1TNegXeNVQ"
        }
      ]
    },
    {
      "id": 58,
      "playerElo": 882,
      "opponentElo": 759,
      "opponentName": "Fate",
      "rounds": [
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Zetterburn",
          "won": true
        },
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Zetterburn",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/vpcFaU9WIVI"
        }
      ]
    },
    {
      "id": 59,
      "playerElo": 895,
      "opponentElo": 751,
      "opponentName": "Fate",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Zetterburn",
          "won": true
        },
        {
          "stage": "Hodojo",
          "playerRival": "Orcane",
          "opponentRival": "Clairen",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/2yvPsevPzLU"
        }
      ]
    },
    {
      "id": 60,
      "playerElo": 909,
      "opponentElo": 744,
      "opponentName": "Fate",
      "rounds": [],
      "links": [
        {
          "text": "forfeited",
          "link": "https://youtu.be/7xkEosX2qdg"
        }
      ]
    },
    {
      "id": 61,
      "playerElo": 921,
      "opponentElo": 738,
      "opponentName": "Fate",
      "rounds": [],
      "links": [
        {
          "text": "forfeited",
          "link": "https://youtu.be/zAhF7PZUYzM"
        }
      ]
    },
    {
      "id": 62,
      "playerElo": 933,
      "opponentElo": 1020,
      "opponentName": "henrik",
      "rounds": [
        {
          "stage": "Aetherian Forest",
          "playerRival": "Orcane",
          "opponentRival": "Wrastor",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Wrastor",
          "won": true
        },
        {
          "stage": "Godai Delta",
          "playerRival": "Orcane",
          "opponentRival": "Wrastor",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/DJ8S48qxz9c"
        }
      ]
    },
    {
      "id": 63,
      "playerElo": 963,
      "opponentElo": 1002,
      "opponentName": "Skarr",
      "rounds": [
        {
          "stage": "Julesvale",
          "playerRival": "Orcane",
          "opponentRival": "Forsburn",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Forsburn",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/tqcyIjnUQmc"
        }
      ]
    },
    {
      "id": 64,
      "playerElo": -1,
      "opponentElo": 928,
      "opponentName": "Nightshade08",
      "rounds": [
        {
          "stage": "Godai Delta",
          "playerRival": "Absa",
          "opponentRival": "Absa",
          "won": false
        },
        {
          "stage": "Aetherian Forest",
          "playerRival": "Absa",
          "opponentRival": "Absa",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/jucR3j7QNEM"
        }
      ]
    },
    {
      "id": 65,
      "playerElo": -1,
      "opponentElo": 929,
      "opponentName": "lelize",
      "rounds": [
        {
          "stage": "Merchant Port",
          "playerRival": "Absa",
          "opponentRival": "Zetterburn",
          "won": false
        },
        {
          "stage": "Tempest Peak",
          "playerRival": "Absa",
          "opponentRival": "Zetterburn",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/T3GSVcaeIpQ"
        }
      ]
    },
    {
      "id": 66,
      "playerElo": -1,
      "opponentElo": -1,
      "opponentName": "DegeneRAT",
      "rounds": [
        {
          "stage": "Aetherian Forest",
          "playerRival": "Absa",
          "opponentRival": "Loxodont",
          "won": true
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Absa",
          "opponentRival": "Kragg",
          "won": false
        },
        {
          "stage": "Hyperborean Harbor",
          "playerRival": "Orcane",
          "opponentRival": "Kragg",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/hkS57ssM-Jg"
        }
      ]
    },
    {
      "id": 67,
      "playerElo": -1,
      "opponentElo": 897,
      "opponentName": "Voodoo",
      "rounds": [
        {
          "stage": "Hodojo",
          "playerRival": "Absa",
          "opponentRival": "Wrastor",
          "won": true
        },
        {
          "stage": "Hodojo",
          "playerRival": "Absa",
          "opponentRival": "Wrastor",
          "won": true
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/Fu5P6yHt5mQ"
        }
      ]
    },
    {
      "id": 68,
      "playerElo": -1,
      "opponentElo": 1202,
      "opponentName": "Shoki",
      "rounds": [
        {
          "stage": "Julesvale",
          "playerRival": "Absa",
          "opponentRival": "Zetterburn",
          "won": false
        },
        {
          "stage": "Merchant Port",
          "playerRival": "Absa",
          "opponentRival": "Zetterburn",
          "won": false
        }
      ],
      "links": [
        {
          "text": "vod",
          "link": "https://youtu.be/L6ZgwAIpHU4"
        }
      ]
    }
  ]
}
