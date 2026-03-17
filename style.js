
:root{
  --bg1:#0f172a;
  --bg2:#1e293b;
  --card:rgba(255,255,255,.09);
  --card2:rgba(255,255,255,.12);
  --text:#ffffff;
  --muted:rgba(255,255,255,.7);
  --border:rgba(255,255,255,.16);
  --primary:#3b82f6;
  --primary-light:#60a5fa;
  --primary-dark:#2563eb;
  --accent:#8b5cf6;
  --accent-light:#a78bfa;
  --success:#22c55e;
  --success-light:#4ade80;
  --danger:#ef4444;
  --danger-light:#f87171;
  --warning:#f59e0b;
  --warning-light:#fbbf24;
  --shadow:0 20px 60px rgba(0,0,0,.4);
  --radius:18px;
}

*{box-sizing:border-box}
html,body{height:100%}

/* === Auth Screen === */
.auth-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: 
    radial-gradient(60% 60% at 50% 30%, rgba(139,92,246,.25), transparent 60%),
    radial-gradient(55% 55% at 20% 20%, rgba(59,130,246,.20), transparent 65%),
    radial-gradient(70% 70% at 70% 75%, rgba(168,85,247,.22), transparent 60%),
    linear-gradient(135deg, #0f172a, #1e293b, #334155);
  z-index: 10000;
  padding: 20px;
}

.auth-screen.hidden {
  display: none;
}

.auth-card {
  width: min(420px, 100%);
  background: rgba(20,20,30,0.95);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 28px;
  padding: 40px 32px;
  text-align: center;
  box-shadow: 0 30px 100px rgba(0,0,0,0.5);
  backdrop-filter: blur(20px);
}

.auth-logo {
  font-size: 64px;
  margin-bottom: 16px;
}

.auth-title {
  font-size: 36px;
  font-weight: 900;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.auth-subtitle {
  font-size: 16px;
  color: rgba(255,255,255,0.6);
  margin: 0 0 20px;
}

.auth-desc {
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  margin: 0 0 28px;
  line-height: 1.5;
}

.auth-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 12px;
  border: none;
}

.auth-btn.primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 8px 24px rgba(59,130,246,0.35);
}

.auth-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(59,130,246,0.45);
}

.auth-btn.secondary {
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.12);
}

.auth-btn.secondary:hover {
  background: rgba(255,255,255,0.10);
}

.auth-footer {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  margin: 16px 0 0;
}

/* Auth Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.auth-input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.06);
  color: #fff;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s ease;
}

.auth-input::placeholder {
  color: rgba(255,255,255,0.4);
}

.auth-input:focus {
  border-color: rgba(59,130,246,0.6);
}

.auth-error {
  padding: 10px 14px;
  border-radius: 10px;
  background: rgba(239,68,68,0.15);
  border: 1px solid rgba(239,68,68,0.3);
  color: #fca5a5;
  font-size: 13px;
  text-align: left;
}

.auth-error.hidden {
  display: none;
}

.auth-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(255,255,255,0.5);
}

.auth-link {
  background: none;
  border: none;
  color: #60a5fa;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.auth-link:hover {
  text-decoration: underline;
}

.forgot-link {
  display: block;
  margin-top: 12px;
  color: rgba(255,255,255,0.5);
}

.forgot-link:hover {
  color: #60a5fa;
}

.reset-success {
  padding: 12px 16px;
  border-radius: 10px;
  background: rgba(34,197,94,0.15);
  border: 1px solid rgba(34,197,94,0.3);
  color: #86efac;
  font-size: 13px;
  margin-top: 12px;
}

.reset-success.hidden {
  display: none;
}


.auth-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* === User Menu === */
.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(0,0,0,0.25);
  color: var(--text);
  cursor: pointer;
  transition: all 0.15s ease;
}

.user-btn:hover {
  background: rgba(0,0,0,0.35);
}

.user-avatar {
  font-size: 18px;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  min-width: 200px;
  background: rgba(20,20,30,0.98);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.4);
  overflow: hidden;
  z-index: 100;
}

.user-dropdown.hidden {
  display: none;
}

.user-dropdown-header {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.user-dropdown-email {
  display: none; /* Hidden for privacy - kids may not have emails */
  font-size: 13px;
  color: rgba(255,255,255,0.6);
}

.user-dropdown-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.85);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.user-dropdown-item:hover {
  background: rgba(255,255,255,0.06);
}

/* App container */
.app-container.hidden {
  display: none;
}
body{
  margin:0;
  font-family:Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial;
  color:var(--text);
  overflow-x:hidden;
}

.aurora-bg{
  position:fixed; inset:0;
  background:
    radial-gradient(60% 60% at 50% 30%, rgba(139,92,246,.28), transparent 60%),
    radial-gradient(55% 55% at 20% 20%, rgba(59,130,246,.22), transparent 65%),
    radial-gradient(70% 70% at 70% 75%, rgba(168,85,247,.24), transparent 60%),
    linear-gradient(135deg, var(--bg1), var(--bg2), #334155);
  filter: saturate(1.15);
  z-index:-2;
}
.aurora-bg::after{
  content:"";
  position:absolute; inset:-40px;
  background-image:radial-gradient(rgba(255,255,255,.16) 1px, transparent 1px);
  background-size:32px 32px;
  opacity:.18;
  transform:rotate(8deg);
}

.top-bar{
  display:flex; align-items:center; justify-content:space-between;
  padding:18px 22px;
}
.brand{display:flex; flex-direction:column; gap:2px}
.brand-title{font-size:26px; font-weight:800; letter-spacing:.3px}
.brand-sub{font-size:12px; color:var(--muted)}
.top-actions{display:flex; gap:10px}
.ghost-btn{
  border:1px solid var(--border);
  background:rgba(0,0,0,.20);
  color:var(--text);
  padding:10px 14px;
  border-radius:999px;
  cursor:pointer;
}
.ghost-btn:hover{background:rgba(0,0,0,.28)}

.manual-btn {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(99, 102, 241, 0.35)) !important;
  border: 2px solid rgba(167, 139, 250, 0.7) !important;
  color: rgba(237, 233, 254, 1) !important;
  font-weight: 700 !important;
  padding: 10px 18px !important;
  font-size: 14px !important;
  box-shadow: 0 3px 12px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.2);
  transition: all 0.2s ease;
}

.manual-btn:hover {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(99, 102, 241, 0.5)) !important;
  border-color: rgba(167, 139, 250, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
  transform: translateY(-2px);
  box-shadow: 0 5px 16px rgba(139, 92, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.3);
}

.reset-btn {
  border: 1px solid rgba(239, 68, 68, 0.4);
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  padding: 10px 16px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.reset-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.6);
  transform: translateY(-1px);
}

.reset-btn:active {
  transform: translateY(0px);
  background: rgba(239, 68, 68, 0.3);
}

.layout{
  display:grid;
  grid-template-columns: 330px minmax(460px,1fr) 330px;
  gap:18px;
  padding:0 18px 24px;
  align-items:start;
}

.panel{
  background:var(--card);
  border:1px solid var(--border);
  border-radius:var(--radius);
  padding:16px;
  box-shadow:var(--shadow);
  backdrop-filter: blur(12px);
}

/* Left Panel - Tasks Section (Pink Highlight) */
.panel:first-of-type {
  margin-left: 20px;
  padding: 20px 20px;
  background: linear-gradient(135deg, 
    rgba(236, 72, 153, 0.08) 0%, 
    rgba(251, 113, 133, 0.06) 50%,
    rgba(236, 72, 153, 0.08) 100%);
  border: 1px solid rgba(236, 72, 153, 0.2);
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.15), var(--shadow);
}

/* Right Panel - Insights Section (Lavender Highlight) */
.panel:last-of-type {
  margin-right: 20px;
  padding: 20px 20px;
  background: linear-gradient(135deg, 
    rgba(139, 92, 246, 0.08) 0%, 
    rgba(236, 72, 153, 0.06) 50%,
    rgba(139, 92, 246, 0.08) 100%);
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: 0 8px 32px rgba(139, 92, 246, 0.15), var(--shadow);
}
.center{
  padding:10px 6px;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:14px;
}
.trophy{font-size:38px; opacity:.95}

