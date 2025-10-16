# MatchCollection Version History

## Version 0 (Legacy - No Version Field)
**Files:** `casuals_collection.json`, `ranked_collection.json`

### Structure:
- No `version` field
- Uses `id` field (number) instead of `uuid` (string)
- Matches use `id` field instead of `uuid`
- **All matches have `playerElo` and `opponentElo` fields** (even in non-ranked collections)
  - In non-ranked collections: `playerElo` and `opponentElo` are set to `0`
  - In ranked collections: `playerElo` and `opponentElo` contain actual ELO values

### Example (Non-Ranked):
```json
{
  "id": 3,
  "createdAt": "2025-07-25T15:34:33.361Z",
  "updatedAt": "2025-07-28T19:15:45.269Z",
  "name": "casuals",
  "type": "casual",
  "description": "radoms in casuals",
  "matches": [
    {
      "id": 1,
      "playerElo": 0,
      "opponentElo": 0,
      "opponentName": "GarraTigre",
      "rounds": [...],
      "links": []
    }
  ]
}
```

**Migration Path:** Version 0 → Version 1
- `id` field is removed
- `uuid` field is generated (crypto.randomUUID())
- `version: 1` is added to collection
- Match `id` fields are replaced with `uuid`
- **For non-ranked collections:** `playerElo` and `opponentElo` fields are removed from matches
- **For ranked collections:** `playerElo` and `opponentElo` fields are kept

---

## Version 1
**Files:** `casuals_collection(1).json`, `ranked_collection(3).json`

### Structure:
- Adds `version: 1` field
- Uses `uuid` field (string) instead of `id` (number)
- Matches use `uuid` field instead of `id`
- Collection has all required fields: `uuid`, `version`, `createdAt`, `updatedAt`, `name`, `type`, `description`, `matches`
- **Type-based match distinction:**
  - **RankedMatchCollection:** Matches have `playerElo` and `opponentElo` fields (actual ELO values)
  - **Non-Ranked Collections:** Matches DO NOT have `playerElo` and `opponentElo` fields

### Example (Non-Ranked):
```json
{
  "createdAt": "2025-07-25T15:34:33.361Z",
  "updatedAt": "2025-08-14T21:18:42.125Z",
  "name": "casuals",
  "type": "casual",
  "description": "radoms in casuals",
  "matches": [
    {
      "opponentName": "GarraTigre",
      "rounds": [...],
      "links": [],
      "uuid": "e99b4ea7-9f74-48b6-867c-4c8b9c246e23",
      "createdAt": "2025-08-03T23:15:40.149Z",
      "updatedAt": "2025-08-03T23:15:40.149Z"
    }
  ],
  "uuid": "8ffd219f-92b6-4e79-9b6a-7fb94f053419",
  "version": 1
}
```

### Example (Ranked):
```json
{
  "name": "ranked",
  "type": "ranked",
  "matches": [
    {
      "playerElo": 666,
      "opponentElo": 849,
      "opponentName": "Whalekitty",
      "rounds": [...],
      "links": [],
      "uuid": "62109d40-48b2-4320-9b3e-e4bbce4bd5ba",
      "createdAt": "2025-08-03T23:15:40.147Z",
      "updatedAt": "2025-08-03T23:15:40.147Z"
    }
  ],
  "uuid": "8f0f1051-1c4e-4501-9c1c-1c10e9f9111a",
  "version": 1
}
```

**Migration Path:** Version 1 → Version 2
- `readOnly: false` field is added
- `version: 2` is set

---

## Version 2 (Current)
**Introduced:** October 16, 2025

### Changes:
- Adds `readOnly: boolean` field to MatchCollection
- Default value: `readOnly: false`
- Collections cannot be edited when `readOnly: true`:
  - No new matches can be added
  - Existing matches cannot be modified
  - Existing matches cannot be deleted

### Structure:
```json
{
  "uuid": "...",
  "version": 2,
  "createdAt": "...",
  "updatedAt": "...",
  "name": "...",
  "type": "ranked|casual|friendly|tournament",
  "description": "...",
  "readOnly": false,
  "matches": [...]
}
```

### UI Changes:
1. **MatchCollectionOverview:**
   - New "Read Only" column in collection table
   - Toggle button to switch between `readOnly: true/false`
   - Visual indicator: 🔒 Read Only / ✏️ Editable

2. **MatchView:**
   - "Add Match" button is disabled and grayed out when `readOnly: true`
   - Button displays lock icon (🔒) instead of plus icon (+)
   - Collection details text turns light red (#ff9999) when read-only
   - Collection name prefixed with "read-only: " when `readOnly: true`

3. **MatchItem:**
   - Matches in read-only collections are not clickable
   - Click handler prevents modal from opening

### Store Validation:
The `matchStore` enforces read-only restrictions:
- `addMatchToCollection()` - checks `readOnly` before adding
- `updateMatch()` - checks `readOnly` before updating
- `deleteMatch()` - checks `readOnly` before deleting

All operations log warnings if attempted on read-only collections.

### Automatic Migration:
Existing Version 1 collections are automatically migrated to Version 2 on load:
- Function: `transformMatchesFromVersion1ToVersion2()` in `src/scripts/roa2.ts`
- Sets `readOnly: false` for all migrated collections
- Updates `version` field to `2`

---

## Version Comparison Table

| Feature | v0 | v1 | v2 |
|---------|----|----|-----|
| ID Field | `id` (number) | `uuid` (string) | `uuid` (string) |
| Version Field | ❌ | ✅ | ✅ |
| Read-Only Support | ❌ | ❌ | ✅ |
| ELO in All Matches | ✅ (0 in non-ranked) | ❌ (only in ranked) | ❌ (only in ranked) |
| Type-based Match | ❌ | ✅ (RankedMatch vs Match) | ✅ (RankedMatch vs Match) |
| Editable | ✅ (always) | ✅ (always) | ✅ (unless readOnly=true) |
| Migration Function | transformMatchesToVersion1 | transformMatchesFromVersion1ToVersion2 | - |

---

## Technical Details

### Current Version Constant
```typescript
export const CURRENT_MATCH_DATA_VERSION = 2
```

Location: `src/constants/match.ts`

### Migration Flow
```
Version 0 (legacy data)
         ↓
    transformMatchesToVersion1()
         ↓
Version 1 (app startup)
         ↓
    transformMatchesFromVersion1ToVersion2()
         ↓
Version 2 (current)
```

### References in JSON Files
- **Version 0:** Legacy files without version field - auto-detected as v0
- **Version 1:** `"version": 1` field present
- **Version 2:** `"version": 2` field present + `"readOnly": boolean` field
