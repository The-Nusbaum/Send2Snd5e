/**
 * Send2Snd - A FoundryVTT v13 Module
 * Adds an icon to item window title bars
 */

// Module Constants
const MODULE_ID = 'send2snd';
const SND_USERNAME = 'cashmerecthulu';

// Template content embedded for API setup
const TEMPLATES = {
  items: `<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', sans-serif; font-size: 16pt; line-height: 1.3; }
  .card { padding: 4mm 2mm; }
  .header { border-bottom: 2px solid #000; padding-bottom: 2mm; margin-bottom: 2mm; display: flex; gap: 4mm; }
  .header-text { flex: 1; }
  .header-img { width: 27mm; height: 27mm; object-fit: contain; border: 2px solid #000; order: 2; background: #000; filter: brightness(calc(100% + 25%)) grayscale(100%) contrast(1000%); }
  .name { font-size: 16pt; font-weight: bold; text-transform: uppercase; }
  .type { font-size: 12pt; font-style: italic; margin-top: 1mm; }
  .rarity { display: block; font-size: 11pt; font-weight: bold; text-transform: uppercase; margin-top: 1mm; }
  .attune { display: block; font-size: 11pt; font-style: italic; margin-top: 1mm; }
  .stat { display: flex; justify-content: space-between; font-size: 14pt; border-bottom: 1px dotted #000; padding: 1mm 0; }
  .stat:last-child { border-bottom: none; }
  .stat-label { font-weight: bold; }
  .props { font-size: 12pt; font-style: italic; margin: 2mm 0; padding: 1mm; border: 1px dotted #000; }
  .desc { font-size: 14pt; margin-top: 2mm; padding-top: 2mm; border-top: 2px solid #000; text-align: justify; }
  .desc p { margin-bottom: 2mm; }
  .desc p:last-child { margin-bottom: 0; }
  .source { font-size: 10pt; text-align: right; margin-top: 2mm; border-top: 1px dotted #000; padding-top: 1mm; }
</style>
<div class="card">
  <div class="header">
    {% if it.imgBase64 %}<img class="header-img" src="{{ it.imgBase64 }}" alt="">{% elif it.img %}<img class="header-img" src="{{ it.img }}" alt="">{% endif %}
    <div class="header-text">
    <div class="name">{{ it.name }}</div>
    <div class="type">
      {%- if it.type == "weapon" -%}
        {{ it.system.type.baseItem | default("Weapon") | capitalize }}{% if it.system.magicalBonus %} +{{ it.system.magicalBonus }}{% endif %}
      {%- elif it.type == "equipment" -%}
        {{ it.system.type.value | replace("wondrous", "Wondrous Item") | capitalize }}
      {%- elif it.type == "consumable" -%}
        {{ it.system.type.value | capitalize }}
      {%- elif it.type == "loot" -%}
        {{ it.system.type.value | default("Gear") | capitalize }}
      {%- else -%}
        {{ it.type | capitalize }}
      {%- endif -%}
    </div>
    {% if it.system.rarity %}<div class="rarity">{{ it.system.rarity }}</div>{% endif %}
    {% if it.system.attunement == "required" %}<div class="attune">(requires attunement)</div>{% endif %}
    </div>
  </div>
  {% if it.type == "weapon" and it.system.damage and it.system.damage.base %}
  <div class="stat">
    <span class="stat-label">Damage</span>
    <span>{{ it.system.damage.base.number }}d{{ it.system.damage.base.denomination }}{% if it.system.magicalBonus %}+{{ it.system.magicalBonus }}{% endif %} {{ it.system.damage.base.types[0] | default("") }}</span>
  </div>
  {% endif %}
  {% if it.type == "weapon" and (it.system.range.reach or it.system.range.value) %}
  <div class="stat">
    <span class="stat-label">Range</span>
    <span>{% if it.system.range.reach %}{{ it.system.range.reach }} ft{% endif %}{% if it.system.range.value %} / {{ it.system.range.value }}{% if it.system.range.long %}/{{ it.system.range.long }}{% endif %} ft{% endif %}</span>
  </div>
  {% endif %}
  {% if it.system.armor and it.system.armor.value %}
  <div class="stat">
    <span class="stat-label">AC</span>
    <span>{{ it.system.armor.value }}{% if it.system.armor.dex %} + Dex (max {{ it.system.armor.dex }}){% endif %}</span>
  </div>
  {% endif %}
  {% if it.system.weight and it.system.weight.value %}
  <div class="stat">
    <span class="stat-label">Weight</span>
    <span>{{ it.system.weight.value }} {{ it.system.weight.units }}</span>
  </div>
  {% endif %}
  {% if it.system.price and it.system.price.value %}
  <div class="stat">
    <span class="stat-label">Value</span>
    <span>{{ it.system.price.value }} {{ it.system.price.denomination }}</span>
  </div>
  {% endif %}
  {% if it.system.properties and it.system.properties.length > 0 %}
  <div class="props">
    {%- set propNames = {"mgc":"Magical","hvy":"Heavy","two":"Two-Handed","fin":"Finesse","lgt":"Light","thr":"Thrown","ver":"Versatile","amm":"Ammunition","lod":"Loading","rch":"Reach","spc":"Special","ada":"Adamantine","sil":"Silvered","stl":"Stealth Disadv."} -%}
    {% for prop in it.system.properties %}{{ propNames[prop] | default(prop) }}{% if not loop.last %}, {% endif %}{% endfor %}
  </div>
  {% endif %}
  <div class="desc">{{ it.system.description.value | safe }}</div>
  {% if it.system.source and it.system.source.book %}
  <div class="source">{{ it.system.source.book }}{% if it.system.source.page %} p.{{ it.system.source.page }}{% endif %}</div>
  {% endif %}
</div>`,

  spells: `<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', sans-serif; font-size: 16pt; line-height: 1.3; }
  .card { padding: 4mm 2mm; }
  .header { border-bottom: 2px solid #000; padding-bottom: 2mm; margin-bottom: 2mm; display: flex; gap: 4mm; }
  .header-text { flex: 1; }
  .header-img { width: 27mm; height: 27mm; object-fit: contain; border: 2px solid #000; order: 2; background: #000; filter: brightness(calc(100% + 25%)) grayscale(100%) contrast(1000%); }
  .name { font-size: 16pt; font-weight: bold; text-transform: uppercase; }
  .level-school { font-size: 12pt; font-style: italic; margin-top: 1mm; }
  .concentration { display: block; font-size: 11pt; font-weight: bold; text-transform: uppercase; margin-top: 1mm; }
  .ritual { display: block; font-size: 11pt; font-style: italic; margin-top: 1mm; }
  .stat { display: flex; justify-content: space-between; font-size: 14pt; border-bottom: 1px dotted #000; padding: 1mm 0; }
  .stat:last-child { border-bottom: none; }
  .stat-label { font-weight: bold; }
  .materials { font-size: 12pt; margin: 2mm 0; }
  .desc { font-size: 14pt; margin-top: 2mm; padding-top: 2mm; border-top: 2px solid #000; text-align: justify; }
  .desc p { margin-bottom: 2mm; }
  .desc p:last-child { margin-bottom: 0; }
  .source { font-size: 10pt; text-align: right; margin-top: 2mm; border-top: 1px dotted #000; padding-top: 1mm; }
</style>
<div class="card">
  <div class="header">
    {% if it.imgBase64 %}<img class="header-img" src="{{ it.imgBase64 }}" alt="">{% elif it.img %}<img class="header-img" src="{{ it.img }}" alt="">{% endif %}
    <div class="header-text">
      <div class="name">{{ it.name }}</div>
      <div class="level-school">
        {%- set schools = {"abj":"Abjuration","con":"Conjuration","div":"Divination","enc":"Enchantment","evo":"Evocation","ill":"Illusion","nec":"Necromancy","trs":"Transmutation"} -%}
        {%- if it.system.level == 0 -%}
          {{ schools[it.system.school] | default(it.system.school) }} cantrip
        {%- else -%}
          {{ it.system.level }}{{ ["st","nd","rd"][it.system.level - 1] | default("th") }}-level {{ schools[it.system.school] | default(it.system.school) | lower }}
        {%- endif -%}
      </div>
      {% if it.system.duration.concentration %}<div class="concentration">Concentration</div>{% endif %}
      {% if it.system.properties and "ritual" in it.system.properties %}<div class="ritual">(ritual)</div>{% endif %}
    </div>
  </div>
  <div class="stat">
    <span class="stat-label">Casting Time</span>
    <span>
      {%- set actTypes = {"action":"1 action","bonus":"1 bonus action","reaction":"1 reaction","minute":"minute","hour":"hour"} -%}
      {%- if it.system.activation.type in ["action","bonus","reaction"] -%}
        {{ actTypes[it.system.activation.type] }}
      {%- else -%}
        {{ it.system.activation.value }} {{ it.system.activation.type }}{% if it.system.activation.value > 1 %}s{% endif %}
      {%- endif -%}
    </span>
  </div>
  <div class="stat">
    <span class="stat-label">Range</span>
    <span>
      {%- if it.system.range.units == "self" -%}
        Self{% if it.system.target.template.size %} ({{ it.system.target.template.size }}-ft {{ it.system.target.template.type }}){% endif %}
      {%- elif it.system.range.units == "touch" -%}
        Touch
      {%- elif it.system.range.units == "spec" -%}
        Special
      {%- elif it.system.range.units == "any" -%}
        Unlimited
      {%- else -%}
        {{ it.system.range.value }} {{ it.system.range.units }}
      {%- endif -%}
    </span>
  </div>
  <div class="stat">
    <span class="stat-label">Duration</span>
    <span>
      {%- if it.system.duration.concentration %}Concentration, up to {% endif -%}
      {%- if it.system.duration.units == "inst" -%}
        Instantaneous
      {%- elif it.system.duration.units == "perm" -%}
        Until dispelled
      {%- elif it.system.duration.units == "spec" -%}
        Special
      {%- else -%}
        {{ it.system.duration.value }} {{ it.system.duration.units }}{% if it.system.duration.value > 1 %}s{% endif %}
      {%- endif -%}
    </span>
  </div>
  {% if it.system.properties %}
  <div class="stat">
    <span class="stat-label">Components</span>
    <span>
      {%- set comps = [] -%}
      {%- if "vocal" in it.system.properties %}{% set comps = comps.concat(["V"]) %}{% endif -%}
      {%- if "somatic" in it.system.properties %}{% set comps = comps.concat(["S"]) %}{% endif -%}
      {%- if "material" in it.system.properties %}{% set comps = comps.concat(["M"]) %}{% endif -%}
      {{ comps | join(", ") }}
    </span>
  </div>
  {% endif %}
  {% if it.system.materials and it.system.materials.value %}
  <div class="materials">
    <em>{{ it.system.materials.value }}{% if it.system.materials.consumed %} (consumed){% endif %}</em>
  </div>
  {% endif %}
  <div class="desc">{{ it.system.description.value | safe }}</div>
  {% if it.system.source and it.system.source.book %}
  <div class="source">{{ it.system.source.book }}{% if it.system.source.page %} p.{{ it.system.source.page }}{% endif %}</div>
  {% endif %}
</div>`,

  features: `<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', sans-serif; font-size: 16pt; line-height: 1.3; }
  .card { padding: 4mm 2mm; }
  .header { border-bottom: 2px solid #000; padding-bottom: 2mm; margin-bottom: 2mm; display: flex; gap: 4mm; }
  .header-text { flex: 1; }
  .header-img { width: 27mm; height: 27mm; object-fit: contain; border: 2px solid #000; order: 2; background: #000; filter: brightness(calc(100% + 25%)) grayscale(100%) contrast(1000%); }
  .name { font-size: 16pt; font-weight: bold; text-transform: uppercase; }
  .type { font-size: 12pt; font-style: italic; margin-top: 1mm; }
  .desc { font-size: 14pt; margin-top: 2mm; padding-top: 2mm; border-top: 2px solid #000; text-align: justify; }
  .desc p { margin-bottom: 2mm; }
  .desc p:last-child { margin-bottom: 0; }
  .source { font-size: 10pt; text-align: right; margin-top: 2mm; border-top: 1px dotted #000; padding-top: 1mm; }
</style>
<div class="card">
  <div class="header">
    {% if it.imgBase64 %}<img class="header-img" src="{{ it.imgBase64 }}" alt="">{% elif it.img %}<img class="header-img" src="{{ it.img }}" alt="">{% endif %}
    <div class="header-text">
      <div class="name">{{ it.name }}</div>
      <div class="type">
        {%- if it.type == "feat" -%}
          {%- set featTypes = {"feat":"Feat","class":"Class Feature","race":"Racial Trait","background":"Background Feature"} -%}
          {{ featTypes[it.system.type.value] | default("Feature") }}
        {%- else -%}
          {{ it.type | capitalize }}
        {%- endif -%}
      </div>
    </div>
  </div>
  <div class="desc">{{ it.system.description.value | safe }}</div>
  {% if it.system.source and it.system.source.book %}
  <div class="source">{{ it.system.source.book }}{% if it.system.source.page %} p.{{ it.system.source.page }}{% endif %}</div>
  {% endif %}
</div>`
};