h2{margin:0 0 12px 0; font-size:18px; font-weight:800}
.mt{margin-top:14px}

.card{
  background:rgba(0,0,0,.18);
  border:1px solid var(--border);
  border-radius:14px;
  padding:12px;
}

/* Insights rows */
.ins-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 8px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  font-size: 14px;
}
.ins-row:last-child {
  border-bottom: none;
}
.ins-row span:first-child {
  color: rgba(255,255,255,0.7);
}
.ins-row span:last-child {
  font-weight: 600;
  color: #fff;
}

.row{display:flex; align-items:center}
.gap{gap:10px}
.end{justify-content:flex-end}
.center-text{text-align:center}
.space-between{justify-content:space-between}
.center{justify-content:flex-start}
.muted{color:var(--muted)}
.tiny{font-size:12px}
.mt8{margin-top:8px}
.mt12{margin-top:12px}

.input{
  width:100%;
  border:1px solid var(--border);
  background:rgba(255,255,255,.06);
  border-radius:12px;
  padding:10px 12px;
  color:var(--text);
  outline:none;
}
.input::placeholder{color:rgba(255,255,255,.45)}
.label{font-size:12px; color:var(--muted); display:block; margin-top:6px}

.btn{
  border:1px solid var(--border);
  background:rgba(255,255,255,.06);
  color:var(--text);
  padding:10px 12px;
  border-radius:12px;
  cursor:pointer;
  font-weight:700;
}
.btn:hover{background:rgba(255,255,255,.10)}
.btn.primary{background:rgba(59,130,246,.95); border-color:rgba(59,130,246,.95)}
.btn.primary:hover{filter:brightness(1.05)}

.btn.destructive {
  background: rgba(239, 68, 68, 0.95);
  border-color: rgba(239, 68, 68, 0.95);
  color: white;
}

.btn.destructive:hover {
  background: rgba(220, 38, 38, 0.95);
  border-color: rgba(220, 38, 38, 0.95);
  filter: brightness(1.05);
}

/* Add Task Section - Primary CTA (Top Priority) */
.add-task-section {
  margin-bottom: 24px;
}

.add-task-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 52px;
  padding: 16px 24px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(99, 102, 241, 0.35), rgba(139, 92, 246, 0.35)) !important;
  border: 2px solid rgba(167, 139, 250, 0.7) !important;
  border-radius: 16px;
  box-shadow: 0 3px 12px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.2);
  font-weight: 700;
  font-size: 16px;
  color: rgba(237, 233, 254, 1) !important;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.add-task-icon {
  font-size: 20px;
  animation: sparkle 2s ease-in-out infinite;
}

.add-task-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease;
}

.add-task-btn:hover::before {
  left: 100%;
}

.add-task-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(99, 102, 241, 0.5), rgba(139, 92, 246, 0.5)) !important;
  border-color: rgba(167, 139, 250, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
  box-shadow: 0 5px 16px rgba(139, 92, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.3);
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(5deg); }
}

/* Helper text under Add Task button */
.add-task-helper {
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
  font-style: italic;
  transition: opacity 0.3s ease;
}

.add-task-helper.hidden {
  display: none;
}

/* Daily Goal Card - Secondary Setting (Reduced Visual Weight) */
.daily-goal-card {
  margin-top: 20px;
  margin-bottom: 24px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.daily-goal-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.daily-goal-helper {
  margin-top: 8px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}
.btn.secondary{background:rgba(255,255,255,.06)}
.btn.danger{background:rgba(239,68,68,.92); border-color:rgba(239,68,68,.92)}
.btn.tiny{padding:8px 10px; border-radius:10px; font-size:12px}

.subhead{margin:14px 0 8px; font-weight:800; font-size:13px; color:rgba(255,255,255,.85)}
.list{display:flex; flex-direction:column; gap:10px}
.empty{margin-top:10px; color:rgba(255,255,255,.55); font-size:12px}

.block{
  display:flex; 
  flex-direction: column;
  gap: 10px;
  border:2px solid var(--border);
  background:rgba(0,0,0,.18);
  border-radius:16px;
  padding: 14px 16px;
  transition: all 0.2s ease;
}

.block:hover {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.25);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.block.draggable-block {
  cursor: grab;
}
.block.draggable-block:hover {
  background: rgba(0,0,0,.25);
}
.block.dragging {
  opacity: 0.5;
  cursor: grabbing;
}
.block.block-active {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.1);
}
.block-left{
  display:flex; 
  flex-direction:row; 
  align-items:flex-start; 
  gap:8px; 
  min-width:0;
  width: 100%;
}
.block-drag-handle {
  cursor: grab;
  color: rgba(255, 255, 255, 0.4);
  font-size: 16px;
  user-select: none;
  padding-top: 2px;
  transition: color 0.2s ease;
}
.block-drag-handle:hover {
  color: rgba(255, 255, 255, 0.7);
}
.block.dragging .block-drag-handle {
  cursor: grabbing;
}
.block-title{
  font-weight:800; 
  font-size: 15px;
  white-space:normal; 
  word-wrap: break-word;
  flex: 1;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.95);
}
.block-meta{font-size:12px; color:var(--muted)}
.block-actions{
  display:flex; 
  gap:6px; 
  align-items:center; 
  position: relative; 
  flex-wrap: wrap;
  width: 100%;
  margin-top: 4px;
}

.block-edit-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
}

.block-edit-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.9);
}

.block-edit-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: rgba(20, 20, 30, 0.98);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 4px;
  min-width: 160px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.block-edit-menu.hidden {
  display: none;
}

.block-menu-item {
  width: 100%;
  padding: 10px 14px;
  text-align: left;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.15s ease;
}

.block-menu-item:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.block-menu-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.block-menu-item.danger {
  color: #fca5a5;
}

.block-menu-item.danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.15);
}

.pill{
  padding:8px 10px;
  border-radius:12px;
  border:1px solid var(--border);
  background:rgba(255,255,255,.06);
  cursor:pointer;
  font-size:12px;
  font-weight:800;
}
.pill.primary{background:rgba(59,130,246,.20); border-color:rgba(59,130,246,.40)}
.pill.danger{background:rgba(239,68,68,.20); border-color:rgba(239,68,68,.40)}

/* Override pill styles when kid-friendly-btn is applied */
.kid-friendly-btn.pill {
  padding: 10px 16px;
  border-radius: 10px;
}

/* Kid-friendly buttons - larger, clearer, with emojis */
.kid-friendly-btn {
  min-height: 38px;
  padding: 9px 14px;
  font-size: 16px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 10px;
  border: none;
  white-space: nowrap;
  cursor: pointer;
  line-height: 1.2;
}

.kid-friendly-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
}

.kid-friendly-btn:active {
  transform: translateY(0);
  filter: brightness(0.95);
}

.kid-friendly-btn.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.kid-friendly-btn.primary:hover {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.kid-friendly-btn.danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.kid-friendly-btn.danger:hover {
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.kid-friendly-btn:not(.primary):not(.danger) {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
}

.kid-friendly-btn:not(.primary):not(.danger):hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.kid-friendly-btn span {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
}

/* Smaller button variant */
.kid-friendly-btn.small {
  min-height: 32px;
  padding: 6px 12px;
  font-size: 14px;
  gap: 4px;
}

.kid-friendly-btn.small span {
  font-size: 12px;
}

/* === Elegant Timer Card === */
.timer-card{
  width: min(480px, 92%);
  background: linear-gradient(145deg, rgba(30,30,45,0.95), rgba(20,20,35,0.98));
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 32px;
  padding: 28px 24px;
  box-shadow: 0 25px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
  backdrop-filter: blur(20px);
  text-align: center;
}

.timer-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.timer-label {
  font-weight: 800;
  letter-spacing: 0.12em;
  font-size: 11px;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
}

.timer-badge {
  font-size: 18px;
}

/* Circular Progress Ring */
.timer-ring-container {
  position: relative;
  width: 220px;
  height: 220px;
  margin: 0 auto 24px;
}

.timer-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.timer-ring-bg {
  fill: none;
  stroke: rgba(255,255,255,0.06);
  stroke-width: 8;
}

.timer-ring-progress {
  fill: none;
  stroke: url(#timerGradient);
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 565.48;
  stroke-dashoffset: 565.48;
  transition: stroke-dashoffset 0.3s ease;
  filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0));
}

/* Glow pulse animation for task start */
@keyframes ringGlowPulse {
  0% {
    filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0)) drop-shadow(0 0 0 rgba(139, 92, 246, 0));
  }
  50% {
    filter: drop-shadow(0 0 12px rgba(59, 130, 246, 0.6)) drop-shadow(0 0 20px rgba(139, 92, 246, 0.4));
  }
  100% {
    filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0)) drop-shadow(0 0 0 rgba(139, 92, 246, 0));
  }
}

