
// === Firebase Authentication ===
// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAe9H28hJZJ_QMOXYWrJ3r2Mj5imAI52rk",
  authDomain: "focusapp-ebe2b.firebaseapp.com",
  projectId: "focusapp-ebe2b",
  storageBucket: "focusapp-ebe2b.firebasestorage.app",
  messagingSenderId: "407554186614",
  appId: "1:407554186614:web:e27c77a261267d65522e57",
  measurementId: "G-26T5JYQR5F"
};

// Initialize Firebase
let firebaseApp, firebaseAuth, firestore, analytics;
if (typeof firebase !== 'undefined') {
  firebaseApp = firebase.initializeApp(firebaseConfig);
  firebaseAuth = firebase.auth();
  firestore = firebase.firestore();
  
  // Initialize Analytics
  try {
    if (firebaseConfig.measurementId && typeof firebase.analytics !== 'undefined') {
      analytics = firebase.analytics();
      console.log('✅ Analytics initialized');
    } else {
      console.warn('⚠️ Analytics not available - measurementId missing or SDK not loaded');
    }
  } catch (error) {
    console.error('❌ Analytics initialization error:', error);
  }
}

// Analytics helper function
function logAnalyticsEvent(eventName, params = {}) {
  if (analytics) {
    try {
      analytics.logEvent(eventName, params);
      console.log('📊 Analytics event:', eventName, params);
    } catch (error) {
      console.error('❌ Analytics event error:', error);
    }
  } else {
    console.warn('⚠️ Analytics not initialized, event not logged:', eventName);
  }
}

// DOM Elements
const authScreen = document.getElementById('authScreen');
const appContainer = document.getElementById('appContainer');
const authForm = document.getElementById('authForm');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authError = document.getElementById('authError');
const authBtnText = document.getElementById('authBtnText');
const authSwitchText = document.getElementById('authSwitchText');
const authSwitchBtn = document.getElementById('authSwitchBtn');
const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
const resetSuccess = document.getElementById('resetSuccess');
const logoutBtn = document.getElementById('logoutBtn');
const userMenuBtn = document.getElementById('userMenuBtn');
const userDropdown = document.getElementById('userDropdown');
const userAvatar = document.getElementById('userAvatar');
const userName = document.getElementById('userName');
const userEmailEl = document.getElementById('userEmail');

// Auth state
let isSignUpMode = false;

// Initialize Firebase Auth
function initFirebaseAuth() {
  if (typeof firebase === 'undefined') {
    console.log('Firebase not loaded - running in local mode');
    showApp({ displayName: 'Local User', email: 'local@dev.com' });
    return;
  }
  
  // Listen for auth state changes
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      // Clear demo data if coming from demo mode
      if (localStorage.getItem('focus_demo_mode') === 'true') {
        clearDemoData();
      }
      showApp(user);
    } else {
      showAuth();
    }
  });
}

// Clear demo data without showing auth screen
function clearDemoData() {
  isDemoMode = false;
  localStorage.removeItem('focus_demo_mode');
  localStorage.removeItem(LS.GOAL);
  localStorage.removeItem(LS.BLOCKS);
  localStorage.removeItem(LS.TASKS);
  localStorage.removeItem(LS.STATS);
  localStorage.removeItem(LS.ACTIVE);
  localStorage.removeItem(LS.TIMER);
  localStorage.removeItem(LS.SETTINGS);
  
  // Reset appSettings to defaults
  appSettings = { ...DEFAULT_SETTINGS };
  
  // Hide demo banner
  const demoBanner = document.getElementById('demoBanner');
  if (demoBanner) demoBanner.classList.add('hidden');
  if (appContainer) appContainer.classList.remove('demo-mode');
  
  // Close demo welcome modal if open
  closeDemoWelcome();
}

function showAuth() {
  if (authScreen) authScreen.classList.remove('hidden');
  if (appContainer) appContainer.classList.add('hidden');
  resetAuthForm();
}

async function showApp(user) {
  if (authScreen) authScreen.classList.add('hidden');
  if (appContainer) appContainer.classList.remove('hidden');
  
  // Update user info in UI
  if (user) {
    const displayName = user.displayName || user.email?.split('@')[0] || 'User';
    const email = user.email || '';
    
    if (userName) userName.textContent = displayName;
    if (userEmailEl) userEmailEl.textContent = email;
    if (userAvatar) userAvatar.textContent = getEmojiAvatar(displayName);
    
    // Set user properties for Analytics
    if (analytics && user.uid) {
      try {
        analytics.setUserId(user.uid);
        analytics.setUserProperties({
          email: user.email || 'anonymous',
          is_demo: user.email === 'demo@focusapp.com'
        });
        
        // Log screen view
        analytics.logEvent('screen_view', {
          screen_name: 'app_home',
          screen_class: 'AppContainer'
        });
      } catch (error) {
        console.error('Analytics user properties error:', error);
      }
    }
    
    // Log app open event
    logAnalyticsEvent('app_open', {
      user_id: user.uid || 'anonymous',
      is_demo: user.email === 'demo@focusapp.com'
    });
    
    // Load data from Firestore if user is logged in (not demo)
    if (user.email && user.email !== 'demo@focusapp.com' && user.email !== 'local@dev.com') {
      const loaded = await loadFromFirestore();
      if (loaded) {
        // Data loaded from Firestore, now render
        ensureDayRoll();
        renderAll();
        updateBadgeCount();
        return;
      }
    }
  }
  
  // Fallback to localStorage
  loadAll();
  loadBadges(); // Load badges from localStorage
  renderAll();
}

function getEmojiAvatar(name) {
  const emojis = ['😊', '🚀', '⭐', '🎯', '💪', '🔥', '✨', '🌟', '💡', '🎨'];
  const index = (name?.charCodeAt(0) || 0) % emojis.length;
  return emojis[index];
}

function showAuthError(message) {
  if (authError) {
    authError.textContent = message;
    authError.classList.remove('hidden');
  }
}

function hideAuthError() {
  if (authError) {
    authError.classList.add('hidden');
  }
}

function resetAuthForm() {
  if (authForm) authForm.reset();
  hideAuthError();
  hideResetSuccess();
  isSignUpMode = false;
  updateAuthMode();
}

function hideResetSuccess() {
  if (resetSuccess) resetSuccess.classList.add('hidden');
}

function showResetSuccess() {
  if (resetSuccess) resetSuccess.classList.remove('hidden');
}

function updateAuthMode() {
  if (authBtnText) authBtnText.textContent = isSignUpMode ? 'Create Account' : 'Sign In';
  if (authSwitchText) authSwitchText.textContent = isSignUpMode ? 'Already have an account?' : "Don't have an account?";
  if (authSwitchBtn) authSwitchBtn.textContent = isSignUpMode ? 'Sign in' : 'Create one';
}

function setAuthLoading(loading) {
  const btn = document.getElementById('loginBtn');
  if (btn) {
    btn.disabled = loading;
    if (authBtnText) authBtnText.textContent = loading ? 'Please wait...' : (isSignUpMode ? 'Create Account' : 'Sign In');
  }
}

// Form submission handler
if (authForm) {
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAuthError();
    hideResetSuccess();
    
    // Check if Firebase is loaded
    if (!firebaseAuth) {
      showAuthError('Firebase not loaded. Please refresh the page.');
      console.error('firebaseAuth is undefined');
      return;
    }
    
    const email = authEmail?.value?.trim();
    const password = authPassword?.value;
    
    if (!email || !password) {
      showAuthError('Please enter email and password');
      return;
    }
    
    setAuthLoading(true);
    
    try {
      if (isSignUpMode) {
        await firebaseAuth.createUserWithEmailAndPassword(email, password);
      } else {
        await firebaseAuth.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
      let message = 'Authentication failed. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'This email is already registered. Try signing in.';
          break;
        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;
        case 'auth/weak-password':
          message = 'Password must be at least 6 characters.';
          break;
        case 'auth/user-not-found':
          message = 'No account found with this email. Create one?';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-credential':
          message = 'Invalid email or password. Please try again.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many attempts. Please wait and try again.';
          break;
      }
      
      showAuthError(message);
      setAuthLoading(false);
    }
  });
} else {
  console.error('authForm element not found');
}

// Toggle sign up / sign in mode
if (authSwitchBtn) {
  authSwitchBtn.addEventListener('click', () => {
    isSignUpMode = !isSignUpMode;
    updateAuthMode();
    hideAuthError();
    hideResetSuccess();
  });
}

// Forgot password handler
if (forgotPasswordBtn) {
  forgotPasswordBtn.addEventListener('click', async () => {
    hideAuthError();
    hideResetSuccess();
    
    const email = authEmail?.value?.trim();
    
    if (!email) {
      showAuthError('Please enter your email address first');
      return;
    }
    
    if (!firebaseAuth) {
      showAuthError('Firebase not loaded. Please refresh the page.');
      return;
    }
    
    try {
      await firebaseAuth.sendPasswordResetEmail(email);
      showResetSuccess();
    } catch (error) {
      console.error('Password reset error:', error);
      let message = 'Failed to send reset email. Please try again.';
      
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;
        case 'auth/user-not-found':
          message = 'No account found with this email.';
          break;
      }
      
      showAuthError(message);
    }
  });
}


// Logout handler
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await firebaseAuth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
    if (userDropdown) userDropdown.classList.add('hidden');
  });
}

// User menu toggle
if (userMenuBtn) {
  userMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (userDropdown) userDropdown.classList.toggle('hidden');
  });
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (userDropdown && !userDropdown.classList.contains('hidden')) {
    if (!e.target.closest('.user-menu')) {
      userDropdown.classList.add('hidden');
    }
  }
});

// === Demo Mode ===
let isDemoMode = false;
const tryDemoBtn = document.getElementById('tryDemoBtn');
const demoBanner = document.getElementById('demoBanner');
const clearDemoBtn = document.getElementById('clearDemoBtn');
const demoHelpBtn = document.getElementById('demoHelpBtn');
const demoWelcomeModal = document.getElementById('demoWelcomeModal');
const demoStartBtn = document.getElementById('demoStartBtn');
const demoCloseBtn = document.getElementById('demoCloseBtn');

function loadDemoData() {
  isDemoMode = true;
  
  // Demo tasks (short durations for quick demo)
  const demoTasks = [
    { id: 'demo-t1', name: '📚 Study Chapter 5 - Biology', minutes: 2, done: true, createdAt: Date.now() - 3600000 },
    { id: 'demo-t2', name: '📝 Complete Math Homework', minutes: 2, done: false, createdAt: Date.now() - 1800000 },
    { id: 'demo-t3', name: '📖 Read Research Paper', minutes: 2, done: false, createdAt: Date.now() - 900000 },
    { id: 'demo-t4', name: '🔬 Lab Report Draft', minutes: 3, done: false, createdAt: Date.now() },
  ];
  
  // Demo blocks (short durations for quick demo)
  const demoBlocks = [
    { id: 'demo-b1', name: '📚 Study Chapter 5 - Biology', minutes: 2, sourceTaskId: 'demo-t1', completed: true, createdAt: Date.now() - 3600000 },
    { id: 'demo-b2', name: '📝 Complete Math Homework', minutes: 2, sourceTaskId: 'demo-t2', completed: false, createdAt: Date.now() - 1800000 },
    { id: 'demo-b3', name: '📖 Read Research Paper', minutes: 2, sourceTaskId: 'demo-t3', completed: false, createdAt: Date.now() - 900000 },
  ];
  
  // Demo stats
  const demoStats = {
    todayMinutes: 47,
    weekMinutes: 138,
    streak: 4,
    lastDayKey: dayKey(),
    distractionCount: 2,
    distractionReasons: { 'Phone': 1, 'Notifications': 1 },
    dailyHistory: [
      { date: getDateDaysAgo(1), minutes: 52 },
      { date: getDateDaysAgo(2), minutes: 38 },
      { date: getDateDaysAgo(3), minutes: 45 },
      { date: getDateDaysAgo(4), minutes: 30 },
    ],
  };
  
  // Save demo data
  localStorage.setItem(LS.TASKS, JSON.stringify(demoTasks));
  localStorage.setItem(LS.BLOCKS, JSON.stringify(demoBlocks));
  localStorage.setItem(LS.STATS, JSON.stringify(demoStats));
  localStorage.setItem(LS.GOAL, '60');
  localStorage.setItem(LS.ACTIVE, 'demo-b2');
  localStorage.setItem('focus_demo_mode', 'true');
  
  // Set up timer state (mid-session, short for demo)
  const demoTimerState = {
    running: false,
    remainingSec: 74, // 1:14 remaining
    totalSec: 120, // 2 min total
    activeBlockId: 'demo-b2',
    isBreak: false,
    sessionCount: 1,
  };
  localStorage.setItem(LS.TIMER, JSON.stringify(demoTimerState));
  
  // Set short durations for demo (1 min breaks)
  const demoSettings = {
    focusDuration: 2,
    shortBreakDuration: 1,
    longBreakDuration: 2,
    sessionsBeforeShortBreak: 1,
    sessionsBeforeLongBreak: 4,
    autoStartBreaks: true,
  };
  localStorage.setItem(LS.SETTINGS, JSON.stringify(demoSettings));
  appSettings = { ...demoSettings };
  
  // Show app
  showApp({ displayName: 'Demo User', email: 'demo@focusapp.com' });
  
  // Show demo banner
  if (demoBanner) demoBanner.classList.remove('hidden');
  if (appContainer) appContainer.classList.add('demo-mode');
  
  // Reload data
  loadAll();
  renderAll();
  
  // Show welcome modal
  showDemoWelcome();
}

