# How to Build Analytics for DeepFocus

This guide covers building analytics features directly in your app and analyzing collected data.

---

## Part 1: Building Analytics Features in the App

### Option A: Using Chart.js (Recommended - Easy & Beautiful)

#### Step 1: Add Chart.js Library

Add to `app.html` `<head>`:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
```

#### Step 2: Add Chart Containers to HTML

Add to `app.html` in the Insights tab section:
```html
<!-- Insights Tab Content -->
<div class="panel-content" id="panelInsights">
  <!-- Existing stats -->
  <div class="card">
    <div class="ins-row"><span>📌 Today</span><span><span id="todayMinutes2">0</span> min</span></div>
    <div class="ins-row"><span>🗓️ 7 Days</span><span><span id="weekMinutes2">0</span> min</span></div>
    <div class="ins-row"><span>🔥 Streak</span><span><span id="streakCount2">0</span></span></div>
    <div class="ins-row"><span>😵 Distractions</span><span><span id="distractionCount2">0</span></span></div>
  </div>
  
  <!-- NEW: Analytics Charts -->
  <div class="card mt12">
    <div class="subhead">📈 Daily Focus Trend</div>
    <canvas id="dailyFocusChart" style="max-height: 200px;"></canvas>
  </div>
  
  <div class="card mt12">
    <div class="subhead">📊 Subject Distribution</div>
    <canvas id="subjectChart" style="max-height: 200px;"></canvas>
  </div>
  
  <div class="card mt12">
    <div class="subhead">⏰ Time of Day Patterns</div>
    <canvas id="timePatternChart" style="max-height: 200px;"></canvas>
  </div>
  
  <div id="subjectBreakdown"></div>
  <div id="deadlineReminders"></div>
</div>
```

#### Step 3: Add Chart Rendering Functions

Add to `script.js`:

```javascript
// Chart instances
let dailyFocusChart = null;
let subjectChart = null;
let timePatternChart = null;

// Render Daily Focus Trend Chart
function renderDailyFocusChart() {
  const ctx = document.getElementById('dailyFocusChart');
  if (!ctx) return;
  
  // Get last 7 days data
  const last7Days = getLast7DaysHistory();
  const today = dayKey();
  
  // Prepare data
  const labels = [];
  const data = [];
  
  // Last 7 days
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateKey = dayKey(date);
    labels.push(date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
    
    if (dateKey === today) {
      data.push(stats.todayMinutes || 0);
    } else {
      const dayData = last7Days.find(d => d.date === dateKey);
      data.push(dayData ? dayData.minutes : 0);
    }
  }
  
  // Destroy existing chart if it exists
  if (dailyFocusChart) dailyFocusChart.destroy();
  
  dailyFocusChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Focus Minutes',
        data: data,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 15
          }
        }
      }
    }
  });
}

// Render Subject Distribution Chart
function renderSubjectChart() {
  const ctx = document.getElementById('subjectChart');
  if (!ctx) return;
  
  // Calculate subject minutes from completed blocks
  const subjectMinutes = {};
  blocks.filter(b => b.completed && b.subject).forEach(block => {
    const minutes = block.minutes || 0;
    subjectMinutes[block.subject] = (subjectMinutes[block.subject] || 0) + minutes;
  });
  
  if (Object.keys(subjectMinutes).length === 0) {
    if (subjectChart) subjectChart.destroy();
    return;
  }
  
  const labels = Object.keys(subjectMinutes).map(s => SUBJECT_LABELS[s] || s);
  const data = Object.values(subjectMinutes);
  const colors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(34, 197, 94, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(168, 85, 247, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(14, 165, 233, 0.8)'
  ];
  
  if (subjectChart) subjectChart.destroy();
  
  subjectChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors.slice(0, labels.length)
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: {
              size: 11
            }
          }
        }
      }
    }
  });
}

