// Catégorie "Blocs".
//
// La table de craft est un exemple de slot MULTI-FACE (voir README.md).
// Tout le reste ci-dessous est à texture UNIQUE sur toutes les faces — les
// blocs avec des faces différentes (bûches, four, herbe, citrouille...)
// demandent une vérification au cas par cas, pas encore inclus.
//
// targetPath vérifiés contre blocks.json + terrain_texture.json
// (Mojang/bedrock-samples).

const PLANK_TYPES = [
  { id: "oak", label: "Chêne" },
  { id: "spruce", label: "Épicéa" },
  { id: "birch", label: "Bouleau" },
  { id: "jungle", label: "Jungle" },
  { id: "acacia", label: "Acacia" },
  { id: "dark_oak", label: "Chêne noir" },
  { id: "mangrove", label: "Palétuvier" },
  { id: "cherry", label: "Cerisier" },
  { id: "bamboo", label: "Bambou" },
  { id: "crimson", label: "Cramoisi" },
  { id: "warped", label: "Déformé" },
];

const ORE_TYPES = [
  { id: "coal_ore", label: "Minerai de charbon" },
  { id: "iron_ore", label: "Minerai de fer" },
  { id: "gold_ore", label: "Minerai d'or" },
  { id: "diamond_ore", label: "Minerai de diamant" },
  { id: "emerald_ore", label: "Minerai d'émeraude" },
  { id: "lapis_ore", label: "Minerai de lapis-lazuli" },
  { id: "redstone_ore", label: "Minerai de redstone" },
];

const MINERAL_BLOCKS = [
  { id: "iron_block", label: "Bloc de fer" },
  { id: "gold_block", label: "Bloc d'or" },
  { id: "diamond_block", label: "Bloc de diamant" },
  { id: "emerald_block", label: "Bloc d'émeraude" },
  { id: "coal_block", label: "Bloc de charbon" },
  { id: "redstone_block", label: "Bloc de redstone" },
  { id: "lapis_block", label: "Bloc de lapis-lazuli" },
  { id: "netherite_block", label: "Bloc de netherite" },
];

const BASIC_BLOCKS = [
  { id: "dirt", label: "Terre" },
  { id: "stone", label: "Pierre" },
  { id: "cobblestone", label: "Pierre taillée" },
  { id: "sand", label: "Sable" },
  { id: "gravel", label: "Gravier" },
  { id: "obsidian", label: "Obsidienne" },
  { id: "bedrock", label: "Bedrock" },
  { id: "netherrack", label: "Netherrack" },
  { id: "end_stone", label: "Pierre de l'End" },
  { id: "glass", label: "Verre" },
  { id: "ice", label: "Glace" },
  { id: "snow", label: "Neige (bloc)" },
  { id: "clay", label: "Argile" },
  { id: "sandstone", label: "Grès" },
];

const LAINE = [
  { id: "wool_colored_black", label: "Laine noire", texturePath: "wool_colored_black" },
  { id: "wool_colored_blue", label: "Laine bleue", texturePath: "wool_colored_blue" },
  { id: "wool_colored_brown", label: "Laine marron", texturePath: "wool_colored_brown" },
  { id: "wool_colored_cyan", label: "Laine cyan", texturePath: "wool_colored_cyan" },
  { id: "wool_colored_gray", label: "Laine grise", texturePath: "wool_colored_gray" },
  { id: "wool_colored_green", label: "Laine verte", texturePath: "wool_colored_green" },
  { id: "wool_colored_light_blue", label: "Laine bleu clair", texturePath: "wool_colored_light_blue" },
  { id: "wool_colored_lime", label: "Laine vert clair", texturePath: "wool_colored_lime" },
  { id: "wool_colored_magenta", label: "Laine magenta", texturePath: "wool_colored_magenta" },
  { id: "wool_colored_orange", label: "Laine orange", texturePath: "wool_colored_orange" },
  { id: "wool_colored_pink", label: "Laine rose", texturePath: "wool_colored_pink" },
  { id: "wool_colored_purple", label: "Laine violette", texturePath: "wool_colored_purple" },
  { id: "wool_colored_red", label: "Laine rouge", texturePath: "wool_colored_red" },
  { id: "wool_colored_silver", label: "Laine gris clair", texturePath: "wool_colored_silver" },
  { id: "wool_colored_white", label: "Laine blanche", texturePath: "wool_colored_white" },
  { id: "wool_colored_yellow", label: "Laine jaune", texturePath: "wool_colored_yellow" },
];

