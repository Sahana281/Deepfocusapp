
// === Firebase Authentication ===
// Firebase Configuration
const firebaseConfig = {
  apiKey: "replace-token",
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

// Distraction modal elements (will be initialized after DOM loads)
let distractNote;
let distractSubmitBtn;

// Reflection modal elements (will be initialized after DOM loads)
let reflectionModal = null;
let productivityRating = null;
let skipReflectionBtn = null;
let saveReflectionBtn = null;

// Auth state
let isSignUpMode = false;

// Distraction modal state
let selectedDistractionReason = null;

// Badges state
let earnedBadges = {};

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
    // Extract username (no email tracking for privacy - kids may not have emails)
    const email = user.email || '';
    const username = user.displayName || (email.includes('@deepfocus.app') ? email.split('@')[0] : email.split('@')[0]) || 'User';
    const displayName = username;
    
    if (userName) userName.textContent = displayName;
    // Don't display email - privacy for kids who may not have emails
    if (userEmailEl) userEmailEl.style.display = 'none';
    if (userAvatar) userAvatar.textContent = getEmojiAvatar(displayName);
    
    // Set user properties for Analytics (NO EMAIL TRACKING - privacy for kids)
    if (analytics && user.uid) {
      try {
        analytics.setUserId(user.uid);
        analytics.setUserProperties({
          username: displayName || 'anonymous',
          is_demo: email === 'demo@focusapp.com'
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
    
    // Log app open event (NO EMAIL TRACKING)
    logAnalyticsEvent('app_open', {
      user_id: user.uid || 'anonymous',
      username: displayName || 'anonymous',
      is_demo: email === 'demo@focusapp.com'
    });
    
    // Load data from Firestore if user is logged in (not demo)
    // Check by UID, not email (privacy for kids)
    if (user.uid && email !== 'demo@focusapp.com' && email !== 'local@dev.com') {
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
// Ensure DOM is ready before attaching handler
function initAuthForm() {
  const form = document.getElementById('authForm');
  const emailInput = document.getElementById('authEmail');
  const passwordInput = document.getElementById('authPassword');
  
  if (!form || !emailInput || !passwordInput) {
    console.error('❌ Auth form elements not found');
    return;
  }
  
  console.log('✅ Auth form found, attaching submit handler');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('📝 Form submitted');
    hideAuthError();
    hideResetSuccess();
    
    // Check if Firebase is loaded
    if (typeof firebase === 'undefined') {
      const errorMsg = 'Firebase SDK not loaded. Please check your internet connection and refresh the page.';
      showAuthError(errorMsg);
      console.error('❌ Firebase SDK not loaded');
      return;
    }
    
    if (!firebaseAuth) {
      const errorMsg = 'Firebase Auth not initialized. Please refresh the page.';
      showAuthError(errorMsg);
      console.error('❌ firebaseAuth is undefined');
      console.error('Firebase object:', typeof firebase !== 'undefined' ? firebase : 'undefined');
      return;
    }
    
    const username = emailInput?.value?.trim();
    const password = passwordInput?.value;
    
    console.log('🔐 Attempting auth:', { username, hasPassword: !!password, isSignUpMode });
    
    if (!username || !password) {
      showAuthError('Please enter username and password');
      return;
    }
    
    if (password.length < 6) {
      showAuthError('Password must be at least 6 characters');
      return;
    }
    
    // Convert username to email format for Firebase (username@deepfocus.app)
    // This allows usernames while still using Firebase email/password auth
    const email = username.includes('@') ? username : `${username}@deepfocus.app`;
    console.log('📧 Using email format:', email);
    
    setAuthLoading(true);
    
    try {
      if (isSignUpMode) {
        console.log('📝 Creating new account...');
        await firebaseAuth.createUserWithEmailAndPassword(email, password);
        // Update display name to username
        if (firebaseAuth.currentUser) {
          await firebaseAuth.currentUser.updateProfile({
            displayName: username
          });
          console.log('✅ Account created successfully');
        }
      } else {
        console.log('🔑 Signing in...');
        await firebaseAuth.signInWithEmailAndPassword(email, password);
        console.log('✅ Signed in successfully');
      }
      // Note: onAuthStateChanged will handle showing the app
    } catch (error) {
      console.error('❌ Auth error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      let message = 'Authentication failed. Please try again.';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'This username is already taken. Try signing in instead.';
          break;
        case 'auth/invalid-email':
          message = 'Please enter a valid username.';
          break;
        case 'auth/weak-password':
          message = 'Password must be at least 6 characters.';
          break;
        case 'auth/user-not-found':
          message = 'No account found with this username. Click "Create one" to sign up.';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password. Please try again.';
          break;
        case 'auth/invalid-credential':
          message = 'Invalid username or password. Please try again.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many attempts. Please wait a few minutes and try again.';
          break;
        case 'auth/network-request-failed':
          message = 'Network error. Please check your internet connection.';
          break;
        default:
          message = `Error: ${error.message || 'Unknown error occurred'}`;
      }
      
      showAuthError(message);
      setAuthLoading(false);
    }
  });
}

// Initialize auth form when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuthForm);
} else {
  initAuthForm();
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
    
    const username = authEmail?.value?.trim();
    
    if (!username) {
      showAuthError('Please enter your username first');
      return;
    }
    
    if (!firebaseAuth) {
      showAuthError('Firebase not loaded. Please refresh the page.');
      return;
    }
    
    // Convert username to email format for Firebase
    const email = username.includes('@') ? username : `${username}@deepfocus.app`;
    
    try {
      await firebaseAuth.sendPasswordResetEmail(email);
      showResetSuccess();
      // Update success message for username context
      const resetSuccessEl = document.getElementById('resetSuccess');
      if (resetSuccessEl) {
        resetSuccessEl.textContent = '✅ Password reset link sent! Check your account email (username@deepfocus.app).';
      }
    } catch (error) {
      console.error('Password reset error:', error);
      let message = 'Failed to send reset email. Please try again.';
      
      switch (error.code) {
        case 'auth/invalid-email':
          message = 'Please enter a valid username.';
          break;
        case 'auth/user-not-found':
          message = 'No account found with this username.';
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

// Manual modal elements
const manualBtn = document.getElementById('manualBtn');
const manualModal = document.getElementById('manualModal');
const manualCloseBtn = document.getElementById('manualCloseBtn');
const manualCloseBtnBottom = document.getElementById('manualCloseBtnBottom');
const manualDemoBtn = document.getElementById('manualDemoBtn');

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
  
  // Demo stats with richer productivity metrics
  const demoStats = {
    todayMinutes: 47,
    weekMinutes: 138,
    streak: 4,
    lastDayKey: dayKey(),
    distractionCount: 5,
    distractionReasons: { 
      'Phone': 2, 
      'Boredom': 2, 
      'Hunger/Thirst': 1 
    },
    dailyHistory: [
      { date: getDateDaysAgo(1), minutes: 52, distractionCount: 3, distractionReasons: { 'Phone': 1, 'Boredom': 2 } },
      { date: getDateDaysAgo(2), minutes: 38, distractionCount: 1, distractionReasons: { 'Phone': 1 } },
      { date: getDateDaysAgo(3), minutes: 45, distractionCount: 2, distractionReasons: { 'Boredom': 1, 'Hunger/Thirst': 1 } },
      { date: getDateDaysAgo(4), minutes: 30, distractionCount: 0 },
      { date: getDateDaysAgo(5), minutes: 42, distractionCount: 1, distractionReasons: { 'Phone': 1 } },
      { date: getDateDaysAgo(6), minutes: 35, distractionCount: 2, distractionReasons: { 'Boredom': 2 } },
    ],
  };
  
  // Helper to get ISO date string for N days ago
  function getISODateDaysAgo(days) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString();
  }
  
  // Demo journal data for insights/patterns
  const demoJournal = {
    reflections: [
      {
        id: 'demo-r1',
        date: getISODateDaysAgo(1),
        blockName: '📚 Study Chapter 5 - Biology',
        minutes: 2,
        rating: 4,
        helpers: ['Quiet Space', 'Music'],
        note: 'Focused well today!'
      },
      {
        id: 'demo-r2',
        date: getISODateDaysAgo(2),
        blockName: '📝 Complete Math Homework',
        minutes: 2,
        rating: 5,
        helpers: ['Timer', 'No Phone'],
        note: 'Great session!'
      },
      {
        id: 'demo-r3',
        date: getISODateDaysAgo(3),
        blockName: '📖 Read Research Paper',
        minutes: 2,
        rating: 3,
        helpers: ['Music'],
        note: 'Got distracted a few times'
      },
      {
        id: 'demo-r4',
        date: getISODateDaysAgo(4),
        blockName: '🔬 Lab Report Draft',
        minutes: 2,
        rating: 4,
        helpers: ['Quiet Space', 'Timer'],
        note: 'Made good progress'
      },
      {
        id: 'demo-r5',
        date: getISODateDaysAgo(5),
        blockName: '📚 Study Chapter 5 - Biology',
        minutes: 2,
        rating: 5,
        helpers: ['No Phone', 'Music'],
        note: 'Super focused!'
      },
      {
        id: 'demo-r6',
        date: getISODateDaysAgo(6),
        blockName: '📝 Complete Math Homework',
        minutes: 2,
        rating: 4,
        helpers: ['Timer'],
        note: 'Good work today'
      },
    ],
    distractions: [
      {
        id: 'demo-d1',
        date: getISODateDaysAgo(1),
        reason: 'Phone',
        note: 'Checked messages',
        blockName: '📚 Study Chapter 5 - Biology'
      },
      {
        id: 'demo-d2',
        date: getISODateDaysAgo(1),
        reason: 'Boredom',
        note: 'Lost focus',
        blockName: '📚 Study Chapter 5 - Biology'
      },
      {
        id: 'demo-d3',
        date: getISODateDaysAgo(1),
        reason: 'Boredom',
        note: 'Mind wandered',
        blockName: '📚 Study Chapter 5 - Biology'
      },
      {
        id: 'demo-d4',
        date: getISODateDaysAgo(2),
        reason: 'Phone',
        note: 'Got notification',
        blockName: '📝 Complete Math Homework'
      },
      {
        id: 'demo-d5',
        date: getISODateDaysAgo(3),
        reason: 'Boredom',
        note: 'Hard to focus',
        blockName: '📖 Read Research Paper'
      },
      {
        id: 'demo-d6',
        date: getISODateDaysAgo(3),
        reason: 'Hunger/Thirst',
        note: 'Needed a snack',
        blockName: '📖 Read Research Paper'
      },
    ]
  };
  
  // Save demo data
  localStorage.setItem(LS.TASKS, JSON.stringify(demoTasks));
  localStorage.setItem(LS.BLOCKS, JSON.stringify(demoBlocks));
  localStorage.setItem(LS.STATS, JSON.stringify(demoStats));
  localStorage.setItem(LS.JOURNAL, JSON.stringify(demoJournal));
  localStorage.setItem(LS.GOAL, '60');
  localStorage.setItem(LS.ACTIVE, 'demo-b2');
  localStorage.setItem('focus_demo_mode', 'true');
  
  // Set up timer state (mid-session, short for demo)
  const demoTimerState = {
    running: false,
    remainingSec: 74, // 1:14 remaining
    totalSec: 120, // 2 min total
    activeBlockId: 'demo-b2',
  };
  localStorage.setItem(LS.TIMER, JSON.stringify(demoTimerState));
  
  // Set short durations for demo
  const demoSettings = {
    focusDuration: 2,
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

// Manual modal handlers
function openManual() {
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (manualModal && modalBackdrop) {
    modalBackdrop.classList.remove('hidden');
    manualModal.classList.remove('hidden');
  }
}

function closeManual() {
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (manualModal && modalBackdrop) {
    modalBackdrop.classList.add('hidden');
    manualModal.classList.add('hidden');
  }
}

if (manualBtn) {
  manualBtn.addEventListener('click', openManual);
}

if (manualCloseBtn) {
  manualCloseBtn.addEventListener('click', closeManual);
}

if (manualCloseBtnBottom) {
  manualCloseBtnBottom.addEventListener('click', closeManual);
}

if (manualDemoBtn) {
  manualDemoBtn.addEventListener('click', () => {
    closeManual();
    loadDemoData();
  });
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
// Initialize distraction modal elements after DOM loads
function initDistractionModal() {
  distractNote = document.getElementById('distractNote');
  const distractOtherInput = document.getElementById('distractOtherInput');
  
  // Get Other-specific buttons
  const distractOtherCancelBtn = document.getElementById('distractOtherCancelBtn');
  const distractOtherSubmitBtn = document.getElementById('distractOtherSubmitBtn');
  
  // Function to update Submit button state based on input
  const updateSubmitButtonState = () => {
    if (distractOtherSubmitBtn && distractNote) {
      const hasText = distractNote.value.trim().length > 0;
      distractOtherSubmitBtn.disabled = !hasText;
    }
  };
  
  // Function to submit Other distraction
  const submitOtherDistraction = () => {
    if (!distractNote) return;
    
    const note = distractNote.value.trim();
    if (!note) return; // Don't submit empty
    
    const distractModalEl = document.getElementById('distractModal');
    closeModal(distractModalEl);
    logDistractionWithNote("Other", note);
    
    // Reset for next time
    selectedDistractionReason = null;
    distractNote.value = '';
    if (distractOtherInput) distractOtherInput.classList.add('hidden');
    document.querySelectorAll("#distractModal .choice").forEach(b => b.classList.remove('selected'));
    updateSubmitButtonState();
  };
  
  // Function to cancel Other distraction
  const cancelOtherDistraction = () => {
    const distractModalEl = document.getElementById('distractModal');
    closeModal(distractModalEl);
    
    // Reset state
    selectedDistractionReason = null;
    if (distractNote) distractNote.value = '';
    if (distractOtherInput) distractOtherInput.classList.add('hidden');
    document.querySelectorAll("#distractModal .choice").forEach(b => b.classList.remove('selected'));
    updateSubmitButtonState();
  };
  
  // Set up distraction reason selection handlers (only once)
  const choiceButtons = document.querySelectorAll("#distractModal .choice");
  choiceButtons.forEach(btn => {
    if (!btn.dataset.listenerAdded) {
      btn.dataset.listenerAdded = 'true';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const reason = btn.getAttribute("data-reason") || "Other";
        
        // Remove selection from all buttons
        document.querySelectorAll("#distractModal .choice").forEach(b => b.classList.remove('selected'));
        // Add selection to clicked button
        btn.classList.add('selected');
        selectedDistractionReason = reason;
        
        // Show input only for "Other", hide for others
        if (reason === "Other") {
          if (distractOtherInput) distractOtherInput.classList.remove('hidden');
          if (distractNote) {
            distractNote.value = ''; // Clear previous input
            setTimeout(() => {
              distractNote.focus();
              updateSubmitButtonState();
            }, 50);
          }
        } else {
          // Auto-submit for non-Other options (fast flow)
          if (distractOtherInput) distractOtherInput.classList.add('hidden');
          
          // Close modal FIRST before logging
          const distractModalEl = document.getElementById('distractModal');
          if (distractModalEl) {
            closeModal(distractModalEl);
          }
          
          // Log distraction (this may return early if no active block, but modal is already closed)
          try {
            logDistractionWithNote(reason, '');
          } catch (err) {
            console.error('Error logging distraction:', err);
          }
          
          // Reset for next time
          selectedDistractionReason = null;
          if (distractNote) distractNote.value = '';
          updateSubmitButtonState();
        }
      });
    }
  });
  
  // Handle input changes to enable/disable Submit button
  if (distractNote && !distractNote.dataset.listenerAdded) {
    distractNote.dataset.listenerAdded = 'true';
    distractNote.addEventListener('input', () => {
      updateSubmitButtonState();
    });
    
    // Handle Enter key in "Other" input to submit
    distractNote.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && selectedDistractionReason === "Other") {
        e.preventDefault();
        if (!distractOtherSubmitBtn?.disabled) {
          submitOtherDistraction();
        }
      }
    });
  }
  
  // Set up Other Cancel button handler
  if (distractOtherCancelBtn && !distractOtherCancelBtn.dataset.listenerAdded) {
    distractOtherCancelBtn.dataset.listenerAdded = 'true';
    distractOtherCancelBtn.addEventListener('click', cancelOtherDistraction);
  }
  
  // Set up Other Submit button handler
  if (distractOtherSubmitBtn && !distractOtherSubmitBtn.dataset.listenerAdded) {
    distractOtherSubmitBtn.dataset.listenerAdded = 'true';
    distractOtherSubmitBtn.addEventListener('click', submitOtherDistraction);
  }
  
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize distraction modal elements
  initDistractionModal();
  
  // Initialize Insights panel layout (force re-render to fix layout issues)
  if (typeof initInsightsPanel === 'function') {
    initInsightsPanel();
  }
  
  // Initialize auth form (ensure it's attached)
  initAuthForm();
  
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
let completionAudio = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume audio context if suspended (required for autoplay policies)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  return audioContext;
}

// Pre-create audio element for better reliability when tab is inactive
function initCompletionAudio() {
  if (completionAudio) return completionAudio;
  
  // Create audio element that can play even when tab is inactive
  completionAudio = new Audio();
  completionAudio.preload = 'auto';
  
  // Generate a pleasant completion sound using Web Audio API
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Create a pleasant chime sound
    oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  } catch (e) {
    console.log("Audio creation error:", e);
  }
  
  return completionAudio;
}

function playCompletionSound() {
  if (!soundEnabled) return;
  
  try {
    const ctx = getAudioContext();
    
    // Resume audio context if suspended (important for background tabs)
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        playSoundNow(ctx);
      }).catch(e => {
        console.log("Could not resume audio context:", e);
      });
    } else {
      playSoundNow(ctx);
    }
  } catch (e) {
    console.log("Audio not available:", e);
  }
}