// Render Time Pattern Chart
function renderTimePatternChart() {
  const ctx = document.getElementById('timePatternChart');
  if (!ctx) return;
  
  // Group sessions by hour of day
  const hourlyData = Array(24).fill(0);
  const hourlyCounts = Array(24).fill(0);
  
  blocks.filter(b => b.completed && b.createdAt).forEach(block => {
    const date = new Date(block.createdAt);
    const hour = date.getHours();
    hourlyData[hour] += block.minutes || 0;
    hourlyCounts[hour]++;
  });
  
  // Calculate average minutes per hour
  const avgMinutes = hourlyData.map((total, i) => 
    hourlyCounts[i] > 0 ? Math.round(total / hourlyCounts[i]) : 0
  );
  
  const labels = Array.from({length: 24}, (_, i) => {
    const hour = i % 12 || 12;
    const period = i < 12 ? 'AM' : 'PM';
    return `${hour}${period}`;
  });
  
  if (timePatternChart) timePatternChart.destroy();
  
  timePatternChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Avg Minutes per Session',
        data: avgMinutes,
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 5
          }
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            font: {
              size: 9
            }
          }
        }
      }
    }
  });
}

// Update renderInsights to include charts
function renderInsights() {
  // ... existing code ...
  
  // Render charts
  renderDailyFocusChart();
  renderSubjectChart();
  renderTimePatternChart();
}
```

---

## Part 2: Advanced Analytics Features

### Focus Score Calculation

Add to `script.js`:

```javascript
function calculateFocusScore() {
  // Factors:
  // 1. Consistency (streak) - 30%
  // 2. Completion rate - 25%
  // 3. Distraction rate - 20%
  // 4. Daily goal achievement - 15%
  // 5. Improvement trend - 10%
  
  const goal = parseInt(localStorage.getItem(LS.GOAL) || "60", 10);
  const streak = stats.streak || 0;
  const todayMinutes = stats.todayMinutes || 0;
  const distractionCount = stats.distractionCount || 0;
  
  // 1. Consistency score (0-30)
  const consistencyScore = Math.min(30, (streak / 7) * 30);
  
  // 2. Completion rate (0-25)
  const totalSessions = blocks.filter(b => b.completed).length;
  const completedSessions = blocks.filter(b => b.completed && b.minutes > 0).length;
  const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
  const completionScore = (completionRate / 100) * 25;
  
  // 3. Distraction rate (0-20) - lower distractions = higher score
  const avgDistractions = totalSessions > 0 ? distractionCount / totalSessions : 0;
  const distractionScore = Math.max(0, 20 - (avgDistractions * 2));
  
  // 4. Daily goal achievement (0-15)
  const goalAchievement = goal > 0 ? Math.min(100, (todayMinutes / goal) * 100) : 0;
  const goalScore = (goalAchievement / 100) * 15;
  
  // 5. Improvement trend (0-10) - compare last 7 days to previous 7 days
  const last7Days = getLast7DaysHistory();
  const last7Total = last7Days.reduce((sum, d) => sum + (d.minutes || 0), 0) + todayMinutes;
  const previous7Days = stats.dailyHistory.slice(-14, -7);
  const previous7Total = previous7Days.reduce((sum, d) => sum + (d.minutes || 0), 0);
  const improvement = previous7Total > 0 ? ((last7Total - previous7Total) / previous7Total) * 100 : 0;
  const improvementScore = Math.min(10, Math.max(0, (improvement / 20) * 10 + 5));
  
  const totalScore = Math.round(consistencyScore + completionScore + distractionScore + goalScore + improvementScore);
  
  return {
    score: Math.min(100, Math.max(0, totalScore)),
    breakdown: {
      consistency: Math.round(consistencyScore),
      completion: Math.round(completionScore),
      distractions: Math.round(distractionScore),
      goal: Math.round(goalScore),
      improvement: Math.round(improvementScore)
    }
  };
}

