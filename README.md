# Send2Snd5e

A FoundryVTT module that integrates with [S&D (Sales & Dungeons)](https://sales-and-dungeons.app/) to print D&D 5e items, spells, and features on thermal receipt printers.

## Features

- Adds a print icon to item, spell, and feature sheets
- Automatically formats data for 58mm thermal receipt printers
- Converts item images to base64 for embedded printing
- Supports items, spells, feats, class features, and race/species traits

## Requirements

- FoundryVTT v13+
- D&D 5e System v5.0.0+
- [S&D (Sales & Dungeons)](https://sales-and-dungeons.app/) application running locally

## Installation

### Manual Installation
1. Download or clone this repository
2. Place the `send2snd` folder in `{userData}/Data/modules/`
3. Restart Foundry VTT
4. Enable the module in your world's **Module Settings**

## Setup

### Step 1: Ensure S&D is Running
Make sure the S&D application is running on your computer. By default, it runs on `http://localhost:7123`.

### Step 2: Run Module Setup
1. In FoundryVTT, go to **Game Settings** > **Configure Settings** > **Module Settings**
2. Find **Send2Snd5e** settings
3. Verify the **API Host** is correct (default: `http://localhost:7123`)
4. Click **Run Setup** to open the setup dialog
5. Click **Setup Everything** to create the required datasources and templates in S&D

This will create:
- **Datasources**: `send2snd-items`, `send2snd-spells`, `send2snd-features`
- **Templates**: Matching print templates for each datasource

### Step 3: Start Printing
1. Open any item, spell, or feature sheet in FoundryVTT
2. Click the **print icon** in the sheet's title bar
3. The entry will be sent to S&D and can be printed from there

## Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| Enabled | Enable/disable the module | `true` |
| API Host | S&D API server address | `http://localhost:7123` |

## Data Flow

```
FoundryVTT Item Sheet
        │
        ▼
   [Print Icon Click]
        │
        ▼
   Clean 5e.tools syntax
   Convert image to base64
        │
        ▼
   POST to S&D API
   /api/saveEntry
        │
        ▼
   S&D Datasource
   (send2snd-items/spells/features)
        │
        ▼
   Print via S&D Template
```

## Templates

The module includes three optimized templates for thermal printing:

### Item Card
- Item name, type, rarity
- Attunement requirements
- Damage, weight, price, properties
- Full description
- Source reference

### Spell Card
- Spell name, level, school
- Concentration/Ritual indicators
- Casting time, range, duration
- Components (V, S, M) with materials
- Full description
- Source reference

### Feature Card
- Feature name and type
- Full description
- Source reference

## Troubleshooting

### "Please run Setup" message
You'll see this notification on first load. Click **Run Setup** in module settings to create the required datasources and templates in S&D.

### Items not sending
1. Verify S&D is running at the configured API Host
2. Check the browser console (F12) for error messages
3. Ensure you've completed the setup process

### Images not appearing
The module attempts to convert images to base64. Some external images may fail due to CORS restrictions. Local Foundry icons should work without issues.

## File Structure

```
send2snd/
├── module.json          # Module manifest
├── README.md            # This file
├── scripts/
│   └── module.js        # Main module code & embedded templates
├── styles/
│   └── module.css       # Module styles
├── lang/
│   └── en.json          # English localization
├── templates/
│   ├── item-card.html   # Item print template (standalone)
│   ├── spell-card.html  # Spell print template (standalone)
│   ├── feature-card.html# Feature print template (standalone)
│   └── setup.html       # Setup dialog template
└── data/                # Sample data files for testing
```

## License

MIT License

## Credits

- Built for use with [S&D (Sales & Dungeons)](https://sales-and-dungeons.app/)
- Designed for the D&D 5e system on FoundryVTT