function playSoundNow(ctx) {
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
}

// Browser Notifications
function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("✅ Notification permission granted");
      }
    });
  }
  
  // Initialize audio on page load to ensure it works when tab is inactive
  if (typeof window !== 'undefined') {
    // User interaction is required to initialize audio context
    // We'll initialize it when user first starts a timer
  }
}

function showBrowserNotification(title, body) {
  if (!("Notification" in window)) return;
  
  // Request permission if not granted
  if (Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        createNotification(title, body);
      }
    });
    return;
  }
  
  if (Notification.permission !== "granted") return;
  
  createNotification(title, body);
}

function createNotification(title, body) {
  try {
    const notification = new Notification(title, {
      body: body,
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎯</text></svg>",
      badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✅</text></svg>",
      tag: "focus-complete",
      requireInteraction: false,
      silent: false // Ensure notification makes sound
    });
    
    // Play sound even when tab is inactive
    playCompletionSound();
    
    // Auto-close after 8 seconds
    setTimeout(() => {
      notification.close();
    }, 8000);
    
    // Focus window when notification is clicked
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch (e) {
    console.log("Notification error:", e);
    // Fallback: still try to play sound
    playCompletionSound();
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
  // Show browser notification first (this will also trigger sound)
  // This works even when tab is inactive
  showBrowserNotification(
    "🎉 Focus Block Complete!",
    `Great job! You focused on "${blockName}" for ${minutes} minutes.`
  );
  
  // Ensure sound plays even if notification fails or tab is inactive
  // Play sound with a slight delay to ensure it works when tab is inactive
  setTimeout(() => {
    playCompletionSound();
  }, 100);
  
  // Visual celebrations (only visible when tab is active)
  launchConfetti();
  showCompletionBanner(blockName, minutes);
  celebrateTimerCard();
}

// Sound Toggle (now in Settings)
function initSoundToggle() {
  const toggleBtn = document.getElementById("settingSoundToggle");
  if (!toggleBtn) return;
  
  // Set initial state
  toggleBtn.checked = soundEnabled;
  
  toggleBtn.addEventListener("change", () => {
    soundEnabled = toggleBtn.checked;
    localStorage.setItem(SOUND_ENABLED_KEY, soundEnabled);
    
    // Request notification permission when enabling sound
    if (soundEnabled) {
      requestNotificationPermission();
      // Play a test sound
      playCompletionSound();
    }
  });
}

function updateSoundToggleUI() {
  const toggleBtn = document.getElementById("settingSoundToggle");
  if (!toggleBtn) return;
  toggleBtn.checked = soundEnabled;
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
  // Shortcuts button removed - shortcuts now in Settings
  // Shortcuts modal can still be opened via ? key for convenience
  
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
  const soundToggleInput = document.getElementById("settingSoundToggle");

  if (soundToggleInput) soundToggleInput.checked = soundEnabled;
  
  openModal(settingsModal);
}

function saveSettingsFromModal() {
  const settingsModal = document.getElementById("settingsModal");
  
  const soundToggleInput = document.getElementById("settingSoundToggle");
  
  // Save sound setting
  if (soundToggleInput) {
    soundEnabled = soundToggleInput.checked;
    localStorage.setItem(SOUND_ENABLED_KEY, soundEnabled);
  }
  
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

// Badge definitions - must be declared before checkBadges() uses them (called from completeBlock around line 1725)
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
  { id: 'multi_tasker', icon: '📚', name: 'Multi-tasker', desc: 'Complete sessions for 5 different tasks' },
  { id: 'focus_master', icon: '👑', name: 'Focus Master', desc: 'Complete 25 sessions total' },
];

// Journal data
let journal = {
  reflections: [], // { id, date, blockName, minutes, rating, helpers: [], note }
  distractions: [], // { id, date, reason, note, blockName }
};

// Default settings
const DEFAULT_SETTINGS = {
  focusDuration: 25,      // minutes (default for new tasks, not in settings UI)
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
const distractionToast = $("distractionToast");
const genericToast = $("genericToast");
const genericToastIcon = $("genericToastIcon");
const genericToastTitle = $("genericToastTitle");
const genericToastMessage = $("genericToastMessage");

// Toast timeout tracking (for replacing previous toast)
let distractionToastTimeout = null;
let genericToastTimeout = null;

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

// feedbackBtn removed from top navigation - now accessible via Insights panel
const feedbackModal = $("feedbackModal");
const feedbackText = $("feedbackText");
const feedbackCloseBtn = $("feedbackCloseBtn");

const resetBtn = $("resetBtn");
const resetModal = $("resetModal");
const resetCancelBtn = $("resetCancelBtn");
const resetConfirmBtn = $("resetConfirmBtn");

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
  // Note: isBreak property does NOT exist - breaks are completely removed
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
  // CRITICAL: One-time cleanup of any old break state in localStorage
  const timerState = loadJSON(LS.TIMER, null);
  if (timerState && (timerState.isBreak === true || timerState.isBreak === "true" || timerState.isBreak === 1)) {
    console.warn('🧹 CLEANUP: Removing old break state from localStorage');
    localStorage.removeItem(LS.TIMER);
    localStorage.removeItem(LS.ACTIVE);
  }
  
  blocks = loadJSON(LS.BLOCKS, []);
  tasks = loadJSON(LS.TASKS, []);
  
  // Ensure all tasks have orderIndex (migration for existing tasks)
  let maxOrderIndex = -1;
  tasks.forEach((t, index) => {
    if (t.orderIndex === undefined || t.orderIndex === null) {
      // Assign orderIndex based on creation order (oldest first)
      t.orderIndex = index;
    }
    maxOrderIndex = Math.max(maxOrderIndex, t.orderIndex);
  });
  // Store maxOrderIndex globally for new task creation
  window._maxTaskOrderIndex = maxOrderIndex;
  
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
    // CRITICAL: Breaks do NOT exist. If old break state exists, clear it completely.
    // Check for any truthy isBreak value (true, "true", 1, or undefined/null which might be old break state)
    if (t.isBreak === true || t.isBreak === "true" || t.isBreak === 1 || (t.isBreak !== false && t.isBreak !== undefined)) {
      // Old break state detected - clear timer completely and remove from localStorage
      console.error('🚨 BREAK STATE DETECTED - Clearing it immediately (breaks no longer exist)');
      console.error('🚨 Timer state:', JSON.stringify(t, null, 2));
      timer.remainingSec = 0;
      timer.totalSec = 0;
      timer.running = false;
      timer.startEpoch = null;
      activeBlockId = null;
      localStorage.removeItem(LS.ACTIVE);
      localStorage.removeItem(LS.TIMER);
      // Save clean state immediately
      persistAll();
      renderAll();
      return; // Don't process timer state if it was a break
    }
    
    if (t.activeBlockId) {
      activeBlockId = t.activeBlockId;
      localStorage.setItem(LS.ACTIVE, activeBlockId);
    }
    timer.remainingSec = t.remainingSec;
    timer.totalSec = t.totalSec || t.remainingSec;
    timer.running = !!t.running;
    timer.startEpoch = t.startEpoch || null;

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
        completeBlock();
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
  // CRITICAL: Always save timer state with isBreak: false (breaks do NOT exist)
  const timerState = {
    running: timer.running,
    startEpoch: timer.running ? timer.startEpoch : null,
    remainingSec: timer.remainingSec,
    totalSec: timer.totalSec,
    activeBlockId: activeBlockId,
    isBreak: false  // Explicitly false - breaks do NOT exist
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
    const blocksRef = userRef.collection('blocks');
    
    // Sync blocks as individual documents in subcollection
    // This enables proper BigQuery export
    const blockPromises = blocks.map(block => {
      const blockData = {
        userId: userId,
        name: block.name,
        minutes: block.minutes,
        completed: block.completed || false,
        sourceTaskId: block.sourceTaskId || null,
        subject: block.subject || null,
        createdAt: block.createdAt ? firebase.firestore.Timestamp.fromMillis(block.createdAt) : firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      return blocksRef.doc(block.id).set(blockData, { merge: true });
    });
    
    await Promise.all(blockPromises);
    
    // Sync distractions as individual documents (if any exist locally)
    if (journal.distractions && journal.distractions.length > 0) {
      const distractionsRef = userRef.collection('distractions');
      const distractionPromises = journal.distractions.map(distraction => {
        const distractionData = {
          userId: userId,
          blockId: distraction.blockId || null,
          blockName: distraction.blockName || null,
          reason: distraction.reason,
          note: distraction.note || null,
          source: distraction.source || 'preset',
          createdAt: distraction.date ? firebase.firestore.Timestamp.fromDate(new Date(distraction.date)) : firebase.firestore.FieldValue.serverTimestamp()
        };
        return distractionsRef.doc(distraction.id).set(distractionData, { merge: true });
      });
      await Promise.all(distractionPromises);
    }
    
    // Sync reflections as individual documents (if any exist locally)
    if (journal.reflections && journal.reflections.length > 0) {
      const reflectionsRef = userRef.collection('reflections');
      const reflectionPromises = journal.reflections.map(reflection => {
        const reflectionData = {
          userId: userId,
          blockId: reflection.blockId || null,
          blockName: reflection.blockName || null,
          date: reflection.date,
          minutes: reflection.minutes || null,
          sessionStartTime: reflection.sessionStartTime || null,
          rating: reflection.rating || null,
          helpers: reflection.helpers || [],
          createdAt: reflection.date ? firebase.firestore.Timestamp.fromDate(new Date(reflection.date)) : firebase.firestore.FieldValue.serverTimestamp()
        };
        return reflectionsRef.doc(reflection.id).set(reflectionData, { merge: true });
      });
      await Promise.all(reflectionPromises);
    }
    
    // Sync other user data to user document (NO arrays - only non-array data)
    // Check if document exists first
    const userDoc = await userRef.get();
    const documentExists = userDoc.exists;
    
    // Prepare the data we want to keep (explicitly exclude arrays)
    const userData = {
      tasks: tasks,
      stats: stats, // Contains complete dailyHistory array with all historical data
      badges: earnedBadges,
      goal: parseInt(localStorage.getItem(LS.GOAL) || "60", 10),
      lastSync: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: new Date().toISOString()
    };
    
    if (documentExists) {
      // Document exists: use update to delete arrays and set other fields
      // Combine deletion and update in a single operation
      await userRef.update({
        ...userData,
        blocks: firebase.firestore.FieldValue.delete(),
        research_sessions: firebase.firestore.FieldValue.delete(),
        journal: firebase.firestore.FieldValue.delete()
      });
      console.log('✅ Updated user document and deleted old array fields');
    } else {
      // Document doesn't exist: just create it with the data we want (no arrays to delete)
      await userRef.set(userData);
      console.log('✅ Created user document (no arrays to delete)');
    }
    
    console.log('✅ Data synced to Firestore (all arrays moved to subcollections)');
  } catch (error) {
    console.error('❌ Firestore sync error:', error);
  }
}

// Sync a single block to Firestore (called when block is created/updated)
async function syncBlockToFirestore(block) {
  if (!firestore || !firebaseAuth?.currentUser || !block) return;
  
  const userId = firebaseAuth.currentUser.uid;
  if (!userId) return;
  
  try {
    const blockRef = firestore.collection('users').doc(userId).collection('blocks').doc(block.id);
    const blockData = {
      userId: userId,
      name: block.name,
      minutes: block.minutes,
      completed: block.completed || false,
      sourceTaskId: block.sourceTaskId || null,
      subject: block.subject || null,
      createdAt: block.createdAt ? firebase.firestore.Timestamp.fromMillis(block.createdAt) : firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    await blockRef.set(blockData, { merge: true });
  } catch (error) {
    console.error('❌ Error syncing block to Firestore:', error);
  }
}

// Delete a block from Firestore (called when block is deleted)
async function deleteBlockFromFirestore(blockId) {
  if (!firestore || !firebaseAuth?.currentUser || !blockId) return;
  
  const userId = firebaseAuth.currentUser.uid;
  if (!userId) return;
  
  try {
    const blockRef = firestore.collection('users').doc(userId).collection('blocks').doc(blockId);
    await blockRef.delete();
  } catch (error) {
    console.error('❌ Error deleting block from Firestore:', error);
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
    const userRef = firestore.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      console.log('No Firestore data found, using localStorage');
      return false;
    }
    
    const data = userDoc.data();
    
    // Load blocks from subcollection (new structure)
    try {
      const blocksSnapshot = await userRef.collection('blocks').get();
      if (!blocksSnapshot.empty) {
        blocks = blocksSnapshot.docs.map(doc => {
          const blockData = doc.data();
          return {
            id: doc.id,
            name: blockData.name,
            minutes: blockData.minutes,
            completed: blockData.completed || false,
            sourceTaskId: blockData.sourceTaskId || null,
            subject: blockData.subject || null,
            createdAt: blockData.createdAt?.toMillis ? blockData.createdAt.toMillis() : Date.now()
          };
        });
      } else {
        // Fallback: try loading from old array structure (backward compatibility)
        if (data.blocks && Array.isArray(data.blocks)) {
          blocks = data.blocks;
          console.log('⚠️ Loaded blocks from old array structure, migrating to subcollection...');
          // Migrate old blocks to subcollection
          await syncToFirestore();
        }
      }
    } catch (blocksError) {
      console.warn('⚠️ Error loading blocks from subcollection, trying fallback:', blocksError);
      // Fallback to old structure
      if (data.blocks && Array.isArray(data.blocks)) {
        blocks = data.blocks;
      }
    }
    
    // Load distractions from subcollection
    try {
      const distractionsSnapshot = await userRef.collection('distractions').get();
      if (!distractionsSnapshot.empty) {
        journal.distractions = distractionsSnapshot.docs.map(doc => {
          const distData = doc.data();
          return {
            id: doc.id,
            date: distData.createdAt?.toDate ? distData.createdAt.toDate().toISOString() : new Date().toISOString(),
            reason: distData.reason,
            source: distData.source || 'preset',
            blockName: distData.blockName || null,
            blockId: distData.blockId || null,
            note: distData.note || null
          };
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
      } else {
        // Fallback: try loading from old journal.distractions array
        if (data.journal?.distractions && Array.isArray(data.journal.distractions)) {
          journal.distractions = data.journal.distractions;
          console.log('⚠️ Loaded distractions from old array structure, migrating to subcollection...');
          await syncToFirestore();
        } else {
          journal.distractions = [];
        }
      }
    } catch (distractionsError) {
      console.warn('⚠️ Error loading distractions from subcollection:', distractionsError);
      // Fallback to old structure
      if (data.journal?.distractions && Array.isArray(data.journal.distractions)) {
        journal.distractions = data.journal.distractions;
      } else {
        journal.distractions = [];
      }
    }
    
    // Load reflections from subcollection
    try {
      const reflectionsSnapshot = await userRef.collection('reflections').get();
      if (!reflectionsSnapshot.empty) {
        journal.reflections = reflectionsSnapshot.docs.map(doc => {
          const reflData = doc.data();
          return {
            id: doc.id,
            date: reflData.date || (reflData.createdAt?.toDate ? reflData.createdAt.toDate().toISOString() : new Date().toISOString()),
            blockName: reflData.blockName || null,
            blockId: reflData.blockId || null,
            minutes: reflData.minutes || null,
            sessionStartTime: reflData.sessionStartTime || null,
            rating: reflData.rating || null,
            helpers: reflData.helpers || []
          };
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Most recent first
      } else {
        // Fallback: try loading from old journal.reflections array
        if (data.journal?.reflections && Array.isArray(data.journal.reflections)) {
          journal.reflections = data.journal.reflections;
          console.log('⚠️ Loaded reflections from old array structure, migrating to subcollection...');
          await syncToFirestore();
        } else {
          journal.reflections = [];
        }
      }
    } catch (reflectionsError) {
      console.warn('⚠️ Error loading reflections from subcollection:', reflectionsError);
      // Fallback to old structure
      if (data.journal?.reflections && Array.isArray(data.journal.reflections)) {
        journal.reflections = data.journal.reflections;
      } else {
        journal.reflections = [];
      }
    }
    
    // Load other data from user document
    if (data.tasks) tasks = data.tasks;
    if (data.stats) {
      // Preserve all historical data from Firestore (including complete dailyHistory)
      stats = Object.assign(stats, data.stats);
      // Ensure dailyHistory is an array (for backward compatibility)
      if (!Array.isArray(stats.dailyHistory)) {
        stats.dailyHistory = [];
      }
    }
    if (data.badges) earnedBadges = Object.assign(earnedBadges, data.badges);
    if (data.goal) {
      localStorage.setItem(LS.GOAL, String(data.goal));
      goalTarget.textContent = String(data.goal);
    }
    
    // Ensure journal object exists
    if (!journal.distractions) journal.distractions = [];
    if (!journal.reflections) journal.reflections = [];
    
    // Save to localStorage for offline access (preserves all historical data)
    saveJSON(LS.BLOCKS, blocks);
    saveJSON(LS.TASKS, tasks);
    saveJSON(LS.STATS, stats);
    saveJSON(LS.JOURNAL, journal);
    saveJSON(LS.BADGES, earnedBadges);
    
    // Update badge count UI
    updateBadgeCount();
    
    // Cleanup: Always try to delete old array fields if they still exist
    // (This ensures cleanup even if migration didn't happen or arrays were re-added)
    if (data.blocks || data.journal || data.research_sessions) {
      console.log('🧹 Cleaning up old array fields from user document...');
      try {
        await userRef.update({
          blocks: firebase.firestore.FieldValue.delete(),
          research_sessions: firebase.firestore.FieldValue.delete(),
          journal: firebase.firestore.FieldValue.delete()
        }).catch(() => {
          // Ignore errors if fields don't exist
        });
        console.log('✅ Old array fields cleaned up');
      } catch (cleanupError) {
        console.warn('⚠️ Error during cleanup (non-critical):', cleanupError);
      }
    }
    
    console.log('✅ Data loaded from Firestore (all subcollections)');
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
    const blockId = researchData.block_id;
    if (!blockId) {
      console.warn('⚠️ Cannot save research data: No block_id provided');
      return;
    }
    
    // Get subject from completed block if available
    const completedBlock = blocks.find(b => b.completed && b.id === blockId);
    const subject = completedBlock?.subject || null;
    
    // Prepare research session data with timestamp
    const sessionId = uuid();
    const now = new Date();
    const researchSession = {
      ...researchData,
      session_id: sessionId,
      user_id: userId,
      subject: subject, // Add subject to research data
      created_at: firebase.firestore.Timestamp.fromDate(now),
      created_at_iso: now.toISOString()
    };
    
    // Update the block document with research session data
    // Store as individual document in blocks subcollection for BigQuery export
    const blockRef = firestore.collection('users').doc(userId).collection('blocks').doc(blockId);
    await blockRef.set({
      ...researchSession,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    
    console.log('✅ Research session data saved to block document:', researchSession);
    
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
function addBlock(name, minutes, sourceTaskId = null, autoSelect = false, subject = null) {
  const mins = clamp(parseInt(minutes, 10) || 15, 1, 240);
  const id = uuid();
  const newBlock = {
    id,
    name: name || "Focus Block",
    minutes: mins,
    sourceTaskId, // link to task when created from task
    completed: false,
    createdAt: Date.now(),
    subject: subject || null // Track subject for analytics
  };
  blocks.unshift(newBlock);
  
  // Auto-select the new block if requested
  if (autoSelect) {
    activeBlockId = id;
    localStorage.setItem(LS.ACTIVE, activeBlockId);
    timer.totalSec = mins * 60;
    timer.remainingSec = timer.totalSec;
  }
  
  // Sync new block to Firestore
  syncBlockToFirestore(newBlock);
  
  persistAll();
  renderAll();
  
  return id; // Return the block ID
}

function upsertTask(name, minutes, subject = null, deadline = null) {
  const mins = clamp(parseInt(minutes, 10) || 15, 1, 240);
  const nm = (name || "").trim();
  if (!nm) return;

  if (editingTaskId) {
    const t = tasks.find(x => x.id === editingTaskId);
    if (t) {
      t.name = nm;
      t.minutes = mins;
      if (subject !== null) t.subject = subject || null;
      if (deadline !== null) t.deadline = deadline || null;
    }
    // update linked block minutes/name/subject too
    const linkedBlock = blocks.find(b => b.sourceTaskId === editingTaskId);
    if (linkedBlock) {
      linkedBlock.name = nm;
      if (subject !== null) linkedBlock.subject = subject || null;
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
    // Calculate orderIndex: max(existing) + 1
    const maxOrderIndex = tasks.length > 0 
      ? Math.max(...tasks.map(t => t.orderIndex !== undefined ? t.orderIndex : -1))
      : -1;
    const orderIndex = maxOrderIndex + 1;
    
    tasks.push({ 
      id, 
      name: nm, 
      minutes: mins, 
      done: false, 
      createdAt: Date.now(),
      subject: subject || null,
      deadline: deadline || null,
      orderIndex: orderIndex
    });

    // auto-create a focus block from task
    // Only auto-select if there's no active task currently (first task scenario)
    // This ensures the first task becomes active, but subsequent tasks don't change the active task
    const shouldAutoSelect = !activeBlockId && !timer.running;
    addBlock(nm, mins, id, shouldAutoSelect, subject);
  }
  persistAll();
  renderAll();
}

function deleteTask(taskId) {
  // If deleting active task's block, stop timer first
  const linkedBlock = blocks.find(b => b.sourceTaskId === taskId);
  if (linkedBlock && linkedBlock.id === activeBlockId) {
    stopTimer(true);
    activeBlockId = null;
    localStorage.removeItem(LS.ACTIVE);
  }
  
  tasks = tasks.filter(t => t.id !== taskId);
  // Remove linked blocks when task is deleted
  blocks = blocks.filter(b => b.sourceTaskId !== taskId);
  
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

  // Ensure no break state can exist (breaks are completely removed)
  timer.running = false;
  timer.startEpoch = null;
  
  // Double-check localStorage for break state
  const timerState = loadJSON(LS.TIMER, null);
  if (timerState && timerState.isBreak) {
    console.warn('⚠️ Clearing break state from localStorage in selectBlock');
    localStorage.removeItem(LS.TIMER);
  }

  activeBlockId = blockId;
  localStorage.setItem(LS.ACTIVE, activeBlockId);

  // reset timer to block duration only if timer not running
  if (!timer.running) {
    timer.totalSec = b.minutes * 60;
    timer.remainingSec = timer.totalSec;
  }
  
  // Ensure isBreak is never set
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
  
  // Delete block from Firestore
  deleteBlockFromFirestore(blockId);
  
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
  
  // Sync updated block to Firestore
  syncBlockToFirestore(b);
  
  persistAll();
  renderAll();
}

// Timer
function startTimer() {
  // CRITICAL: Breaks do NOT exist. Only focus timers can run.
  // Handle focus timer (requires active block)
  const b = getActiveBlock();
  if (!b) return;

  // Track if this is a transition from idle → running (not pause → resume)
  // Fresh start: timer was not running AND remainingSec equals totalSec AND startEpoch is null
  // Resume: timer was not running BUT startEpoch was set (paused state)
  // Note: When paused, startEpoch is set to null, so we check if timer was truly idle
  const wasIdle = !timer.running && timer.remainingSec === timer.totalSec && !timer.startEpoch;

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
  
  // Initialize audio context on first timer start (requires user interaction)
  if (!audioContext) {
    getAudioContext();
  }
  
  // Request notification permission on first timer start (requires user interaction)
  requestNotificationPermission();
  
  // Show task start toast when transitioning from idle → running (not pause → resume)
  if (wasIdle) {
    showTaskStartToast();
  }

  clearInterval(timer.tickHandle);
  
  // Initialize progress ring immediately (before first tick)
  if (timerRingProgress && timer.totalSec > 0) {
    // At start: elapsed = 0, so offset = 0 (full circle visible)
    timerRingProgress.style.strokeDashoffset = 0;
    timerRingProgress.style.opacity = '1';
  }
  
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
  if (!timer.running) {
    // Clear tab title when timer is not running
    updateTabTitle(null);
    return;
  }
  const elapsed = Math.floor((Date.now() - timer.startEpoch) / 1000);
  if (elapsed <= 0) return;

  timer.remainingSec = clamp(timer.remainingSec - elapsed, 0, timer.remainingSec);
  timer.startEpoch = Date.now();

  if (timer.remainingSec <= 0) {
    // Timer expired - complete the block (NO BREAKS - breaks do not exist)
    completeBlock();
    return;
  }
  
  // Update tab title with timer countdown
  updateTabTitle(timer.remainingSec);
  
  // Update timer display and progress ring
  if (timerDisplay) {
    timerDisplay.textContent = formatTime(timer.remainingSec);
  }
  
  // Update progress ring during tick (normalized to total session duration)
  if (timerRingProgress && timer.totalSec > 0) {
    const remainingPercent = Math.min(timer.remainingSec / timer.totalSec, 1.0);
    const circumference = 565.48;
    const offset = circumference - (remainingPercent * circumference);
    timerRingProgress.style.strokeDashoffset = offset;
    timerRingProgress.style.stroke = ""; // Default color for focus
  }
  
  persistAll();
}

// Update browser tab title with timer countdown
function updateTabTitle(remainingSec) {
  const baseTitle = "DeepFocus";
  if (remainingSec === null || remainingSec === undefined) {
    document.title = baseTitle;
    return;
  }
  
  const timeStr = formatTime(remainingSec);
  const b = getActiveBlock();
  const taskName = b ? b.name.substring(0, 20) : "";
  document.title = `[${timeStr}] ${taskName ? taskName + ' - ' : ''}${baseTitle}`;
}

function pauseTimer() {
  // Only pause if timer is currently running
  if (!timer.running) {
    updateTabTitle(null);
    return;
  }
  
  // Stop the timer
  timer.running = false;
  
  // Clear the tick interval
  if (timer.tickHandle) {
    clearInterval(timer.tickHandle);
    timer.tickHandle = null;
  }
  
  // Reset start epoch (timer is paused)
  timer.startEpoch = null;
  
  // Force button state updates
  if (startBtn) startBtn.disabled = false;
  if (pauseBtn) pauseBtn.disabled = true;
  
  // Update UI and persist state
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
  // CRITICAL: Breaks do NOT exist. Skip must go directly to next task or idle.
  console.log('🔄 skipBlock() called - NO BREAKS');
  
  pauseTimer();
  const b = getActiveBlock();
  if (!b) {
    // No active block, just clear selection and go idle
    console.log('⚠️ No active block - going to idle');
    activeBlockId = null;
    localStorage.removeItem(LS.ACTIVE);
    timer.remainingSec = 0;
    timer.totalSec = 0;
    timer.running = false;
    persistAll();
    renderAll();
    return;
  }
  
  console.log('⏭️ Skipping block:', b.name);
  
  // Calculate elapsed focus time (partial work done)
  const elapsedSec = timer.totalSec > 0 ? timer.totalSec - timer.remainingSec : 0;
  
  // Log partial time if any work was done (at least 1 second)
  if (elapsedSec > 0) {
    const elapsedMins = Math.max(1, Math.round(elapsedSec / 60));
    // update streak baseline FIRST (handles day rollover before adding minutes)
    ensureDayRoll();
    
    // Credit the partial focused minutes
    stats.todayMinutes = (stats.todayMinutes || 0) + elapsedMins;
    
    // Log analytics event for partial completion
    logAnalyticsEvent('session_skip', {
      block_name: b.name,
      duration_minutes: elapsedMins,
      planned_minutes: b.minutes
    });
  }
  
  // Sync skipped block to Firestore before removing (mark as skipped)
  b.completed = false;
  b.skipped = true;
  syncBlockToFirestore(b);
  
  // Remove block from blocks array (cleanup)
  blocks = blocks.filter(bl => bl.id !== b.id);
  
  // Delete block from Firestore after syncing skipped state
  deleteBlockFromFirestore(b.id);
  
  // If block was linked to a task, remove the task as well
  if (b.sourceTaskId) {
    tasks = tasks.filter(t => t.id !== b.sourceTaskId);
  }
  
  // Clear active selection and reset timer completely (NO BREAK STATE)
  activeBlockId = null;
  localStorage.removeItem(LS.ACTIVE);
  timer.remainingSec = 0;
  timer.totalSec = 0;
  timer.running = false;
  timer.startEpoch = null;
  
  // Ensure no break state exists in localStorage
  const timerState = loadJSON(LS.TIMER, null);
  if (timerState && timerState.isBreak) {
    console.warn('⚠️ Clearing old break state from localStorage');
    localStorage.removeItem(LS.TIMER);
  }
  
  persistAll();
  renderAll();
  
  console.log('➡️ Moving to next task (NO BREAKS)');
  // Move directly to next task (or idle if no tasks remain)
  // NO BREAKS - skip always transitions: Task → Next Task OR Task → Idle
  moveToNextTask();
}

// Helper function to move to next task
function moveToNextTask() {
  moveToNextTaskOnly();
}

// Helper function to move to next task only (NO BREAKS - breaks do not exist)
function moveToNextTaskOnly() {
  console.log('🔄 moveToNextTaskOnly() called - NO BREAKS');
  
  // Ensure timer is completely stopped and cleared (no break state possible)
  timer.running = false;
  timer.startEpoch = null;
  timer.remainingSec = 0;
  timer.totalSec = 0;
  
  // Double-check: ensure no break state exists
  const timerState = loadJSON(LS.TIMER, null);
  if (timerState && timerState.isBreak) {
    console.warn('⚠️ Clearing break state from localStorage in moveToNextTaskOnly');
    localStorage.removeItem(LS.TIMER);
  }
  
  // Find next task in queue
  if (blocks.length === 0) {
    // No more tasks - go to idle state
    console.log('✅ No more tasks - going to idle state');
    activeBlockId = null;
    localStorage.removeItem(LS.ACTIVE);
    persistAll();
    renderAll();
    return;
  }
  
  // Sort blocks by orderIndex to find next task
  const sortedBlocks = [...blocks].sort((a, b) => {
    const taskA = a.sourceTaskId ? tasks.find(t => t.id === a.sourceTaskId) : null;
    const taskB = b.sourceTaskId ? tasks.find(t => t.id === b.sourceTaskId) : null;
    const orderA = taskA?.orderIndex !== undefined ? taskA.orderIndex : Infinity;
    const orderB = taskB?.orderIndex !== undefined ? taskB.orderIndex : Infinity;
    return orderA - orderB;
  });
  
  // Select the first task in the sorted queue (user must manually start timer)
  if (sortedBlocks.length > 0) {
    const nextBlock = sortedBlocks[0];
    console.log('➡️ Selecting next task:', nextBlock.name, '- NO BREAKS');
    selectBlock(nextBlock.id);
  }
}

// Store last completed block for reflection
let lastCompletedBlock = null;

function completeBlock() {
  // CRITICAL: Breaks do NOT exist. Completion goes directly to reflection, then idle/next task.
  
  pauseTimer();
  const b = getActiveBlock();
  if (!b) return;
  
  // Ensure no break state can exist
  timer.running = false;
  timer.startEpoch = null;

  b.completed = true;

  // update streak baseline FIRST (handles day rollover before adding minutes)
  ensureDayRoll();

  // credit focused minutes = elapsed time (totalSec - remainingSec, or full duration if timer hit 0)
  // When timer hits 0, remainingSec is 0, so elapsed = totalSec
  const elapsedSec = timer.totalSec - timer.remainingSec;
  const mins = Math.max(1, Math.round(elapsedSec / 60));
  stats.todayMinutes = (stats.todayMinutes || 0) + mins;

  // Note: sessionCount is no longer used for breaks, but kept for potential future use
  // timer.sessionCount = (timer.sessionCount || 0) + 1;

  // Store for reflection modal (with research data)
  const sessionDistractions = stats.distractionCount - (sessionStartDistractions || 0);
  lastCompletedBlock = { 
    name: b.name, 
    minutes: mins,
    plannedMinutes: b.minutes,
    actualMinutes: mins,
    distractionCount: sessionDistractions,
    sessionStartTime: sessionStartTime || new Date().toISOString(),
    date: new Date().toISOString(),
    subject: b.subject || null,
    block_id: b.id
  };

  // Log session completion event (before removing block from array)
  const completedCountBefore = blocks.filter(bl => bl.completed).length;
  logAnalyticsEvent('session_complete', {
    block_name: b.name,
    duration_minutes: mins,
    streak: stats.streak || 0,
    total_sessions: completedCountBefore
  });

  // Update tab title to show completion
  updateTabTitle(null);
  
  // 🎉 Trigger celebration (sound, notification, confetti, banner)
  triggerCompletionCelebration(b.name, mins);

  // Sync completed block to Firestore before removing
  syncBlockToFirestore(b);
  
  // Remove block from blocks array (cleanup after completion)
  blocks = blocks.filter(bl => bl.id !== b.id);
  
  // If block was linked to a task, remove the task as well
  if (b.sourceTaskId) {
    tasks = tasks.filter(t => t.id !== b.sourceTaskId);
  }

  // reset timer for next time (NO BREAKS - breaks do not exist)
  timer.remainingSec = 0;
  timer.totalSec = 0;
  timer.running = false;
  timer.startEpoch = null;

  // remove active selection
  activeBlockId = null;
  localStorage.removeItem(LS.ACTIVE);

  persistAll();
  renderAll();
  
  // Note: After reflection modal closes, user manually selects next task
  // NO automatic break or task transition - user has full control

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

// Subject labels mapping
const SUBJECT_LABELS = {
  math: "📐 Math",
  science: "🔬 Science",
  english: "📚 English",
  history: "📜 History",
  computer: "💻 CS",
  language: "🗣️ Language",
  art: "🎨 Arts",
  music: "🎵 Music",
  physical: "🏃 PE",
  other: "📝 Other"
};

function renderBlocks() {
  blockListEl.innerHTML = "";
  const addTaskHelper = document.getElementById("addTaskHelper");
  
  // Show/hide helper text based on whether tasks/blocks exist
  if (addTaskHelper) {
    if (tasks.length === 0 && blocks.length === 0) {
      addTaskHelper.classList.remove("hidden");
    } else {
      addTaskHelper.classList.add("hidden");
    }
  }
  
  if (!blocks.length) {
    noBlocksText.classList.remove("hidden");
    return;
  }
  noBlocksText.classList.add("hidden");

  // Sort blocks strictly by linked task's orderIndex (no special treatment for active)
  const sortedBlocks = [...blocks].sort((a, b) => {
    // Get linked tasks
    const taskA = a.sourceTaskId ? tasks.find(t => t.id === a.sourceTaskId) : null;
    const taskB = b.sourceTaskId ? tasks.find(t => t.id === b.sourceTaskId) : null;
    
    // Get orderIndex (default to Infinity if no task or no orderIndex)
    const orderA = taskA?.orderIndex !== undefined ? taskA.orderIndex : Infinity;
    const orderB = taskB?.orderIndex !== undefined ? taskB.orderIndex : Infinity;
    
    return orderA - orderB;
  });

  sortedBlocks.forEach((b, index) => {
    const el = document.createElement("div");
    el.className = "block";
    el.dataset.blockId = b.id;
    el.dataset.orderIndex = index;
    
    // Make ALL blocks draggable (including active)
    el.draggable = true;
    el.classList.add('draggable-block');
    
    // Add active indicator class if this is the active block
    const isActive = b.id === activeBlockId;
    if (isActive) {
      el.classList.add('block-active');
    }

    const left = document.createElement("div");
    left.className = "block-left";
    
    // Add drag handle for all blocks
    const dragHandle = document.createElement("div");
    dragHandle.className = "block-drag-handle";
    dragHandle.textContent = "⠿";
    dragHandle.title = "Drag to reorder";
    left.appendChild(dragHandle);

    const title = document.createElement("div");
    title.className = "block-title";
    title.textContent = b.name;

    // Build meta with subject and deadline info
    let metaText = `${b.minutes} min`;
    if (b.subject && SUBJECT_LABELS[b.subject]) {
      metaText += ` • ${SUBJECT_LABELS[b.subject]}`;
    }
    if (b.completed) metaText += " • done";
    
    // Check for deadline urgency
    const task = b.sourceTaskId ? tasks.find(t => t.id === b.sourceTaskId) : null;
    if (task && task.deadline) {
      const deadline = new Date(task.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      if (daysUntil >= 0 && daysUntil <= 7) {
        metaText += ` • Due in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`;
      }
    }

    const meta = document.createElement("div");
    meta.className = "block-meta";
    meta.textContent = metaText;
    
    const titleMetaWrapper = document.createElement("div");
    titleMetaWrapper.style.display = "flex";
    titleMetaWrapper.style.flexDirection = "column";
    titleMetaWrapper.style.gap = "2px";
    titleMetaWrapper.style.minWidth = "0";
    titleMetaWrapper.style.flex = "1";
    
    titleMetaWrapper.appendChild(title);
    titleMetaWrapper.appendChild(meta);
    
    left.appendChild(titleMetaWrapper);

    const actions = document.createElement("div");
    actions.className = "block-actions";

    // Kid-friendly: Show buttons directly instead of menu
    if (!isActive) {
      const selectBtn = document.createElement("button");
      selectBtn.className = "kid-friendly-btn primary small";
      selectBtn.innerHTML = "🎯 <span>Select</span>";
      selectBtn.title = "Select this task";
      selectBtn.dataset.blockId = b.id;
      selectBtn.addEventListener("click", () => selectBlock(b.id));
      actions.appendChild(selectBtn);
    }
    
    const editBtn = document.createElement("button");
    editBtn.className = "kid-friendly-btn small";
    editBtn.innerHTML = "✏️ <span>Edit</span>";
    editBtn.title = "Edit this task";
    editBtn.dataset.blockId = b.id;
    editBtn.addEventListener("click", () => {
      if (b.sourceTaskId) {
        const task = tasks.find(t => t.id === b.sourceTaskId);
        if (task) openTaskModal(true, task);
      }
    });
    
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "kid-friendly-btn danger small";
    deleteBtn.innerHTML = "🗑️ <span>Delete</span>";
    deleteBtn.title = "Delete this task";
    deleteBtn.dataset.blockId = b.id;
    deleteBtn.addEventListener("click", () => {
      if (isActive) {
        if (!confirm(`Delete "${b.name}"? This will stop the timer.`)) {
          return;
        }
      } else {
        if (!confirm(`Delete "${b.name}"?`)) {
          return;
        }
      }
      // Delete the block and its linked task
      if (b.sourceTaskId) {
        deleteTask(b.sourceTaskId);
      } else {
        deleteBlock(b.id);
      }
    });
    
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    el.appendChild(left);
    el.appendChild(actions);
    blockListEl.appendChild(el);
    
    // Add drag event listeners for ALL blocks
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', b.id);
      el.classList.add('dragging');
      // No menus to close (using direct buttons now)
    });
    
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
    });
    
    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const afterElement = getDragAfterElement(blockListEl, e.clientY);
      const dragging = blockListEl.querySelector('.dragging');
      if (dragging && afterElement == null) {
        blockListEl.appendChild(dragging);
      } else if (dragging && afterElement) {
        blockListEl.insertBefore(dragging, afterElement);
      }
    });
    
    el.addEventListener('drop', (e) => {
      e.preventDefault();
      const draggedBlockId = e.dataTransfer.getData('text/plain');
      if (draggedBlockId === b.id) return;
      
      // Get all blocks in current order (ALL blocks, including active)
      const allBlockElements = Array.from(blockListEl.children);
      
      const draggedIndex = allBlockElements.findIndex(child => child.dataset.blockId === draggedBlockId);
      const targetIndex = allBlockElements.findIndex(child => child.dataset.blockId === b.id);
      
      if (draggedIndex !== -1 && targetIndex !== -1 && draggedIndex !== targetIndex) {
        reorderBlocks(draggedBlockId, targetIndex);
      }
    });
  });
  
  // Helper function to find element after which to drop
  function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.block.draggable-block:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }
}

// Function to reorder blocks and update task orderIndex
function reorderBlocks(draggedBlockId, targetIndex) {
  // Get all blocks in current display order (ALL blocks, including active)
  const allBlockElements = Array.from(blockListEl.children);
  
  const allBlocks = allBlockElements
    .map(child => blocks.find(b => b.id === child.dataset.blockId))
    .filter(b => b);
  
  // Find the dragged block
  const draggedBlock = blocks.find(b => b.id === draggedBlockId);
  if (!draggedBlock || !draggedBlock.sourceTaskId) return;
  
  // Remove dragged block from array
  const otherBlocks = allBlocks.filter(b => b.id !== draggedBlockId);
  
  // Insert at target position
  otherBlocks.splice(targetIndex, 0, draggedBlock);
  
  // Update orderIndex for all affected tasks
  otherBlocks.forEach((block, index) => {
    if (block && block.sourceTaskId) {
      const task = tasks.find(t => t.id === block.sourceTaskId);
      if (task) {
        task.orderIndex = index;
      }
    }
  });
  
  persistAll();
  renderAll();
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
    nameWrap.className = "task-name-wrap";
    nameWrap.style.minWidth = "0";
    nameWrap.style.flex = "1";

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
    focusBtn.className = "kid-friendly-btn primary small";
    focusBtn.innerHTML = "🎯 <span>Start</span>";
    focusBtn.title = "Start focusing on this task";
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
    editBtn.className = "kid-friendly-btn small";
    editBtn.innerHTML = "✏️ <span>Edit</span>";
    editBtn.title = "Edit this task";
    editBtn.addEventListener("click", () => {
      openTaskModal(true, t);
    });

    const delBtn = document.createElement("button");
    delBtn.className = "kid-friendly-btn danger small";
    delBtn.innerHTML = "🗑️ <span>Delete</span>";
    delBtn.title = "Delete this task";
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
  // Show subtitle and no-blocks text (they'll be hidden/shown appropriately below)
  if (timerHint) timerHint.classList.remove("hidden");
  
  const b = getActiveBlock();
  if (!b) {
    // Clear tab title when no active block
    updateTabTitle(null);
    currentLabel.textContent = "CURRENT FOCUS";
    timerDisplay.textContent = "00:00";
    // Subtitle removed - timer UI shows only task title, countdown, and progress ring
    if (timerBadge) timerBadge.textContent = "🎯";
    startBtn.disabled = true;
    pauseBtn.disabled = true;
    skipBtn.disabled = true;
    distractedBtn.disabled = true;
    
    // Timer ring - reset to empty (no active timer)
    if (timerRingProgress) {
      timerRingProgress.style.strokeDashoffset = 565.48; // No visible circle
      timerRingProgress.style.opacity = '0.3'; // Dimmed
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
    if (nowBlockName) nowBlockName.textContent = "No active block";
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
    // Only reset totalSec if starting a completely new session (remainingSec <= 0)
    // This ensures totalSec represents the ORIGINAL session duration and never changes
    if (!timer.remainingSec || timer.remainingSec <= 0) {
      timer.totalSec = b.minutes * 60;
      timer.remainingSec = timer.totalSec;
    }
    // If timer is paused but has time remaining, preserve totalSec (don't reset it)
  }

  timerDisplay.textContent = formatTime(timer.remainingSec);
  // Subtitle removed - timer UI shows only task title, countdown, and progress ring
  if (timerBadge) timerBadge.textContent = timer.running ? "🔥" : "▶️";

  startBtn.disabled = timer.running ? true : false;
  pauseBtn.disabled = timer.running ? false : true;
  skipBtn.disabled = timer.running ? false : false; // allow skip any time
  
  // Distraction button: ONLY enabled when focus timer is actively running
  // Disabled: before task starts, when paused
  if (distractedBtn) {
    distractedBtn.disabled = !timer.running; // Enabled only when timer is running
  }
  
  // Timer ring progress (SVG circle)
  // Progress ring represents TOTAL session duration (normalized)
  // Start with FULL circle, decrease smoothly as time counts down
  const circumference = 565.48; // 2 * PI * 90
  if (timer.totalSec > 0 && timerRingProgress) {
    // Calculate progress as percentage of REMAINING time
    // remainingSec / totalSec gives us how much is left (0.0 to 1.0+ if penalty added)
    const remainingPercent = Math.min(timer.remainingSec / timer.totalSec, 1.0);
    // Offset: 0 = full circle visible, circumference = no circle visible
    // We want: 100% remaining = 0 offset (full), 0% remaining = circumference offset (empty)
    const offset = circumference - (remainingPercent * circumference);
    timerRingProgress.style.strokeDashoffset = offset;
    // Ensure ring is visible (not hidden)
    timerRingProgress.style.opacity = '1';
  } else if (timerRingProgress) {
    // No timer set - show full circle (no time elapsed)
    timerRingProgress.style.strokeDashoffset = 0;
    timerRingProgress.style.opacity = '1';
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
  
  if (nowBlockName) nowBlockName.textContent = b.name;
  
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
  
  // Note: panelInsights removed - insights are now in right panel (Reflections/Distractions/Patterns)
  // Subject breakdown and deadline reminders are no longer displayed in a separate tab
  // They can be accessed through the journal/patterns tabs on the right panel
}

// Subject breakdown for Insights tab
function renderSubjectBreakdown() {
  const subjectBreakdownEl = document.getElementById('subjectBreakdown');
  if (!subjectBreakdownEl) return;
  
  // Calculate minutes per subject from completed blocks today
  const subjectMinutes = {};
  const today = dayKey();
  
  blocks.filter(b => b.completed && b.subject).forEach(block => {
    // Get minutes from stats or estimate from block duration
    const minutes = block.minutes || 0;
    subjectMinutes[block.subject] = (subjectMinutes[block.subject] || 0) + minutes;
  });
  
  if (Object.keys(subjectMinutes).length === 0) {
    subjectBreakdownEl.innerHTML = '<div class="muted tiny">No subject data yet</div>';
    return;
  }
  
  // Sort by minutes (descending)
  const sorted = Object.entries(subjectMinutes).sort((a, b) => b[1] - a[1]);
  
  let html = '<div class="subhead mt12">📚 By Subject Today</div>';
  sorted.forEach(([subject, minutes]) => {
    const label = SUBJECT_LABELS[subject] || subject;
    html += `<div class="ins-row"><span>${label}</span><span>${minutes} min</span></div>`;
  });
  
  subjectBreakdownEl.innerHTML = html;
}

// Deadline reminders
function renderDeadlineReminders() {
  const deadlineRemindersEl = document.getElementById('deadlineReminders');
  if (!deadlineRemindersEl) return;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Find tasks with deadlines in next 7 days
  const upcomingDeadlines = tasks
    .filter(t => t.deadline && !t.done)
    .map(t => {
      const deadline = new Date(t.deadline);
      deadline.setHours(0, 0, 0, 0);
      const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      return { ...t, daysUntil };
    })
    .filter(t => t.daysUntil >= 0 && t.daysUntil <= 7)
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 3); // Show top 3
  
  if (upcomingDeadlines.length === 0) {
    deadlineRemindersEl.innerHTML = '';
    return;
  }
  
  let html = '<div class="subhead mt12">⏰ Upcoming Deadlines</div>';
  upcomingDeadlines.forEach(task => {
    const urgency = task.daysUntil === 0 ? 'urgent' : task.daysUntil <= 2 ? 'soon' : 'normal';
    const urgencyIcon = task.daysUntil === 0 ? '🔴' : task.daysUntil <= 2 ? '🟡' : '🟢';
    const daysText = task.daysUntil === 0 ? 'Today!' : task.daysUntil === 1 ? 'Tomorrow' : `${task.daysUntil} days`;
    html += `<div class="ins-row ${urgency}"><span>${urgencyIcon} ${task.name}</span><span>${daysText}</span></div>`;
  });
  
  deadlineRemindersEl.innerHTML = html;
}

function renderAll() {
  renderGoal();
  renderBlocks();
  renderTasks();
  renderTimer();
  renderInsights();
  
  // Update helper text visibility (also handled in renderBlocks, but ensure it's updated)
  const addTaskHelper = document.getElementById("addTaskHelper");
  if (addTaskHelper) {
    if (tasks.length === 0 && blocks.length === 0) {
      addTaskHelper.classList.remove("hidden");
    } else {
      addTaskHelper.classList.add("hidden");
    }
  }
  // College tab renders on-demand when opened
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
const taskDeadlineInput = $("taskDeadlineInput");
const templateButtons = document.getElementById("templateButtons");

// Study session templates
const STUDY_TEMPLATES = {
  math: { name: "Study for test", minutes: 45 },
  reading: { name: "Reading session", minutes: 30 },
  review: { name: "Review notes", minutes: 25 },
  writing: { name: "Essay draft", minutes: 60 }
};

function openTaskModal(edit=false, task=null) {
  if (edit && task) {
    editingTaskId = task.id;
    taskModalTitle.textContent = "Edit Task";
    taskNameInput.value = task.name;
    taskMinsInput.value = String(task.minutes);
    if (taskDeadlineInput) taskDeadlineInput.value = task.deadline || "";
  } else {
    editingTaskId = null;
    taskModalTitle.textContent = "Add Task";
    taskNameInput.value = "";
    taskMinsInput.value = "15";
    if (taskDeadlineInput) taskDeadlineInput.value = "";
  }
  openModal(taskModal);
  setTimeout(()=>taskNameInput.focus(), 10);
  taskNameInput.select();
}

// Template button handlers
if (templateButtons) {
  templateButtons.addEventListener("click", (e) => {
    const btn = e.target.closest(".template-btn");
    if (!btn) return;
    const templateKey = btn.dataset.template;
    const template = STUDY_TEMPLATES[templateKey];
    if (template) {
      taskNameInput.value = template.name;
      taskMinsInput.value = String(template.minutes);
      // Focus on name input so user can customize
      taskNameInput.focus();
      taskNameInput.select();
    }
  });
}

// Distract modal
function openDistractModal() {
  // Reset modal state
  selectedDistractionReason = null;
  const distractOtherInput = document.getElementById('distractOtherInput');
  const distractOtherSubmitBtn = document.getElementById('distractOtherSubmitBtn');
  if (distractNote) distractNote.value = '';
  if (distractOtherInput) distractOtherInput.classList.add('hidden');
  if (distractOtherSubmitBtn) distractOtherSubmitBtn.disabled = true;
  document.querySelectorAll("#distractModal .choice").forEach(b => b.classList.remove('selected'));
  
  const distractModalEl = document.getElementById('distractModal');
  if (!distractModalEl) {
    console.warn('Distraction modal not found in DOM');
    return;
  }
  openModal(distractModalEl);
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

// Render Feedback content in Insights panel
function renderFeedback() {
  if (!journalContent) return;
  
  const reflections = journal.reflections || [];
  const distractions = journal.distractions || [];
  
  // Show empty state if no session data
  if (reflections.length === 0) {
    journalContent.innerHTML = '<div class="journal-empty">Complete a focus session to see feedback.</div>';
    return;
  }
  
  let feedbackHtml = '<div class="feedback-content">';
  
  // 1. PRODUCTIVITY TREND (Small Line Graph)
  // Get recent sessions with ratings (last 10 sessions)
  const recentSessions = reflections
    .filter(r => r.rating !== null && r.rating !== undefined)
    .slice(0, 10)
    .reverse(); // Most recent last for graph
  
  if (recentSessions.length > 0) {
    feedbackHtml += '<div class="feedback-section">';
    feedbackHtml += '<div class="feedback-title">📈 Productivity Trend</div>';
    
    // Render small line graph
    const graphHeight = 60;
    const graphWidth = 100;
    const maxRating = 5;
    const minRating = 1;
    const ratingRange = maxRating - minRating;
    
    // Calculate points for line graph
    const points = recentSessions.map((r, index) => {
      const x = (index / Math.max(1, recentSessions.length - 1)) * graphWidth;
      const y = graphHeight - ((r.rating - minRating) / ratingRange) * graphHeight;
      return `${x},${y}`;
    }).join(' ');
    
    // Create SVG line graph
    feedbackHtml += `
      <div class="productivity-graph-container" style="width: 100%; height: ${graphHeight}px; margin: 12px 0;">
        <svg viewBox="0 0 ${graphWidth} ${graphHeight}" style="width: 100%; height: 100%;">
          <!-- Grid lines (subtle) -->
          <line x1="0" y1="${graphHeight * 0.8}" x2="${graphWidth}" y2="${graphHeight * 0.8}" stroke="#e5e7eb" stroke-width="0.5"/>
          <line x1="0" y1="${graphHeight * 0.5}" x2="${graphWidth}" y2="${graphHeight * 0.5}" stroke="#e5e7eb" stroke-width="0.5"/>
          <line x1="0" y1="${graphHeight * 0.2}" x2="${graphWidth}" y2="${graphHeight * 0.2}" stroke="#e5e7eb" stroke-width="0.5"/>
          
          <!-- Data line -->
          <polyline 
            points="${points}" 
            fill="none" 
            stroke="#3b82f6" 
            stroke-width="2" 
            stroke-linecap="round" 
            stroke-linejoin="round"
          />
          
          <!-- Data points -->
          ${recentSessions.map((r, index) => {
            const x = (index / Math.max(1, recentSessions.length - 1)) * graphWidth;
            const y = graphHeight - ((r.rating - minRating) / ratingRange) * graphHeight;
            return `<circle cx="${x}" cy="${y}" r="2" fill="#3b82f6"/>`;
          }).join('')}
        </svg>
      </div>
    `;
    
    feedbackHtml += '</div>';
  }
  
  // 2. PERSONALIZED FEEDBACK (1-2 short statements + actionable takeaways)
  feedbackHtml += '<div class="feedback-section">';
  feedbackHtml += '<div class="feedback-title">💡 Your Feedback</div>';
  
  const feedbackStatements = [];
  const actionableTips = [];
  
  // Analyze data to generate personalized feedback
  if (recentSessions.length >= 3) {
    // Check productivity trend
    const recentRatings = recentSessions.slice(-3).map(r => r.rating);
    const olderRatings = recentSessions.slice(0, Math.max(0, recentSessions.length - 3)).map(r => r.rating);
    
    if (recentRatings.length > 0 && olderRatings.length > 0) {
      const recentAvg = recentRatings.reduce((a, b) => a + b, 0) / recentRatings.length;
      const olderAvg = olderRatings.reduce((a, b) => a + b, 0) / olderRatings.length;
      
      if (recentAvg > olderAvg + 0.5) {
        feedbackStatements.push('Your productivity has improved recently.');
        actionableTips.push('💡 Keep doing what you\'re doing! You\'re getting better at focusing!');
      } else if (recentAvg < olderAvg - 0.5) {
        feedbackStatements.push('Your productivity has dipped recently.');
        actionableTips.push('💡 Try using your top focus helpers again - they worked before!');
      }
    }
  }
  
  // Check focus helpers correlation
  const sessionsWithHelpers = reflections.filter(r => r.helpers && r.helpers.length > 0);
  const sessionsWithoutHelpers = reflections.filter(r => !r.helpers || r.helpers.length === 0);
  
  if (sessionsWithHelpers.length >= 3 && sessionsWithoutHelpers.length >= 2) {
    const avgWithHelpers = sessionsWithHelpers
      .filter(r => r.rating !== null && r.rating !== undefined)
      .map(r => r.rating)
      .reduce((a, b) => a + b, 0) / sessionsWithHelpers.filter(r => r.rating !== null).length;
    
    const avgWithoutHelpers = sessionsWithoutHelpers
      .filter(r => r.rating !== null && r.rating !== undefined)
      .map(r => r.rating)
      .reduce((a, b) => a + b, 0) / sessionsWithoutHelpers.filter(r => r.rating !== null).length;
    
    if (avgWithHelpers > avgWithoutHelpers + 0.5) {
      const topHelper = sessionsWithHelpers
        .flatMap(r => r.helpers || [])
        .reduce((acc, h) => {
          acc[h] = (acc[h] || 0) + 1;
          return acc;
        }, {});
      const mostCommonHelper = Object.entries(topHelper).sort((a, b) => b[1] - a[1])[0]?.[0];
      
      if (mostCommonHelper) {
        feedbackStatements.push(`Sessions with "${mostCommonHelper}" selected show higher productivity.`);
        actionableTips.push(`💡 Use "${mostCommonHelper}" more often - it really helps you focus!`);
      }
    }
  }
  
  // Check distraction timing patterns
  if (distractions.length >= 5) {
    const allSessions = reflections.filter(r => r.sessionStartTime && r.minutes);
    const distractionTimings = [];
    
    allSessions.forEach(session => {
      const sessionStart = new Date(session.sessionStartTime);
      const sessionDists = distractions
        .filter(d => {
          const distTime = new Date(d.date);
          return distTime >= sessionStart && 
                 distTime <= new Date(sessionStart.getTime() + (session.minutes * 60 * 1000)) &&
                 d.blockName === session.blockName;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      if (sessionDists.length > 0) {
        const firstDist = sessionDists[0];
        const firstDistTime = new Date(firstDist.date);
        const minutesToFirst = (firstDistTime - sessionStart) / (60 * 1000);
        distractionTimings.push(minutesToFirst);
      }
    });
    
    if (distractionTimings.length >= 3) {
      const avgTimeToFirst = distractionTimings.reduce((a, b) => a + b, 0) / distractionTimings.length;
      
      if (avgTimeToFirst < 10) {
        feedbackStatements.push('Phone distractions appear most often early in sessions.');
        actionableTips.push('💡 Put your phone away before you start - it helps you get into focus mode faster!');
      } else if (avgTimeToFirst >= 10 && avgTimeToFirst <= 15) {
        feedbackStatements.push('You tend to focus better after the first 10–15 minutes.');
        actionableTips.push('💡 Try starting with shorter sessions, then build up - you focus best after getting started!');
      }
    }
  }
  
  // If no specific feedback, show generic but data-driven message
  if (feedbackStatements.length === 0 && reflections.length > 0) {
    const avgRating = reflections
      .filter(r => r.rating !== null && r.rating !== undefined)
      .map(r => r.rating)
      .reduce((a, b) => a + b, 0) / reflections.filter(r => r.rating !== null).length;
    
    if (avgRating >= 4) {
      feedbackStatements.push('You maintain consistently high productivity.');
      actionableTips.push('💡 You\'re doing amazing! Keep up the great work!');
    } else if (avgRating >= 3) {
      feedbackStatements.push('Your productivity is steady.');
      actionableTips.push('💡 You\'re doing well! Try using your top focus helpers to boost your score even higher!');
    }
  }
  
  // Display feedback statements (max 2)
  if (feedbackStatements.length > 0) {
    feedbackStatements.slice(0, 2).forEach(statement => {
      feedbackHtml += `<div class="feedback-insight">${statement}</div>`;
    });
  } else {
    feedbackHtml += '<div class="feedback-insight">Complete more sessions to see personalized feedback.</div>';
  }
  
  // Display actionable takeaways (max 2)
  if (actionableTips.length > 0) {
    actionableTips.slice(0, 2).forEach(tip => {
      feedbackHtml += `<div class="feedback-takeaway">${tip}</div>`;
    });
  }
  
  feedbackHtml += '</div>';
  feedbackHtml += '</div>';
  
  journalContent.innerHTML = feedbackHtml;
}

// Render simple focus timeline graph
function renderFocusTimeline(durationMinutes, distractions, sessionStartTime) {
  if (!sessionStartTime || durationMinutes <= 0) return '<div class="timeline-empty">No timeline data</div>';
  
  const width = 100; // Percentage width
  const height = 40; // Pixels
  const segments = [];
  
  // Create segments between distractions
  const distractionMinutes = distractions.map(d => {
    const distTime = new Date(d.date);
    const sessionStart = new Date(sessionStartTime);
    return Math.max(0, Math.min(durationMinutes, (distTime - sessionStart) / (60 * 1000)));
  }).sort((a, b) => a - b);
  
  let lastPos = 0;
  
  // Add focused segments (green)
  distractionMinutes.forEach(distMin => {
    if (distMin > lastPos) {
      const segmentWidth = ((distMin - lastPos) / durationMinutes) * 100;
      segments.push({
        type: 'focused',
        width: segmentWidth,
        left: (lastPos / durationMinutes) * 100
      });
    }
    lastPos = distMin;
  });
  
  // Add final focused segment if any
  if (lastPos < durationMinutes) {
    segments.push({
      type: 'focused',
      width: ((durationMinutes - lastPos) / durationMinutes) * 100,
      left: (lastPos / durationMinutes) * 100
    });
  }
  
  // Build timeline HTML
  let timelineHtml = `<div class="focus-timeline" style="width: 100%; height: ${height}px; position: relative; background: rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden; margin: 12px 0;">`;
  
  // Render focused segments
  segments.forEach(seg => {
    timelineHtml += `<div class="timeline-segment focused" style="position: absolute; left: ${seg.left}%; width: ${seg.width}%; height: 100%; background: linear-gradient(90deg, #22c55e, #16a34a);"></div>`;
  });
  
  // Render distraction markers
  distractionMinutes.forEach(distMin => {
    const leftPercent = (distMin / durationMinutes) * 100;
    timelineHtml += `<div class="timeline-marker distraction" style="position: absolute; left: ${leftPercent}%; top: 50%; transform: translate(-50%, -50%); width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 2px solid rgba(255,255,255,0.9); box-shadow: 0 0 8px rgba(239,68,68,0.6);"></div>`;
  });
  
  // Add time labels at start and end
  timelineHtml += `<div class="timeline-label" style="position: absolute; left: 4px; top: 4px; font-size: 10px; color: rgba(255,255,255,0.6);">0</div>`;
  timelineHtml += `<div class="timeline-label" style="position: absolute; right: 4px; top: 4px; font-size: 10px; color: rgba(255,255,255,0.6);">${durationMinutes}m</div>`;
  
  timelineHtml += '</div>';
  
  return timelineHtml;
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
  const deadline = taskDeadlineInput?.value || null;
  if (!nm) return;
  closeModal(taskModal);
  upsertTask(nm, mins, null, deadline); // subject is always null now
});

// Clear tasks button removed from simplified UI

startBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  startTimer();
  
  // Force re-render to update button states
  renderAll();
});

pauseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  // Force enable button if it's disabled but timer is running (defensive)
  if (timer.running && pauseBtn.disabled) {
    pauseBtn.disabled = false;
  }
  
  pauseTimer();
  
  // Force re-render to update button states
  renderAll();
});

skipBtn.addEventListener("click", () => skipBlock());

distractedBtn.addEventListener("click", () => {
  // Only allow if button is enabled (timer is running and not in break)
  if (distractedBtn.disabled) return;
  
  // Only allow if there is an active block
  if (!getActiveBlock()) return;
  
  // Only allow if timer is actually running (double-check state)
  if (!timer.running) return;
  
  // Add visual feedback
  distractedBtn.classList.add('feedback');
  setTimeout(() => {
    distractedBtn.classList.remove('feedback');
  }, 600);
  
  openDistractModal();
});

// Distraction cancel button
// Distraction cancel button handler (set up in initDistractionModal)

// Feedback button removed from top navigation - now accessible via Insights panel
// feedbackBtn removed - feedback is now in Insights panel
feedbackCloseBtn.addEventListener("click", () => closeModal(feedbackModal));

// Reset button - opens confirmation modal
resetBtn.addEventListener("click", () => {
  if (resetModal) {
    openModal(resetModal);
    // Focus Cancel button by default
    if (resetCancelBtn) {
      setTimeout(() => resetCancelBtn.focus(), 100);
    }
  }
});

// Reset cancel button
if (resetCancelBtn) {
  resetCancelBtn.addEventListener("click", () => {
    if (resetModal) closeModal(resetModal);
  });
}

// Reset confirm button - performs full reset
if (resetConfirmBtn) {
  resetConfirmBtn.addEventListener("click", () => {
    performFullReset();
    if (resetModal) closeModal(resetModal);
  });
}

// Full global reset function
function performFullReset() {
  // Stop timer immediately
  stopTimer(true);
  
  // Clear all localStorage keys
  localStorage.removeItem(LS.GOAL);
  localStorage.removeItem(LS.BLOCKS);
  localStorage.removeItem(LS.TASKS);
  localStorage.removeItem(LS.STATS);
  localStorage.removeItem(LS.ACTIVE);
  localStorage.removeItem(LS.TIMER);
  localStorage.removeItem(LS.SETTINGS);
  localStorage.removeItem(LS.JOURNAL);
  localStorage.removeItem(LS.BADGES);
  localStorage.removeItem(SOUND_ENABLED_KEY);
  localStorage.removeItem('focus_demo_mode');
  
  // Reset all in-memory state
  blocks = [];
  tasks = [];
  activeBlockId = null;
  
  // Reset stats completely
  stats = {
    todayMinutes: 0,
    weekMinutes: 0,
    streak: 0,
    lastDayKey: null,
    distractionCount: 0,
    distractionReasons: {},
    dailyHistory: []
  };
  
  // Reset journal
  journal = {
    reflections: [],
    distractions: []
  };
  
  // Reset badges
  earnedBadges = {};
  
  // Reset timer state completely
  timer = {
    totalSec: 0,
    remainingSec: 0,
    running: false,
    startEpoch: null,
    tickHandle: null
  };
  
  // Reset app settings to defaults
  appSettings = { ...DEFAULT_SETTINGS };
  
  // Reset sound setting to default (enabled)
  soundEnabled = true;
  
  // Reload and re-render everything
  loadAll();
  renderAll();
}

// Init
(function init(){
  loadAll();
  renderAll();

  // Initialize sound toggle button
  initSoundToggle();
  
  // Initialize reflection modal (must be after DOM is ready)
  initReflectionModal();
  
  // Initialize keyboard shortcuts
  initKeyboardShortcuts();
  initShortcutsUI();
  
  // Initialize Insights panel layout (ensure it renders correctly)
  // Use setTimeout to ensure DOM is fully ready
  setTimeout(() => {
    if (typeof initInsightsPanel === 'function') {
      initInsightsPanel();
    }
  }, 0);
  
  // Request notification permission (will only prompt if not already granted/denied)
  requestNotificationPermission();

  // First-time user onboarding: add a sample task if no tasks/blocks exist
  const hasSeenOnboarding = localStorage.getItem('focus_onboarding_done');
  if (!hasSeenOnboarding && blocks.length === 0 && tasks.length === 0) {
    // Create a welcome task for first-time users
    const welcomeTaskId = uuid();
    // Calculate orderIndex for welcome task
    const maxOrderIndex = tasks.length > 0 
      ? Math.max(...tasks.map(t => t.orderIndex !== undefined ? t.orderIndex : -1))
      : -1;
    
    tasks.push({
      id: welcomeTaskId,
      name: "My first focus session",
      minutes: 5,
      done: false,
      createdAt: Date.now(),
      orderIndex: maxOrderIndex + 1
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

// Reflection Modal elements declared at top of file (around line 72)

let selectedRating = null;
let selectedHelpers = [];

// Initialize reflection modal elements (after DOM loads)
function initReflectionModal() {
  // reflectionModal and other elements declared at top of file (around line 75)
  reflectionModal = document.getElementById('reflectionModal');
  productivityRating = document.getElementById('productivityRating');
  skipReflectionBtn = document.getElementById('skipReflectionBtn');
  saveReflectionBtn = document.getElementById('saveReflectionBtn');
  
  // Initialize button handlers (only once)
  if (skipReflectionBtn && !skipReflectionBtn.dataset.listenerAdded) {
    skipReflectionBtn.dataset.listenerAdded = 'true';
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
          focus_rating: null
        });
      }
      closeReflectionModal();
    });
  }
  
  if (saveReflectionBtn && !saveReflectionBtn.dataset.listenerAdded) {
    saveReflectionBtn.dataset.listenerAdded = 'true';
    saveReflectionBtn.addEventListener('click', saveReflection);
  }
  
  // Star rating buttons (only add listeners once)
  if (productivityRating && !productivityRating.dataset.listenerAdded) {
    productivityRating.dataset.listenerAdded = 'true';
    
    const starButtons = productivityRating.querySelectorAll('.star-btn');
    
    // Function to update star display based on rating value
    const updateStarDisplay = (ratingValue, isHover = false) => {
      starButtons.forEach((btn, index) => {
        const starNum = index + 1; // 1-based index
        btn.textContent = '☆'; // Always start with empty star
        btn.classList.remove('filled', 'hover-preview');
        
        if (ratingValue !== null && starNum <= ratingValue) {
          btn.textContent = '★';
          if (isHover) {
            btn.classList.add('hover-preview');
          } else {
            btn.classList.add('filled');
          }
        }
      });
    };
    
    // Click handler
    productivityRating.addEventListener('click', (e) => {
      const btn = e.target.closest('.star-btn');
      if (!btn) return;
      
      const clickedRating = parseInt(btn.dataset.rating);
      
      // Toggle: if clicking the same rating, deselect
      if (selectedRating === clickedRating) {
        selectedRating = null;
      } else {
        selectedRating = clickedRating;
      }
      
      // Update display with actual selection (not hover)
      updateStarDisplay(selectedRating, false);
    });
    
    // Hover preview handler
    starButtons.forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        const hoverRating = parseInt(btn.dataset.rating);
        updateStarDisplay(hoverRating, true);
      });
    });
    
    // Mouse leave handler - revert to actual selection
    productivityRating.addEventListener('mouseleave', () => {
      updateStarDisplay(selectedRating, false);
    });
  }
  
  // Helper chips (only add listeners once)
  document.querySelectorAll('.helper-chip').forEach(chip => {
    if (!chip.dataset.listenerAdded) {
      chip.dataset.listenerAdded = 'true';
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
        const helper = chip.dataset.helper;
        if (chip.classList.contains('selected')) {
          if (!selectedHelpers.includes(helper)) selectedHelpers.push(helper);
        } else {
          selectedHelpers = selectedHelpers.filter(h => h !== helper);
        }
      });
    }
  });
}

function openReflectionModal() {
  const reflectionModalEl = document.getElementById('reflectionModal');
  if (!reflectionModalEl) {
    console.warn('Reflection modal not found in DOM');
    return;
  }
  
  // Reset state
  // Reset state
  selectedRating = null;
  selectedHelpers = [];
  
  // Reset UI
  if (productivityRating) {
    productivityRating.querySelectorAll('.star-btn').forEach(btn => {
      btn.textContent = '☆';
      btn.classList.remove('filled', 'hover-preview');
    });
  }
  document.querySelectorAll('.helper-chip').forEach(chip => chip.classList.remove('selected'));
  
  // Open modal
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (modalBackdrop) modalBackdrop.classList.remove('hidden');
  reflectionModalEl.classList.remove('hidden');
  
  console.log('✅ Reflection modal opened');
}

function closeReflectionModal() {
  const reflectionModalEl = document.getElementById('reflectionModal');
  if (!reflectionModalEl) return;
  reflectionModalEl.classList.add('hidden');
  const modalBackdrop = document.getElementById('modalBackdrop');
  if (modalBackdrop) modalBackdrop.classList.add('hidden');
  
  // Refresh journal to show new reflection
  renderJournalTab('reflections');
  
  // CRITICAL: NO BREAKS - After reflection closes, user manually selects next task
  // Timer is already cleared in completeBlock(), so we're in idle state
  // User must manually select and start the next task
}

function saveReflection() {
  if (!lastCompletedBlock) {
    closeReflectionModal();
    return;
  }
  
  const reflectionId = uuid();
  const reflection = {
    id: reflectionId,
    date: lastCompletedBlock.date,
    blockName: lastCompletedBlock.name,
    blockId: lastCompletedBlock.block_id || null,
    minutes: lastCompletedBlock.minutes,
    sessionStartTime: lastCompletedBlock.sessionStartTime, // Store for feedback timeline
    rating: selectedRating,
    helpers: selectedHelpers
  };
  
  // Save to local journal array (for UI rendering)
  if (!journal.reflections) journal.reflections = [];
  journal.reflections.unshift(reflection);
  
  // Keep only last 100 reflections locally (for UI performance)
  if (journal.reflections.length > 100) {
    journal.reflections = journal.reflections.slice(0, 100);
  }
  
  // Save reflection to Firestore as individual document (for BigQuery export)
  syncReflectionToFirestore(reflection);
  
  // Save research data to Firestore (block document)
  saveResearchSessionData({
    user_id: firebaseAuth?.currentUser?.uid || 'anonymous',
    date: dayKey(new Date(lastCompletedBlock.date)),
    session_start_time: lastCompletedBlock.sessionStartTime,
    planned_minutes: lastCompletedBlock.plannedMinutes,
    actual_minutes: lastCompletedBlock.actualMinutes,
    distraction_count: lastCompletedBlock.distractionCount,
    focus_rating: selectedRating,
    subject: lastCompletedBlock.subject || null,
    block_id: lastCompletedBlock.block_id || null
  });
  
  persistAll();
  closeReflectionModal();
}

// Sync a single reflection to Firestore (document-based, not array)
async function syncReflectionToFirestore(reflection) {
  if (!firestore || !firebaseAuth?.currentUser || !reflection) return;
  
  const userId = firebaseAuth.currentUser.uid;
  if (!userId) return;
  
  try {
    const reflectionRef = firestore.collection('users').doc(userId).collection('reflections').doc(reflection.id);
    const reflectionData = {
      userId: userId,
      blockId: reflection.blockId || null,
      blockName: reflection.blockName || null,
      date: reflection.date,
      minutes: reflection.minutes || null,
      sessionStartTime: reflection.sessionStartTime || null,
      rating: reflection.rating || null,
      helpers: reflection.helpers || [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    await reflectionRef.set(reflectionData);
  } catch (error) {
    console.error('❌ Error syncing reflection to Firestore:', error);
  }
}


// Enhanced Distraction Logging
// distractNote and distractSubmitBtn declared at top of file
// selectedDistractionReason declared at top of file

// Distraction reason selection and submit button handlers are set up in initDistractionModal()

function logDistractionWithNote(reason, note) {
  const b = getActiveBlock();
  if (!b) return;

  // Determine the actual distraction label
  // If "Other", use the note (user's typed text) as the label
  // Otherwise, use the preset reason
  let distractionLabel;
  let distractionSource;
  
  if (reason === "Other") {
    // Use the user's typed text as the actual distraction label
    distractionLabel = note.trim();
    distractionSource = "custom";
    
    // Don't log if empty
    if (!distractionLabel) return;
  } else {
    // Use the preset reason
    distractionLabel = reason;
    distractionSource = "preset";
  }

  // 1) count
  stats.distractionCount = (stats.distractionCount || 0) + 1;

  // 2) reason breakdown (use actual label, not "Other")
  stats.distractionReasons[distractionLabel] = (stats.distractionReasons[distractionLabel] || 0) + 1;

  // 3) "time tax" add 30 seconds
  timer.remainingSec = clamp(timer.remainingSec + 30, 0, 24 * 60 * 60);

  // Show toast notification for timer penalty
  showDistractionToast();

  // 4) Create distraction object for local storage (UI rendering)
  const distractionId = uuid();
  const distraction = {
    id: distractionId,
    date: new Date().toISOString(),
    reason: distractionLabel, // Store the actual label (not "Other")
    source: distractionSource, // "preset" or "custom"
    blockName: b.name,
    blockId: b.id,
    note: note || null
  };
  
  // Save to local journal array (for UI rendering)
  if (!journal.distractions) journal.distractions = [];
  journal.distractions.unshift(distraction);
  
  // Keep only last 100 distractions locally (for UI performance)
  if (journal.distractions.length > 100) {
    journal.distractions = journal.distractions.slice(0, 100);
  }
  
  // 5) Save to Firestore as individual document (for BigQuery export)
  syncDistractionToFirestore(distraction);
  
  persistAll();
  renderAll();
}

// Sync a single distraction to Firestore (document-based, not array)
async function syncDistractionToFirestore(distraction) {
  if (!firestore || !firebaseAuth?.currentUser || !distraction) return;
  
  const userId = firebaseAuth.currentUser.uid;
  if (!userId) return;
  
  try {
    const distractionRef = firestore.collection('users').doc(userId).collection('distractions').doc(distraction.id);
    const distractionData = {
      userId: userId,
      blockId: distraction.blockId || null,
      blockName: distraction.blockName || null,
      reason: distraction.reason,
      note: distraction.note || null,
      source: distraction.source || 'preset',
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    await distractionRef.set(distractionData);
  } catch (error) {
    console.error('❌ Error syncing distraction to Firestore:', error);
  }
}

// Play distraction toast sound
function playDistractionSound() {
  if (!soundEnabled) return;
  
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    // Create a pleasant two-tone chime (major third interval: C5 and E5)
    const frequencies = [523.25, 659.25]; // C5 and E5 - pleasant major third
    const duration = 0.3; // Pleasant duration
    
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine'; // Smooth sine wave
      
      const startTime = now + (i * 0.05); // Slight stagger for harmony
      
      // Gentle attack and smooth decay
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  } catch (e) {
    console.log("Audio not available:", e);
  }
}

// Play task start sound
function playTaskStartSound() {
  if (!soundEnabled) return;
  
  try {
    const audio = new Audio('/sounds/task-start.mp3');
    audio.volume = 0.6;
    audio.play().catch(e => {
      console.log("Task start sound not available:", e);
      // Fallback to pleasant chime if file not found
      playPleasantChime([440, 554.37]); // A4, C#5 - pleasant interval
    });
  } catch (e) {
    console.log("Audio not available:", e);
    // Fallback to pleasant chime
    playPleasantChime([440, 554.37]);
  }
}

// Fallback pleasant chime (if audio files not found)
function playPleasantChime(frequencies) {
  if (!soundEnabled) return;
  
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duration = 0.4;
    
    frequencies.forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      
      const startTime = now + (i * 0.08);
      
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      
      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    });
  } catch (e) {
    console.log("Audio not available:", e);
  }
}