// Simple SVG placeholder icons as base64 for skeleton data
const PLACEHOLDER_ICONS = {
  weapon: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzMzMyIvPjxwYXRoIGQ9Ik0yMCA4MEw4MCAyME03NSAyNUw4MCAyMEw3NSAxNU02MCAzMEw0MCA1ME0zNSA1NUwyMCA3MCIgc3Ryb2tlPSIjY2NjIiBzdHJva2Utd2lkdGg9IjQiIGZpbGw9Im5vbmUiLz48L3N2Zz4=",
  spell: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzIyMjI0NCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMwIiBmaWxsPSJub25lIiBzdHJva2U9IiM4OGFhZmYiIHN0cm9rZS13aWR0aD0iMyIvPjxwYXRoIGQ9Ik01MCAyMEw1MCA4ME0yMCA1MEw4MCA1ME0yOCAyOEw3MiA3Mk0yOCA3Mkw3MiAyOCIgc3Ryb2tlPSIjODhhYWZmIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=",
  feat: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzQ0MzMyMiIvPjxwYXRoIGQ9Ik01MCAxNUw2MSA0MEw4OCA0MEw2NyA1N0w3NiA4NUw1MCA2OEwyNCA4NUwzMyA1N0wxMiA0MEwzOSA0MFoiIGZpbGw9IiNmZmNjMDAiLz48L3N2Zz4="
};