.timer-ring-progress.ring-pulse {
  animation: ringGlowPulse 0.7s ease-out;
}

.timer-display-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.timer-big {
  font-size: 56px;
  font-weight: 900;
  letter-spacing: -2px;
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.timer-sub {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin-top: 4px;
}

/* Timer Controls */
.timer-controls {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.timer-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 16px;
  border: none;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.timer-btn .timer-btn-icon {
  font-size: 14px;
}

.timer-btn.primary {
  background: rgba(59, 130, 246, 0.15);
  color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
}

.timer-btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
}

.timer-btn.secondary {
  background: rgba(255,255,255,0.04);
  color: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.08);
}

.timer-btn.secondary:hover:not(:disabled) {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.12);
}

.timer-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Distracted Button - Primary Action (Below Timer) */
.distracted-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 18px 24px;
  border-radius: 20px;
  border: 2px solid rgba(239, 68, 68, 0.4);
  background: linear-gradient(135deg, 
    rgba(239, 68, 68, 0.25) 0%, 
    rgba(251, 113, 133, 0.2) 50%,
    rgba(239, 68, 68, 0.25) 100%);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin: 24px 0 20px 0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3), 0 0 30px rgba(239, 68, 68, 0.15);
}

.distracted-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease;
}

.distracted-btn:hover:not(:disabled)::before {
  left: 100%;
}

.distracted-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, 
    rgba(239, 68, 68, 0.35) 0%, 
    rgba(251, 113, 133, 0.3) 50%,
    rgba(239, 68, 68, 0.35) 100%);
  border-color: rgba(239, 68, 68, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.2);
  filter: brightness(1.1);
}

.distracted-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
}

.distracted-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: none;
}

.distracted-icon {
  font-size: 22px;
  flex-shrink: 0;
}

.distracted-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.distracted-label {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
}

.distracted-subtext {
  font-size: 11px;
  font-weight: 500;
  opacity: 0.85;
  font-style: italic;
}

/* Distraction feedback animation */
.distracted-btn.feedback {
  animation: distractionPulse 0.6s ease;
}

@keyframes distractionPulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3), 0 0 30px rgba(239, 68, 68, 0.15);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 10px 30px rgba(239, 68, 68, 0.5), 0 0 50px rgba(239, 68, 68, 0.3);
  }
}



/* Template Buttons */
.template-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.template-btn {
  flex: 1;
  min-width: 120px;
  padding: 8px 12px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.12));
  border: 1px solid rgba(59, 130, 246, 0.35);
  border-radius: 8px;
  color: var(--primary-light);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.template-btn:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(139, 92, 246, 0.25));
  border-color: rgba(59, 130, 246, 0.6);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

/* Subject Breakdown in Insights */
#subjectBreakdown {
  margin-top: 16px;
}

#subjectBreakdown .ins-row {
  padding: 8px 4px;
  font-size: 13px;
}

/* Deadline Reminders */
#deadlineReminders {
  margin-top: 16px;
}

#deadlineReminders .ins-row.urgent {
  color: var(--danger-light);
  font-weight: 700;
  background: rgba(239, 68, 68, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid var(--danger);
}

#deadlineReminders .ins-row.soon {
  color: var(--warning-light);
  font-weight: 600;
  background: rgba(245, 158, 11, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid var(--warning);
}

#deadlineReminders .ins-row.normal {
  color: var(--success-light);
  background: rgba(34, 197, 94, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  border-left: 3px solid var(--success);
}

/* Block with Subject/Deadline styling */
.block-meta {
  font-size: 12px;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

/* College Application Styles */
.college-section {
  padding: 4px;
}

.college-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.college-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 4px;
  margin-bottom: 4px;
}

.checklist-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checklist-item label {
  cursor: pointer;
  font-size: 13px;
  flex: 1;
}

.college-item, .activity-item, .essay-item, .test-prep-item, .recommendation-item {
  transition: all 0.2s ease;
}

.college-item:hover, .activity-item:hover, .essay-item:hover, .test-prep-item:hover, .recommendation-item:hover {
  transform: translateX(4px);
}

.btn.small {
  padding: 6px 12px;
  font-size: 12px;
}

.input.small {
  padding: 4px 8px;
  font-size: 12px;
}

/* Status Card */
/* Distraction Toast Notification */
.distraction-toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  z-index: 9999;
  width: min(400px, 90%);
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.12));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(245, 158, 11, 0.3);
  border-radius: 16px;
  padding: 14px 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(245, 158, 11, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}

.distraction-toast:not(.hidden) {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
  pointer-events: auto;
}

.distraction-toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.distraction-toast-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.distraction-toast-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.distraction-toast-title {
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.3;
}

.distraction-toast-message {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.4;
}

.status-card {
  width: min(480px, 92%);
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 20px;
  padding: 18px 24px;
  margin-top: 16px;
}

.status-icon {
  font-size: 32px;
}

.status-content {
  text-align: left;
}

.status-title {
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 2px;
}

.status-sub {
  color: rgba(255,255,255,0.6);
  font-size: 13px;
}

.status-card{
  width:min(620px, 92%);
  background:rgba(255,255,255,.06);
  border:1px solid var(--border);
  border-radius:22px;
  padding:18px;
  text-align:center;
}
.status-title{font-weight:900; font-size:28px}
.status-sub{color:var(--muted); margin-top:6px}

/* === Elegant Now Card === */
.now-card {
  background: linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.10) 100%);
  border: 1px solid rgba(59,130,246,0.25);
  border-radius: 16px;
  padding: 16px;
  position: relative;
  overflow: hidden;
}

.now-card.active {
  background: linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(139,92,246,0.15) 100%);
  border-color: rgba(59,130,246,0.4);
}

.now-card.running {
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% { border-color: rgba(59,130,246,0.4); }
  50% { border-color: rgba(59,130,246,0.7); }
}

.now-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.now-icon {
  font-size: 20px;
}

.now-state {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255,255,255,0.7);
}

.now-state.running {
  color: rgba(59,130,246,1);
}

