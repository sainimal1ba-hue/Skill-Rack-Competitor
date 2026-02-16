# Quick Start Guide

## Getting Your App Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will open at http://localhost:3000

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## First Time Setup

### Create Your First Admin Account

1. Open the app in your browser
2. Click "Register" and create an account
3. Open Browser DevTools (F12)
4. Go to Application → IndexedDB → skillrackdb → users
5. Double-click your user record
6. Change `"admin": false` to `"admin": true`
7. Refresh the page

You now have admin access!

### Add Sample Data

As an admin, you can access admin routes from the navbar:

#### 1. Add Branches
- Navigate to `/admin/branches`
- Example: "Computer Science & Engineering", "Information Technology"

#### 2. Add Chapters  
- Navigate to `/admin/chapters`
- Example under CSE: "Arrays", "Linked Lists", "Trees"

#### 3. Add Questions
- Navigate to `/admin/questions`
- Include:
  - Question ID, Title, Description
  - Sample Input/Output
  - Test cases with expected outputs

#### 4. Create Contests
- Navigate to `/admin/contests`
- Set start/end times
- Add comma-separated question IDs

## Project Structure Overview

```
src/
├── components/       # Reusable UI components
├── context/         # React Context (user, contest state)
├── pages/           # Page components
│   ├── Auth/       # Login, Register
│   ├── Dashboard/  # User dashboard
│   ├── Practise/   # Problem browsing & solving
│   ├── Contest/    # Contest pages
│   └── Admin/      # Admin panel
├── services/       # API & storage services
└── utils/          # Helper functions
```

## Available Routes

### Public Routes
- `/` - Home page
- `/login` - Login
- `/register` - Register

### Protected Routes (requires login)
- `/dashboard` - User dashboard
- `/practice` - Browse branches
- `/practice/branches/:id` - Browse chapters
- `/practice/chapters/:id` - Browse questions
- `/practice/questions/:id` - Solve a question
- `/contests` - View contests
- `/submissions` - Submission history

### Admin Routes (requires admin = true)
- `/admin/branches` - Manage branches
- `/admin/chapters` - Manage chapters
- `/admin/questions` - Manage questions
- `/admin/contests` - Manage contests
- `/admin/users` - Manage users

## Features

### Code Editor
- Supports C, C++, Java, Python
- Monaco Editor (VS Code engine)
- Custom input testing
- Auto test case evaluation

### Contest System
- Real-time countdown timer
- Live leaderboard
- Automatic scoring

### Dashboard
- Submission statistics
- Success rate tracking
- Recent submissions

## Important Notes

### Code Execution Backend Required

The frontend sends code to `http://localhost:5100/run` for execution. You need to:

1. Set up a code execution backend
2. Update the URL in `src/utils/codeRunner/runC.js`
3. Or use environment variable `VITE_API_URL`

### Data Storage

- Uses IndexedDB (browser-based)
- Data is stored locally per browser
- Not suitable for multi-user production without backend
- Consider adding a real database for production

## Troubleshooting

### Port 3000 already in use
```bash
# Change port in vite.config.js or:
npm run dev -- --port 3001
```

### Module not found errors
```bash
# Clear node_modules and reinstall:
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Check for syntax errors in console
# Ensure all imports have correct paths
npm run build
```

## Next Steps

1. ✅ Get the app running locally
2. ✅ Create admin account
3. ✅ Add sample data
4. 🎯 Set up code execution backend
5. 🎯 Deploy to Vercel (see DEPLOYMENT.md)
6. 🎯 Add real database for production

Happy coding! 🚀