const BETON = [
  { id: "concrete_black", label: "Béton noire", texturePath: "concrete_black" },
  { id: "concrete_blue", label: "Béton bleue", texturePath: "concrete_blue" },
  { id: "concrete_brown", label: "Béton marron", texturePath: "concrete_brown" },
  { id: "concrete_cyan", label: "Béton cyan", texturePath: "concrete_cyan" },
  { id: "concrete_gray", label: "Béton grise", texturePath: "concrete_gray" },
  { id: "concrete_green", label: "Béton verte", texturePath: "concrete_green" },
  { id: "concrete_light_blue", label: "Béton bleu clair", texturePath: "concrete_light_blue" },
  { id: "concrete_lime", label: "Béton vert clair", texturePath: "concrete_lime" },
  { id: "concrete_magenta", label: "Béton magenta", texturePath: "concrete_magenta" },
  { id: "concrete_orange", label: "Béton orange", texturePath: "concrete_orange" },
  { id: "concrete_pink", label: "Béton rose", texturePath: "concrete_pink" },
  { id: "concrete_purple", label: "Béton violette", texturePath: "concrete_purple" },
  { id: "concrete_red", label: "Béton rouge", texturePath: "concrete_red" },
  { id: "concrete_silver", label: "Béton gris clair", texturePath: "concrete_silver" },
  { id: "concrete_white", label: "Béton blanche", texturePath: "concrete_white" },
  { id: "concrete_yellow", label: "Béton jaune", texturePath: "concrete_yellow" },
];

const BETON_POUDRE = [
  { id: "concrete_powder_black", label: "Béton en poudre noire", texturePath: "concrete_powder_black" },
  { id: "concrete_powder_blue", label: "Béton en poudre bleue", texturePath: "concrete_powder_blue" },
  { id: "concrete_powder_brown", label: "Béton en poudre marron", texturePath: "concrete_powder_brown" },
  { id: "concrete_powder_cyan", label: "Béton en poudre cyan", texturePath: "concrete_powder_cyan" },
  { id: "concrete_powder_gray", label: "Béton en poudre grise", texturePath: "concrete_powder_gray" },
  { id: "concrete_powder_green", label: "Béton en poudre verte", texturePath: "concrete_powder_green" },
  { id: "concrete_powder_light_blue", label: "Béton en poudre bleu clair", texturePath: "concrete_powder_light_blue" },
  { id: "concrete_powder_lime", label: "Béton en poudre vert clair", texturePath: "concrete_powder_lime" },
  { id: "concrete_powder_magenta", label: "Béton en poudre magenta", texturePath: "concrete_powder_magenta" },
  { id: "concrete_powder_orange", label: "Béton en poudre orange", texturePath: "concrete_powder_orange" },
  { id: "concrete_powder_pink", label: "Béton en poudre rose", texturePath: "concrete_powder_pink" },
  { id: "concrete_powder_purple", label: "Béton en poudre violette", texturePath: "concrete_powder_purple" },
  { id: "concrete_powder_red", label: "Béton en poudre rouge", texturePath: "concrete_powder_red" },
  { id: "concrete_powder_silver", label: "Béton en poudre gris clair", texturePath: "concrete_powder_silver" },
  { id: "concrete_powder_white", label: "Béton en poudre blanche", texturePath: "concrete_powder_white" },
  { id: "concrete_powder_yellow", label: "Béton en poudre jaune", texturePath: "concrete_powder_yellow" },
];