// Skeleton data for template previews
const SKELETON_DATA = {
  items: {
    name: "Ascendant Dragon's Wrath Maul",
    img: PLACEHOLDER_ICONS.weapon,
    imgBase64: PLACEHOLDER_ICONS.weapon,
    type: "weapon",
    system: {
      type: { value: "martialM", baseItem: "maul" },
      rarity: "legendary",
      attunement: "required",
      attuned: true,
      damage: {
        base: { denomination: 6, number: 2, types: ["bludgeoning"] }
      },
      properties: ["hvy", "mgc", "two"],
      weight: { value: 10, units: "lb" },
      price: { value: 0, denomination: "gp" },
      description: {
        value: "<p>This weapon is decorated with dragon heads, claws, wings, scales, or Draconic letters. When it steeps in a dragon's hoard, it absorbs the energy of the dragon's breath weapon and deals damage of that type with its special properties.</p><p>You gain a +3 bonus to attack and damage rolls made using the weapon. On a hit, the weapon deals an extra 3d6 damage of the type dealt by the dragon's breath weapon.</p>"
      },
      source: { book: "FTD", page: "25" }
    }
  },
  spells: {
    name: "Acid Arrow",
    img: PLACEHOLDER_ICONS.spell,
    imgBase64: PLACEHOLDER_ICONS.spell,
    type: "spell",
    system: {
      level: 2,
      school: "evo",
      properties: ["vocal", "somatic", "material"],
      materials: { value: "powdered rhubarb leaf", consumed: false },
      activation: { type: "action", value: 1 },
      range: { value: "90", units: "ft" },
      duration: { value: null, units: "inst", concentration: false },
      description: {
        value: "<p>A shimmering green arrow streaks toward a target within range and bursts in a spray of acid. Make a ranged spell attack against the target. On a hit, the target takes 4d4 acid damage immediately and 2d4 acid damage at the end of its next turn. On a miss, the arrow splashes the target with acid for half as much of the initial damage and no damage at the end of its next turn.</p>"
      },
      source: { book: "PHB", page: "259" }
    }
  },
  features: {
    name: "Alert",
    img: PLACEHOLDER_ICONS.feat,
    imgBase64: PLACEHOLDER_ICONS.feat,
    type: "feat",
    system: {
      type: { value: "feat", subtype: "" },
      requirements: "",
      prerequisites: { level: null },
      description: {
        value: "<p>Always on the lookout for danger, you gain the following benefits:</p><ul><li>You gain a +5 bonus to initiative.</li><li>You can't be surprised while you are conscious.</li><li>Other creatures don't gain advantage on attack rolls against you as a result of being unseen by you.</li></ul>"
      },
      source: { book: "PHB", page: "165" }
    }
  }
};

