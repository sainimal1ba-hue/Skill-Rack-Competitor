# SkillRack Competitor

A competitive programming platform built with React and Vite, featuring code practice, contests, and comprehensive tracking of your coding progress.

## Features

- 🎯 **Practice Mode**: Browse problems organized by branches and chapters
- 🏆 **Live Contests**: Participate in timed coding competitions
- 💻 **Multi-Language Support**: Write code in C, C++, Java, and Python
- 📊 **Dashboard**: Track your submissions and progress
- 🔐 **User Authentication**: Secure login and registration
- 👥 **Admin Panel**: Manage users, questions, contests, and content
- 🎨 **Modern UI**: Clean, responsive interface built with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, React Router v7
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **Code Editor**: Monaco Editor
- **State Management**: React Context API
- **Storage**: IndexedDB
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd skillrack-competitor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Deployment on Vercel

### Quick Deploy

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Visit [vercel.com](https://vercel.com) and sign in

3. Click "New Project" and import your repository

4. Vercel will automatically detect Vite and use the correct settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Click "Deploy"

Your app will be live in minutes!

### Manual Configuration

If needed, create a `vercel.json` (already included):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── contest/        # Contest-specific components
│   ├── editor/         # Code editor component
│   └── navigation/     # Navigation components
├── context/            # React Context for state management
├── data/              # Static data (branches, chapters)
├── pages/             # Page components
│   ├── Admin/         # Admin panel pages
│   ├── Auth/          # Login/Register pages
│   ├── Contest/       # Contest pages
│   ├── Dashboard/     # Dashboard page
│   └── Practise/      # Practice mode pages
├── services/          # API and storage services
│   └── storage/       # IndexedDB utilities
├── styles/            # Global styles
└── utils/             # Utility functions
    └── codeRunner/    # Code execution utilities
```

## Usage

### For Students

1. **Register**: Create an account
2. **Practice**: Navigate to Practice section, select a branch and chapter, then solve problems
3. **Submit**: Write your code and submit for automatic evaluation
4. **Contests**: Join live contests and compete on the leaderboard
5. **Track Progress**: View your submission history and statistics in the dashboard

### For Administrators

Access the admin panel to:
- Manage branches and chapters
- Create and edit questions
- Schedule contests
- Manage user accounts

## Code Execution Backend

**Important**: This frontend requires a backend API for code execution. The code runner sends requests to `http://localhost:5100/run`.

You need to set up a backend service that:
- Accepts POST requests with `{ code, input, language }`
- Compiles and runs the code safely (using Docker/sandboxing)
- Returns `{ stdout, stderr, time, error }`

## Environment Variables

Create a `.env` file for any environment-specific configuration:

```env
VITE_API_URL=http://localhost:5100
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions, please open an issue on GitHub or contact the development team.

---

Built with ❤️ using React and Vite