.now-block-name {
  font-weight: 800;
  font-size: 18px;
  margin-bottom: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.now-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.now-meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.now-meta-label {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.now-meta-value {
  font-size: 16px;
  font-weight: 700;
}

.now-progress {
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
}

.now-progress-fill {
  height: 100%;
  width: 0%;
  background: linear-gradient(90deg, rgba(59,130,246,0.9), rgba(139,92,246,0.9));
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Old style kept for compatibility */
.now-title{font-weight:900; font-size:16px}

.progress{
  width:100%;
  height:10px;
  background:rgba(255,255,255,.08);
  border-radius:999px;
  overflow:hidden;
  margin:10px 0;
}
.progress-fill{
  height:100%;
  width:0%;
  background:rgba(59,130,246,.9);
  border-radius:999px;
}

.task-list{display:flex; flex-direction:column; gap:10px; margin-top:10px}
.task{
  display:flex; 
  flex-direction: column;
  gap: 10px;
  border:1px solid var(--border);
  background:rgba(0,0,0,.16);
  border-radius:14px;
  padding:12px;
}
.task-left{
  display:flex; 
  align-items:flex-start; 
  gap:10px; 
  min-width:0;
  width: 100%;
}
.task-name-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}
.checkbox{
  width:18px; height:18px; border-radius:6px;
  border:1px solid var(--border);
  display:flex; align-items:center; justify-content:center;
  cursor:pointer;
  background:rgba(255,255,255,.04);
  flex:0 0 auto;
}
.checkbox.checked{background:rgba(59,130,246,.9); border-color:rgba(59,130,246,.9)}
.checkbox.checked::after{content:"✓"; font-weight:900; font-size:12px}
.task-name{
  font-weight:700; 
  font-size: 15px;
  white-space:normal; 
  word-wrap: break-word;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.95);
}
.task-meta{font-size:12px; color:var(--muted); margin-top: 2px;}
.task-actions{
  display:flex; 
  align-items:center; 
  gap:6px; 
  flex-wrap: wrap;
  width: 100%;
  margin-top: 4px;
}

.backdrop{
  position:fixed; inset:0;
  background:rgba(0,0,0,.55);
  backdrop-filter: blur(6px);
  z-index:50;
}
.modal{
  position:fixed;
  top:50%; left:50%;
  transform:translate(-50%,-50%);
  width:min(520px, 92%);
  background:rgba(20,20,28,.96);
  border:1px solid rgba(255,255,255,.18);
  border-radius:20px;
  padding:20px;
  z-index:60;
  box-shadow:0 30px 90px rgba(0,0,0,.5);
}

.modal-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Manual Modal Styles */
.manual-modal {
  max-width: 600px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 0;
}

.manual-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  position: relative;
}

.manual-header h3 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #fff;
}

.manual-modal .manual-body {
  padding: 24px;
  display: block;
}

.manual-intro {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.manual-intro p {
  margin: 0 0 16px;
  font-size: 15px;
  color: rgba(255,255,255,0.8);
  line-height: 1.6;
}

.manual-section {
  margin-bottom: 28px;
}

.manual-section:last-of-type {
  margin-bottom: 0;
}

.manual-section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
}

.manual-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.15);
  border-radius: 10px;
  flex-shrink: 0;
}

.manual-section-header h4 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
}

.manual-section p {
  margin: 0;
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
  padding-left: 52px;
}

.manual-list {
  margin: 8px 0 0;
  padding-left: 52px;
  list-style: none;
}

.manual-list li {
  margin-bottom: 8px;
  font-size: 14px;
  color: rgba(255,255,255,0.7);
  line-height: 1.6;
  padding-left: 20px;
  position: relative;
}

.manual-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: rgba(139, 92, 246, 0.8);
  font-weight: bold;
}

.manual-list li strong {
  color: rgba(255,255,255,0.9);
  font-weight: 600;
}

.manual-tips {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid rgba(255,255,255,0.1);
  background: rgba(139, 92, 246, 0.08);
  border-radius: 12px;
  padding: 20px;
}

.manual-tips h4 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.manual-tips .manual-list {
  padding-left: 0;
}

.manual-tips .manual-list li {
  padding-left: 20px;
}

.manual-tips kbd {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
}

.manual-footer {
  padding: 20px 24px 24px;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .manual-modal {
    max-width: calc(100% - 20px);
    max-height: 90vh;
  }
  
  .manual-header {
    padding: 20px;
  }
  
  .manual-header h3 {
    font-size: 20px;
  }
  
  .manual-body {
    padding: 20px;
  }
  
  .manual-section {
    margin-bottom: 24px;
  }
  
  .manual-section p,
  .manual-list {
    padding-left: 48px;
  }
  
  .manual-icon {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }
}

/* Task name input - make it visually dominant */
#taskNameInput {
  font-size: 16px;
  padding: 14px 16px;
  font-weight: 500;
}
.choice{
  width:100%;
  text-align:left;
  padding:12px;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.14);
  background:rgba(255,255,255,.06);
  color:var(--text);
  cursor:pointer;
  margin-top:10px;
  font-weight:800;
}
.choice:hover{background:rgba(255,255,255,.10)}
.hidden{display:none}

/* === TABLET (max 1080px) === */
@media (max-width: 1080px){
  .layout{
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 0 14px 24px;
  }
  .center{ order: -1; } /* Timer at top on tablet/mobile */
  .panel{ padding: 14px; }
  .panel:last-of-type {
    margin-right: 12px;
    padding: 16px 16px;
  }
  .panel:first-of-type {
    margin-left: 12px;
    padding: 16px 16px;
  }
}