function showDemoWelcome() {
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (demoWelcomeModal && modalBackdrop) {
    modalBackdrop.classList.remove('hidden');
    demoWelcomeModal.classList.remove('hidden');
    // Scroll modal to top
    demoWelcomeModal.scrollTop = 0;
  }
}

function closeDemoWelcome() {
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (demoWelcomeModal && modalBackdrop) {
    demoWelcomeModal.classList.add('hidden');
    modalBackdrop.classList.add('hidden');
  }
}

function getDateDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function clearDemoAndLogout() {
  clearDemoData();
  showAuth();
}

// Demo button handlers
if (tryDemoBtn) {
  tryDemoBtn.addEventListener('click', loadDemoData);
}

if (clearDemoBtn) {
  clearDemoBtn.addEventListener('click', clearDemoAndLogout);
}

if (demoHelpBtn) {
  demoHelpBtn.addEventListener('click', showDemoWelcome);
}

if (demoStartBtn) {
  demoStartBtn.addEventListener('click', closeDemoWelcome);
}

if (demoCloseBtn) {
  demoCloseBtn.addEventListener('click', closeDemoWelcome);
}

// Check if returning to demo mode
function checkDemoMode() {
  if (localStorage.getItem('focus_demo_mode') === 'true') {
    isDemoMode = true;
    showApp({ displayName: 'Demo User', email: 'demo@focusapp.com' });
    if (demoBanner) demoBanner.classList.remove('hidden');
    if (appContainer) appContainer.classList.add('demo-mode');
    return true;
  }
  return false;
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
  // Log page view for Analytics
  logAnalyticsEvent('page_view', {
    page_title: 'DeepFocus',
    page_location: window.location.href
  });
  
  // Check demo mode first
  if (checkDemoMode()) {
    return;
  }
  // Otherwise init Firebase auth
  initFirebaseAuth();
});

// === Timer Completion Feedback System ===
const SOUND_ENABLED_KEY = "focus_sound_enabled";
let soundEnabled = localStorage.getItem(SOUND_ENABLED_KEY) !== "false"; // default true

// Web Audio API for completion sound
let audioContext = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioContext;
}

function playCompletionSound() {
  if (!soundEnabled) return;
  
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Create a pleasant chime sound
    const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      const startTime = now + (i * 0.15);
      const duration = 0.5;
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  } catch (e) {
    console.log("Audio not available:", e);
  }
}

// Browser Notifications
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}

function showBrowserNotification(title, body) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  
  try {
    const notification = new Notification(title, {
      body: body,
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏆</text></svg>",
      badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✅</text></svg>",
      tag: "focus-complete",
      requireInteraction: false
    });
    
    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000);
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (e) {
    console.log("Notification error:", e);
  }
}

// Confetti Animation
function launchConfetti() {
  const container = document.getElementById("confettiContainer");
  if (!container) return;
  
  container.innerHTML = "";
  
  const colors = [
    "#3b82f6", // blue
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#06b6d4"  // cyan
  ];
  
  const confettiCount = 50;
  
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDelay = Math.random() * 0.5 + "s";
    confetti.style.animationDuration = (2 + Math.random() * 2) + "s";
    container.appendChild(confetti);
  }
  
  // Clean up after animation
  setTimeout(() => {
    container.innerHTML = "";
  }, 4000);
}

// Completion Banner
function showCompletionBanner(blockName, minutes) {
  const banner = document.getElementById("completionBanner");
  const subtitle = document.getElementById("completionSubtitle");
  
  if (!banner) return;
  
  subtitle.textContent = `${minutes} minutes of focus on "${blockName}"`;
  banner.classList.add("show");
  
  // Hide after 3 seconds
  setTimeout(() => {
    banner.classList.remove("show");
  }, 3000);
}

// Timer card celebration animation
function celebrateTimerCard() {
  const timerCard = document.querySelector(".timer-card");
  if (!timerCard) return;
  
  timerCard.classList.add("celebrating");
  
  setTimeout(() => {
    timerCard.classList.remove("celebrating");
  }, 2000);
}

// Master celebration function
function triggerCompletionCelebration(blockName, minutes) {
  // Play sound
  playCompletionSound();
  
  // Show browser notification
  showBrowserNotification(
    "🎉 Focus Block Complete!",
    `Great job! You focused on "${blockName}" for ${minutes} minutes.`
  );
  
  // Visual celebrations
  launchConfetti();
  showCompletionBanner(blockName, minutes);
  celebrateTimerCard();
}

// Sound Toggle
function initSoundToggle() {
  const toggleBtn = document.getElementById("soundToggle");
  if (!toggleBtn) return;
  
  // Set initial state
  updateSoundToggleUI();
  
  toggleBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem(SOUND_ENABLED_KEY, soundEnabled);
    updateSoundToggleUI();
    
    // Request notification permission when enabling sound
    if (soundEnabled) {
      requestNotificationPermission();
      // Play a test sound
      playCompletionSound();
    }
  });
}

function updateSoundToggleUI() {
  const toggleBtn = document.getElementById("soundToggle");
  if (!toggleBtn) return;
  
  if (soundEnabled) {
    toggleBtn.textContent = "🔔 Sound";
    toggleBtn.classList.remove("muted");
  } else {
    toggleBtn.textContent = "🔕 Muted";
    toggleBtn.classList.add("muted");
  }
}

// === Keyboard Shortcuts ===
function initKeyboardShortcuts() {
  document.addEventListener("keydown", (e) => {
    // Don't trigger shortcuts when typing in inputs/textareas
    const activeEl = document.activeElement;
    const isTyping = activeEl && (
      activeEl.tagName === "INPUT" || 
      activeEl.tagName === "TEXTAREA" ||
      activeEl.isContentEditable
    );
    
    // Escape always works (to close modals)
    if (e.key === "Escape") {
      closeAllModals();
      return;
    }
    
    // Skip other shortcuts if typing
    if (isTyping) return;
    
    // Don't trigger if modifier keys are pressed (except for ?)
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    
    switch (e.key.toLowerCase()) {
      case " ": // Space - Start/Pause
        e.preventDefault();
        if (getActiveBlock()) {
          if (timer.running) {
            pauseTimer();
          } else {
            startTimer();
          }
        }
        break;
        
      case "s": // S - Skip
        if (getActiveBlock()) {
          skipBlock();
        }
        break;
        
      case "n": // N - New task
        openTaskModal(false);
        break;
        
      case "?": // ? - Show shortcuts help
        openShortcutsModal();
        break;
    }
  });
}

function openShortcutsModal() {
  const modal = document.getElementById("shortcutsModal");
  if (modal) {
    openModal(modal);
  }
}

function closeAllModals() {
  const modals = [
    document.getElementById("taskModal"),
    document.getElementById("distractModal"),
    document.getElementById("feedbackModal"),
    document.getElementById("shortcutsModal"),
    document.getElementById("appFeedbackModal")
  ];
  
  modals.forEach(modal => {
    if (modal && !modal.classList.contains("hidden")) {
      if (modal.id === "appFeedbackModal") {
        modal.classList.add("hidden");
        modal.setAttribute("aria-hidden", "true");
      } else {
        closeModal(modal);
      }
    }
  });
}

// Wire up shortcuts button and close button
function initShortcutsUI() {
  const shortcutsBtn = document.getElementById("shortcutsBtn");
  const shortcutsCloseBtn = document.getElementById("shortcutsCloseBtn");
  const shortcutsModal = document.getElementById("shortcutsModal");
  
  if (shortcutsBtn) {
    shortcutsBtn.addEventListener("click", openShortcutsModal);
  }
  
  if (shortcutsCloseBtn && shortcutsModal) {
    shortcutsCloseBtn.addEventListener("click", () => closeModal(shortcutsModal));
  }
  
  // Settings modal
  const settingsBtn = document.getElementById("settingsBtn");
  const settingsModal = document.getElementById("settingsModal");
  const settingsCancelBtn = document.getElementById("settingsCancelBtn");
  const settingsSaveBtn = document.getElementById("settingsSaveBtn");
  
  if (settingsBtn) {
    settingsBtn.addEventListener("click", openSettingsModal);
  }
  
  if (settingsCancelBtn && settingsModal) {
    settingsCancelBtn.addEventListener("click", () => closeModal(settingsModal));
  }
  
  if (settingsSaveBtn && settingsModal) {
    settingsSaveBtn.addEventListener("click", saveSettingsFromModal);
  }
}

function openSettingsModal() {
  const settingsModal = document.getElementById("settingsModal");
  if (!settingsModal) return;
  
  // Populate current settings
  const sessionsShortInput = document.getElementById("settingSessionsShort");
  const shortBreakInput = document.getElementById("settingShortBreak");
  const longBreakInput = document.getElementById("settingLongBreak");
  const sessionsInput = document.getElementById("settingSessions");
  const autoBreakInput = document.getElementById("settingAutoBreak");

  if (sessionsShortInput) sessionsShortInput.value = appSettings.sessionsBeforeShortBreak || 1;
  if (shortBreakInput) shortBreakInput.value = appSettings.shortBreakDuration;
  if (longBreakInput) longBreakInput.value = appSettings.longBreakDuration;
  if (sessionsInput) sessionsInput.value = appSettings.sessionsBeforeLongBreak;
  if (autoBreakInput) autoBreakInput.checked = appSettings.autoStartBreaks;
  
  openModal(settingsModal);
}

function saveSettingsFromModal() {
  const settingsModal = document.getElementById("settingsModal");
  
  const sessionsShortInput = document.getElementById("settingSessionsShort");
  const shortBreakInput = document.getElementById("settingShortBreak");
  const longBreakInput = document.getElementById("settingLongBreak");
  const sessionsInput = document.getElementById("settingSessions");
  const autoBreakInput = document.getElementById("settingAutoBreak");

  appSettings.sessionsBeforeShortBreak = clamp(parseInt(sessionsShortInput?.value) || 1, 1, 10);
  appSettings.shortBreakDuration = clamp(parseInt(shortBreakInput?.value) || 5, 1, 30);
  appSettings.longBreakDuration = clamp(parseInt(longBreakInput?.value) || 15, 1, 60);
  appSettings.sessionsBeforeLongBreak = clamp(parseInt(sessionsInput?.value) || 4, 1, 10);
  appSettings.autoStartBreaks = autoBreakInput?.checked ?? true;
  
  saveSettings();
  closeModal(settingsModal);
}



