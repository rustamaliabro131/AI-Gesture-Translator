# AI Gesture Translator

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/flask-2.3+-green.svg)

**Breaking Language Barriers with AI**

AI Gesture Translator is a web application that uses natural language processing and sentiment analysis to interpret and categorize gesture descriptions. It provides visual analytics through interactive charts and real-time sentiment scoring.

![App Logo](favicon.svg)

## Features

- 🎯 **Real-time Sentiment Analysis** - Instant analysis of gesture descriptions
- 📊 **Interactive Charts** - Visual sentiment distribution and trends
- 🔄 **Live Updates** - Charts update dynamically as you add gestures
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🌙 **Dark Mode UI** - Modern, eye-friendly dark theme
- 📤 **Export Functionality** - Export your analysis data
- ⚡ **Fast Performance** - Powered by Flask and VADER sentiment analyzer

## Tech Stack

- **Backend:** Python, Flask, Flask-CORS
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Charts:** Chart.js 4.4
- **NLP:** NLTK VADER Sentiment Analyzer
- **Testing:** Pytest

## Installation

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Step 1: Clone the Repository

```bash
git clone https://github.com/rustamaliabro131/AI-Gesture-Translator.git
cd AI-Gesture-Translator
```

### Step 2: Create Virtual Environment (Recommended)

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 4: Run the Application

```bash
python app.py
```

The application will start on `http://localhost:8080`

### Alternative: Run with Debug Mode

```bash
export FLASK_DEBUG=1
python app.py
```

## Usage

1. **Open the App** - Navigate to `http://localhost:8080` in your browser
2. **Enter Gesture** - Type a gesture description in the "Gesture Input" field
3. **Add Context** (Optional) - Provide cultural background or intended meaning
4. **Analyze** - Click the "Analyze" button to process
5. **View Results** - See sentiment analysis in the charts section
6. **Export** - Download your analysis data when ready

### Example Gestures to Try

- "Thumbs up gesture meaning approval"
- "Wave hand to say goodbye"
- "Folded arms indicating disagreement"
- "Pointing finger while speaking"
- "Open palms showing honesty"

## API Endpoints

### Health Check
```
GET /health
```
Returns: `{"status": "healthy"}`

### Analyze Sentiment
```
POST /api/analyze
Content-Type: application/json

{
  "text": "Your gesture description here"
}
```

**Response:**
```json
{
  "score": 0.6486,
  "category": "positive",
  "details": {
    "pos": 0.646,
    "neg": 0.0,
    "neu": 0.354
  }
}
```

### Sentiment Categories
- **Positive:** Score >= 0.05
- **Neutral:** -0.05 < Score < 0.05
- **Negative:** Score <= -0.05

## Running Tests

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=. --cov-report=html

# Run specific test file
pytest tests/test_app.py -v
```

## Project Structure

```
AI-Gesture-Translator/
├── app.py                 # Flask application
├── requirements.txt       # Python dependencies
├── index.html            # Main HTML file
├── favicon.svg           # App favicon
├── SPEC.md               # Project specification
├── README.md             # This file
├── css/
│   └── styles.css        # Stylesheet
├── js/
│   ├── app.js            # Main application logic
│   ├── analyzer.js       # Sentiment analyzer client
│   └── charts.js         # Chart management
├── tests/
│   ├── __init__.py       # Test package
│   └── test_app.py       # Unit tests
└── .github/
    └── workflows/
        ├── ci.yml              # CI pipeline
        └── dependabot-auto-merge.yml  # Auto-merge bot
```

## Development

### Running in Development Mode

```bash
# Enable debug mode
export FLASK_DEBUG=1
python app.py
```

### Adding New Features

1. Update `SPEC.md` with feature description
2. Implement changes in appropriate files
3. Add unit tests in `tests/test_app.py`
4. Run tests to verify: `pytest tests/ -v`
5. Commit and push changes

## Deployment

### Deploy to Heroku

```bash
# Create Heroku app
heroku create your-app-name

# Set buildpack
heroku buildpacks:set heroku/python

# Deploy
git push heroku master

# Open app
heroku open
```

### Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
railway init

# Deploy
railway up
```

### Deploy to Render

1. Connect your GitHub repository to Render
2. Select "Web Service"
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python app.py`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `pytest tests/ -v`
5. Commit: `git commit -m "Add feature"`
6. Push: `git push origin feature-name`
7. Open a Pull Request

## Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/rustamaliabro131"><img src="https://avatars.githubusercontent.com/u/143821884?v=4" width="60px;" alt="Rustam Ali"/><br /><sub><b>Rustam Ali</b></sub></a><br /><a href="https://github.com/rustamaliabro131/AI-Gesture-Translator/commits?author=rustamaliabro131" title="Code">💻</a> <a href="https://github.com/rustamaliabro131/AI-Gesture-Translator/commits?author=rustamaliabro131" title="Documentation">📖</a> <a href="#ideas-rustamaliabro131" title="Ideas, Planning, & Feedback">🤔</a></td>
    </tr>
  </tbody>
</table>
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://allcontributors.org) specification.
Contributions of any kind welcome!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **NLTK** - VADER Sentiment Analyzer
- **Chart.js** - Beautiful charts library
- **Flask** - Lightweight WSGI web application framework
- **Powered by Rustam Ex KWK Creatives**

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/rustamaliabro131/AI-Gesture-Translator/issues) page
2. Create a new issue with detailed information
3. Submit a pull request with your fix

---

Made with ❤️ by [Rustam Ali](https://github.com/rustamaliabro131) | Powered by **Rustam Ex KWK Creatives**