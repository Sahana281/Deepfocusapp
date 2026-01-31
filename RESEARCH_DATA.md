# Research Data Collection

This document describes the research data points collected by the DeepFocus app.

## Data Points Collected

Each completed focus session generates a research data record with the following fields:

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| `user_id` | string | Unique user identifier from Firebase Auth | Firebase Auth UID |
| `date` | string | Date of session (YYYY-MM-DD format) | Calculated from session completion time |
| `session_start_time` | string (ISO 8601) | When the timer was started | Tracked when `startTimer()` is called |
| `planned_minutes` | number | Planned duration in minutes | From focus block `minutes` property |
| `actual_minutes` | number | Actual completed minutes (rounded) | Calculated from `timer.totalSec / 60` |
| `distraction_count` | number | Number of distractions during session | Counted from session start to completion |
| `focus_rating` | number (1-5) or null | User's productivity/focus rating | From reflection modal (optional) |
| `recovery_rating` | number (1-5) or null | User's recovery/refreshment rating | From reflection modal (optional) |

## Additional Metadata

Each research session document also includes:

- `session_id`: Unique identifier for the session
- `created_at`: Server timestamp (Firestore)
- `created_at_iso`: ISO 8601 timestamp string

## Storage Location

Research data is stored in Firebase Firestore within the `users` collection:

- **Collection**: `users`
- **Document ID**: User's Firebase Auth UID
- **Field**: `research_sessions` (array of session objects)
- **Document Structure**: Each user document contains a `research_sessions` array with all their session data

## Data Collection Flow

1. **Session Start**: When user clicks "Start", `session_start_time` is recorded
2. **During Session**: Distractions are tracked incrementally
3. **Session Complete**: When timer reaches 0:
   - `planned_minutes` = block.minutes
   - `actual_minutes` = calculated from timer
   - `distraction_count` = current count - session start count
4. **Reflection Modal**: User optionally provides:
   - `focus_rating` (1-5 emoji scale)
   - `recovery_rating` (1-5 emoji scale)
5. **Data Save**: All data points saved to Firestore `research_sessions` collection

## Accessing Research Data

### From Firebase Console

1. Go to Firebase Console → Firestore Database
2. Navigate to `users` collection
3. Click on a user document (document ID = user's Firebase Auth UID)
4. Find the `research_sessions` field (it's an array)
5. Expand the array to view all research session objects
6. Export data using Firestore export feature

### Programmatic Access

```javascript
// Get all research sessions for a user
const userRef = firestore.collection('users').doc(userId);
const userDoc = await userRef.get();

if (userDoc.exists) {
  const userData = userDoc.data();
  const researchSessions = userData.research_sessions || [];
  
  console.log(`User has ${researchSessions.length} research sessions`);
  researchSessions.forEach((session, index) => {
    console.log(`Session ${index + 1}:`, session);
  });
}
```

### Export for Analysis

You can export data from Firestore:
- Use Firebase Console → Firestore → Export
- Or use Firebase Admin SDK to export programmatically
- Data format: JSON or CSV (via conversion)

## Data Privacy

- Each user can only access their own data (enforced by Firestore security rules)
- User IDs are anonymized Firebase Auth UIDs
- No personally identifiable information is stored in research data

## Example User Document Structure

```json
{
  "blocks": [...],
  "tasks": [...],
  "stats": {...},
  "journal": {...},
  "badges": {...},
  "goal": 60,
  "research_sessions": [
    {
      "user_id": "abc123xyz789",
      "date": "2026-01-30",
      "session_start_time": "2026-01-30T18:45:23.456Z",
      "planned_minutes": 25,
      "actual_minutes": 25,
      "distraction_count": 2,
      "focus_rating": 4,
      "recovery_rating": 5,
      "session_id": "session_xyz123",
      "created_at": "2026-01-30T19:10:45.789Z",
      "created_at_iso": "2026-01-30T19:10:45.789Z"
    },
    {
      "user_id": "abc123xyz789",
      "date": "2026-01-30",
      "session_start_time": "2026-01-30T20:15:10.123Z",
      "planned_minutes": 15,
      "actual_minutes": 15,
      "distraction_count": 0,
      "focus_rating": 5,
      "recovery_rating": 4,
      "session_id": "session_abc456",
      "created_at": "2026-01-30T20:30:25.456Z",
      "created_at_iso": "2026-01-30T20:30:25.456Z"
    }
  ],
  "lastSync": "2026-01-30T20:30:25.789Z",
  "updatedAt": "2026-01-30T20:30:25.789Z"
}
```

## Notes

- If user skips reflection, `focus_rating` and `recovery_rating` will be `null`
- `distraction_count` is always recorded (even if 0)
- `actual_minutes` may differ from `planned_minutes` if user skips or pauses
- All timestamps are in UTC

## Analytics Events

The app also logs analytics events:
- `research_session_saved`: Fired when research data is saved
- Includes: session_id, planned_minutes, actual_minutes, distraction_count