// Focus App (clean rebuild) - Tasks sync to Focus Blocks + Timer + Distracted reason
// LocalStorage keys
const LS = {
  GOAL: "focus_goal_minutes",
  BLOCKS: "focus_blocks_v1",
  TASKS: "focus_tasks_v1",
  STATS: "focus_stats_v1",
  ACTIVE: "focus_active_block_v1",
  TIMER: "focus_timer_state_v1",
  SETTINGS: "focus_settings_v1",
  JOURNAL: "focus_journal_v1",
  BADGES: "focus_badges_v1",
};

// Journal data
let journal = {
  reflections: [], // { id, date, blockName, minutes, rating, helpers: [], note }
  distractions: [], // { id, date, reason, note, blockName }
};

// Default settings
const DEFAULT_SETTINGS = {
  focusDuration: 25,      // minutes (default for new tasks, not in settings UI)
  shortBreakDuration: 5,  // minutes
  longBreakDuration: 15,  // minutes
  sessionsBeforeShortBreak: 1,  // sessions before short break
  sessionsBeforeLongBreak: 4,  // sessions before long break
  autoStartBreaks: true,
};

// Load settings
let appSettings = { ...DEFAULT_SETTINGS };
try {
  const saved = localStorage.getItem(LS.SETTINGS);
  if (saved) appSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
} catch (e) {}

function saveSettings() {
  localStorage.setItem(LS.SETTINGS, JSON.stringify(appSettings));
}

const $ = (id) => document.getElementById(id);

// Elements
const addTaskBtn = $("addTaskBtn");
const blockListEl = $("blockList");
const noBlocksText = $("noBlocksText");

const taskListEl = $("taskList");
const noTasksText = $("noTasksText");

const goalInput = $("goalInput");
const saveGoalBtn = $("saveGoalBtn");
const goalProgress = $("goalProgress");
const goalTarget = $("goalTarget");
const goalFill = $("goalFill");

const timerDisplay = $("timerDisplay");
const currentLabel = $("currentLabel");
const timerHint = $("timerHint");
const timerBadge = $("timerBadge");
const timerRingProgress = $("timerRingProgress");
const statusTitle = $("statusTitle");
const statusSub = $("statusSub");
const statusIcon = $("statusIcon");

const startBtn = $("startBtn");
const pauseBtn = $("pauseBtn");
const skipBtn = $("skipBtn");
const distractedBtn = $("distractedBtn");

const nowBlockName = $("nowBlockName");
const nowCard = $("nowCard");
const nowIcon = $("nowIcon");
const nowState = $("nowState");
const nowTimeValue = $("nowTimeValue");
const nowFocusValue = $("nowFocusValue");
const nowProgressFill = $("nowProgressFill");

const todayMinutesEl = $("todayMinutes");
const weekMinutesEl = $("weekMinutes");
const streakCountEl = $("streakCount");
const distractionCountEl = $("distractionCount");

const feedbackBtn = $("feedbackBtn");
const feedbackModal = $("feedbackModal");
const feedbackText = $("feedbackText");
const feedbackCloseBtn = $("feedbackCloseBtn");

const resetBtn = $("resetBtn");

const backdrop = $("modalBackdrop");
const taskModal = $("taskModal");
const taskModalTitle = $("taskModalTitle");
const taskNameInput = $("taskNameInput");
const taskMinsInput = $("taskMinsInput");
const taskCancelBtn = $("taskCancelBtn");
const taskSaveBtn = $("taskSaveBtn");

const distractModal = $("distractModal");
const distractCancelBtn = $("distractCancelBtn");

// State
let blocks = [];
let tasks = [];
let stats = {
  todayMinutes: 0,
  weekMinutes: 0,
  streak: 0,
  lastDayKey: null,
  distractionCount: 0,
  distractionReasons: {},
  dailyHistory: [], // Array of { date: "YYYY-MM-DD", minutes: N } - ALL historical data preserved for research
};

let activeBlockId = null;

let timer = {
  running: false,
  startEpoch: null,
  remainingSec: 0,
  totalSec: 0,
  tickHandle: null,
  isBreak: false,        // true if currently in break mode
  sessionCount: 0,       // count of focus sessions for long break logic
};

let sessionStartDistractions = 0; // Track distractions at session start for badge
let sessionStartTime = null; // Track when session started for research data
let editingTaskId = null;
let editingBlockId = null;

