# 🎡 Spin Wheel Application

A modern, interactive spin wheel application built with React, Vite, Tailwind CSS, and Firebase Firestore. Select a person, spin the wheel, and let fate decide the prize!

![Spin Wheel Demo](https://img.shields.io/badge/Status-Ready-brightgreen)

## ✨ Features

- **Person Selection System**: Select participants from a Firestore database with a clean, intuitive UI
- **Animated Spin Wheel**: Smooth spinning animation with realistic deceleration physics
- **Firebase Integration**: Store participants and spin history in Firestore
- **Responsive Design**: Mobile-first design that works beautifully on all devices
- **Real-time Updates**: Fetch participants from Firestore in real-time
- **Spin History**: Automatically saves each spin result with timestamp
- **Beautiful UI**: Gradient backgrounds, smooth animations, and modern design using Tailwind CSS
- **Icon Support**: Rich icon library from Lucide React

## 🚀 Technologies Used

- **React 18**: Modern React with hooks
- **Vite**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Firebase 10+**: Backend and database (Firestore)
- **Lucide React**: Beautiful, consistent icons
- **PostCSS & Autoprefixer**: CSS processing

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account and project

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AxelRuLo/spin-wheel.git
   cd spin-wheel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Enable Firestore Database (in Build → Firestore Database)
   - Go to Project Settings → General → Your apps
   - Register a web app if you haven't already
   - Copy your Firebase configuration

4. **Configure environment variables**
   
   Create a `.env` file in the root directory (use `.env.example` as a template):
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Set up Firestore Collections**

   In your Firebase Console, create the following collections:

   **`people` collection:**
   - Go to Firestore Database
   - Create a collection named `people`
   - Add documents with the following structure:
     ```javascript
     {
       name: "John Doe"  // string
     }
     ```
   - Add multiple people to populate the selector

   **`spinHistory` collection:**
   - This collection will be created automatically when you spin the wheel
   - Structure (auto-created):
     ```javascript
     {
       personId: "document_id",      // string
       personName: "John Doe",       // string
       result: "🎁 Prize 1",         // string
       timestamp: Timestamp          // Firebase Timestamp
     }
     ```

6. **Run the development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser

## 📦 Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

To preview the production build:
```bash
npm run preview
```

## 🎨 Customization

### Changing Prizes

Edit the `prizes` array in `src/App.jsx`:

```javascript
const prizes = [
  '🎁 Custom Prize 1',
  '🎊 Custom Prize 2',
  '🎉 Custom Prize 3',
  // Add more prizes (8 recommended for best visual)
];
```

### Changing Wheel Colors

Edit the `colors` array in `src/components/SpinWheel.jsx`:

```javascript
const colors = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  // Add or modify colors
];
```

### Adjusting Spin Duration and Rotations

In `src/components/SpinWheel.jsx`, modify:

```javascript
// Rotation range (in degrees)
const minRotation = 1800; // 5 full rotations
const maxRotation = 3600; // 10 full rotations

// Animation duration
setTimeout(() => {
  // ...
}, 4000); // 4 seconds

// CSS transition
transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
```

## 📁 Project Structure

```
spin-wheel/
├── public/              # Static assets
├── src/
│   ├── components/
│   │   ├── PersonSelector.jsx   # Person selection UI
│   │   └── SpinWheel.jsx        # Animated wheel component
│   ├── App.jsx         # Main application component
│   ├── firebase.js     # Firebase configuration
│   ├── main.jsx        # React entry point
│   └── index.css       # Global styles (Tailwind)
├── .env                # Environment variables (not in git)
├── .env.example        # Environment variables template
├── .gitignore          # Git ignore file
├── index.html          # HTML entry point
├── package.json        # Dependencies and scripts
├── postcss.config.js   # PostCSS configuration
├── tailwind.config.js  # Tailwind configuration
└── vite.config.js      # Vite configuration
```

## 🔧 Firestore Security Rules

For development, you can use these basic rules (⚠️ not recommended for production):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /people/{document=**} {
      allow read, write: if true;
    }
    match /spinHistory/{document=**} {
      allow read, write: if true;
    }
  }
}
```

For production, implement proper authentication and authorization rules.

## 🎯 Usage

1. **Select a Person**: Click on a person from the list on the left
2. **Spin the Wheel**: Click the "Spin the Wheel!" button
3. **View Result**: Wait for the wheel to stop and see the winning prize
4. **Spin History**: All spins are automatically saved to Firestore with timestamps

## 🐛 Troubleshooting

### "No people found" message
- Make sure you've created the `people` collection in Firestore
- Add at least one document with a `name` field
- Check your Firebase configuration in `.env`

### Firebase connection errors
- Verify your `.env` file has correct Firebase credentials
- Ensure Firestore is enabled in your Firebase project
- Check browser console for specific error messages

### Build errors
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Clear Vite cache: `rm -rf node_modules/.vite`

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 💡 Future Enhancements

- [ ] Add authentication for users
- [ ] Create admin panel to manage people and prizes
- [ ] Add sound effects for spinning
- [ ] Export spin history to CSV
- [ ] Add different wheel themes
- [ ] Support for custom number of segments
- [ ] Leaderboard showing most wins

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Made with ❤️ using React + Vite + Firebase
