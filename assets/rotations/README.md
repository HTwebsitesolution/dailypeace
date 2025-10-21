# Daily Peace Reflection Management System

This directory contains the automated merging system for Daily Peace reflection categories.

## 📁 Directory Structure

```
assets/rotations/
├── categories/           # Individual category files (source)
│   ├── peace_calm.json
│   ├── trust_provision.json
│   ├── courage_faith_action.json
│   └── ... (9 total categories)
├── messages.json         # Combined output file (auto-generated)
└── README.md            # This file
```

## 🔧 Usage

### Merge all categories into messages.json
```bash
npm run merge:messages
```

### Preview without writing (validation)
```bash
npm run merge:messages:dry
```

### Validate structure only
```bash
npm run merge:messages:validate
```

## 📝 Category File Format

Each category file should contain an array of reflection objects:

```json
[
  {
    "id": "peace_01",
    "category": "peace_calm", 
    "text": "My peace is not the silence of an empty room...",
    "verses": ["John 14:27", "Mark 4:39"]
  }
]
```

### Required Fields
- `id` (string): Unique identifier across all categories
- `category` (string): Category name matching filename
- `text` (string): The reflection content (60-100 words recommended)
- `verses` (array): Scripture references

### Optional Fields
- `tones` (object): Alternative text for different times
- `disclaimer` (string): Custom disclaimer override

## 🎯 Category System

**Current 9 Categories (10 reflections each = 90 total):**

1. **peace_calm** - Peace & Calm in Turmoil
2. **trust_provision** - Trust & Provision  
3. **purpose_direction** - Purpose & Direction
4. **forgiveness_compassion** - Forgiveness & Compassion
5. **hope_endurance** - Hope & Endurance
6. **gratitude_praise** - Gratitude & Praise
7. **courage_faith_action** - Courage & Faith in Action
8. **rest_renewal** - Rest & Renewal
9. **love_community** - Love & Community

## ✅ Validation Features

The merge script automatically:
- ✅ Validates required fields
- ✅ Checks for duplicate IDs across files
- ✅ Sanitizes and deduplicates verse arrays
- ✅ Normalizes whitespace in text
- ✅ Sorts output by category then ID
- ✅ Generates category summary statistics
- ✅ Warns if target count (90) isn't met

## 🚀 Workflow

### Adding New Reflections
1. Edit the appropriate category file in `categories/`
2. Run `npm run merge:messages:validate` to check
3. Run `npm run merge:messages` to rebuild `messages.json`
4. Commit both the category file and regenerated `messages.json`

### Creating New Categories
1. Create new `.json` file in `categories/`
2. Follow the standard format with 10 reflections
3. Run merge script to include in combined output
4. Update documentation

## 📊 Quality Standards

**Content Guidelines:**
- 60-100 words per reflection
- Jesus' gentle voice tone
- Biblically grounded with Scripture verses
- Emotionally intelligent and practical
- Production-ready quality

**Technical Standards:**
- Unique IDs following `{category}_{number}` pattern  
- Consistent category naming
- Valid JSON structure
- Proper verse formatting

## 🔍 Example Commands

```bash
# Standard workflow
npm run merge:messages:dry     # Preview changes
npm run merge:messages         # Apply changes

# Development
node mergeMessages.js --dry-run                    # Same as npm script
node mergeMessages.js custom/path custom/out.json  # Custom paths
```

## 🎭 Integration

The generated `messages.json` file is consumed by:
- `lib/notifications.ts` - Daily rotation algorithm
- Mobile app notification system
- Category-specific reflection selection

**Daily Peace automatically rotates through all 90 reflections using a day-of-year algorithm, ensuring users receive unique content for 3 months before any repetition.**