/* === MOBILE (max 640px) === */
@media (max-width: 640px){
  /* Top bar */
  .top-bar{
    flex-wrap: wrap;
    gap: 12px;
    padding: 14px;
  }
  .brand-title{ font-size: 22px; }
  .brand-sub{ font-size: 11px; }
  .top-actions{
    width: 100%;
    justify-content: flex-end;
    gap: 8px;
  }
  .ghost-btn{
    padding: 8px 10px;
    font-size: 13px;
  }
  .sound-toggle{
    padding: 8px 10px;
    font-size: 13px;
  }

  /* Layout */
  .layout{
    gap: 12px;
    padding: 0 10px 20px;
  }
  .panel{
    padding: 12px;
    border-radius: 14px;
  }
  .panel:last-of-type {
    margin-right: 10px;
    padding: 14px 14px;
  }
  .panel:first-of-type {
    margin-left: 10px;
    padding: 14px 14px;
  }
  .insight-selector-btn {
    padding: 12px 16px;
    font-size: 13px;
  }
  .insights-title {
    font-size: 18px;
  }
  .insights-subtitle {
    font-size: 12px;
  }
  .panel-tab {
    padding: 10px 8px;
    font-size: 12px;
  }
  
  /* Timer card */
  .timer-card{
    width: 100%;
    padding: 16px;
    border-radius: 18px;
  }
  .timer-big{
    font-size: 52px;
  }
  .timer-title{
    font-size: 11px;
  }
  
  /* Timer buttons - stack on very small screens */
  .timer-card .row.center.gap{
    flex-wrap: wrap;
    gap: 8px;
  }
  .timer-card .btn{
    padding: 12px 14px;
    font-size: 14px;
    flex: 1 1 auto;
    min-width: 70px;
  }
  .distracted-btn {
    padding: 16px 20px;
    margin: 20px 0 16px 0;
  }
  .distracted-label {
    font-size: 15px;
  }
  .distracted-subtext {
    font-size: 10px;
  }
  .timer-btn {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  /* Shortcut hint - hide on mobile (no keyboard) */
  
  /* Status card */
  .status-card{
    width: 100%;
    padding: 14px;
    border-radius: 16px;
  }
  .status-title{ font-size: 22px; }
  .status-sub{ font-size: 13px; }
  
  /* Cards */
  .card{
    padding: 10px;
    border-radius: 12px;
  }
  
  /* Headings */
  h2{ font-size: 16px; margin-bottom: 10px; }
  .subhead{ font-size: 12px; }
  
  /* Buttons */
  .btn{
    padding: 10px 12px;
    font-size: 13px;
    border-radius: 10px;
  }
  .btn.tiny{
    padding: 8px 10px;
    font-size: 11px;
  }
  .pill{
    padding: 8px 10px;
    font-size: 11px;
  }
  
  /* Blocks */
  .block{
    padding: 10px;
    border-radius: 12px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .block-left{
    flex: 1 1 100%;
  }
  .block-actions{
    flex: 1 1 100%;
    justify-content: flex-start;
  }
  .block-title{ font-size: 14px; }
  .block-meta{ font-size: 11px; }
  
  /* Tasks */
  .task{
    padding: 10px;
    border-radius: 12px;
    flex-wrap: wrap;
    gap: 8px;
  }
  .task-left{
    flex: 1 1 60%;
  }
  .task-actions{
    flex: 1 1 auto;
    justify-content: flex-end;
  }
  .task-name{ font-size: 14px; }
  .task-meta{ font-size: 11px; }
  
  /* Insights */
  .ins-row{
    font-size: 13px;
    padding: 6px 0;
  }
  
  /* Auth screen mobile */
  .auth-card {
    padding: 32px 24px;
    border-radius: 24px;
  }
  .auth-logo {
    font-size: 48px;
  }
  .auth-title {
    font-size: 28px;
  }
  .auth-subtitle {
    font-size: 14px;
  }
  .auth-btn {
    padding: 14px 20px;
    font-size: 15px;
  }
  
  /* User menu mobile */
  .user-name {
    display: none;
  }
  .user-btn {
    padding: 8px 10px;
  }
  
  /* Now card mobile */
  .now-card {
    padding: 12px;
  }
  .now-block-name {
    font-size: 15px;
  }
  .now-meta {
    gap: 12px;
  }
  .now-meta-value {
    font-size: 14px;
  }
  
  /* Timer card mobile */
  .timer-card {
    padding: 20px 16px;
    border-radius: 24px;
  }
  .timer-ring-container {
    width: 180px;
    height: 180px;
    margin-bottom: 20px;
  }
  .timer-big {
    font-size: 44px;
  }
  .timer-controls {
    gap: 8px;
  }
  .timer-btn {
    padding: 12px 16px;
    font-size: 14px;
  }
  .distracted-btn {
    padding: 8px 16px;
    font-size: 12px;
  }
  .status-card {
    padding: 14px 18px;
    gap: 12px;
  }
  .status-icon {
    font-size: 28px;
  }
  .status-title {
    font-size: 16px;
  }
  .status-sub {
    font-size: 12px;
  }
  
  /* Emoji rating mobile */
  .emoji-rating-row {
    gap: 4px;
  }
  .emoji-rating {
    font-size: 24px;
    padding: 8px 10px;
  }
  
  /* Improve grid mobile */
  .improve-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }
  .improve-chip {
    padding: 8px 10px;
    font-size: 12px;
  }
  
  /* Progress bar */
  .progress{
    height: 8px;
    margin: 8px 0;
  }
  
  /* Modals - full width on mobile */
  .modal{
    width: calc(100% - 24px);
    max-height: 90vh;
    overflow-y: auto;
    padding: 14px;
    border-radius: 16px;
  }
  .modal h3{ font-size: 18px; }
  
  /* Modal card (app feedback) */
  .modal-card{
    width: calc(100% - 24px);
    max-height: 90vh;
    overflow-y: auto;
    border-radius: 16px;
  }
  .modal-head{ padding: 14px; }
  .modal-body{ padding: 0 14px 14px; }
  .modal-actions{ padding: 12px 14px; }
  
  /* Shortcuts modal */
  .shortcut-row{
    padding: 8px 10px;
  }
  .shortcut-row kbd{
    padding: 4px 8px;
    font-size: 12px;
    min-width: 50px;
  }
  .shortcut-row span{
    font-size: 13px;
  }
  
  /* Completion banner */
  .completion-banner{
    width: calc(100% - 32px);
    padding: 24px;
    border-radius: 18px;
  }
  .completion-banner .emoji{ font-size: 48px; }
  .completion-banner .title{ font-size: 22px; }
  .completion-banner .subtitle{ font-size: 14px; }
  
  /* Choice buttons in distract modal */
  .choice{
    padding: 12px;
    font-size: 14px;
  }
  
  /* Coach feedback */
  .coach-msg{ font-size: 13px; }
  .coach-tips{ font-size: 12px; }
  
  /* Now section */
  .now-title{ font-size: 14px; }
  
  /* Trophy */
  .trophy{ font-size: 30px; }
}

/* === VERY SMALL SCREENS (max 380px) === */
@media (max-width: 380px){
  .timer-big{ font-size: 44px; }
  .timer-card .btn{
    padding: 10px 8px;
    font-size: 12px;
  }
  .top-actions{
    gap: 6px;
  }
  .ghost-btn, .sound-toggle{
    padding: 6px 8px;
    font-size: 12px;
  }
  .block-actions .pill,
  .task-actions .pill{
    padding: 6px 8px;
    font-size: 10px;
  }
}


/* --- App Feedback Modal --- */
.ghost-btn{
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(0,0,0,0.25);
  color: rgba(255,255,255,0.92);
  cursor: pointer;
  font-weight: 600;
  transition: transform .08s ease, background .2s ease;
}
.ghost-btn:hover{ background: rgba(0,0,0,0.35); transform: translateY(-1px); }
.ghost-btn:active{ transform: translateY(0px); }

/* Enhanced feedback button styling */
.feedback-btn {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.35), rgba(99, 102, 241, 0.35));
  border: 2px solid rgba(167, 139, 250, 0.7);
  color: rgba(237, 233, 254, 1);
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 3px 12px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.2);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.feedback-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s ease;
}

.feedback-btn:hover::before {
  left: 100%;
}

.feedback-btn:hover {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(99, 102, 241, 0.5));
  border-color: rgba(167, 139, 250, 1);
  color: rgba(255, 255, 255, 1);
  box-shadow: 0 5px 16px rgba(139, 92, 246, 0.5), 0 0 30px rgba(139, 92, 246, 0.3);
  transform: translateY(-2px);
}

.feedback-btn:active {
  transform: translateY(0px);
  box-shadow: 0 2px 6px rgba(139, 92, 246, 0.2);
}

.modal-backdrop{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 18px;
}
.modal-backdrop.hidden{ display: none; }
.modal-card{
  width: min(560px, 96vw);
  border-radius: 18px;
  background: rgba(20,20,28,0.92);
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 20px 60px rgba(0,0,0,0.45);
  backdrop-filter: blur(10px);
  color: rgba(255,255,255,0.92);
}
.modal-head{
  display:flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 10px 16px;
}
.modal-title{
  font-size: 18px;
  font-weight: 800;
}
.modal-subtitle{
  font-size: 13px;
  opacity: .75;
  margin-top: 2px;
}
.icon-btn{
  border: 0;
  background: rgba(255,255,255,0.10);
  color: rgba(255,255,255,0.9);
  width: 34px;
  height: 34px;
  border-radius: 10px;
  cursor: pointer;
}
.icon-btn:hover{ background: rgba(255,255,255,0.16); }

.modal-body{ padding: 0 16px 14px 16px; }
.field-label{
  display:block;
  margin: 20px 0 10px;
  font-weight: 600;
  font-size: 14px;
  color: rgba(255,255,255,0.9);
}

.field-label:first-child {
  margin-top: 0;
}
.rating-row{ display:flex; gap:8px; flex-wrap: wrap; }
.pill{
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.92);
  cursor:pointer;
  font-weight:700;
}
.pill.selected{ background: rgba(59,130,246,0.35); border-color: rgba(59,130,246,0.55); }

.chip-row{ display:flex; gap:8px; flex-wrap: wrap; }
.chip{
  padding: 7px 10px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.9);
  cursor:pointer;
  font-weight:650;
  font-size: 12px;
}
.chip.selected{ background: rgba(236,72,153,0.28); border-color: rgba(236,72,153,0.45); }

.feedback-textarea{
  width: 100%;
  resize: vertical;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(255,255,255,0.06);
  color: rgba(255,255,255,0.92);
  padding: 12px 16px;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.5;
  margin-top: 8px;
  min-height: 80px;
}

.feedback-textarea:focus{ 
  border-color: rgba(59,130,246,0.6);
  background: rgba(255,255,255,0.08);
}

.checkbox-row{
  display:flex;
  gap:10px;
  align-items:center;
  margin-top: 10px;
  font-size: 12px;
  opacity: .9;
}

.modal-actions{
  display:flex;
  justify-content: flex-end;
  gap:10px;
  padding: 12px 16px 16px;
}