const VERRE_TEINTE = [
  { id: "glass_black", label: "Verre teinté noire", texturePath: "glass_black" },
  { id: "glass_blue", label: "Verre teinté bleue", texturePath: "glass_blue" },
  { id: "glass_brown", label: "Verre teinté marron", texturePath: "glass_brown" },
  { id: "glass_cyan", label: "Verre teinté cyan", texturePath: "glass_cyan" },
  { id: "glass_gray", label: "Verre teinté grise", texturePath: "glass_gray" },
  { id: "glass_green", label: "Verre teinté verte", texturePath: "glass_green" },
  { id: "glass_light_blue", label: "Verre teinté bleu clair", texturePath: "glass_light_blue" },
  { id: "glass_lime", label: "Verre teinté vert clair", texturePath: "glass_lime" },
  { id: "glass_magenta", label: "Verre teinté magenta", texturePath: "glass_magenta" },
  { id: "glass_orange", label: "Verre teinté orange", texturePath: "glass_orange" },
  { id: "glass_pink", label: "Verre teinté rose", texturePath: "glass_pink" },
  { id: "glass_purple", label: "Verre teinté violette", texturePath: "glass_purple" },
  { id: "glass_red", label: "Verre teinté rouge", texturePath: "glass_red" },
  { id: "glass_silver", label: "Verre teinté gris clair", texturePath: "glass_silver" },
  { id: "glass_white", label: "Verre teinté blanche", texturePath: "glass_white" },
  { id: "glass_yellow", label: "Verre teinté jaune", texturePath: "glass_yellow" },
];

const TERRE_CUITE = [
  { id: "hardened_clay_stained_black", label: "Terre cuite noire", texturePath: "hardened_clay_stained_black" },
  { id: "hardened_clay_stained_blue", label: "Terre cuite bleue", texturePath: "hardened_clay_stained_blue" },
  { id: "hardened_clay_stained_brown", label: "Terre cuite marron", texturePath: "hardened_clay_stained_brown" },
  { id: "hardened_clay_stained_cyan", label: "Terre cuite cyan", texturePath: "hardened_clay_stained_cyan" },
  { id: "hardened_clay_stained_gray", label: "Terre cuite grise", texturePath: "hardened_clay_stained_gray" },
  { id: "hardened_clay_stained_green", label: "Terre cuite verte", texturePath: "hardened_clay_stained_green" },
  { id: "hardened_clay_stained_light_blue", label: "Terre cuite bleu clair", texturePath: "hardened_clay_stained_light_blue" },
  { id: "hardened_clay_stained_lime", label: "Terre cuite vert clair", texturePath: "hardened_clay_stained_lime" },
  { id: "hardened_clay_stained_magenta", label: "Terre cuite magenta", texturePath: "hardened_clay_stained_magenta" },
  { id: "hardened_clay_stained_orange", label: "Terre cuite orange", texturePath: "hardened_clay_stained_orange" },
  { id: "hardened_clay_stained_pink", label: "Terre cuite rose", texturePath: "hardened_clay_stained_pink" },
  { id: "hardened_clay_stained_purple", label: "Terre cuite violette", texturePath: "hardened_clay_stained_purple" },
  { id: "hardened_clay_stained_red", label: "Terre cuite rouge", texturePath: "hardened_clay_stained_red" },
  { id: "hardened_clay_stained_silver", label: "Terre cuite gris clair", texturePath: "hardened_clay_stained_silver" },
  { id: "hardened_clay_stained_white", label: "Terre cuite blanche", texturePath: "hardened_clay_stained_white" },
  { id: "hardened_clay_stained_yellow", label: "Terre cuite jaune", texturePath: "hardened_clay_stained_yellow" },
];