// Helpers
function dayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${da}`;
}
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}
function formatTime(sec) {
  sec = Math.max(0, Math.floor(sec));
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}
function uuid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

// Data lifecycle
function ensureDayRoll() {
  const k = dayKey();
  if (stats.lastDayKey !== k) {
    // Initialize dailyHistory if it doesn't exist
    if (!Array.isArray(stats.dailyHistory)) {
      stats.dailyHistory = [];
    }
    
    // new day -> save previous day's minutes to history
    if (stats.lastDayKey && stats.todayMinutes > 0) {
      stats.dailyHistory.push({
        date: stats.lastDayKey,
        minutes: stats.todayMinutes
      });
    }
    
    // IMPORTANT: Keep ALL historical data for research purposes
    // We do NOT filter out old data here - all data is preserved in Firebase
    // Only filter for UI display purposes (see getLast7DaysHistory())
    
    // Calculate weekMinutes from last 7 days only (for UI display)
    // But preserve all data in stats.dailyHistory for Firebase sync
    stats.weekMinutes = getLast7DaysHistory().reduce((sum, d) => sum + (d.minutes || 0), 0);
    
    // Streak logic: if yesterday had >0 minutes, streak continues, else reset
    if (stats.lastDayKey) {
      if (stats.todayMinutes > 0) {
        stats.streak = (stats.streak || 0) + 1;
      } else {
        stats.streak = 0;
      }
    }
    
    // Reset today's stats
    stats.todayMinutes = 0;
    stats.distractionCount = 0;
    stats.distractionReasons = {};
    stats.lastDayKey = k;
    saveJSON(LS.STATS, stats);
  }
}

// Get only last 7 days of history for UI display (preserves all data in DB)
function getLast7DaysHistory() {
  if (!Array.isArray(stats.dailyHistory)) {
    return [];
  }
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const cutoffKey = sevenDaysAgo.toISOString().slice(0, 10);
  // Filter only for display - original data remains intact
  return stats.dailyHistory.filter(d => d.date > cutoffKey);
}

// Calculate week minutes including today (for UI display - shows last 7 days)
function getWeekMinutesWithToday() {
  const historyMinutes = getLast7DaysHistory().reduce((sum, d) => sum + (d.minutes || 0), 0);
  return historyMinutes + (stats.todayMinutes || 0);
}

function loadAll() {
  blocks = loadJSON(LS.BLOCKS, []);
  tasks = loadJSON(LS.TASKS, []);
  stats = Object.assign(stats, loadJSON(LS.STATS, stats));
  journal = Object.assign(journal, loadJSON(LS.JOURNAL, journal));
  activeBlockId = localStorage.getItem(LS.ACTIVE) || null;

  ensureDayRoll();

  // Goal
  const g = parseInt(localStorage.getItem(LS.GOAL) || "60", 10);
  goalTarget.textContent = String(isFinite(g) && g > 0 ? g : 60);

  // Restore timer state
  const t = loadJSON(LS.TIMER, null);
  if (t && typeof t.remainingSec === "number") {
    if (t.activeBlockId) {
      activeBlockId = t.activeBlockId;
      localStorage.setItem(LS.ACTIVE, activeBlockId);
    }
    timer.remainingSec = t.remainingSec;
    timer.totalSec = t.totalSec || t.remainingSec;
    timer.running = !!t.running;
    timer.startEpoch = t.startEpoch || null;
    timer.isBreak = !!t.isBreak;
    timer.sessionCount = t.sessionCount || 0;

    if (timer.running && timer.startEpoch) {
      // compute drift since startEpoch
      const elapsed = Math.floor((Date.now() - timer.startEpoch) / 1000);
      timer.remainingSec = clamp(t.remainingSec - elapsed, 0, t.remainingSec);
      
      if (timer.remainingSec > 0) {
        // Timer still has time remaining - pause it and let user manually resume
        // This gives user control: they might have closed the app intentionally
        timer.running = false;
        timer.startEpoch = null;
        clearInterval(timer.tickHandle);
        timer.tickHandle = null;
      } else {
        // Timer expired while app was closed - complete it
        timer.running = false;
        timer.startEpoch = null;
        if (timer.isBreak) {
          completeBreak();
        } else {
          completeBlock();
        }
      }
    } else if (timer.running && !timer.startEpoch) {
      // Timer was running but startEpoch is missing - treat as paused
      timer.running = false;
    }
  }
}

function persistAll() {
  saveJSON(LS.BLOCKS, blocks);
  saveJSON(LS.TASKS, tasks);
  saveJSON(LS.STATS, stats);
  saveJSON(LS.JOURNAL, journal);
  const timerState = {
    running: timer.running,
    startEpoch: timer.running ? timer.startEpoch : null,
    remainingSec: timer.remainingSec,
    totalSec: timer.totalSec,
    activeBlockId: activeBlockId,
    isBreak: timer.isBreak,
    sessionCount: timer.sessionCount,
  };
  saveJSON(LS.TIMER, timerState);
  
  // Sync to Firestore if user is logged in
  syncToFirestore();
}

/* =========================
   Firestore Data Sync
========================= */

// Sync all user data to Firestore
// IMPORTANT: All historical data is preserved in Firebase for research purposes
// UI only displays last 7 days, but database contains complete history
async function syncToFirestore() {
  if (!firestore || !firebaseAuth?.currentUser) return;
  
  const userId = firebaseAuth.currentUser.uid;
  if (!userId) return;
  
  try {
    const userRef = firestore.collection('users').doc(userId);
    
    // Get existing research sessions to preserve them
    const userDoc = await userRef.get();
    const existingData = userDoc.exists ? userDoc.data() : {};
    const existingResearchSessions = existingData.research_sessions || [];
    
    // Merge with existing data to preserve all historical records
    // stats.dailyHistory contains ALL historical data (not just 7 days)
    await userRef.set({
      blocks: blocks,
      tasks: tasks,
      stats: stats, // Contains complete dailyHistory array with all historical data
      journal: journal,
      badges: earnedBadges,
      research_sessions: existingResearchSessions, // Preserve existing research sessions
      goal: parseInt(localStorage.getItem(LS.GOAL) || "60", 10),
      lastSync: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    console.log('✅ Data synced to Firestore (all historical data preserved)');
  } catch (error) {
    console.error('❌ Firestore sync error:', error);
  }
}

// Load user data from Firestore
// IMPORTANT: This loads ALL historical data from Firebase (complete dailyHistory array)
// UI will filter to show only last 7 days, but all data is preserved locally and in Firebase
async function loadFromFirestore() {
  if (!firestore || !firebaseAuth?.currentUser) return false;
  
  const userId = firebaseAuth.currentUser.uid;
  if (!userId) return false;
  
  try {
    const userDoc = await firestore.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      console.log('No Firestore data found, using localStorage');
      return false;
    }
    
    const data = userDoc.data();
    
    // Merge Firestore data with localStorage (Firestore takes priority)
    // Firestore contains complete historical data including full dailyHistory array
    if (data.blocks) blocks = data.blocks;
    if (data.tasks) tasks = data.tasks;
    if (data.stats) {
      // Preserve all historical data from Firestore (including complete dailyHistory)
      stats = Object.assign(stats, data.stats);
      // Ensure dailyHistory is an array (for backward compatibility)
      if (!Array.isArray(stats.dailyHistory)) {
        stats.dailyHistory = [];
      }
    }
    if (data.journal) journal = Object.assign(journal, data.journal);
    if (data.badges) earnedBadges = Object.assign(earnedBadges, data.badges);
    if (data.goal) {
      localStorage.setItem(LS.GOAL, String(data.goal));
      goalTarget.textContent = String(data.goal);
    }
    
    // Save to localStorage for offline access (preserves all historical data)
    saveJSON(LS.BLOCKS, blocks);
    saveJSON(LS.TASKS, tasks);
    saveJSON(LS.STATS, stats);
    saveJSON(LS.JOURNAL, journal);
    saveJSON(LS.BADGES, earnedBadges);
    
    // Update badge count UI
    updateBadgeCount();
    
    console.log('✅ Data loaded from Firestore (all historical data preserved)');
    return true;
  } catch (error) {
    console.error('❌ Firestore load error:', error);
    return false;
  }
}

/* =========================
   Research Data Collection
========================= */

// Save research session data to Firestore (stored in users collection)
async function saveResearchSessionData(researchData) {
  if (!firestore || !firebaseAuth?.currentUser) {
    console.warn('⚠️ Cannot save research data: Firebase not initialized');
    return;
  }
  
  const userId = firebaseAuth.currentUser.uid;
  if (!userId) {
    console.warn('⚠️ Cannot save research data: No user ID');
    return;
  }
  
  try {
    const userRef = firestore.collection('users').doc(userId);
    
    // Get existing research sessions
    const userDoc = await userRef.get();
    const existingData = userDoc.exists ? userDoc.data() : {};
    const researchSessions = existingData.research_sessions || [];
    
    // Prepare research session data with timestamp
    const sessionId = uuid();
    const researchSession = {
      ...researchData,
      session_id: sessionId,
      user_id: userId,
      created_at: firebase.firestore.FieldValue.serverTimestamp(),
      created_at_iso: new Date().toISOString()
    };
    
    // Add new session to array
    researchSessions.push(researchSession);
    
    // Update user document with new research session
    await userRef.update({
      research_sessions: researchSessions,
      lastSync: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Research session data saved to users collection:', researchSession);
    
    // Also log analytics event
    logAnalyticsEvent('research_session_saved', {
      session_id: sessionId,
      planned_minutes: researchData.planned_minutes,
      actual_minutes: researchData.actual_minutes,
      distraction_count: researchData.distraction_count
    });
    
  } catch (error) {
    console.error('❌ Error saving research session data:', error);
    // Don't throw - allow app to continue even if research data save fails
  }
}

// Blocks and Tasks
function addBlock(name, minutes, sourceTaskId = null, autoSelect = false) {
  const mins = clamp(parseInt(minutes, 10) || 15, 1, 240);
  const id = uuid();
  blocks.unshift({
    id,
    name: name || "Focus Block",
    minutes: mins,
    sourceTaskId, // link to task when created from task
    completed: false,
    createdAt: Date.now()
  });
  
  // Auto-select the new block if requested
  if (autoSelect) {
    activeBlockId = id;
    localStorage.setItem(LS.ACTIVE, activeBlockId);
    timer.totalSec = mins * 60;
    timer.remainingSec = timer.totalSec;
  }
  
  persistAll();
  renderAll();
  
  return id; // Return the block ID
}

function upsertTask(name, minutes) {
  const mins = clamp(parseInt(minutes, 10) || 15, 1, 240);
  const nm = (name || "").trim();
  if (!nm) return;

  if (editingTaskId) {
    const t = tasks.find(x => x.id === editingTaskId);
    if (t) {
      t.name = nm;
      t.minutes = mins;
    }
    // update linked block minutes/name too
    const linkedBlock = blocks.find(b => b.sourceTaskId === editingTaskId);
    if (linkedBlock) {
      linkedBlock.name = nm;
      const oldMins = linkedBlock.minutes;
      linkedBlock.minutes = mins;
      
      // If this block is currently active and timer is running, update timer
      if (linkedBlock.id === activeBlockId && timer.running) {
        // Calculate new remaining time proportionally
        const progressRatio = timer.remainingSec / (oldMins * 60);
        timer.totalSec = mins * 60;
        timer.remainingSec = Math.round(timer.totalSec * progressRatio);
      } else if (linkedBlock.id === activeBlockId) {
        // Block is active but timer not running - update timer to new duration
        timer.totalSec = mins * 60;
        timer.remainingSec = timer.totalSec;
      }
    }
    editingTaskId = null;
  } else {
    const id = uuid();
    tasks.unshift({ id, name: nm, minutes: mins, done: false, createdAt: Date.now() });

    // auto-create a focus block from task
    // Only auto-select if no timer is currently running (don't interrupt active sessions)
    const shouldAutoSelect = !timer.running;
    addBlock(nm, mins, id, shouldAutoSelect);
  }
  persistAll();
  renderAll();
}

function deleteTask(taskId) {
  tasks = tasks.filter(t => t.id !== taskId);
  // Keep blocks (don't auto-delete blocks) unless they were created solely for this task and not started?
  // We'll keep them for user history, but mark sourceTaskId null if task deleted.
  blocks.forEach(b => { if (b.sourceTaskId === taskId) b.sourceTaskId = null; });
  persistAll();
  renderAll();
}

function toggleTaskDone(taskId) {
  const t = tasks.find(x => x.id === taskId);
  if (!t) return;
  t.done = !t.done;

  // If done, we can optionally prompt to delete after completing focus (handled elsewhere)
  persistAll();
  renderAll();
}

function selectBlock(blockId) {
  const b = blocks.find(x => x.id === blockId);
  if (!b) return;

  activeBlockId = blockId;
  localStorage.setItem(LS.ACTIVE, activeBlockId);

  // reset timer to block duration only if timer not running
  if (!timer.running) {
    timer.totalSec = b.minutes * 60;
    timer.remainingSec = timer.totalSec;
  }
  persistAll();
  renderAll();
}

function deleteBlock(blockId) {
  // if deleting active, stop timer first
  if (activeBlockId === blockId) {
    stopTimer(true);
    activeBlockId = null;
    localStorage.removeItem(LS.ACTIVE);
  }
  blocks = blocks.filter(b => b.id !== blockId);
  persistAll();
  renderAll();
}

function updateBlockMinutes(blockId, newMinutes) {
  const b = blocks.find(x => x.id === blockId);
  if (!b) return;
  const mins = clamp(parseInt(newMinutes, 10) || b.minutes, 1, 240);
  b.minutes = mins;

  // if active and not running, update timer
  if (activeBlockId === blockId && !timer.running) {
    timer.totalSec = mins * 60;
    timer.remainingSec = timer.totalSec;
  }
  // if linked to task, update task minutes too
  if (b.sourceTaskId) {
    const t = tasks.find(x => x.id === b.sourceTaskId);
    if (t) t.minutes = mins;
  }
  persistAll();
  renderAll();
}

// Timer
function startTimer() {
  // Handle break timer
  if (timer.isBreak) {
    if (timer.remainingSec <= 0) {
      // Break already completed
      return;
    }
    timer.running = true;
    timer.startEpoch = Date.now();
    
    clearInterval(timer.tickHandle);
    // Render immediately to show progress bar starting
    renderAll();
    timer.tickHandle = setInterval(() => {
      tick();
    }, 250);
    
    persistAll();
    return;
  }
  
  // Handle focus timer (requires active block)
  const b = getActiveBlock();
  if (!b) return;

  if (timer.remainingSec <= 0) {
    timer.totalSec = b.minutes * 60;
    timer.remainingSec = timer.totalSec;
    // Track distractions at start of new session for badge check
    sessionStartDistractions = stats.distractionCount || 0;
    // Track session start time for research data
    sessionStartTime = new Date().toISOString();
  }

  timer.running = true;
  timer.startEpoch = Date.now();

  clearInterval(timer.tickHandle);
  // Render immediately to show progress bar starting
  renderAll();
  timer.tickHandle = setInterval(() => {
    tick();
  }, 250);

  // Log timer start event
  logAnalyticsEvent('timer_start', {
    block_name: b.name,
    duration_minutes: b.minutes
  });

  persistAll();
  renderAll();
}

function tick() {
  if (!timer.running) return;
  const elapsed = Math.floor((Date.now() - timer.startEpoch) / 1000);
  if (elapsed <= 0) return;

  timer.remainingSec = clamp(timer.remainingSec - elapsed, 0, timer.remainingSec);
  timer.startEpoch = Date.now();

  if (timer.remainingSec <= 0) {
    // Check if this was a break or focus session
    if (timer.isBreak) {
      completeBreak();
    } else {
      completeBlock();
    }
    return;
  }
  // lightweight render of timer display
  timerDisplay.textContent = formatTime(timer.remainingSec);
  persistAll();
}

function pauseTimer() {
  if (!timer.running) return;
  timer.running = false;
  clearInterval(timer.tickHandle);
  timer.tickHandle = null;
  timer.startEpoch = null;
  persistAll();
  renderAll();
}

function stopTimer(clearTime = false) {
  timer.running = false;
  clearInterval(timer.tickHandle);
  timer.tickHandle = null;
  timer.startEpoch = null;
  if (clearTime) {
    timer.remainingSec = 0;
    timer.totalSec = 0;
  }
  persistAll();
  renderAll();
}

function skipBlock() {
  // If in break mode, skip the break
  if (timer.isBreak) {
    skipBreak();
    return;
  }
  
  // skip ends the current block without credit
  pauseTimer();
  const b = getActiveBlock();
  if (b) {
    b.completed = false;
  }
  // move to next available block (select first non-completed)
  activeBlockId = null;
  localStorage.removeItem(LS.ACTIVE);
  persistAll();
  renderAll();
}

// Store last completed block for reflection
let lastCompletedBlock = null;

function completeBlock() {
  pauseTimer();
  const b = getActiveBlock();
  if (!b) return;

  b.completed = true;

  // update streak baseline FIRST (handles day rollover before adding minutes)
  ensureDayRoll();

  // credit focused minutes = total duration (rounded)
  const mins = Math.max(1, Math.round(timer.totalSec / 60));
  stats.todayMinutes = (stats.todayMinutes || 0) + mins;

  // Increment session count for long break logic
  timer.sessionCount = (timer.sessionCount || 0) + 1;

  // Store for reflection modal (with research data)
  const sessionDistractions = stats.distractionCount - (sessionStartDistractions || 0);
  lastCompletedBlock = { 
    name: b.name, 
    minutes: mins,
    plannedMinutes: b.minutes,
    actualMinutes: mins,
    distractionCount: sessionDistractions,
    sessionStartTime: sessionStartTime || new Date().toISOString(),
    date: new Date().toISOString() 
  };

  // Log session completion event
  logAnalyticsEvent('session_complete', {
    block_name: b.name,
    duration_minutes: mins,
    streak: stats.streak || 0,
    total_sessions: blocks.filter(bl => bl.completed).length
  });

  // 🎉 Trigger celebration (sound, notification, confetti, banner)
  triggerCompletionCelebration(b.name, mins);

  // prompt: if linked task is done, suggest deleting it
  if (b.sourceTaskId) {
    const t = tasks.find(x => x.id === b.sourceTaskId);
    if (t && t.done) {
      // auto-remove completed+done tasks to prevent piling up
      deleteTask(t.id);
    }
  }

  // reset timer for next time
  timer.remainingSec = 0;
  timer.totalSec = 0;

  // remove active selection
  activeBlockId = null;
  localStorage.removeItem(LS.ACTIVE);

  persistAll();
  renderAll();

  // Check for badge unlocks (reuse sessionDistractions calculated above)
  checkBadges({ 
    justCompleted: true, 
    noDistraction: sessionDistractions === 0 
  });

  // Show reflection modal after celebration (delayed)
  setTimeout(() => {
    openReflectionModal();
  }, 2000);
}

// Break timer functions
function startBreak() {
  // Determine break type
  const sessionsBeforeShort = appSettings.sessionsBeforeShortBreak || 1;
  const sessionsBeforeLong = appSettings.sessionsBeforeLongBreak || 4;
  
  // Long break takes priority
  const isLongBreak = timer.sessionCount > 0 && 
    timer.sessionCount % sessionsBeforeLong === 0;
  
  // Short break if it's time for one (but not long break)
  const isShortBreak = !isLongBreak && timer.sessionCount > 0 &&
    timer.sessionCount % sessionsBeforeShort === 0;
  
  // Only start break if it's time for one
  if (!isLongBreak && !isShortBreak) {
    return; // No break needed yet
  }
  
  const breakMins = isLongBreak ? 
    appSettings.longBreakDuration : 
    appSettings.shortBreakDuration;
  
  timer.isBreak = true;
  timer.totalSec = breakMins * 60;
  timer.remainingSec = timer.totalSec;
  timer.running = true;
  timer.startEpoch = Date.now();
  
  // Start the tick
  if (timer.tickHandle) clearInterval(timer.tickHandle);
  // Render immediately to show progress bar starting
  renderAll();
  timer.tickHandle = setInterval(tick, 1000);
  
  persistAll();
  
  // Show notification
  showBrowserNotification(
    isLongBreak ? "☕ Long Break Time!" : "☕ Break Time!",
    `Take a ${breakMins} minute break. You've earned it!`
  );
}