/* App Feedback Modal */
.app-feedback-modal{
  position:fixed; inset:0;
  display:none;
  align-items:center; justify-content:center;
  background:rgba(0,0,0,.55);
  z-index:9999;
}
.app-feedback-modal.show{display:flex;}
.app-feedback-card{
  width:min(520px,92vw);
  background:rgba(20,20,30,.95);
  border:1px solid rgba(255,255,255,.10);
  border-radius:18px;
  padding:16px;
  box-shadow:0 25px 60px rgba(0,0,0,.55);
}
.app-feedback-header{display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;}
.app-feedback-title{font-weight:700; font-size:18px; color:#fff;}
.app-feedback-close{
  border:none; background:rgba(255,255,255,.08);
  color:#fff; border-radius:10px; padding:8px 10px; cursor:pointer;
}
#appFeedbackText{
  width:100%; height:140px; resize:none;
  border-radius:14px;
  border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.06);
  color:#fff; padding:12px;
}
.app-feedback-actions{display:flex; align-items:center; justify-content:space-between; margin-top:10px; gap:10px;}
.app-feedback-status{font-size:13px; color:rgba(255,255,255,.75);}
.app-feedback-send{
  border:none;
  background:rgba(90,150,255,.95);
  color:#fff; border-radius:12px; padding:10px 14px; cursor:pointer;
}

/* Screen reader only - hide visually but keep accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Rating pills as labels for radio buttons */
.rating-row .rating-pill {
  cursor: pointer;
  transition: all 0.15s ease;
}
input[type="radio"]:checked + .rating-pill {
  background: rgba(59,130,246,0.35);
  border-color: rgba(59,130,246,0.55);
  transform: scale(1.05);
}
input[type="radio"]:focus + .rating-pill {
  box-shadow: 0 0 0 2px rgba(59,130,246,0.4);
}

/* Chips as labels for checkboxes */
.chip-row .chip {
  cursor: pointer;
  transition: all 0.15s ease;
}
input[type="checkbox"]:checked + .chip {
  background: rgba(236,72,153,0.28);
  border-color: rgba(236,72,153,0.45);
}
input[type="checkbox"]:focus + .chip {
  box-shadow: 0 0 0 2px rgba(236,72,153,0.3);
}

/* Secondary button */
.secondary-btn {
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.06);
  color: var(--text);
  cursor: pointer;
  font-weight: 600;
}
.secondary-btn:hover {
  background: rgba(255,255,255,0.10);
}

/* Primary button */
.primary-btn {
  padding: 10px 16px;
  border-radius: 12px;
  border: none;
  background: rgba(59,130,246,0.95);
  color: #fff;
  cursor: pointer;
  font-weight: 600;
}
.primary-btn:hover {
  filter: brightness(1.05);
}
.primary-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Feedback success state */
.feedback-success {
  padding: 40px 20px;
  text-align: center;
}
.feedback-success .success-emoji {
  font-size: 56px;
  margin-bottom: 12px;
}
.feedback-success .success-title {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 8px;
}
.feedback-success .success-subtitle {
  color: var(--muted);
  font-size: 15px;
}

/* === Emoji Rating === */
.emoji-rating-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin: 12px 0 24px 0;
  padding: 8px 0;
}

.emoji-rating {
  font-size: 32px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 2px solid transparent;
  background: rgba(255,255,255,0.05);
  cursor: pointer;
  transition: all 0.2s ease;
  filter: grayscale(0.5);
  opacity: 0.7;
}

.emoji-rating:hover {
  background: rgba(255,255,255,0.10);
  transform: scale(1.1);
  filter: grayscale(0);
  opacity: 1;
}

input[type="radio"]:checked + .emoji-rating {
  background: rgba(59,130,246,0.2);
  border-color: rgba(59,130,246,0.5);
  filter: grayscale(0);
  opacity: 1;
  transform: scale(1.15);
}

input[type="radio"]:focus + .emoji-rating {
  box-shadow: 0 0 0 2px rgba(59,130,246,0.4);
}

/* === Improve Chips Grid === */
.improve-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 12px 0 24px 0;
  padding: 8px 0;
}

.improve-chip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.12);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.8);
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s ease;
}

.improve-chip:hover {
  background: rgba(255,255,255,0.10);
  border-color: rgba(255,255,255,0.2);
}

input[type="checkbox"]:checked + .improve-chip {
  background: rgba(236,72,153,0.2);
  border-color: rgba(236,72,153,0.4);
  color: #fff;
}

input[type="checkbox"]:focus + .improve-chip {
  box-shadow: 0 0 0 2px rgba(236,72,153,0.3);
}

/* === Celebration Animation === */
@keyframes celebrate-pulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59,130,246,0.7); }
  50% { transform: scale(1.02); box-shadow: 0 0 40px 10px rgba(59,130,246,0.3); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59,130,246,0); }
}

@keyframes confetti-fall {
  0% { transform: translateY(-100%) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

.timer-card.celebrating {
  animation: celebrate-pulse 0.6s ease-in-out 3;
  border-color: rgba(59,130,246,0.6);
}

.confetti-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -20px;
  animation: confetti-fall 3s ease-out forwards;
}

.confetti:nth-child(odd) { border-radius: 50%; }
.confetti:nth-child(even) { border-radius: 2px; }

/* Completion banner */
.completion-banner {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  background: rgba(20,20,28,0.95);
  border: 2px solid rgba(59,130,246,0.6);
  border-radius: 24px;
  padding: 32px 48px;
  text-align: center;
  z-index: 9998;
  box-shadow: 0 30px 90px rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
  opacity: 0;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease;
}

.completion-banner.show {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
}

.completion-banner .emoji {
  font-size: 64px;
  margin-bottom: 12px;
}

.completion-banner .title {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
}

.completion-banner .subtitle {
  color: var(--muted);
  font-size: 16px;
}

/* Sound toggle in top bar */
.sound-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: rgba(0,0,0,0.20);
  color: var(--text);
  cursor: pointer;
  font-size: 14px;
}
.sound-toggle:hover { background: rgba(0,0,0,0.28); }
.sound-toggle.muted { opacity: 0.5; }

/* === Keyboard Shortcuts Modal === */
/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.25s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.25s;
  border-radius: 50%;
}

.toggle-switch input:checked + .toggle-slider {
  background-color: rgba(59, 130, 246, 0.6);
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(24px);
}

.toggle-switch:hover .toggle-slider {
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
}

.shortcut-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: rgba(255,255,255,0.04);
  border-radius: 10px;
}

.shortcut-row kbd {
  background: rgba(59,130,246,0.25);
  border: 1px solid rgba(59,130,246,0.4);
  border-radius: 6px;
  padding: 6px 12px;
  font-family: inherit;
  font-weight: 700;
  font-size: 13px;
  min-width: 60px;
  text-align: center;
}

.shortcut-row span {
  color: var(--muted);
  font-size: 14px;
}

/* Shortcut hint tooltip on timer */

/* === Settings Modal === */
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
}

.settings-form.scrollable {
  max-height: calc(80vh - 120px);
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  margin-right: -8px;
}

.settings-form.scrollable::-webkit-scrollbar {
  width: 6px;
}

.settings-form.scrollable::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.settings-form.scrollable::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.settings-form.scrollable::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.settings-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.settings-section-title {
  font-size: 15px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 4px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: rgba(255,255,255,0.04);
  border-radius: 10px;
}

.setting-row label {
  font-size: 14px;
  color: rgba(255,255,255,0.85);
}

.setting-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.setting-input input[type="number"] {
  width: 70px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: rgba(0,0,0,0.3);
  color: #fff;
  font-size: 14px;
  text-align: center;
}

.setting-input span {
  color: var(--muted);
  font-size: 13px;
  min-width: 30px;
}

.setting-toggle input[type="checkbox"] {
  width: 44px;
  height: 24px;
  appearance: none;
  background: rgba(255,255,255,0.15);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background 0.2s ease;
}

.setting-toggle input[type="checkbox"]::before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.2s ease;
}

.setting-toggle input[type="checkbox"]:checked {
  background: #3b82f6;
}

.setting-toggle input[type="checkbox"]:checked::before {
  transform: translateX(20px);
}


.timer-ring-progress {
  stroke: url(#timerGradient); /* Purple gradient for focus */
}

.timer-ring-indicator {
  transition: opacity 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(96, 165, 250, 0.5));
}

/* === Journaling Feature === */
.journal-textarea {
  width: 100%;
  min-height: 70px;
  resize: vertical;
  font-family: inherit;
}