const TERRE_CUITE_VERNISSEE = [
  { id: "glazed_terracotta_black", label: "Terre cuite vernissée noire", texturePath: "glazed_terracotta_black" },
  { id: "glazed_terracotta_blue", label: "Terre cuite vernissée bleue", texturePath: "glazed_terracotta_blue" },
  { id: "glazed_terracotta_brown", label: "Terre cuite vernissée marron", texturePath: "glazed_terracotta_brown" },
  { id: "glazed_terracotta_cyan", label: "Terre cuite vernissée cyan", texturePath: "glazed_terracotta_cyan" },
  { id: "glazed_terracotta_gray", label: "Terre cuite vernissée grise", texturePath: "glazed_terracotta_gray" },
  { id: "glazed_terracotta_green", label: "Terre cuite vernissée verte", texturePath: "glazed_terracotta_green" },
  { id: "glazed_terracotta_light_blue", label: "Terre cuite vernissée bleu clair", texturePath: "glazed_terracotta_light_blue" },
  { id: "glazed_terracotta_lime", label: "Terre cuite vernissée vert clair", texturePath: "glazed_terracotta_lime" },
  { id: "glazed_terracotta_magenta", label: "Terre cuite vernissée magenta", texturePath: "glazed_terracotta_magenta" },
  { id: "glazed_terracotta_orange", label: "Terre cuite vernissée orange", texturePath: "glazed_terracotta_orange" },
  { id: "glazed_terracotta_pink", label: "Terre cuite vernissée rose", texturePath: "glazed_terracotta_pink" },
  { id: "glazed_terracotta_purple", label: "Terre cuite vernissée violette", texturePath: "glazed_terracotta_purple" },
  { id: "glazed_terracotta_red", label: "Terre cuite vernissée rouge", texturePath: "glazed_terracotta_red" },
  { id: "glazed_terracotta_silver", label: "Terre cuite vernissée gris clair", texturePath: "glazed_terracotta_silver" },
  { id: "glazed_terracotta_white", label: "Terre cuite vernissée blanche", texturePath: "glazed_terracotta_white" },
  { id: "glazed_terracotta_yellow", label: "Terre cuite vernissée jaune", texturePath: "glazed_terracotta_yellow" },
];

const BOUGIES = [
  { id: "black_candle", label: "Bougie noire", texturePath: "candles/black_candle" },
  { id: "blue_candle", label: "Bougie bleue", texturePath: "candles/blue_candle" },
  { id: "brown_candle", label: "Bougie marron", texturePath: "candles/brown_candle" },
  { id: "cyan_candle", label: "Bougie cyan", texturePath: "candles/cyan_candle" },
  { id: "gray_candle", label: "Bougie grise", texturePath: "candles/gray_candle" },
  { id: "green_candle", label: "Bougie verte", texturePath: "candles/green_candle" },
  { id: "light_blue_candle", label: "Bougie bleu clair", texturePath: "candles/light_blue_candle" },
  { id: "lime_candle", label: "Bougie vert clair", texturePath: "candles/lime_candle" },
  { id: "magenta_candle", label: "Bougie magenta", texturePath: "candles/magenta_candle" },
  { id: "orange_candle", label: "Bougie orange", texturePath: "candles/orange_candle" },
  { id: "pink_candle", label: "Bougie rose", texturePath: "candles/pink_candle" },
  { id: "purple_candle", label: "Bougie violette", texturePath: "candles/purple_candle" },
  { id: "red_candle", label: "Bougie rouge", texturePath: "candles/red_candle" },
  { id: "silver_candle", label: "Bougie gris clair", texturePath: "candles/silver_candle" },
  { id: "candle", label: "Bougie blanche", texturePath: "candles/candle" },
  { id: "yellow_candle", label: "Bougie jaune", texturePath: "candles/yellow_candle" },
];

const PIERRES_VARIANTES = [
  { id: "stone_andesite", label: "Andésite", texturePath: "stone_andesite" },
  { id: "stone_andesite_smooth", label: "Andésite polie", texturePath: "stone_andesite_smooth" },
  { id: "stone_diorite", label: "Diorite", texturePath: "stone_diorite" },
  { id: "stone_diorite_smooth", label: "Diorite polie", texturePath: "stone_diorite_smooth" },
  { id: "stone_granite", label: "Granite", texturePath: "stone_granite" },
  { id: "stone_granite_smooth", label: "Granite poli", texturePath: "stone_granite_smooth" },
  { id: "calcite", label: "Calcite", texturePath: "calcite" },
  { id: "tuff", label: "Tuf", texturePath: "tuff" },
  { id: "dripstone_block", label: "Bloc de dripstone", texturePath: "dripstone_block" },
  { id: "amethyst_block", label: "Bloc d'améthyste", texturePath: "amethyst_block" },
  { id: "budding_amethyst", label: "Améthyste en germination", texturePath: "budding_amethyst" },
];

