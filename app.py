"""
Combined Flask Backend for PR Sentiment Analyzer
Serves static files and provides API endpoints for VADER sentiment analysis
"""
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import nltk

app = Flask(__name__, static_folder='.')
CORS(app)

# Download VADER lexicon on startup
try:
    nltk.data.find('sentiment/vader_lexicon.zip')
except LookupError:
    nltk.download('vader_lexicon', quiet=True)

from nltk.sentiment.vader import SentimentIntensityAnalyzer

sia = SentimentIntensityAnalyzer()

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('css', filename)

@app.route('/js/<path:filename>')
def serve_js(filename):
    return send_from_directory('js', filename)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    action = data.get('action', 'analyze')
    
    if action == 'init':
        return jsonify({'success': True, 'message': 'Analyzer initialized'})
    
    text = data.get('text', '')
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    scores = sia.polarity_scores(text)
    compound = scores['compound']
    
    # Categorize based on compound score
    if compound >= 0.05:
        category = 'positive'
    elif compound <= -0.05:
        category = 'negative'
    else:
        category = 'neutral'
    
    return jsonify({
        'score': round(compound, 4),
        'category': category,
        'details': {
            'pos': round(scores['pos'], 4),
            'neg': round(scores['neg'], 4),
            'neu': round(scores['neu'], 4)
        }
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=False)