.distract-reasons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.distract-reasons .choice {
  width: 100%;
  padding: 10px 12px;
  font-size: 13px;
  transition: all 0.2s ease;
}

.distract-reasons .choice.selected {
  background: rgba(59, 130, 246, 0.3);
  border-color: #3b82f6;
  transform: scale(1.02);
}

.distract-other-input {
  transition: opacity 0.2s ease, max-height 0.2s ease;
}

.distract-other-input.hidden {
  display: none;
}

.distract-other-input input {
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
  font-family: inherit;
}

.distract-other-input input:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(255, 255, 255, 0.08);
}

.journal-note-section {
  padding-top: 12px;
  border-top: 1px solid var(--border);
}

/* Reflection Modal */
.reflection-section {
  margin-bottom: 8px;
}

.productivity-rating {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.rating-btn {
  flex: 1;
  padding: 12px 8px;
  font-size: 24px;
  background: rgba(255,255,255,0.05);
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rating-btn:hover {
  background: rgba(255,255,255,0.1);
  transform: scale(1.05);
}

.rating-btn.selected {
  border-color: #3b82f6;
  background: rgba(59,130,246,0.2);
}

.star-rating {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  justify-content: center;
}

.star-btn {
  padding: 8px;
  font-size: 28px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: color 0.15s ease, transform 0.15s ease;
  line-height: 1;
  user-select: none;
}

.star-btn.filled {
  color: #ffd700;
}

.star-btn.hover-preview {
  color: rgba(255, 215, 0, 0.8);
}

.star-btn:hover {
  transform: scale(1.1);
}

.focus-helpers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.helper-chip {
  padding: 8px 12px;
  font-size: 13px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--muted);
}

.helper-chip:hover {
  background: rgba(255,255,255,0.1);
}

.helper-chip.selected {
  background: rgba(34,197,94,0.2);
  border-color: rgba(34,197,94,0.5);
  color: #86efac;
}

/* Journal Modal */
.journal-modal {
  max-width: 560px;
  max-height: 80vh;
}

.journal-tabs {
  display: flex;
  gap: 4px;
  background: rgba(0,0,0,0.3);
  padding: 3px;
  border-radius: 10px;
  margin-bottom: 16px;
}

/* Right panel journal tabs use same styling as left panel tabs */
.panel-tabs .journal-tab {
  flex: 1;
  padding: 10px 14px;
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.panel-tabs .journal-tab:hover {
  background: rgba(255,255,255,0.05);
  color: #fff;
}

.panel-tabs .journal-tab.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(139, 92, 246, 0.3));
  color: #fff;
}

.journal-tab {
  flex: 1;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.journal-tab:hover {
  background: rgba(255,255,255,0.05);
}

.journal-tab.active {
  background: rgba(59,130,246,0.2);
  color: #60a5fa;
}

.journal-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}

.journal-header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.journal-clear-btn {
  font-size: 12px;
  padding: 6px 12px;
}

.journal-clear-btn.hidden {
  display: none;
}

.journal-content {
  max-height: 500px;
  overflow-y: auto;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Ensure content doesn't hug edges */
.journal-content > * {
  margin-left: 0;
  margin-right: 0;
}

/* Journal Entry Spacing */
.journal-entry {
  margin-bottom: 16px;
}

.journal-entry:last-child {
  margin-bottom: 0;
}

/* Empty State Styling */
.journal-empty {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  font-style: italic;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

/* Feedback Content Styling */
.feedback-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feedback-section {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 16px;
}

.feedback-title {
  font-size: 16px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12px;
}

.feedback-insight {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 8px;
}

.feedback-takeaway {
  font-size: 14px;
  color: rgba(139, 92, 246, 0.9);
  line-height: 1.6;
  margin-top: 12px;
  padding: 10px 12px;
  background: rgba(139, 92, 246, 0.1);
  border-left: 3px solid rgba(139, 92, 246, 0.5);
  border-radius: 6px;
}

.pattern-takeaway {
  font-size: 13px;
  color: rgba(139, 92, 246, 0.9);
  line-height: 1.6;
  margin-top: 12px;
  padding: 10px 12px;
  background: rgba(139, 92, 246, 0.1);
  border-left: 3px solid rgba(139, 92, 246, 0.5);
  border-radius: 6px;
}

.journal-content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 8px;
}

.journal-content-header h3 {
  margin: 0;
  flex: 1;
}

.insights-clear-btn {
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(220, 38, 38, 0.1));
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: rgba(239, 68, 68, 0.95);
  border-radius: 10px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.1);
}

.insights-clear-btn:hover {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.18));
  border-color: rgba(239, 68, 68, 0.55);
  color: rgba(239, 68, 68, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.2);
}

.insights-clear-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(239, 68, 68, 0.15);
}

.insights-clear-btn.hidden {
  display: none;
}

.feedback-metric {
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  margin: 8px 0 4px 0;
  line-height: 1;
}

/* Top Distractions Section - More Prominent */
.pattern-section.pattern-distractions {
  background: rgba(239, 68, 68, 0.06);
  border-color: rgba(239, 68, 68, 0.15);
  margin-top: 8px;
}

.pattern-section.pattern-distractions .pattern-title {
  color: rgba(248, 113, 113, 0.95);
  border-bottom-color: rgba(239, 68, 68, 0.2);
}

.journal-empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--muted);
  font-size: 14px;
}

.journal-entry {
  padding: 14px;
  background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(59,130,246,0.05));
  border-radius: 12px;
  margin-bottom: 10px;
  border-left: 3px solid var(--primary);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.journal-entry.distraction {
  border-left-color: var(--danger);
  background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(239,68,68,0.05));
}

.journal-entry:hover {
  transform: translateX(8px);
  background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(59,130,246,0.08));
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.journal-entry-actions {
  position: absolute;
  right: -120px;
  top: 14px;
  display: flex;
  gap: 6px;
  transition: right 0.3s ease;
  z-index: 10;
  background: rgba(15, 23, 42, 0.95);
  padding: 4px 8px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.journal-entry:hover .journal-entry-actions {
  right: 8px;
}

.journal-action-btn {
  padding: 6px 12px;
  font-size: 11px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.journal-action-btn.edit-btn {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.journal-action-btn.edit-btn:hover {
  background: rgba(59, 130, 246, 0.3);
  transform: scale(1.05);
}

.journal-action-btn.delete-btn {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.journal-action-btn.delete-btn:hover {
  background: rgba(239, 68, 68, 0.3);
  transform: scale(1.05);
}

.journal-entry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-right: 140px; /* Make room for action buttons */
  min-height: 24px;
}

.journal-entry-title {
  font-weight: 600;
  font-size: 14px;
  color: #fff;
}

.journal-entry-date {
  font-size: 12px;
  color: var(--muted);
}

.journal-entry-body {
  font-size: 13px;
  color: rgba(255,255,255,0.8);
  line-height: 1.5;
}

.journal-entry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.journal-tag {
  padding: 4px 10px;
  background: rgba(59,130,246,0.15);
  border-radius: 12px;
  font-size: 11px;
  color: #93c5fd;
}

.journal-tag.helper {
  background: rgba(34,197,94,0.15);
  color: #86efac;
}

.journal-tag.rating {
  background: rgba(251,191,36,0.15);
  color: #fcd34d;
}

/* Pattern Stats */

/* Insights Panel - Improved Layout & Spacing */

.pattern-section {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.pattern-title {
  font-size: 16px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 14px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.pattern-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding: 4px 0;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.pattern-label {
  min-width: 120px;
  max-width: 120px;
  font-size: 13px;
  color: var(--muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pattern-fill-bg {
  flex: 1;
  min-width: 0;
  height: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
}

.pattern-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.pattern-fill.distraction {
  background: linear-gradient(90deg, #ef4444, #f97316);
}

.pattern-count {
  min-width: 30px;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
}

.pattern-metric {
  font-size: 32px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin: 8px 0;
  line-height: 1.2;
}

/* Prominent Journal Button */
.journal-btn-prominent {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(59, 130, 246, 0.3));
  border: 1px solid rgba(139, 92, 246, 0.5);
  border-radius: 20px;
  color: #c4b5fd;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.journal-btn-prominent:hover {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.5), rgba(59, 130, 246, 0.5));
  border-color: rgba(139, 92, 246, 0.8);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

/* === Panel Tabs (Left Panel) === */
/* Insights Header for Right Panel */
.insights-header {
  margin-bottom: 24px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.3);
}

.insights-title {
  font-size: 22px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #fff 0%, rgba(236, 72, 153, 0.9) 50%, rgba(139, 92, 246, 0.9) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.3px;
  line-height: 1.2;
}

.insights-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-style: italic;
  line-height: 1.4;
}

/* Vertical Segmented Buttons for Insights */
.insights-selector {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;
  margin-top: 24px;
}

.insight-selector-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border: 2px solid rgba(167, 139, 250, 0.5);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.2);
}

.insight-selector-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.insight-selector-btn:hover::before {
  left: 100%;
}

.insight-selector-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(167, 139, 250, 0.8);
  color: rgba(255, 255, 255, 0.9);
  transform: translateX(4px);
  box-shadow: 0 3px 12px rgba(139, 92, 246, 0.3);
}

.insight-selector-btn.active {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(59, 130, 246, 0.25));
  border-color: rgba(167, 139, 250, 0.7);
  color: rgba(237, 233, 254, 1);
  box-shadow: 0 3px 12px rgba(139, 92, 246, 0.4), 0 0 20px rgba(139, 92, 246, 0.2);
}

.insight-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.insight-label {
  flex: 1;
}

/* Legacy panel-tabs (kept for compatibility, but not used) */
.panel-tabs {
  display: flex;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 28px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  gap: 8px;
}

.panel-tab {
  flex: 1;
  padding: 14px 18px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.65);
  font-size: 13px;
  font-weight: 700;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  letter-spacing: 0.2px;
  white-space: nowrap;
  min-width: 0;
}

.panel-tab:hover {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.9);
  transform: translateY(-1px);
}