const DEEPSLATE = [
  { id: "cobbled_deepslate", label: "Cobble de deepslate", texturePath: "deepslate/cobbled_deepslate" },
  { id: "polished_deepslate", label: "Deepslate polie", texturePath: "deepslate/polished_deepslate" },
  { id: "chiseled_deepslate", label: "Deepslate ciselée", texturePath: "deepslate/chiseled_deepslate" },
  { id: "deepslate_coal_ore", label: "Minerai de charbon (deepslate)", texturePath: "deepslate/deepslate_coal_ore" },
  { id: "deepslate_copper_ore", label: "Minerai de cuivre (deepslate)", texturePath: "deepslate/deepslate_copper_ore" },
  { id: "deepslate_diamond_ore", label: "Minerai de diamant (deepslate)", texturePath: "deepslate/deepslate_diamond_ore" },
  { id: "deepslate_emerald_ore", label: "Minerai d'émeraude (deepslate)", texturePath: "deepslate/deepslate_emerald_ore" },
  { id: "deepslate_gold_ore", label: "Minerai d'or (deepslate)", texturePath: "deepslate/deepslate_gold_ore" },
  { id: "deepslate_iron_ore", label: "Minerai de fer (deepslate)", texturePath: "deepslate/deepslate_iron_ore" },
  { id: "deepslate_lapis_ore", label: "Minerai de lapis-lazuli (deepslate)", texturePath: "deepslate/deepslate_lapis_ore" },
  { id: "deepslate_redstone_ore", label: "Minerai de redstone (deepslate)", texturePath: "deepslate/deepslate_redstone_ore" },
];

const CUIVRE = [
  { id: "copper_block", label: "Bloc de cuivre", texturePath: "copper_block" },
  { id: "exposed_copper", label: "Cuivre exposé", texturePath: "exposed_copper" },
  { id: "weathered_copper", label: "Cuivre patiné", texturePath: "weathered_copper" },
  { id: "oxidized_copper", label: "Cuivre oxydé", texturePath: "oxidized_copper" },
  { id: "cut_copper", label: "Cuivre taillé", texturePath: "cut_copper" },
  { id: "exposed_cut_copper", label: "Cuivre taillé exposé", texturePath: "exposed_cut_copper" },
  { id: "weathered_cut_copper", label: "Cuivre taillé patiné", texturePath: "weathered_cut_copper" },
  { id: "oxidized_cut_copper", label: "Cuivre taillé oxydé", texturePath: "oxidized_cut_copper" },
  { id: "raw_copper_block", label: "Bloc de cuivre brut", texturePath: "raw_copper_block" },
];

const NETHER_END_DIVERS = [
  { id: "nether_brick", label: "Brique du Nether", texturePath: "nether_brick" },
  { id: "red_nether_brick", label: "Brique du Nether rouge", texturePath: "red_nether_brick" },
  { id: "chiseled_nether_bricks", label: "Brique du Nether ciselée", texturePath: "chiseled_nether_bricks" },
  { id: "cracked_nether_bricks", label: "Brique du Nether fissurée", texturePath: "cracked_nether_bricks" },
  { id: "quartz_bricks", label: "Brique de quartz", texturePath: "quartz_bricks" },
  { id: "quartz_ore", label: "Minerai de quartz", texturePath: "quartz_ore" },
  { id: "purpur_block", label: "Bloc de purpur", texturePath: "purpur_block" },
  { id: "blackstone", label: "Blackstone", texturePath: "blackstone" },
  { id: "polished_blackstone", label: "Blackstone polie", texturePath: "polished_blackstone" },
  { id: "gilded_blackstone", label: "Blackstone dorée", texturePath: "gilded_blackstone" },
  { id: "shroomlight", label: "Luminescence fongique", texturePath: "shroomlight" },
  { id: "soul_sand", label: "Sable des âmes", texturePath: "soul_sand" },
  { id: "soul_soil", label: "Terre des âmes", texturePath: "soul_soil" },
  { id: "magma", label: "Bloc de magma", texturePath: "magma" },
  { id: "glowstone", label: "Pierre lumineuse", texturePath: "glowstone" },
  { id: "sea_lantern", label: "Lanterne des mers", texturePath: "sea_lantern" },
  { id: "honeycomb_block", label: "Bloc de rayon de miel", texturePath: "honeycomb" },
  { id: "moss_block", label: "Bloc de mousse", texturePath: "moss_block" },
  { id: "mud", label: "Boue", texturePath: "mud" },
  { id: "mud_bricks", label: "Brique de boue", texturePath: "mud_bricks" },
  { id: "packed_mud", label: "Boue tassée", texturePath: "packed_mud" },
  { id: "sponge", label: "Éponge", texturePath: "sponge" },
  { id: "sponge_wet", label: "Éponge humide", texturePath: "sponge_wet" },
  { id: "dragon_egg", label: "Œuf de dragon", texturePath: "dragon_egg" },
  { id: "crying_obsidian", label: "Obsidienne pleureuse", texturePath: "crying_obsidian" },
  { id: "raw_gold_block", label: "Bloc de brut d'or", texturePath: "raw_gold_block" },
  { id: "raw_iron_block", label: "Bloc de fer brut", texturePath: "raw_iron_block" },
  { id: "slime", label: "Bloc de slime", texturePath: "slime" },
  { id: "prismarine_rough", label: "Prismarine", texturePath: "prismarine_rough" },
  { id: "prismarine_bricks", label: "Brique de prismarine", texturePath: "prismarine_bricks" },
  { id: "prismarine_dark", label: "Prismarine sombre", texturePath: "prismarine_dark" },
  { id: "tinted_glass", label: "Verre teinté (opaque)", texturePath: "tinted_glass" },
  { id: "nether_wart_block", label: "Bloc d'excroissance du Nether", texturePath: "nether_wart_block" },
  { id: "warped_wart_block", label: "Bloc d'excroissance déformée", texturePath: "warped_wart_block" },
];