/**
 * Initialize module settings
 */
function registerSettings() {
  game.settings.register(MODULE_ID, 'enabled', {
    name: game.i18n.localize(`${MODULE_ID}.settings.enabled.name`),
    hint: game.i18n.localize(`${MODULE_ID}.settings.enabled.hint`),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, 'apiHost', {
    name: 'API Host',
    hint: 'The SND API server address (e.g., http://localhost:7123)',
    scope: 'world',
    config: true,
    type: String,
    default: 'http://localhost:7123'
  });

  game.settings.register(MODULE_ID, 'setupComplete', {
    name: 'Setup Complete',
    scope: 'world',
    config: false,
    type: Boolean,
    default: false
  });

  game.settings.registerMenu(MODULE_ID, 'setupMenu', {
    name: 'Setup SND',
    label: 'Run Setup',
    hint: 'Create datasources and templates in the SND app',
    icon: 'fas fa-cogs',
    type: Send2SndSetup,
    restricted: true
  });
}

/**
 * Add the send2snd icon button to an item sheet's title bar
 * @param {ItemSheet} app - The item sheet application
 * @param {jQuery} html - The rendered HTML
 */
function addTitleBarIcon(app, html) {
  // Check if module is enabled
  if (!game.settings.get(MODULE_ID, 'enabled')) return;

  // Check if item type is supported
  const item = app.document;
  const itemType = item?.type;
  const featType = item?.system?.type?.value;
  
  // Supported types: items, spells, feats, class features, race features
  const supportedItemTypes = ['weapon', 'equipment', 'consumable', 'tool', 'loot', 'container', 'spell', 'wondrous'];
  const supportedFeatTypes = ['feat', 'class', 'race'];
  
  const isSupported = supportedItemTypes.includes(itemType) || 
                      (itemType === 'feat' && supportedFeatTypes.includes(featType));
  
  if (!isSupported) return;

  // Find the window header
  const header = $(html).closest('form').find('.window-header');
  if (!header.length) return;

  // Check if icons already exist (prevent duplicates on re-render)
  if (header.find('.send2snd-header-button').length) return;

  // Create the icon button
  const iconButton = $(`
    <a class="send2snd-header-button" data-tooltip="${game.i18n.localize(`${MODULE_ID}.ui.buttonTooltip`)}">
      <i class="fas fa-print"></i>
    </a>
  `);

  // Add click handler
  iconButton.on('click', (event) => {
    event.preventDefault();
    onSend2SndClick(app.document);
  });

  // Insert before the close button
  const closeButton = header.find('.header-button.close');
  if (closeButton.length) {
    iconButton.insertBefore(closeButton);
  } else {
    // Fallback: append to window header
    header.find('.window-title').after(iconButton);
  }
}

/**
 * Clean 5e.tools syntax from a string
 * @param {string} str - The string to clean
 * @returns {string} - Cleaned string
 */
function clean5eToolsSyntax(str) {
  if (!str) return '';
  const abilities = {
    str: 'Strength',
    dex: 'Dexterity',
    con: 'Constitution',
    int: 'Intelligence',
    wis: 'Wisdom',
    cha: 'Charisma'
  };
  return str
    .replace(/<hr\s*\/?>/g, '')
    .replace(/<div class="rd__b[^"]*">/g, '')
    .replace(/<div>/g, '')
    .replace(/<\/div>/g, '')
    .replace(/\[\[\/damage\s+([^\]]+)\]\]/g, '$1')
    .replace(/\[\[\/save\s+ability=(\w+)\s+dc=(\d+)\]\]/g, (m, ab, dc) => `DC ${dc} ${abilities[ab] || ab}`)
    .replace(/\[\[\/r\s+([^\]]+)\]\]/g, '$1')
    .replace(/@item\[([^\]|]+)\|?[^\]]*\]/g, '$1')
    .replace(/@spell\[([^\]|]+)\|?[^\]]*\]/g, '$1')
    .replace(/@creature\[([^\]|]+)\|?[^\]]*\]/g, '$1')
    .replace(/@condition\[([^\]|]+)\|?[^\]]*\]/g, '$1')
    .replace(/@feat\[([^\]|]+)\|?[^\]]*\]/g, '$1')
    .replace(/@class\[([^\]|]+)\|?[^\]]*\]/g, '$1')
    .replace(/@race\[([^\]|]+)\|?[^\]]*\]/g, '$1')
    .replace(/@background\[([^\]|]+)\|?[^\]]*\]/g, '$1')
    .replace(/@skill\[([^\]|]+)\|?[^\]]*\]/g, '$1')
    .replace(/@action\[([^\]|]+)\|?[^\]]*\]/g, '$1')
    .replace(/<a[^>]*href="https?:\/\/5e\.tools[^"]*"[^>]*>([^<]*)<\/a>/g, '$1')
    .replace(/class="[^"]*rd__[^"]*"/g, '')
    .replace(/data-[a-z-]+="[^"]*"/g, '')
    .replace(/^\s+/, '')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