function completeBreak() {
  pauseTimer();
  timer.isBreak = false;
  timer.remainingSec = 0;
  timer.totalSec = 0;
  
  // Play sound and notify
  playCompletionSound();
  showBrowserNotification(
    "⏰ Break Over!",
    "Ready to focus again?"
  );
  
  persistAll();
  renderAll();
}

function skipBreak() {
  pauseTimer();
  timer.isBreak = false;
  timer.remainingSec = 0;
  timer.totalSec = 0;
  persistAll();
  renderAll();
}

function logDistraction(reason) {
  const b = getActiveBlock();
  if (!b) return;

  // 1) count
  stats.distractionCount = (stats.distractionCount || 0) + 1;

  // 2) reason breakdown
  stats.distractionReasons[reason] = (stats.distractionReasons[reason] || 0) + 1;

  // 3) "time tax" add 30 seconds
  timer.remainingSec = clamp(timer.remainingSec + 30, 0, 24 * 60 * 60);

  persistAll();
  renderAll();
}

function getActiveBlock() {
  if (!activeBlockId) return null;
  return blocks.find(b => b.id === activeBlockId) || null;
}

// UI rendering
function renderGoal() {
  const goal = parseInt(localStorage.getItem(LS.GOAL) || "60", 10);
  const target = isFinite(goal) && goal > 0 ? goal : 60;

  const progress = Math.min(stats.todayMinutes || 0, target);
  goalProgress.textContent = String(progress);
  goalTarget.textContent = String(target);

  const pct = target ? (progress / target) * 100 : 0;
  goalFill.style.width = `${pct}%`;
}

function renderBlocks() {
  blockListEl.innerHTML = "";
  if (!blocks.length) {
    noBlocksText.classList.remove("hidden");
    return;
  }
  noBlocksText.classList.add("hidden");

  blocks.forEach((b) => {
    const el = document.createElement("div");
    el.className = "block";

    const left = document.createElement("div");
    left.className = "block-left";

    const title = document.createElement("div");
    title.className = "block-title";
    title.textContent = b.name;

    const meta = document.createElement("div");
    meta.className = "block-meta";
    meta.textContent = `${b.minutes} min${b.completed ? " • done" : ""}`;

    left.appendChild(title);
    left.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "block-actions";

    const select = document.createElement("button");
    select.className = "pill primary";
    select.textContent = (activeBlockId === b.id) ? "Active" : "Select";
    select.addEventListener("click", () => selectBlock(b.id));

    // edit minutes inline
    const minsBtn = document.createElement("button");
    minsBtn.className = "pill";
    minsBtn.textContent = "Edit min";
    minsBtn.addEventListener("click", () => {
      const val = prompt("Edit minutes (1-240)", String(b.minutes));
      if (val === null) return;
      updateBlockMinutes(b.id, val);
    });

    const del = document.createElement("button");
    del.className = "pill danger";
    del.textContent = "Del";
    del.addEventListener("click", () => deleteBlock(b.id));

    actions.appendChild(select);
    actions.appendChild(minsBtn);
    actions.appendChild(del);

    el.appendChild(left);
    el.appendChild(actions);
    blockListEl.appendChild(el);
  });
}

function renderTasks() {
  // Task list UI removed for simplified layout
  if (!taskListEl) return;
  
  taskListEl.innerHTML = "";
  if (!tasks.length) {
    if (noTasksText) noTasksText.classList.remove("hidden");
    return;
  }
  if (noTasksText) noTasksText.classList.add("hidden");

  tasks.forEach((t) => {
    const el = document.createElement("div");
    el.className = "task";

    const left = document.createElement("div");
    left.className = "task-left";

    const cb = document.createElement("div");
    cb.className = "checkbox" + (t.done ? " checked" : "");
    cb.addEventListener("click", () => toggleTaskDone(t.id));

    const nameWrap = document.createElement("div");
    nameWrap.style.minWidth = "0";

    const nm = document.createElement("div");
    nm.className = "task-name";
    nm.textContent = t.name;

    const meta = document.createElement("div");
    meta.className = "task-meta";
    meta.textContent = `${t.minutes} min`;

    nameWrap.appendChild(nm);
    nameWrap.appendChild(meta);

    left.appendChild(cb);
    left.appendChild(nameWrap);

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const focusBtn = document.createElement("button");
    focusBtn.className = "pill primary";
    focusBtn.textContent = "Focus";
    focusBtn.addEventListener("click", () => {
      // select linked block if exists, else create one
      let linked = blocks.find(b => b.sourceTaskId === t.id);
      if (!linked) {
        // make block
        addBlock(t.name, t.minutes, t.id);
        linked = blocks.find(b => b.sourceTaskId === t.id);
      }
      if (linked) selectBlock(linked.id);
    });

    const editBtn = document.createElement("button");
    editBtn.className = "pill";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => {
      openTaskModal(true, t);
    });

    const delBtn = document.createElement("button");
    delBtn.className = "pill danger";
    delBtn.textContent = "Del";
    delBtn.addEventListener("click", () => deleteTask(t.id));

    actions.appendChild(focusBtn);
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    el.appendChild(left);
    el.appendChild(actions);
    taskListEl.appendChild(el);
  });
}

function renderTimer() {
  // Handle break mode
  if (timer.isBreak) {
    const sessionsBeforeShort = appSettings.sessionsBeforeShortBreak || 1;
    const sessionsBeforeLong = appSettings.sessionsBeforeLongBreak || 4;
    const isLongBreak = timer.sessionCount > 0 && 
      timer.sessionCount % sessionsBeforeLong === 0;
    const isShortBreak = !isLongBreak && timer.sessionCount > 0 &&
      timer.sessionCount % sessionsBeforeShort === 0;
    const breakMins = isLongBreak ? appSettings.longBreakDuration : appSettings.shortBreakDuration;
    
    currentLabel.textContent = isLongBreak ? "LONG BREAK" : "SHORT BREAK";
    timerDisplay.textContent = formatTime(timer.remainingSec);
    if (timerHint) timerHint.textContent = `${breakMins} min break • Session ${timer.sessionCount}`;
    if (timerBadge) timerBadge.textContent = "☕";
    
    // Button states for break timer
    if (timer.running) {
      // Timer is running - can pause or skip
      startBtn.disabled = true;
      pauseBtn.disabled = false;
    } else {
      // Timer is paused - can start or skip (if time remaining)
      startBtn.disabled = timer.remainingSec <= 0;
      pauseBtn.disabled = true;
    }
    skipBtn.disabled = false;
    distractedBtn.disabled = true;
    
    // Timer ring progress
    const progressPercent = timer.totalSec ? ((timer.totalSec - timer.remainingSec) / timer.totalSec) * 100 : 0;
    const circumference = 565.48;
    const offset = circumference - (progressPercent / 100) * circumference;
    if (timerRingProgress) {
      timerRingProgress.style.strokeDashoffset = offset;
      timerRingProgress.style.stroke = "#22c55e"; // Green for break
    }
    
    // Update indicator for break timer
    const timerRingIndicator = document.getElementById('timerRingIndicator');
    if (timerRingIndicator && timer.running && timer.totalSec > 0) {
      const angle = (progressPercent / 100) * 360 - 90;
      const radius = 90;
      const centerX = 100;
      const centerY = 100;
      const x = centerX + radius * Math.cos((angle * Math.PI) / 180);
      const y = centerY + radius * Math.sin((angle * Math.PI) / 180);
      // Update car position
      const carCircle = timerRingIndicator.querySelector('circle');
      const carText = timerRingIndicator.querySelector('text');
      if (carCircle) {
        carCircle.setAttribute('cx', x);
        carCircle.setAttribute('cy', y);
        carCircle.setAttribute('fill', '#22c55e'); // Green for break
      }
      if (carText) {
        carText.setAttribute('x', x);
        carText.setAttribute('y', y + 4);
      }
      timerRingIndicator.setAttribute('opacity', '1');
    } else if (timerRingIndicator) {
      timerRingIndicator.setAttribute('opacity', '0');
    }
    
    // Now card - break state
    if (nowCard) {
      nowCard.classList.add("active", "break");
      nowCard.classList.remove("running");
    }
    if (nowIcon) nowIcon.textContent = "☕";
    if (nowState) {
      nowState.textContent = "Break";
      nowState.classList.remove("running");
      nowState.classList.add("break");
    }
    nowBlockName.textContent = isLongBreak ? "Long Break" : "Short Break";
    if (nowTimeValue) nowTimeValue.textContent = formatTime(timer.remainingSec);
    if (nowFocusValue) nowFocusValue.textContent = `${timer.sessionCount} sessions`;
    if (nowProgressFill) nowProgressFill.style.width = `${progressPercent}%`;
    
    // Status card
    if (statusIcon) statusIcon.textContent = "☕";
    statusTitle.textContent = "Break Time";
    statusSub.textContent = "Relax, stretch, hydrate — you've earned it!";
    return;
  }
  
  // Reset break styling
  if (timerRingProgress) timerRingProgress.style.stroke = "";
  if (nowCard) nowCard.classList.remove("break");
  if (nowState) nowState.classList.remove("break");
  
  const b = getActiveBlock();
  if (!b) {
    currentLabel.textContent = "CURRENT FOCUS";
    timerDisplay.textContent = "00:00";
    if (timerHint) timerHint.textContent = "Add a block to begin";
    if (timerBadge) timerBadge.textContent = "🎯";
    startBtn.disabled = true;
    pauseBtn.disabled = true;
    skipBtn.disabled = true;
    distractedBtn.disabled = true;
    
    // Timer ring - reset to empty
    if (timerRingProgress) {
      timerRingProgress.style.strokeDashoffset = 565.48; // Full circle
    }
    const timerRingIndicator = document.getElementById('timerRingIndicator');
    if (timerRingIndicator) {
      timerRingIndicator.style.opacity = '0';
    }

    // Update elegant Now card - empty state
    if (nowCard) nowCard.classList.remove("active", "running");
    if (nowIcon) nowIcon.textContent = "⏸️";
    if (nowState) {
      nowState.textContent = "Ready";
      nowState.classList.remove("running");
    }
    nowBlockName.textContent = "No active block";
    if (nowTimeValue) nowTimeValue.textContent = "--:--";
    if (nowFocusValue) nowFocusValue.textContent = "100%";
    if (nowProgressFill) nowProgressFill.style.width = "0%";

    // Status card
    if (statusIcon) statusIcon.textContent = "💭";
    statusTitle.textContent = "Ready to focus?";
    statusSub.textContent = "Add a block to start your session";
    return;
  }

  currentLabel.textContent = b.name.toUpperCase();
  if (!timer.running) {
    // ensure remaining matches block minutes if not set
    if (!timer.remainingSec || timer.remainingSec <= 0) {
      timer.totalSec = b.minutes * 60;
      timer.remainingSec = timer.totalSec;
    }
  }

  timerDisplay.textContent = formatTime(timer.remainingSec);
  if (timerHint) timerHint.textContent = `${b.minutes} min session • Session ${(timer.sessionCount || 0) + 1}`;
  if (timerBadge) timerBadge.textContent = timer.running ? "🔥" : "▶️";

  startBtn.disabled = timer.running ? true : false;
  pauseBtn.disabled = timer.running ? false : true;
  skipBtn.disabled = timer.running ? false : false; // allow skip any time
  distractedBtn.disabled = timer.running ? false : false; // allow distraction when active
  
  // Timer ring progress (SVG circle)
  const progressPercent = timer.totalSec ? ((timer.totalSec - timer.remainingSec) / timer.totalSec) * 100 : 0;
  const circumference = 565.48; // 2 * PI * 90
  const offset = circumference - (progressPercent / 100) * circumference;
  if (timerRingProgress) {
    timerRingProgress.style.strokeDashoffset = offset;
  }

  // Update elegant Now card - active state
  if (nowCard) {
    nowCard.classList.add("active");
    if (timer.running) {
      nowCard.classList.add("running");
    } else {
      nowCard.classList.remove("running");
    }
  }
  
  if (nowIcon) nowIcon.textContent = timer.running ? "🔥" : "▶️";
  if (nowState) {
    nowState.textContent = timer.running ? "Focusing" : "Paused";
    if (timer.running) {
      nowState.classList.add("running");
    } else {
      nowState.classList.remove("running");
    }
  }
  
  nowBlockName.textContent = b.name;
  
  // Time remaining
  if (nowTimeValue) nowTimeValue.textContent = formatTime(timer.remainingSec);
  
  // Focus percentage (based on distractions)
  const distractions = stats.distractionCount || 0;
  const focusPercent = distractions === 0 ? 100 : Math.max(0, 100 - (distractions * 10));
  if (nowFocusValue) nowFocusValue.textContent = `${focusPercent}%`;
  
  // Now card progress bar
  if (nowProgressFill) nowProgressFill.style.width = `${progressPercent}%`;

  // Status card
  if (statusIcon) statusIcon.textContent = timer.running ? "🔥" : "✨";
  statusTitle.textContent = timer.running ? "Locked in" : "Ready to go";
  statusSub.textContent = timer.running ? "Stay focused — you're doing great!" : "Hit Start when you're ready";
}