// Generic toast notification function
function showGenericToast(icon, title, message, soundFunction) {
  if (!genericToast || !genericToastIcon || !genericToastTitle || !genericToastMessage) return;
  
  // Play sound if provided
  if (soundFunction) {
    soundFunction();
  }
  
  // Clear any existing timeout (replace previous toast)
  if (genericToastTimeout) {
    clearTimeout(genericToastTimeout);
    genericToastTimeout = null;
  }
  
  // Update toast content
  genericToastIcon.textContent = icon;
  genericToastTitle.textContent = title;
  genericToastMessage.textContent = message;
  
  // Hide toast first (if visible) to reset animation
  genericToast.classList.add('hidden');
  
  // Show toast after a brief delay to ensure clean animation
  setTimeout(() => {
    genericToast.classList.remove('hidden');
    
    // Auto-dismiss after 1.5-2 seconds
    genericToastTimeout = setTimeout(() => {
      genericToast.classList.add('hidden');
      genericToastTimeout = null;
    }, 1800);
  }, 10);
}

// Show task start toast
function showTaskStartToast() {
  showGenericToast('🎯', 'Task starting', '', playTaskStartSound);
  
  // Trigger glow pulse animation on timer ring
  if (timerRingProgress) {
    // Remove class if already present to retrigger animation
    timerRingProgress.classList.remove('ring-pulse');
    
    // Force reflow to ensure class removal is processed
    void timerRingProgress.offsetWidth;
    
    // Add class to trigger animation
    timerRingProgress.classList.add('ring-pulse');
    
    // Remove class after animation completes
    setTimeout(() => {
      if (timerRingProgress) {
        timerRingProgress.classList.remove('ring-pulse');
      }
    }, 700);
  }
}

