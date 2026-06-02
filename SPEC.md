# AI Gesture Translator - Specification

## 1. Project Overview

**Project Name:** AI Gesture Translator  
**Type:** Web Application (Single Page App)  
**Core Functionality:** Translate and analyze gesture-based communication using AI sentiment analysis to understand the emotional tone of gestures.  
**Target Users:** Communication specialists, accessibility advocates, language learners, and teams working on gesture-based AI systems.  
**Tagline:** "Breaking Language Barriers with AI"  
**Powered by:** Rustam Ex KWK Creatives

---

## 2. Visual & Rendering Specification

### Layout Structure
- **Header:** Fixed top bar with app title and GitHub connection status
- **Main Content Area:**
  - Left panel (40%): PR input and configuration
  - Right panel (60%): Visualization results
- **Responsive:** Collapses to single column on mobile (< 768px)

### Visual Style
- **Theme:** Dark modern terminal-inspired aesthetic
- **Color Palette:**
  - Background: `#0d1117` (GitHub dark)
  - Surface: `#161b22` (card backgrounds)
  - Border: `#30363d`
  - Primary accent: `#58a6ff` (links/highlights)
  - Success: `#3fb950`
  - Warning: `#d29922`
  - Danger: `#f85149`
  - Text primary: `#e6edf3`
  - Text secondary: `#8b949e`
- **Typography:** JetBrains Mono for code/data, Inter for UI text
- **Animations:** Smooth fade-in for results (300ms), progress indicator for analysis

### Charts & Visualizations
1. **Sentiment Donut Chart** - Overall distribution (Positive/Neutral/Negative)
2. **Score Bar Chart** - Individual PR scores on a -1 to +1 scale
3. **Trend Line Chart** - Sentiment over time (last 10 PRs)
4. **Keyword Cloud** - Most frequent sentiment words

---

## 3. Interaction Specification

### User Controls
- **PR Input:** Text area for pasting PR title and description
- **Add PR Button:** Adds current PR to analysis batch
- **Clear Button:** Resets all data
- **Export Button:** Downloads results as JSON

### Interactive Features
- Click on chart segments to filter/highlight specific PRs
- Hover tooltips showing detailed metrics
- Real-time character count for PR text

---

## 4. Data Flow & Processing

### Analysis Pipeline
1. **Input Processing:** Parse PR title and description
2. **Sentiment Scoring:** 
   - Use VADER (Valence Aware Dictionary and sEntiment Reasoner) for compound score
   - Score range: -1 (very negative) to +1 (very positive)
3. **Categorization:**
   - Negative: score < -0.05
   - Neutral: score >= -0.05 and <= 0.05
   - Positive: score > 0.05
4. **Aggregation:** Calculate overall stats across all PRs

### Output Data Structure
```json
{
  "prs": [
    {
      "id": "unique-id",
      "title": "PR title",
      "description": "PR description",
      "score": 0.5,
      "category": "positive",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ],
  "stats": {
    "total": 10,
    "positive": 6,
    "neutral": 2,
    "negative": 2,
    "avgScore": 0.35
  }
}
```

---

## 5. Technical Implementation

### Dependencies
- **Analysis:** NLTK's VADER sentiment analyzer
- **Visualization:** Chart.js for all charts
- **UI:** Vanilla JS with CSS custom properties for theming

### File Structure
```
/workspace/project/
├── SPEC.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── analyzer.js
│   └── charts.js
└── requirements.txt
```

---

## 6. Acceptance Criteria

1. ✅ User can input PR title and description
2. ✅ Sentiment analysis runs on each PR with accurate scoring
3. ✅ Visual charts display distribution, scores, and trends
4. ✅ Multiple PRs can be analyzed in batch
5. ✅ Results can be exported as JSON
6. ✅ Dark theme matches GitHub's aesthetic
7. ✅ Responsive layout works on mobile
8. ✅ Smooth animations on results display
9. ✅ Interactive chart tooltips and filtering