function renderInsights() {
  todayMinutesEl.textContent = String(stats.todayMinutes || 0);
  // Show 7-day total including today
  weekMinutesEl.textContent = String(getWeekMinutesWithToday());
  streakCountEl.textContent = String(stats.streak || 0);
  if (distractionCountEl) distractionCountEl.textContent = String(stats.distractionCount || 0);
  
  // Sync to panel tab
  const todayMinutes2 = document.getElementById('todayMinutes2');
  const weekMinutes2 = document.getElementById('weekMinutes2');
  const streakCount2 = document.getElementById('streakCount2');
  const distractionCount2 = document.getElementById('distractionCount2');
  
  if (todayMinutes2) todayMinutes2.textContent = String(stats.todayMinutes || 0);
  if (weekMinutes2) weekMinutes2.textContent = String(getWeekMinutesWithToday());
  if (streakCount2) streakCount2.textContent = String(stats.streak || 0);
  if (distractionCount2) distractionCount2.textContent = String(stats.distractionCount || 0);
}

function renderAll() {
  renderGoal();
  renderBlocks();
  renderTasks();
  renderTimer();
  renderInsights();
}

function openModal(modalEl) {
  backdrop.classList.remove("hidden");
  modalEl.classList.remove("hidden");
}
function closeModal(modalEl) {
  modalEl.classList.add("hidden");
  backdrop.classList.add("hidden");
}

// Task modal
function openTaskModal(edit=false, task=null) {
  if (edit && task) {
    editingTaskId = task.id;
    taskModalTitle.textContent = "Edit Task";
    taskNameInput.value = task.name;
    taskMinsInput.value = String(task.minutes);
  } else {
    editingTaskId = null;
    taskModalTitle.textContent = "Add Task";
    taskNameInput.value = "";
    taskMinsInput.value = "15";
  }
  openModal(taskModal);
  setTimeout(()=>taskNameInput.focus(), 10);
}

// Distract modal
function openDistractModal() {
  // Reset modal state
  selectedDistractionReason = null;
  if (distractNote) distractNote.value = '';
  document.querySelectorAll("#distractModal .choice").forEach(b => b.classList.remove('selected'));
  
  openModal(distractModal);
}

// Feedback modal
function openFeedbackModal() {
  const mins = stats.todayMinutes || 0;
  const d = stats.distractionCount || 0;

  let msg = `Today: ${mins} min focused • ${d} interruptions\n\n`;
  if (mins === 0) {
    msg += "Start a focus block, and I’ll coach you here.";
  } else if (d === 0) {
    msg += "Perfect discipline today ✅ Keep the streak alive.";
  } else {
    const entries = Object.entries(stats.distractionReasons || {});
    entries.sort((a,b)=>b[1]-a[1]);
    if (entries.length) {
      msg += "Top distractions:\n";
      entries.slice(0,3).forEach(([r,c])=>{
        msg += `• ${r}: ${c}\n`;
      });
      msg += "\nFix: put the #1 distraction out of reach before starting.";
    } else {
      msg += "You got distracted — next session: phone away + 1 deep breath reset.";
    }
  }

  feedbackText.textContent = msg;
  openModal(feedbackModal);
}

// Events
saveGoalBtn.addEventListener("click", () => {
  const val = parseInt(goalInput.value, 10);
  if (!isFinite(val) || val <= 0) return;
  localStorage.setItem(LS.GOAL, String(val));
  goalInput.value = "";
  renderGoal();
});

// Add Focus Block button removed - users add via tasks

addTaskBtn.addEventListener("click", () => openTaskModal(false));

taskCancelBtn.addEventListener("click", () => closeModal(taskModal));
taskSaveBtn.addEventListener("click", () => {
  const nm = taskNameInput.value.trim();
  const mins = taskMinsInput.value;
  if (!nm) return;
  closeModal(taskModal);
  upsertTask(nm, mins);
});

// Clear tasks button removed from simplified UI

startBtn.addEventListener("click", () => startTimer());
pauseBtn.addEventListener("click", () => pauseTimer());
skipBtn.addEventListener("click", () => skipBlock());

distractedBtn.addEventListener("click", () => {
  // Only allow if there is an active block
  if (!getActiveBlock()) return;
  openDistractModal();
});

// Distraction cancel button
distractCancelBtn.addEventListener("click", () => closeModal(distractModal));

feedbackBtn.addEventListener("click", () => openFeedbackModal());
feedbackCloseBtn.addEventListener("click", () => closeModal(feedbackModal));

resetBtn.addEventListener("click", () => {
  if (!confirm("Reset everything? This clears tasks, blocks, stats.")) return;
  localStorage.removeItem(LS.GOAL);
  localStorage.removeItem(LS.BLOCKS);
  localStorage.removeItem(LS.TASKS);
  localStorage.removeItem(LS.STATS);
  localStorage.removeItem(LS.ACTIVE);
  localStorage.removeItem(LS.TIMER);
  blocks = [];
  tasks = [];
  stats.todayMinutes = 0;
  stats.weekMinutes = 0;
  stats.streak = 0;
  stats.lastDayKey = null;
  stats.distractionCount = 0;
  stats.distractionReasons = {};
  stats.dailyHistory = [];
  activeBlockId = null;
  stopTimer(true);
  loadAll();
  renderAll();
});

// Init
(function init(){
  loadAll();
  renderAll();

  // Initialize sound toggle button
  initSoundToggle();
  
  // Initialize keyboard shortcuts
  initKeyboardShortcuts();
  initShortcutsUI();
  
  // Request notification permission (will only prompt if not already granted/denied)
  requestNotificationPermission();

  // First-time user onboarding: add a sample task if no tasks/blocks exist
  const hasSeenOnboarding = localStorage.getItem('focus_onboarding_done');
  if (!hasSeenOnboarding && blocks.length === 0 && tasks.length === 0) {
    // Create a welcome task for first-time users
    const welcomeTaskId = uuid();
    tasks.unshift({
      id: welcomeTaskId,
      name: "My first focus session",
      minutes: 5,
      done: false,
      createdAt: Date.now()
    });
    
    // Create the linked focus block and auto-select it
    addBlock("My first focus session", 5, welcomeTaskId, true);
    
    // Mark onboarding as done
    localStorage.setItem('focus_onboarding_done', 'true');
    
    // Show a welcome hint
    setTimeout(() => {
      const hint = document.getElementById('timerHint');
      if (hint) {
        hint.textContent = "👋 Welcome! Hit Start to begin your first 5-min focus session";
      }
    }, 100);
  }
  
  // Auto-select first available block if none is active
  if (blocks.length && !activeBlockId) {
    // Find first non-completed block, or just use the first one
    const firstAvailable = blocks.find(b => !b.completed) || blocks[0];
    if (firstAvailable) {
      activeBlockId = firstAvailable.id;
      localStorage.setItem(LS.ACTIVE, activeBlockId);
      timer.totalSec = firstAvailable.minutes * 60;
      timer.remainingSec = timer.totalSec;
      persistAll();
      renderAll();
    }
  }

  // Ensure timer controls are correct
})();





/* =========================
   Journaling Feature
========================= */

// Reflection Modal
const reflectionModal = document.getElementById('reflectionModal');
const productivityRating = document.getElementById('productivityRating');
const recoveryRating = document.getElementById('recoveryRating');
const reflectionNote = document.getElementById('reflectionNote');
const skipReflectionBtn = document.getElementById('skipReflectionBtn');
const saveReflectionBtn = document.getElementById('saveReflectionBtn');

let selectedRating = null;
let selectedRecoveryRating = null;
let selectedHelpers = [];

function openReflectionModal() {
  if (!reflectionModal) return;
  
  // Reset state
  selectedRating = null;
  selectedRecoveryRating = null;
  selectedHelpers = [];
  if (reflectionNote) reflectionNote.value = '';
  
  // Reset UI
  document.querySelectorAll('.rating-btn').forEach(btn => btn.classList.remove('selected'));
  document.querySelectorAll('.helper-chip').forEach(chip => chip.classList.remove('selected'));
  
  // Open modal
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('hidden');
  reflectionModal.classList.remove('hidden');
}

function closeReflectionModal() {
  if (!reflectionModal) return;
  reflectionModal.classList.add('hidden');
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (modalBackdrop) modalBackdrop.classList.add('hidden');
  
  // Start break after closing reflection (if enabled)
  if (appSettings.autoStartBreaks) {
    setTimeout(() => startBreak(), 500);
  }
}

function saveReflection() {
  if (!lastCompletedBlock) {
    closeReflectionModal();
    return;
  }
  
  const reflection = {
    id: uuid(),
    date: lastCompletedBlock.date,
    blockName: lastCompletedBlock.name,
    minutes: lastCompletedBlock.minutes,
    rating: selectedRating,
    recoveryRating: selectedRecoveryRating,
    helpers: selectedHelpers,
    note: reflectionNote?.value?.trim() || ''
  };
  
  if (!journal.reflections) journal.reflections = [];
  journal.reflections.unshift(reflection);
  
  // Keep only last 100 reflections
  if (journal.reflections.length > 100) {
    journal.reflections = journal.reflections.slice(0, 100);
  }
  
  // Save research data to Firestore
  saveResearchSessionData({
    user_id: firebaseAuth?.currentUser?.uid || 'anonymous',
    date: dayKey(new Date(lastCompletedBlock.date)),
    session_start_time: lastCompletedBlock.sessionStartTime,
    planned_minutes: lastCompletedBlock.plannedMinutes,
    actual_minutes: lastCompletedBlock.actualMinutes,
    distraction_count: lastCompletedBlock.distractionCount,
    focus_rating: selectedRating,
    recovery_rating: selectedRecoveryRating
  });
  
  persistAll();
  closeReflectionModal();
}

// Rating buttons (productivity/focus rating)
if (productivityRating) {
  productivityRating.addEventListener('click', (e) => {
    const btn = e.target.closest('.rating-btn');
    if (!btn) return;
    
    // Only remove selected from productivity rating buttons
    productivityRating.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedRating = parseInt(btn.dataset.rating);
  });
}

