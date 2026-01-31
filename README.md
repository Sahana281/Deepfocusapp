# DeepFocus App 🎯

A research-backed focus timer application designed to help students build better study habits, track productivity, and unlock their full potential through data-driven insights.

## 🌟 Features

### Core Functionality
- **Smart Timer**: Customizable focus sessions with automatic break timers based on Pomodoro technique
- **Task Management**: Create tasks that automatically generate focus blocks
- **Break System**: Automatic short and long breaks with customizable intervals
- **Distraction Tracking**: Log distractions with reasons and notes
- **Goal Setting**: Set daily focus goals and track progress

### Journaling & Reflection
- **Post-Session Reflection**: Rate productivity, identify focus helpers, and add notes after each session
- **Distraction Logging**: Track what pulls you away with detailed notes
- **Pattern Analysis**: View insights on what helps you focus and your biggest distractions
- **Edit/Delete Entries**: Manage your journal entries with hover actions

### Gamification
- **12 Achievement Badges**: Unlock badges for milestones (earnable multiple times)
  - 🎯 First Focus
  - ⭐ Rising Star (5 sessions)
  - 🌟 Focus Pro (10 sessions)
  - 🔥 On Fire (3-day streak)
  - 💪 Streak Master (7-day streak)
  - ⏰ Hour Hero (60 min/day)
  - 💯 Centurion (100 total minutes)
  - 🏃 Marathon (500 total minutes)
  - 🧘 Zen Master (0 distractions)
  - 📝 Reflector (5 reflections)
  - 🌅 Early Bird (session before 8 AM)
  - 🦉 Night Owl (session after 10 PM)

### Analytics & Insights
- **Daily Tracking**: Today's focus minutes, streak, distractions
- **7-Day Rolling Total**: Weekly productivity metrics
- **Visual Progress**: Progress bars and animated timer ring with traveling indicator
- **Pattern Recognition**: Identify your most productive times and common distractions

### User Experience
- **Keyboard Shortcuts**: 
  - `Space` - Start/Pause timer
  - `S` - Skip current block
  - `N` - New task
  - `Esc` - Close modals
  - `?` - Show all shortcuts
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- **PWA Support**: Install as a Progressive Web App for offline access
- **Sound Notifications**: Optional audio feedback on session completion
- **Browser Notifications**: System notifications when sessions complete

### Authentication & Data
- **Firebase Authentication**: Secure email/password login
- **Password Reset**: Forgot password functionality
- **Firestore Integration**: Automatic cloud sync of all user data
- **Local Storage**: Offline-first with localStorage fallback
- **Data Privacy**: Each user can only access their own data

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Firebase authentication and sync)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/deepfocusapp.git
   cd deepfocusapp
   ```

2. **Open the app**
   - Simply open `index.html` in your browser, or
   - Use a local server (recommended):
     ```bash
     # Using Python
     python3 -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     
     # Using VS Code Live Server extension
     # Right-click index.html → "Open with Live Server"
     ```

3. **Access the app**
   - Landing page: `http://localhost:8000/` (or your server URL)
   - Main app: `http://localhost:8000/app.html`

### Demo Mode
- Click "🎮 Try Demo" on the landing page
- Explore the app with pre-populated sample data
- No login required for demo mode

## 📁 Project Structure

```
deepfocusapp/
├── index.html          # Landing page (marketing)
├── app.html            # Main application
├── style.css           # All styles and responsive design
├── script.js           # Core application logic
├── manifest.json       # PWA manifest
├── service-worker.js   # Service worker for offline support
└── README.md           # This file
```

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML, CSS, JavaScript (no frameworks)
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore (cloud sync)
- **Analytics**: Firebase Analytics
- **Hosting**: Cloudflare Pages
- **Storage**: LocalStorage (offline-first)

## 📊 Data Collection

This app is part of a research project tracking student productivity patterns. Data collected includes:

- Focus session duration and frequency
- Distraction patterns and reasons
- Productivity self-ratings
- Focus helpers (what conditions improve focus)
- Streak and consistency metrics
- Time-of-day patterns (early bird/night owl)

All data is stored securely in Firebase Firestore and can be exported for research analysis.

## 🎨 Customization

### Timer Settings
- Sessions before short break
- Short break duration
- Long break duration
- Sessions before long break
- Auto-start breaks toggle

### Default Values
- Focus duration: 25 minutes (per task)
- Short break: 5 minutes
- Long break: 15 minutes
- Sessions before short break: 1
- Sessions before long break: 4

## 🔒 Privacy & Security

- User authentication via Firebase
- Data encrypted in transit
- Each user can only access their own data
- No third-party tracking (except Firebase Analytics)
- All data stored securely in Firebase Firestore

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Known Issues

- Service worker caching may require hard refresh after updates
- Break timer requires manual start if auto-start is disabled

## 🤝 Contributing

This is a research project. For contributions or feedback, please use the in-app feedback form or contact the project maintainer.

## 📝 License

This project is part of academic research. All rights reserved.

## 👥 Credits

- Built for student productivity research
- Designed with user feedback and iterative improvements
- Powered by Firebase and Cloudflare Pages

## 🔗 Links

- **Live Demo**: [https://deepfocus-9av.pages.dev/](https://deepfocus-9av.pages.dev/)
- **Landing Page**: [https://deepfocus-9av.pages.dev/](https://deepfocus-9av.pages.dev/)
- **Main App**: [https://deepfocus-9av.pages.dev/app.html](https://deepfocus-9av.pages.dev/app.html)

## 📧 Contact

For questions or feedback about this research project, please use the in-app feedback form.

---

**Built with ❤️ for students, powered by research**