// Display Focus Score in Insights
function renderFocusScore() {
  const scoreData = calculateFocusScore();
  const scoreEl = document.getElementById('focusScore');
  if (!scoreEl) return;
  
  scoreEl.innerHTML = `
    <div class="card mt12">
      <div class="subhead">💯 Focus Score</div>
      <div style="text-align: center; padding: 20px;">
        <div style="font-size: 48px; font-weight: 800; background: linear-gradient(135deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
          ${scoreData.score}
        </div>
        <div class="tiny muted mt8">Out of 100</div>
        <div class="mt12" style="font-size: 11px; color: rgba(255,255,255,0.6);">
          Consistency: ${scoreData.breakdown.consistency} • 
          Completion: ${scoreData.breakdown.completion} • 
          Focus: ${scoreData.breakdown.distractions} • 
          Goal: ${scoreData.breakdown.goal} • 
          Growth: ${scoreData.breakdown.improvement}
        </div>
      </div>
    </div>
  `;
}
```

---

## Part 3: Export Analytics Data

### Export Function for Users

Add to `script.js`:

```javascript
function exportAnalyticsData() {
  const analyticsData = {
    user_id: firebaseAuth?.currentUser?.uid || 'anonymous',
    export_date: new Date().toISOString(),
    stats: {
      total_sessions: blocks.filter(b => b.completed).length,
      total_minutes: stats.dailyHistory.reduce((sum, d) => sum + (d.minutes || 0), 0) + stats.todayMinutes,
      current_streak: stats.streak || 0,
      longest_streak: Math.max(...(stats.dailyHistory.map(d => d.streak || 0))),
      average_session_duration: calculateAverageSessionDuration(),
      focus_score: calculateFocusScore().score
    },
    daily_history: stats.dailyHistory,
    subject_breakdown: calculateSubjectBreakdown(),
    time_patterns: calculateTimePatterns(),
    distraction_analysis: {
      total_distractions: stats.distractionCount || 0,
      top_reasons: Object.entries(stats.distractionReasons || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([reason, count]) => ({ reason, count }))
    }
  };
  
  // Download as JSON
  const blob = new Blob([JSON.stringify(analyticsData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `deepfocus-analytics-${dayKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function calculateAverageSessionDuration() {
  const completedBlocks = blocks.filter(b => b.completed);
  if (completedBlocks.length === 0) return 0;
  const total = completedBlocks.reduce((sum, b) => sum + (b.minutes || 0), 0);
  return Math.round(total / completedBlocks.length);
}

function calculateSubjectBreakdown() {
  const breakdown = {};
  blocks.filter(b => b.completed && b.subject).forEach(block => {
    breakdown[block.subject] = (breakdown[block.subject] || 0) + (block.minutes || 0);
  });
  return breakdown;
}

function calculateTimePatterns() {
  const patterns = {
    morning: 0, // 6 AM - 12 PM
    afternoon: 0, // 12 PM - 6 PM
    evening: 0, // 6 PM - 12 AM
    night: 0 // 12 AM - 6 AM
  };
  
  blocks.filter(b => b.completed && b.createdAt).forEach(block => {
    const date = new Date(block.createdAt);
    const hour = date.getHours();
    const minutes = block.minutes || 0;
    
    if (hour >= 6 && hour < 12) patterns.morning += minutes;
    else if (hour >= 12 && hour < 18) patterns.afternoon += minutes;
    else if (hour >= 18 && hour < 24) patterns.evening += minutes;
    else patterns.night += minutes;
  });
  
  return patterns;
}
```

---

## Part 4: Using Existing Export Scripts

You already have `export-research-data.js` for Firebase data export:

```bash
# Export to JSON
npm run export:json

# Export to CSV
npm run export:csv
```

Then analyze using:
- Excel/Google Sheets (see `SIMPLE_ANALYSIS_GUIDE.md`)
- Python (see `ANALYZE_DATA.md`)
- R (see `PAPER_PUBLICATION_GUIDE.md`)

---

## Quick Start: Add Basic Charts

1. **Add Chart.js** to `app.html`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
   ```

2. **Add chart containers** to Insights tab

3. **Add chart rendering functions** to `script.js`

4. **Call render functions** in `renderInsights()`

---

## Next Steps

1. Start with **Daily Focus Trend** chart (easiest)
2. Add **Focus Score** calculation
3. Add **Export Analytics** button
4. Expand with more visualizations as needed

Need help implementing any specific chart? Let me know!