// Recovery rating buttons
if (recoveryRating) {
  recoveryRating.addEventListener('click', (e) => {
    const btn = e.target.closest('.rating-btn');
    if (!btn) return;
    
    // Only remove selected from recovery rating buttons
    recoveryRating.querySelectorAll('.rating-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedRecoveryRating = parseInt(btn.dataset.rating);
  });
}

// Helper chips
document.querySelectorAll('.helper-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('selected');
    const helper = chip.dataset.helper;
    if (chip.classList.contains('selected')) {
      if (!selectedHelpers.includes(helper)) selectedHelpers.push(helper);
    } else {
      selectedHelpers = selectedHelpers.filter(h => h !== helper);
    }
  });
});

if (skipReflectionBtn) {
  skipReflectionBtn.addEventListener('click', () => {
    // Save research data even if reflection is skipped (with null ratings)
    if (lastCompletedBlock) {
      saveResearchSessionData({
        user_id: firebaseAuth?.currentUser?.uid || 'anonymous',
        date: dayKey(new Date(lastCompletedBlock.date)),
        session_start_time: lastCompletedBlock.sessionStartTime,
        planned_minutes: lastCompletedBlock.plannedMinutes,
        actual_minutes: lastCompletedBlock.actualMinutes,
        distraction_count: lastCompletedBlock.distractionCount,
        focus_rating: null,
        recovery_rating: null
      });
    }
    closeReflectionModal();
  });
}

if (saveReflectionBtn) {
  saveReflectionBtn.addEventListener('click', saveReflection);
}

// Enhanced Distraction Logging
const distractNote = document.getElementById('distractNote');
const distractSubmitBtn = document.getElementById('distractSubmitBtn');
let selectedDistractionReason = null;

// Handle distraction reason selection (just highlight, don't submit)
document.querySelectorAll("#distractModal .choice").forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove selection from all buttons
    document.querySelectorAll("#distractModal .choice").forEach(b => b.classList.remove('selected'));
    // Add selection to clicked button
    btn.classList.add('selected');
    selectedDistractionReason = btn.getAttribute("data-reason") || "Other";
  });
});

// Handle distraction submit button
if (distractSubmitBtn) {
  distractSubmitBtn.addEventListener('click', () => {
    if (!selectedDistractionReason) {
      alert('Please select a distraction reason');
      return;
    }
    
    const note = distractNote?.value?.trim() || '';
    const distractModal = document.getElementById('distractModal');
    
    closeModal(distractModal);
    logDistractionWithNote(selectedDistractionReason, note);
    
    // Reset for next time
    selectedDistractionReason = null;
    if (distractNote) distractNote.value = '';
    document.querySelectorAll("#distractModal .choice").forEach(b => b.classList.remove('selected'));
  });
}

function logDistractionWithNote(reason, note) {
  const b = getActiveBlock();
  if (!b) return;

  // 1) count
  stats.distractionCount = (stats.distractionCount || 0) + 1;

  // 2) reason breakdown
  stats.distractionReasons[reason] = (stats.distractionReasons[reason] || 0) + 1;

  // 3) "time tax" add 30 seconds
  timer.remainingSec = clamp(timer.remainingSec + 30, 0, 24 * 60 * 60);

  // 4) Save to journal
  if (!journal.distractions) journal.distractions = [];
  journal.distractions.unshift({
    id: uuid(),
    date: new Date().toISOString(),
    reason: reason,
    note: note,
    blockName: b.name
  });
  
  // Keep only last 100 distractions
  if (journal.distractions.length > 100) {
    journal.distractions = journal.distractions.slice(0, 100);
  }

  persistAll();
  renderAll();
}

// Journal Modal
const journalModal = document.getElementById('journalModal');
const journalBtn = document.getElementById('journalBtn');
const closeJournalBtn = document.getElementById('closeJournalBtn');
const journalContent = document.getElementById('journalContent');

function openJournalModal() {
  if (!journalModal) return;
  
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('hidden');
  journalModal.classList.remove('hidden');
  
  // Show reflections tab by default
  renderJournalTab('reflections');
}

function closeJournalModal() {
  if (!journalModal) return;
  journalModal.classList.add('hidden');
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (modalBackdrop) modalBackdrop.classList.add('hidden');
}

function renderJournalTab(tab) {
  if (!journalContent) return;
  
  // Update tab buttons (both left panel tabs and right panel journal tabs)
  document.querySelectorAll('.journal-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  
  // Show/hide clear buttons based on active tab
  const clearReflectionsBtn = document.getElementById('clearReflectionsBtn');
  const clearDistractionsBtn = document.getElementById('clearDistractionsBtn');
  const clearPatternsBtn = document.getElementById('clearPatternsBtn');
  
  if (clearReflectionsBtn) clearReflectionsBtn.classList.toggle('hidden', tab !== 'reflections');
  if (clearDistractionsBtn) clearDistractionsBtn.classList.toggle('hidden', tab !== 'distractions');
  if (clearPatternsBtn) clearPatternsBtn.classList.toggle('hidden', tab !== 'patterns');
  
  if (tab === 'reflections') {
    renderReflections();
  } else if (tab === 'distractions') {
    renderDistractions();
  } else if (tab === 'patterns') {
    renderPatterns();
  }
}

function renderReflections() {
  const reflections = journal.reflections || [];
  const clearReflectionsBtn = document.getElementById('clearReflectionsBtn');
  
  // Show clear button only if there are reflections
  if (clearReflectionsBtn) {
    clearReflectionsBtn.classList.toggle('hidden', reflections.length === 0);
  }
  
  if (reflections.length === 0) {
    journalContent.innerHTML = '<div class="journal-empty">No reflections yet. Complete a focus session to start journaling!</div>';
    return;
  }
  
  const ratingEmojis = ['', '😫', '😕', '😐', '🙂', '🤩'];
  
  journalContent.innerHTML = reflections.map(r => {
    const date = new Date(r.date);
    const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const tags = [];
    if (r.rating) tags.push(`<span class="journal-tag rating">${ratingEmojis[r.rating]} ${r.rating}/5</span>`);
    r.helpers?.forEach(h => tags.push(`<span class="journal-tag helper">${h}</span>`));
    
    return `
      <div class="journal-entry" data-entry-id="${r.id}" data-entry-type="reflection">
        <div class="journal-entry-header">
          <div class="journal-entry-title">📝 ${r.blockName} (${r.minutes} min)</div>
          <div class="journal-entry-date">${dateStr}</div>
        </div>
        ${r.note ? `<div class="journal-entry-body">${r.note}</div>` : ''}
        ${tags.length ? `<div class="journal-entry-tags">${tags.join('')}</div>` : ''}
        <div class="journal-entry-actions">
          <button class="journal-action-btn edit-btn" data-entry-id="${r.id}" data-type="reflection">✏️ Edit</button>
          <button class="journal-action-btn delete-btn" data-entry-id="${r.id}" data-type="reflection">🗑️ Delete</button>
        </div>
      </div>
    `;
  }).join('');
  
  // Add event listeners for edit/delete buttons
  attachJournalEntryListeners('reflection');
}

function renderDistractions() {
  const distractions = journal.distractions || [];
  const clearDistractionsBtn = document.getElementById('clearDistractionsBtn');
  
  // Show clear button only if there are distractions
  if (clearDistractionsBtn) {
    clearDistractionsBtn.classList.toggle('hidden', distractions.length === 0);
  }
  
  if (distractions.length === 0) {
    journalContent.innerHTML = '<div class="journal-empty">No distractions logged yet. That\'s great focus!</div>';
    return;
  }
  
  journalContent.innerHTML = distractions.map(d => {
    const date = new Date(d.date);
    const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    return `
      <div class="journal-entry distraction" data-entry-id="${d.id}" data-entry-type="distraction">
        <div class="journal-entry-header">
          <div class="journal-entry-title">⚠️ ${d.reason}</div>
          <div class="journal-entry-date">${dateStr}</div>
        </div>
        ${d.note ? `<div class="journal-entry-body">${d.note}</div>` : ''}
        <div class="journal-entry-tags">
          <span class="journal-tag">During: ${d.blockName}</span>
        </div>
        <div class="journal-entry-actions">
          <button class="journal-action-btn edit-btn" data-entry-id="${d.id}" data-type="distraction">✏️ Edit</button>
          <button class="journal-action-btn delete-btn" data-entry-id="${d.id}" data-type="distraction">🗑️ Delete</button>
        </div>
      </div>
    `;
  }).join('');
  
  // Add event listeners for edit/delete buttons
  attachJournalEntryListeners('distraction');
}

function renderPatterns() {
  const reflections = journal.reflections || [];
  const distractions = journal.distractions || [];
  const clearPatternsBtn = document.getElementById('clearPatternsBtn');
  
  // Show clear button only if there's data
  if (clearPatternsBtn) {
    clearPatternsBtn.classList.toggle('hidden', reflections.length === 0 && distractions.length === 0);
  }
  
  if (reflections.length === 0 && distractions.length === 0) {
    journalContent.innerHTML = '<div class="journal-empty">Not enough data yet. Keep using the app to see patterns!</div>';
    return;
  }
  
  // Calculate helper frequency
  const helperCounts = {};
  reflections.forEach(r => {
    r.helpers?.forEach(h => {
      helperCounts[h] = (helperCounts[h] || 0) + 1;
    });
  });
  
  // Calculate distraction frequency
  const distractionCounts = {};
  distractions.forEach(d => {
    distractionCounts[d.reason] = (distractionCounts[d.reason] || 0) + 1;
  });
  
  // Calculate average rating
  const ratings = reflections.filter(r => r.rating).map(r => r.rating);
  const avgRating = ratings.length ? (ratings.reduce((a,b) => a+b, 0) / ratings.length).toFixed(1) : '-';
  
  // Sort and get top items
  const topHelpers = Object.entries(helperCounts).sort((a,b) => b[1] - a[1]).slice(0, 5);
  const topDistractions = Object.entries(distractionCounts).sort((a,b) => b[1] - a[1]).slice(0, 5);
  const maxHelper = Math.max(...Object.values(helperCounts), 1);
  const maxDistraction = Math.max(...Object.values(distractionCounts), 1);
  
  let html = `
    <div class="pattern-section">
      <div class="pattern-title">📊 Summary</div>
      <div class="ins-row">
        <span>Total sessions</span>
        <span>${reflections.length}</span>
      </div>
      <div class="ins-row">
        <span>Average productivity</span>
        <span>${avgRating}/5</span>
      </div>
      <div class="ins-row">
        <span>Total distractions logged</span>
        <span>${distractions.length}</span>
      </div>
    </div>
  `;
  
  if (topHelpers.length > 0) {
    html += `
      <div class="pattern-section">
        <div class="pattern-title">✅ What helps you focus</div>
        ${topHelpers.map(([helper, count]) => `
          <div class="pattern-bar">
            <div class="pattern-label">${helper}</div>
            <div class="pattern-fill-bg">
              <div class="pattern-fill" style="width: ${(count/maxHelper)*100}%"></div>
            </div>
            <div class="pattern-count">${count}</div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  if (topDistractions.length > 0) {
    html += `
      <div class="pattern-section">
        <div class="pattern-title">⚠️ Top distractions</div>
        ${topDistractions.map(([reason, count]) => `
          <div class="pattern-bar">
            <div class="pattern-label">${reason}</div>
            <div class="pattern-fill-bg">
              <div class="pattern-fill distraction" style="width: ${(count/maxDistraction)*100}%"></div>
            </div>
            <div class="pattern-count">${count}</div>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  journalContent.innerHTML = html;
}

// Attach edit/delete listeners to journal entries
function attachJournalEntryListeners(type) {
  // Delete buttons
  document.querySelectorAll(`.journal-entry[data-entry-type="${type}"] .delete-btn`).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const entryId = btn.dataset.entryId;
      if (confirm('Are you sure you want to delete this entry?')) {
        if (type === 'reflection') {
          journal.reflections = journal.reflections.filter(r => r.id !== entryId);
        } else if (type === 'distraction') {
          journal.distractions = journal.distractions.filter(d => d.id !== entryId);
        }
        persistAll();
        renderJournalTab(type === 'reflection' ? 'reflections' : 'distractions');
      }
    });
  });
  
  // Edit buttons
  document.querySelectorAll(`.journal-entry[data-entry-type="${type}"] .edit-btn`).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const entryId = btn.dataset.entryId;
      if (type === 'reflection') {
        editReflection(entryId);
      } else if (type === 'distraction') {
        editDistraction(entryId);
      }
    });
  });
}