// Removed break start toast function

// Show distraction toast notification
function showDistractionToast() {
  if (!distractionToast) return;
  
  // Play sound
  playDistractionSound();
  
  // Clear any existing timeout (replace previous toast)
  if (distractionToastTimeout) {
    clearTimeout(distractionToastTimeout);
    distractionToastTimeout = null;
  }
  
  // Hide toast first (if visible) to reset animation
  distractionToast.classList.add('hidden');
  
  // Show toast after a brief delay to ensure clean animation
  setTimeout(() => {
    distractionToast.classList.remove('hidden');
    
    // Auto-dismiss after 2 seconds
    distractionToastTimeout = setTimeout(() => {
      distractionToast.classList.add('hidden');
      distractionToastTimeout = null;
    }, 2000);
  }, 10);
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
  
  // Update vertical segmented buttons
  document.querySelectorAll('.insight-selector-btn').forEach(btn => {
    if (btn.dataset.tab === tab) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Also update legacy tab buttons if they exist (for compatibility) - only Patterns now
  document.querySelectorAll('.panel-tabs button[data-tab="patterns"]').forEach(t => {
    if (t.dataset.tab === tab) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });
  
  // Also update any old journal-tab classes if they exist (for compatibility)
  document.querySelectorAll('.journal-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  
  // Show/hide clear button based on active tab (Patterns or Feedback)
  const insightsClearBtn = document.getElementById('insightsClearBtn');
  if (insightsClearBtn) {
    const shouldShow = tab === 'patterns' || tab === 'feedback';
    if (shouldShow) {
      insightsClearBtn.classList.remove('hidden');
      insightsClearBtn.dataset.activeTab = tab; // Store current tab for clear action
    } else {
      insightsClearBtn.classList.add('hidden');
    }
  }
  
  if (tab === 'patterns') {
    renderPatterns();
  } else if (tab === 'feedback') {
    renderFeedback();
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
  
  const entriesHtml = reflections.map(r => {
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
  
  journalContent.innerHTML = entriesHtml;
  
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
  
  // Format distraction label for display
  const formatLabel = (label) => {
    if (!label) return '';
    return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  };
  
  const entriesHtml = distractions.map(d => {
    const date = new Date(d.date);
    const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    return `
      <div class="journal-entry distraction" data-entry-id="${d.id}" data-entry-type="distraction">
        <div class="journal-entry-header">
          <div class="journal-entry-title">⚠️ ${formatLabel(d.reason)}</div>
          <div class="journal-entry-date">${dateStr}</div>
        </div>
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
  
  journalContent.innerHTML = entriesHtml;
  
  // Add event listeners for edit/delete buttons
  attachJournalEntryListeners('distraction');
}

function renderPatterns() {
  const reflections = journal.reflections || [];
  const distractions = journal.distractions || [];
  
  if (reflections.length === 0 && distractions.length === 0) {
    journalContent.innerHTML = '<div class="journal-empty">Not enough data yet. Keep using the app to see patterns!</div>';
    return;
  }
  
  let html = '';
  
  // 1. TOP DISTRACTIONS (Top 3 only)
  const distractionCounts = {};
  distractions.forEach(d => {
    if (d.reason) {
      distractionCounts[d.reason] = (distractionCounts[d.reason] || 0) + 1;
    }
  });
  
  const topDistractions = Object.entries(distractionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  if (topDistractions.length > 0) {
    const formatDistractionLabel = (label) => {
      if (!label) return '';
      const capitalized = label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
      return capitalized.length > 24 ? capitalized.substring(0, 21) + '...' : capitalized;
    };
    
    const maxDistraction = Math.max(...Object.values(distractionCounts), 1);
    
    // Generate actionable tip based on top distraction
    const topDistractionReason = topDistractions[0][0];
    let distractionTip = '';
    if (topDistractionReason.toLowerCase().includes('phone')) {
      distractionTip = '💡 Try putting your phone in another room or turning it off before you start!';
    } else if (topDistractionReason.toLowerCase().includes('boredom')) {
      distractionTip = '💡 Try breaking your task into smaller parts or setting a timer to make it more fun!';
    } else if (topDistractionReason.toLowerCase().includes('hunger') || topDistractionReason.toLowerCase().includes('thirst')) {
      distractionTip = '💡 Have a snack and water ready before you start focusing!';
    } else {
      distractionTip = '💡 Try to notice when this happens and take a deep breath to refocus!';
    }
    
    html += `
      <div class="pattern-section pattern-distractions">
        <div class="pattern-title">⚠️ Top distractions</div>
        ${topDistractions.map(([reason, count]) => `
          <div class="pattern-bar">
            <div class="pattern-label">${formatDistractionLabel(reason)}</div>
            <div class="pattern-fill-bg">
              <div class="pattern-fill distraction" style="width: ${(count/maxDistraction)*100}%"></div>
            </div>
            <div class="pattern-count">${count}</div>
          </div>
        `).join('')}
        <div class="pattern-takeaway">${distractionTip}</div>
      </div>
    `;
  }
  
  // 2. AVERAGE PRODUCTIVITY (numeric value only)
  const ratings = reflections
    .filter(r => r.rating !== null && r.rating !== undefined)
    .map(r => r.rating);
  
  if (ratings.length > 0) {
    const avgRating = parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1));
    let productivityTip = '';
    if (avgRating >= 4.5) {
      productivityTip = '💡 Amazing! You\'re doing great! Keep using what works for you!';
    } else if (avgRating >= 3.5) {
      productivityTip = '💡 Good job! Try using your top focus helpers more often to boost your score!';
    } else if (avgRating >= 2.5) {
      productivityTip = '💡 You can improve! Try putting away distractions and finding a quiet space!';
    } else {
      productivityTip = '💡 Don\'t give up! Try shorter focus sessions and take breaks when needed!';
    }
    
    html += `
      <div class="pattern-section">
        <div class="pattern-title">⭐ Average Productivity</div>
        <div class="pattern-metric">${avgRating.toFixed(1)} / 5</div>
        <div class="pattern-takeaway">${productivityTip}</div>
      </div>
    `;
  }
  
  // 3. WHAT HELPS YOU FOCUS (Top 2-3)
  const helperCounts = {};
  reflections.forEach(r => {
    r.helpers?.forEach(h => {
      helperCounts[h] = (helperCounts[h] || 0) + 1;
    });
  });
  
  const topHelpers = Object.entries(helperCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
  
  if (topHelpers.length > 0) {
    const maxHelper = Math.max(...Object.values(helperCounts), 1);
    
    const topHelperName = topHelpers[0][0];
    let helperTip = '';
    if (topHelperName.toLowerCase().includes('music')) {
      helperTip = '💡 Music helps you focus! Try listening to it again next time!';
    } else if (topHelperName.toLowerCase().includes('quiet') || topHelperName.toLowerCase().includes('space')) {
      helperTip = '💡 A quiet space works great for you! Find a calm spot before starting!';
    } else if (topHelperName.toLowerCase().includes('phone') || topHelperName.toLowerCase().includes('no phone')) {
      helperTip = '💡 Putting your phone away helps! Try it again next session!';
    } else if (topHelperName.toLowerCase().includes('timer')) {
      helperTip = '💡 Using a timer keeps you on track! Keep using it!';
    } else {
      helperTip = `💡 "${topHelperName}" works well for you! Try using it more often!`;
    }
    
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
        <div class="pattern-takeaway">${helperTip}</div>
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
        // Reflections and Distractions tabs removed - only Patterns remains
        // This code path should not be reached, but kept for safety
        persistAll();
        renderJournalTab('patterns');
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
// Journal tabs in right panel
// Vertical segmented buttons for Insights panel
document.querySelectorAll('.insight-selector-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    document.querySelectorAll('.insight-selector-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Render the selected tab
    renderJournalTab(btn.dataset.tab);
  });
});

// Legacy tab support (if any old tabs exist) - only Patterns now
document.querySelectorAll('.panel-tabs button[data-tab="patterns"]').forEach(tab => {
  tab.addEventListener('click', () => {
    // Update active state
    document.querySelectorAll('.panel-tabs button[data-tab="patterns"]').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Also update vertical selector if it exists
    const selectorBtn = document.querySelector(`.insight-selector-btn[data-tab="${tab.dataset.tab}"]`);
    if (selectorBtn) {
      document.querySelectorAll('.insight-selector-btn').forEach(b => b.classList.remove('active'));
      selectorBtn.classList.add('active');
    }
    
    // Render the selected tab
    renderJournalTab(tab.dataset.tab);
  });
});

// Initialize Insights panel to show Patterns by default
function initInsightsPanel() {
  if (!journalContent) return;
  
  // Set active button (prefer vertical selector, fallback to legacy tabs)
  const patternsBtn = document.querySelector('.insight-selector-btn[data-tab="patterns"]') || 
                       document.querySelector('.panel-tabs button[data-tab="patterns"]');
  if (patternsBtn) {
    if (patternsBtn.classList.contains('insight-selector-btn')) {
      document.querySelectorAll('.insight-selector-btn').forEach(b => b.classList.remove('active'));
    } else {
      document.querySelectorAll('.panel-tabs button[data-tab]').forEach(t => t.classList.remove('active'));
    }
    patternsBtn.classList.add('active');
  }
  
  // Ensure Clear button is initialized
  const insightsClearBtn = document.getElementById('insightsClearBtn');
  if (insightsClearBtn) {
    insightsClearBtn.classList.remove('hidden');
  }
  
  renderJournalTab('patterns');
}

// Journal tabs now in right panel (no modal needed)
// Remove modal handlers - journal is now inline

// Clear button handlers
// Clear Insights button (for Patterns and Feedback)
const insightsClearBtn = document.getElementById('insightsClearBtn');
const clearInsightsModal = document.getElementById('clearInsightsModal');
const clearInsightsCancelBtn = document.getElementById('clearInsightsCancelBtn');
const clearInsightsConfirmBtn = document.getElementById('clearInsightsConfirmBtn');

if (insightsClearBtn && clearInsightsModal) {
  insightsClearBtn.addEventListener('click', () => {
    const activeTab = insightsClearBtn.dataset.activeTab;
    if (activeTab === 'patterns' || activeTab === 'feedback') {
      // Update modal text based on active tab
      const modalTitle = document.getElementById('clearInsightsModalTitle');
      const modalMessage = document.getElementById('clearInsightsModalMessage');
      
      if (activeTab === 'feedback') {
        if (modalTitle) modalTitle.textContent = 'Clear feedback?';
        if (modalMessage) modalMessage.textContent = 'This will permanently clear your feedback data.';
      } else if (activeTab === 'patterns') {
        if (modalTitle) modalTitle.textContent = 'Clear this data?';
        if (modalMessage) modalMessage.textContent = 'This will permanently clear the data shown in this panel.';
      }
      
      openModal(clearInsightsModal);
      // Set focus on Cancel button
      if (clearInsightsCancelBtn) {
        setTimeout(() => clearInsightsCancelBtn.focus(), 100);
      }
    }
  });
}

if (clearInsightsCancelBtn && clearInsightsModal) {
  clearInsightsCancelBtn.addEventListener('click', () => {
    closeModal(clearInsightsModal);
  });
}

if (clearInsightsConfirmBtn && clearInsightsModal) {
  clearInsightsConfirmBtn.addEventListener('click', () => {
    const activeTab = insightsClearBtn?.dataset.activeTab;
    closeModal(clearInsightsModal);
    
    if (activeTab === 'patterns') {
      // Clear patterns data (reflections and distractions)
      journal.reflections = [];
      journal.distractions = [];
      persistAll();
      renderJournalTab('patterns'); // Use renderJournalTab to ensure proper re-render
      updateBadgeCount(); // Recalculate badges
    } else if (activeTab === 'feedback') {
      // Clear feedback data (stats that affect feedback)
      stats.todayMinutes = 0;
      stats.distractionCount = 0;
      stats.distractionReasons = {};
      persistAll();
      renderJournalTab('feedback'); // Use renderJournalTab to ensure proper re-render and button state
    }
  });
}

/* =========================
   Panel Tabs (Right Panel Only - Left panel has no tabs)
========================= */
// Left panel no longer has tabs - Tasks are always visible
// Tab switching only applies to right panel journal tabs (handled in renderJournalTab)
// Removed old tab switching code that was affecting all panels

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

// BADGES array declared at top of file (after LS constant, around line 946)

// Earned badges storage: { badgeId: count } - badges can be earned multiple times
// earnedBadges declared at top of file

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
  
  // Count unique tasks completed
  const uniqueTasks = new Set(blocks.filter(b => b.completed).map(b => b.name));
  const uniqueTaskCount = uniqueTasks.size;
  
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
      case 'multi_tasker':
        threshold = 5;
        shouldAward = uniqueTaskCount >= (currentCount + 1) * threshold;
        break;
      case 'focus_master':
        threshold = 25;
        shouldAward = completedSessions >= (currentCount + 1) * threshold;
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
const clearBadgesBtn = document.getElementById('clearBadgesBtn');
const clearBadgesModal = document.getElementById('clearBadgesModal');
const clearBadgesCancelBtn = document.getElementById('clearBadgesCancelBtn');
const clearBadgesConfirmBtn = document.getElementById('clearBadgesConfirmBtn');

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
  
  // Update Clear button visibility based on earned badges
  const hasEarnedBadges = Object.keys(earnedBadges).some(id => earnedBadges[id] > 0);
  if (clearBadgesBtn) {
    if (hasEarnedBadges) {
      clearBadgesBtn.classList.remove('hidden');
    } else {
      clearBadgesBtn.classList.add('hidden');
    }
  }
  
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

// Clear badges button handler
if (clearBadgesBtn) {
  clearBadgesBtn.addEventListener('click', () => {
    if (clearBadgesModal) {
      const modalBackdrop = document.getElementById('modalBackdrop');
      if (modalBackdrop) modalBackdrop.classList.remove('hidden');
      clearBadgesModal.classList.remove('hidden');
    }
  });
}

// Clear badges confirmation handlers
if (clearBadgesCancelBtn) {
  clearBadgesCancelBtn.addEventListener('click', () => {
    if (clearBadgesModal) {
      clearBadgesModal.classList.add('hidden');
      const modalBackdrop = document.getElementById('modalBackdrop');
      if (modalBackdrop) modalBackdrop.classList.add('hidden');
    }
  });
}

if (clearBadgesConfirmBtn) {
  clearBadgesConfirmBtn.addEventListener('click', () => {
    // Clear all earned badges
    earnedBadges = {};
    
    // Save cleared state
    saveBadges();
    
    // Update UI
    renderBadges();
    updateBadgeCount();
    
    // Close modals
    if (clearBadgesModal) {
      clearBadgesModal.classList.add('hidden');
    }
    if (badgesModal) {
      badgesModal.classList.add('hidden');
    }
    const modalBackdrop = document.getElementById('modalBackdrop');
    if (modalBackdrop) modalBackdrop.classList.add('hidden');
    
    // Sync to Firebase if logged in
    if (firestore && firebaseAuth?.currentUser) {
      syncToFirestore();
    }
  });
}

// Load badges on init
loadBadges();



/* =========================
   App Feedback (Google Forms)
========================= */
(function(){
  const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSfcd2h_L_fyMFawaEmGzFOs1lkbektMQFROi6GuMGR9h8JVZw/viewform?usp=publish-editor';
  
  const openBtn = document.getElementById('appFeedbackBtn');
  
  if(!openBtn) return;

  openBtn.addEventListener('click', () => {
    window.open(GOOGLE_FORM_URL, '_blank');
  });
})();