/**
 * Convert an image URL to a base64 data URI
 * @param {string} imgPath - The image path
 * @returns {Promise<string|null>} - Base64 data URI or null if failed
 */
async function imageToBase64(imgPath) {
  if (!imgPath) return null;
  
  // Try canvas approach for all images (works better with CORS)
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        console.warn(`${MODULE_ID} | Canvas conversion failed:`, e);
        resolve(null);
      }
    };
    img.onerror = () => {
      console.warn(`${MODULE_ID} | Failed to load image:`, imgPath);
      resolve(null);
    };
    img.src = imgPath;
  });
}

/**
 * Prepare item data for sending, cleaning 5e.tools syntax
 * @param {Item} item - The item document
 * @returns {Promise<Object>} - Cleaned item data with base64 image
 */
async function prepareItemData(item) {
  const data = item.toObject();
  if (data.system?.description?.value) {
    data.system.description.value = clean5eToolsSyntax(data.system.description.value);
  }
  if (item.img) {
    data.imgBase64 = await imageToBase64(item.img);
  }
  return data;
}

/**
 * Setup Form Application
 */
class Send2SndSetup extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: 'send2snd-setup',
      title: 'Send2Snd Setup',
      template: `modules/${MODULE_ID}/templates/setup.html`,
      width: 400,
      height: 'auto'
    });
  }

  getData() {
    const apiHost = game.settings.get(MODULE_ID, 'apiHost');
    return { apiHost, username: SND_USERNAME };
  }

  async _updateObject(event, formData) {
    // Settings are saved automatically
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find('#setup-datasources').click(() => this._setupDatasources());
    html.find('#setup-templates').click(() => this._setupTemplates());
    html.find('#setup-all').click(() => this._setupAll());
  }

  async _setupDatasources() {
    const apiHost = game.settings.get(MODULE_ID, 'apiHost');
    const datasources = [
      { name: 'Send2Snd Items', slug: 'send2snd-items', description: 'D&D 5e items from FoundryVTT' },
      { name: 'Send2Snd Spells', slug: 'send2snd-spells', description: 'D&D 5e spells from FoundryVTT' },
      { name: 'Send2Snd Features', slug: 'send2snd-features', description: 'D&D 5e features from FoundryVTT' }
    ];
    
    ui.notifications.info('Creating datasources...');
    
    for (const ds of datasources) {
      try {
        await fetch(`${apiHost}/api/saveSource`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([{
            name: ds.name,
            slug: ds.slug,
            author: SND_USERNAME,
            description: ds.description,
            version: '1.0.0'
          }])
        });
        console.log(`${MODULE_ID} | Created datasource: ${ds.slug}`);
      } catch (e) {
        console.error(`${MODULE_ID} | Failed to create datasource ${ds.slug}:`, e);
        ui.notifications.error(`Failed to create datasource: ${ds.slug}`);
        return;
      }
    }
    
    ui.notifications.info('Datasources created successfully!');
  }

  async _setupTemplates() {
    const apiHost = game.settings.get(MODULE_ID, 'apiHost');
    const templates = [
      { 
        name: 'Send2Snd Items', 
        slug: 'send2snd-items', 
        description: 'Template for D&D 5e items',
        printTemplate: TEMPLATES.items,
        skeletonData: SKELETON_DATA.items,
        dataSources: [`ds:${SND_USERNAME}+send2snd-items`]
      },
      { 
        name: 'Send2Snd Spells', 
        slug: 'send2snd-spells', 
        description: 'Template for D&D 5e spells',
        printTemplate: TEMPLATES.spells,
        skeletonData: SKELETON_DATA.spells,
        dataSources: [`ds:${SND_USERNAME}+send2snd-spells`]
      },
      { 
        name: 'Send2Snd Features', 
        slug: 'send2snd-features', 
        description: 'Template for D&D 5e features',
        printTemplate: TEMPLATES.features,
        skeletonData: SKELETON_DATA.features,
        dataSources: [`ds:${SND_USERNAME}+send2snd-features`]
      }
    ];
    
    ui.notifications.info('Creating templates...');
    
    for (const tmpl of templates) {
      try {
        await fetch(`${apiHost}/api/saveTemplate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([{
            name: tmpl.name,
            slug: tmpl.slug,
            author: SND_USERNAME,
            description: tmpl.description,
            copyrightNotice: '',
            printTemplate: tmpl.printTemplate,
            listTemplate: '',
            skeletonData: tmpl.skeletonData,
            images: {},
            config: [],
            dataSources: tmpl.dataSources,
            version: '1.0.0'
          }])
        });
        console.log(`${MODULE_ID} | Created template: ${tmpl.slug}`);
      } catch (e) {
        console.error(`${MODULE_ID} | Failed to create template ${tmpl.slug}:`, e);
        ui.notifications.error(`Failed to create template: ${tmpl.slug}`);
        return;
      }
    }
    
    ui.notifications.info('Templates created successfully!');
  }

  async _setupAll() {
    await this._setupDatasources();
    await this._setupTemplates();
    await game.settings.set(MODULE_ID, 'setupComplete', true);
    ui.notifications.info('Setup complete!');
  }
}

/**
 * Get the data source for a given item type
 * @param {string} type - The item type
 * @returns {string} - The data source identifier
 */
function getDataSource(type) {
  switch (type) {
    case 'spell':
      return `ds:${SND_USERNAME}+send2snd-spells`;
    case 'feat':
    case 'class':
    case 'subclass':
    case 'race':
    case 'background':
      return `ds:${SND_USERNAME}+send2snd-features`;
    case 'weapon':
    case 'equipment':
    case 'consumable':
    case 'tool':
    case 'loot':
    case 'container':
    default:
      return `ds:${SND_USERNAME}+send2snd-items`;
  }
}

/**
 * Save an item entry to S&D
 * @param {Item} item - The item document
 * @returns {Promise<boolean>} - True if successful
 */
async function saveEntryToSnd(item) {
  const apiHost = game.settings.get(MODULE_ID, 'apiHost');
  const cleanedItem = await prepareItemData(item);
  const dataSource = getDataSource(item.type);

  const response = await fetch(`${apiHost}/api/saveEntry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([dataSource, {id: item._id, name: item.name, data: cleanedItem}])
  });

  return response.ok;
}

/**
 * Print an item entry from S&D
 * @param {Item} item - The item document
 * @returns {Promise<boolean>} - True if successful
 */
async function printEntryFromSnd(item) {
  const apiHost = game.settings.get(MODULE_ID, 'apiHost');
  const dataSource = getDataSource(item.type);
  const templateId = dataSource.replace('ds:', 'tmpl:');

  const response = await fetch(`${apiHost}/api/printTemplateEntry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([templateId, item._id, {}])
  });

  return response.ok;
}

/**
 * Handle the send2snd button click
 * @param {Item} item - The item document
 */
async function onSend2SndClick(item) {
  console.log(`${MODULE_ID} | Button clicked for item:`, item.name);

  if (!game.settings.get(MODULE_ID, 'setupComplete')) {
    ui.notifications.warn('Send2SND: Please run Setup from Module Settings before sending items.');
    return;
  }

  try {
    const saveSuccess = await saveEntryToSnd(item);
    if (!saveSuccess) {
      ui.notifications.error(`Failed to send ${item.name}`);
      return;
    }

    const printSuccess = await printEntryFromSnd(item);
    if (printSuccess) {
      ui.notifications.info(`Printed ${item.name}`);
    } else {
      ui.notifications.warn(`Sent ${item.name} but failed to print`);
    }
  } catch (e) {
    console.error(`${MODULE_ID} | Failed to send/print item:`, e);
    ui.notifications.error(`Failed to connect to SND API`);
  }
}

/**
 * Module initialization hook
 */
Hooks.once('init', () => {
  console.log(`${MODULE_ID} | Initializing module`);
  registerSettings();
});

/**
 * Ready hook
 */
Hooks.once('ready', () => {
  console.log(`${MODULE_ID} | Module ready`);
  
  if (!game.settings.get(MODULE_ID, 'setupComplete')) {
    ui.notifications.warn('Send2SND: Please run Setup from Module Settings to configure datasources and templates.');
  }
});

/**
 * Hook into item sheet rendering to add our icon
 * Covers all item types including spells
 */
Hooks.on('renderItemSheet5e', (app, html, data) => {
  addTitleBarIcon(app, html);
});

Hooks.on('renderItemSheet', (app, html, data) => {
  addTitleBarIcon(app, html);
});

// Export for external access if needed
export { MODULE_ID, onSend2SndClick };
