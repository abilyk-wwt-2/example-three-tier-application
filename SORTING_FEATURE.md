# Task Sorting Feature Implementation

## Summary
Added sorting options for tasks with three sort modes:
1. **Date (Oldest)** - Sort by creation date ascending (default)
2. **Date (Newest)** - Sort by creation date descending
3. **Alphabetical** - Sort by task title alphabetically

## Changes Made

### 1. Backend API (`src/api/index.js`)
- Modified `GET /tasks` endpoint to accept optional `sort` query parameter
- Implemented sorting logic:
  - `sort=date-asc` or no sort parameter → `ORDER BY created_at ASC` (default)
  - `sort=date-desc` → `ORDER BY created_at DESC`
  - `sort=alphabetical` → `ORDER BY title ASC`

### 2. Frontend Actions (`src/web/app/actions.ts`)
- Added `SortOption` type: `'date-asc' | 'date-desc' | 'alphabetical'`
- Updated `getTasks()` function to accept `sort` parameter
- Constructs URL with query parameter when sort is not the default

### 3. Frontend UI (`src/web/app/page.tsx`)
- Converted from server component to client component (`'use client'`)
- Added state management:
  - `tasks`: array of tasks
  - `sort`: current sort option
  - `isLoading`: loading state
- Added `useEffect` hook to load tasks when sort option changes
- Added three sort buttons with visual feedback (active button styling)
- Updated task loading and refresh logic to respect current sort option
- Added loading indicator while fetching tasks

## Features
- ✅ Three sorting options with clear labels
- ✅ Visual feedback showing which sort is active
- ✅ Responsive button styling with hover effects
- ✅ Dark mode support
- ✅ Loading state management
- ✅ Automatic refresh when sort changes
- ✅ Maintains sort preference during task operations

## Testing
- ✓ TypeScript compilation passes without errors
- ✓ API syntax validation passes
- ✓ Sorting logic verified for all three modes
- ✓ No breaking changes to existing functionality