.panel-tab.active {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.4));
  color: #fff;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  border: 1px solid rgba(59, 130, 246, 0.5);
  font-weight: 800;
}

/* Panel content - only used for right panel journal tabs now */
.panel-content {
  display: none;
}

.panel-content.active {
  display: block;
  animation: panelFadeIn 0.3s ease;
}

/* Left panel Tasks no longer uses panel-content - always visible */

@keyframes panelFadeIn {
  from { 
    opacity: 0;
    transform: translateY(-5px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

/* === Badges / Gamification === */
.badges-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 14px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(245, 158, 11, 0.2));
  border: 1px solid rgba(251, 191, 36, 0.4);
  border-radius: 20px;
  color: #fcd34d;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.badges-btn:hover {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.3));
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
}

.badges-btn #badgeCount {
  background: rgba(251, 191, 36, 0.3);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

/* Badges Modal */
.badges-modal {
  max-width: 500px;
}

.badges-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding: 4px;
}

.badge-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px;
  background: rgba(255,255,255,0.03);
  border-radius: 12px;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.badge-card.locked {
  opacity: 0.4;
  filter: grayscale(100%);
}

.badge-card.unlocked {
  border-color: rgba(251, 191, 36, 0.5);
  background: rgba(251, 191, 36, 0.1);
}

.badge-card.unlocked .badge-icon {
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.badge-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.badge-name {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  text-align: center;
  margin-bottom: 4px;
}

.badge-desc {
  font-size: 10px;
  color: var(--muted);
  text-align: center;
  line-height: 1.3;
}

.badge-date {
  font-size: 9px;
  color: rgba(251, 191, 36, 0.8);
  margin-top: 6px;
}

/* Badge Toast Notification */
.badge-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.95), rgba(245, 158, 11, 0.95));
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(251, 191, 36, 0.4);
  z-index: 10000;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.badge-toast.show {
  transform: translateX(-50%) translateY(0);
}

.badge-toast-icon {
  font-size: 32px;
  animation: toastBounce 0.6s ease;
}

@keyframes toastBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

.badge-toast-content {
  color: #1a1a2e;
}

.badge-toast-title {
  font-size: 12px;
  font-weight: 600;
  opacity: 0.8;
}

.badge-toast-name {
  font-size: 16px;
  font-weight: 700;
}

/* Mobile adjustments for badges */
@media (max-width: 640px) {
  .badges-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .badge-icon {
    font-size: 28px;
  }
  
  .badges-btn {
    padding: 6px 10px;
    font-size: 13px;
  }
}


/* Mobile adjustments */
@media (max-width: 640px) {
  .distract-reasons {
    grid-template-columns: 1fr;
  }
  
  .productivity-rating {
    gap: 4px;
  }
  
  .rating-btn {
    padding: 10px 6px;
    font-size: 20px;
  }
  
  .focus-helpers {
    gap: 6px;
  }
  
  .helper-chip {
    padding: 6px 10px;
    font-size: 12px;
  }
}

/* === Demo Mode === */
.auth-btn.demo {
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  border: none;
  color: #fff;
}

.auth-btn.demo:hover {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0;
  color: rgba(255,255,255,0.3);
  font-size: 12px;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.1);
}

.demo-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%);
  color: #fff;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  font-size: 14px;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.demo-banner.hidden {
  display: none;
}

.demo-clear-btn {
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: #fff;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
}

.demo-clear-btn:hover {
  background: rgba(255,255,255,0.3);
}

/* Adjust app when demo banner is visible */
.app-container.demo-mode {
  padding-top: 50px;
}

.demo-help-btn {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.demo-help-btn:hover {
  background: rgba(255,255,255,0.25);
}

/* Demo Welcome Modal */
.demo-modal {
  width: min(480px, 92%);
  max-height: 75vh;
  padding: 0;
  overflow-y: auto;
}

.modal-close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255,255,255,0.2);
  color: #fff;
  border-radius: 50%;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.2s ease;
}

.modal-close-btn:hover {
  background: rgba(255,255,255,0.3);
}

.demo-welcome-header {
  padding: 28px 24px 24px;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.demo-welcome-icon {
  font-size: 56px;
  margin-bottom: 12px;
  display: block;
}

.demo-welcome-header h2 {
  margin: 0 0 8px 0;
  font-size: 26px;
  font-weight: 800;
  color: #fff;
}

.demo-welcome-sub {
  margin: 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.7);
}

.demo-steps {
  padding: 24px 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.demo-step {
  display: flex;
  gap: 16px;
  align-items: flex-start;
}

.demo-step-num {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  flex-shrink: 0;
}

.demo-step-content {
  flex: 1;
}

.demo-step-content {
  flex: 1;
}

.demo-step-content strong {
  display: block;
  font-size: 15px;
  margin-bottom: 6px;
  color: #fff;
  font-weight: 700;
}

.demo-step-content p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.demo-step-content .highlight {
  background: rgba(139,92,246,0.2);
  color: #a78bfa;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

/* Removed demo-tips section for minimal design */

.demo-modal-footer {
  padding: 20px 24px 24px;
  text-align: center;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.demo-modal-footer .btn {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 700;
}

/* Mobile adjustments for demo modal */
@media (max-width: 640px) {
  .demo-modal {
    max-width: calc(100% - 20px);
    max-height: 80vh;
    margin: 10px;
  }
  
  .demo-welcome-header {
    padding: 24px 20px 20px;
  }
  
  .demo-welcome-icon {
    font-size: 48px;
    margin-bottom: 10px;
  }
  
  .demo-welcome-header h2 {
    font-size: 22px;
  }
  
  .demo-welcome-sub {
    font-size: 14px;
  }
  
  .demo-steps {
    padding: 20px;
    gap: 16px;
  }
  
  .demo-step-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }
  
  .demo-step-content strong {
    font-size: 14px;
  }
  
  .demo-step-content p {
    font-size: 13px;
  }
  
  .demo-modal-footer {
    padding: 18px 20px 20px;
  }
  
  .demo-modal-footer .btn {
    padding: 12px;
    font-size: 15px;
  }
}