function simpleBlockSlot({ id, label }, targetPath) {
  return { id, label, targetPath: targetPath ?? `textures/blocks/${id}.png`, variants: [] };
}

export const blocks = {
  id: "blocs",
  label: "Blocs",
  slots: [
    {
      id: "crafting_table",
      label: "Table de craft",
      faces: [
        { id: "top", label: "Dessus", targetPath: "textures/blocks/crafting_table_top.png", variants: [] },
        { id: "front", label: "Face avant", targetPath: "textures/blocks/crafting_table_front.png", variants: [] },
        { id: "side", label: "Côtés", targetPath: "textures/blocks/crafting_table_side.png", variants: [] },
        { id: "bottom", label: "Dessous", targetPath: "textures/blocks/planks_oak.png", variants: [] },
      ],
    },
    ...PLANK_TYPES.map((t) => simpleBlockSlot({ id: `${t.id}_planks`, label: `Planches de ${t.label.toLowerCase()}` }, `textures/blocks/${t.id}_planks.png`)),
    ...ORE_TYPES.map((t) => simpleBlockSlot(t)),
    ...MINERAL_BLOCKS.map((t) => simpleBlockSlot(t)),
    ...BASIC_BLOCKS.map((t) => simpleBlockSlot(t)),
    ...LAINE.map((t) => simpleBlockSlot(t, `textures/blocks/${t.texturePath}.png`)),
    ...BETON.map((t) => simpleBlockSlot(t, `textures/blocks/${t.texturePath}.png`)),
    ...BETON_POUDRE.map((t) => simpleBlockSlot(t, `textures/blocks/${t.texturePath}.png`)),
    ...VERRE_TEINTE.map((t) => simpleBlockSlot(t, `textures/blocks/${t.texturePath}.png`)),
    ...TERRE_CUITE.map((t) => simpleBlockSlot(t, `textures/blocks/${t.texturePath}.png`)),
    ...TERRE_CUITE_VERNISSEE.map((t) => simpleBlockSlot(t, `textures/blocks/${t.texturePath}.png`)),
    ...BOUGIES.map((t) => simpleBlockSlot(t, `textures/blocks/${t.texturePath}.png`)),
    ...PIERRES_VARIANTES.map((t) => simpleBlockSlot(t, `textures/blocks/${t.texturePath}.png`)),
    ...DEEPSLATE.map((t) => simpleBlockSlot(t, `textures/blocks/${t.texturePath}.png`)),
    ...CUIVRE.map((t) => simpleBlockSlot(t, `textures/blocks/${t.texturePath}.png`)),
    ...NETHER_END_DIVERS.map((t) => simpleBlockSlot(t, `textures/blocks/${t.texturePath}.png`)),
  ],
};