function editReflection(entryId) {
  const reflection = journal.reflections.find(r => r.id === entryId);
  if (!reflection) return;
  
  const newNote = prompt('Edit your reflection note:', reflection.note || '');
  if (newNote !== null) {
    reflection.note = newNote.trim();
    persistAll();
    renderReflections();
  }
}

function editDistraction(entryId) {
  const distraction = journal.distractions.find(d => d.id === entryId);
  if (!distraction) return;
  
  const newNote = prompt('Edit your distraction note:', distraction.note || '');
  if (newNote !== null) {
    distraction.note = newNote.trim();
    persistAll();
    renderDistractions();
  }
}

// Journal tab clicks (right panel)
document.querySelectorAll('.panel-tabs .journal-tab, .journal-tabs .journal-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    renderJournalTab(tab.dataset.tab);
  });
});

// Initialize journal to show reflections by default
if (journalContent) {
  renderJournalTab('reflections');
}

// Journal tabs now in right panel (no modal needed)
// Remove modal handlers - journal is now inline

// Clear button handlers
const clearReflectionsBtn = document.getElementById('clearReflectionsBtn');
const clearDistractionsBtn = document.getElementById('clearDistractionsBtn');
const clearPatternsBtn = document.getElementById('clearPatternsBtn');

if (clearReflectionsBtn) {
  clearReflectionsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all reflections? This cannot be undone.')) {
      journal.reflections = [];
      persistAll();
      renderReflections();
      updateBadgeCount(); // Recalculate badges
    }
  });
}

if (clearDistractionsBtn) {
  clearDistractionsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all distraction logs? This cannot be undone.')) {
      journal.distractions = [];
      persistAll();
      renderDistractions();
    }
  });
}

if (clearPatternsBtn) {
  clearPatternsBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all journal data (reflections and distractions)? This cannot be undone.')) {
      journal.reflections = [];
      journal.distractions = [];
      persistAll();
      renderPatterns();
      updateBadgeCount(); // Recalculate badges
    }
  });
}

/* =========================
   Panel Tabs (Left Panel)
========================= */
document.querySelectorAll('.panel-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.dataset.tab;
    
    // Update tab buttons
    document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.panel-content').forEach(content => content.classList.remove('active'));
    const targetContent = document.getElementById('panel' + targetTab.charAt(0).toUpperCase() + targetTab.slice(1));
    if (targetContent) targetContent.classList.add('active');
  });
});

// Sync insights values between main and tab panel
function syncInsightsToTab() {
  const todayMinutes2 = document.getElementById('todayMinutes2');
  const weekMinutes2 = document.getElementById('weekMinutes2');
  const streakCount2 = document.getElementById('streakCount2');
  const distractionCount2 = document.getElementById('distractionCount2');
  
  if (todayMinutes2) todayMinutes2.textContent = stats.todayMinutes || 0;
  if (weekMinutes2) weekMinutes2.textContent = stats.weekMinutes || 0;
  if (streakCount2) streakCount2.textContent = stats.streak || 0;
  if (distractionCount2) distractionCount2.textContent = stats.distractionCount || 0;
}

/* =========================
   Badges / Gamification
========================= */

// Badge definitions
const BADGES = [
  { id: 'first_focus', icon: '🎯', name: 'First Focus', desc: 'Complete your first session' },
  { id: 'five_sessions', icon: '⭐', name: 'Rising Star', desc: 'Complete 5 sessions' },
  { id: 'ten_sessions', icon: '🌟', name: 'Focus Pro', desc: 'Complete 10 sessions' },
  { id: 'streak_3', icon: '🔥', name: 'On Fire', desc: '3-day streak' },
  { id: 'streak_7', icon: '💪', name: 'Streak Master', desc: '7-day streak' },
  { id: 'hour_hero', icon: '⏰', name: 'Hour Hero', desc: '60 minutes in one day' },
  { id: 'centurion', icon: '💯', name: 'Centurion', desc: '100 total minutes focused' },
  { id: 'marathon', icon: '🏃', name: 'Marathon', desc: '500 total minutes focused' },
  { id: 'no_distraction', icon: '🧘', name: 'Zen Master', desc: 'Session with 0 distractions' },
  { id: 'reflection_5', icon: '📝', name: 'Reflector', desc: 'Write 5 reflections' },
  { id: 'early_bird', icon: '🌅', name: 'Early Bird', desc: 'Session before 8 AM' },
  { id: 'night_owl', icon: '🦉', name: 'Night Owl', desc: 'Session after 10 PM' },
];

// Earned badges storage: { badgeId: count } - badges can be earned multiple times
let earnedBadges = {};

// Load badges from storage
function loadBadges() {
  const loaded = loadJSON(LS.BADGES, {});
  // Migrate old format (date strings) to new format (counts)
  earnedBadges = {};
  Object.keys(loaded).forEach(badgeId => {
    if (typeof loaded[badgeId] === 'string') {
      // Old format: date string, convert to count 1
      earnedBadges[badgeId] = 1;
    } else if (typeof loaded[badgeId] === 'number') {
      // New format: count
      earnedBadges[badgeId] = loaded[badgeId];
    }
  });
  updateBadgeCount();
}

// Save badges to storage  
function saveBadges() {
  saveJSON(LS.BADGES, earnedBadges);
  updateBadgeCount();
  syncToFirestore(); // Sync badges to Firestore
}

// Update badge count in header (unique badges earned)
function updateBadgeCount() {
  const badgeCountEl = document.getElementById('badgeCount');
  if (badgeCountEl) {
    const uniqueBadges = Object.keys(earnedBadges).filter(id => earnedBadges[id] > 0).length;
    badgeCountEl.textContent = uniqueBadges > 0 ? uniqueBadges : '';
  }
}

// Check and award badges
function checkBadges(sessionInfo = {}) {
  const newBadges = [];
  
  // Count completed sessions
  const completedSessions = blocks.filter(b => b.completed).length;
  
  // Calculate total minutes (from ALL daily history + today) - for badge calculations use all data
  let totalMinutes = stats.todayMinutes || 0;
  if (Array.isArray(stats.dailyHistory)) {
    stats.dailyHistory.forEach(entry => {
      totalMinutes += (entry.minutes || 0);
    });
  }
  
  // Count reflections
  const reflectionCount = journal.reflections?.length || 0;
  
  // Current hour
  const currentHour = new Date().getHours();
  
  // Check each badge (can be earned multiple times)
  BADGES.forEach(badge => {
    const currentCount = earnedBadges[badge.id] || 0;
    let shouldAward = false;
    let threshold = 0;
    
    switch(badge.id) {
      case 'first_focus':
        threshold = 1;
        shouldAward = completedSessions >= (currentCount + 1) * threshold;
        break;
      case 'five_sessions':
        threshold = 5;
        shouldAward = completedSessions >= (currentCount + 1) * threshold;
        break;
      case 'ten_sessions':
        threshold = 10;
        shouldAward = completedSessions >= (currentCount + 1) * threshold;
        break;
      case 'streak_3':
        threshold = 3;
        shouldAward = (stats.streak || 0) >= (currentCount + 1) * threshold;
        break;
      case 'streak_7':
        threshold = 7;
        shouldAward = (stats.streak || 0) >= (currentCount + 1) * threshold;
        break;
      case 'hour_hero':
        threshold = 60;
        shouldAward = (stats.todayMinutes || 0) >= (currentCount + 1) * threshold;
        break;
      case 'centurion':
        threshold = 100;
        shouldAward = totalMinutes >= (currentCount + 1) * threshold;
        break;
      case 'marathon':
        threshold = 500;
        shouldAward = totalMinutes >= (currentCount + 1) * threshold;
        break;
      case 'no_distraction':
        // Can only earn once per session
        shouldAward = sessionInfo.noDistraction === true && currentCount === 0;
        break;
      case 'reflection_5':
        threshold = 5;
        shouldAward = reflectionCount >= (currentCount + 1) * threshold;
        break;
      case 'early_bird':
        // Can earn once per day
        const today = new Date().toDateString();
        const lastEarnedDate = sessionInfo.lastEarnedDates?.[badge.id];
        shouldAward = sessionInfo.justCompleted && currentHour < 8 && lastEarnedDate !== today;
        break;
      case 'night_owl':
        // Can earn once per day
        const today2 = new Date().toDateString();
        const lastEarnedDate2 = sessionInfo.lastEarnedDates?.[badge.id];
        shouldAward = sessionInfo.justCompleted && currentHour >= 22 && lastEarnedDate2 !== today2;
        break;
    }
    
    if (shouldAward) {
      earnedBadges[badge.id] = (earnedBadges[badge.id] || 0) + 1;
      newBadges.push(badge);
    }
  });
  
  if (newBadges.length > 0) {
    saveBadges();
    // Show toast for each new badge (with delay between)
    newBadges.forEach((badge, i) => {
      setTimeout(() => {
        showBadgeToast(badge);
        // Also play a sound for badge unlock
        playCompletionSound();
      }, i * 3000);
    });
  }
}

// Show badge unlocked toast
function showBadgeToast(badge) {
  const toast = document.getElementById('badgeToast');
  const toastIcon = document.getElementById('badgeToastIcon');
  const toastName = document.getElementById('badgeToastName');
  
  if (!toast || !toastIcon || !toastName) return;
  
  const count = earnedBadges[badge.id] || 1;
  toastIcon.textContent = badge.icon;
  toastName.textContent = `${badge.name}${count > 1 ? ` (${count}x)` : ''}`;
  
  toast.classList.remove('hidden');
  toast.classList.add('show');
  
  // Hide after 4 seconds (longer for multiple badges)
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 400);
  }, 4000);
}

// Badges Modal
const badgesModal = document.getElementById('badgesModal');
const badgesBtn = document.getElementById('badgesBtn');
const closeBadgesBtn = document.getElementById('closeBadgesBtn');
const badgesGrid = document.getElementById('badgesGrid');

function openBadgesModal() {
  if (!badgesModal) return;
  
  renderBadges();
  
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('hidden');
  badgesModal.classList.remove('hidden');
}

function closeBadgesModal() {
  if (!badgesModal) return;
  badgesModal.classList.add('hidden');
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (modalBackdrop) modalBackdrop.classList.add('hidden');
}

function renderBadges() {
  if (!badgesGrid) return;
  
  badgesGrid.innerHTML = BADGES.map(badge => {
    const count = earnedBadges[badge.id] || 0;
    const isUnlocked = count > 0;
    
    return `
      <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
        <div class="badge-icon">${badge.icon}</div>
        <div class="badge-name">${badge.name}</div>
        <div class="badge-desc">${badge.desc}</div>
        ${isUnlocked ? `<div class="badge-date">Earned ${count}x</div>` : ''}
      </div>
    `;
  }).join('');
}

if (badgesBtn) {
  badgesBtn.addEventListener('click', openBadgesModal);
}

if (closeBadgesBtn) {
  closeBadgesBtn.addEventListener('click', closeBadgesModal);
}

// Load badges on init
loadBadges();



/* =========================
   App Feedback (Google Forms)
========================= */
(function(){
  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScAEQQxxowZMXCD3JVQVo9zwEe1l6yu35Ow8y2EchRZ81nvPA/viewform';
  
  const openBtn = document.getElementById('appFeedbackBtn');
  
  if(!openBtn) return;

  openBtn.addEventListener('click', () => {
    window.open(GOOGLE_FORM_URL, '_blank');
  });
})();



