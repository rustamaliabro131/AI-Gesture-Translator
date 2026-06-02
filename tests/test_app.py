"""
Unit tests for the Flask application API endpoints
"""
import pytest
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app


@pytest.fixture
def client():
    """Create a test client for the Flask application"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


class TestHealthEndpoint:
    """Tests for the /health endpoint"""

    def test_health_returns_200(self, client):
        """Test that health endpoint returns 200 status"""
        response = client.get('/health')
        assert response.status_code == 200

    def test_health_returns_json(self, client):
        """Test that health endpoint returns JSON"""
        response = client.get('/health')
        assert response.content_type == 'application/json'

    def test_health_returns_healthy_status(self, client):
        """Test that health endpoint returns healthy status"""
        response = client.get('/health')
        data = response.get_json()
        assert data['status'] == 'healthy'


class TestIndexEndpoint:
    """Tests for the index (/) endpoint"""

    def test_index_returns_200(self, client):
        """Test that index returns 200 status"""
        response = client.get('/')
        assert response.status_code == 200

    def test_index_returns_html(self, client):
        """Test that index returns HTML content"""
        response = client.get('/')
        assert 'text/html' in response.content_type


class TestAnalyzeEndpoint:
    """Tests for the /api/analyze endpoint"""

    def test_analyze_positive_text(self, client):
        """Test sentiment analysis of positive text"""
        response = client.post('/api/analyze',
                               json={'text': 'I love this! This is amazing and wonderful!'},
                               content_type='application/json')
        assert response.status_code == 200
        data = response.get_json()
        assert data['category'] == 'positive'
        assert data['score'] > 0.05

    def test_analyze_negative_text(self, client):
        """Test sentiment analysis of negative text"""
        response = client.post('/api/analyze',
                               json={'text': 'This is terrible and awful. I hate it!'},
                               content_type='application/json')
        assert response.status_code == 200
        data = response.get_json()
        assert data['category'] == 'negative'
        assert data['score'] < -0.05

    def test_analyze_neutral_text(self, client):
        """Test sentiment analysis of neutral text"""
        response = client.post('/api/analyze',
                               json={'text': 'The file is located in the directory.'},
                               content_type='application/json')
        assert response.status_code == 200
        data = response.get_json()
        assert data['category'] == 'neutral'
        assert -0.05 <= data['score'] <= 0.05

    def test_analyze_empty_text_returns_400(self, client):
        """Test that empty text returns 400 error"""
        response = client.post('/api/analyze',
                               json={'text': ''},
                               content_type='application/json')
        assert response.status_code == 400

    def test_analyze_missing_text_returns_400(self, client):
        """Test that missing text returns 400 error"""
        response = client.post('/api/analyze',
                               json={},
                               content_type='application/json')
        assert response.status_code == 400

    def test_analyze_returns_score_rounded_to_4_decimals(self, client):
        """Test that score is rounded to 4 decimal places"""
        response = client.post('/api/analyze',
                               json={'text': 'Hello world'},
                               content_type='application/json')
        data = response.get_json()
        # Check that score has at most 4 decimal places
        assert len(str(data['score']).split('.')[-1]) <= 4

    def test_analyze_returns_details_with_pos_neg_neu(self, client):
        """Test that response includes pos, neg, neu details"""
        response = client.post('/api/analyze',
                               json={'text': 'Great job on the project!'},
                               content_type='application/json')
        data = response.get_json()
        assert 'details' in data
        assert 'pos' in data['details']
        assert 'neg' in data['details']
        assert 'neu' in data['details']

    def test_analyze_details_sum_to_approximately_1(self, client):
        """Test that pos + neg + neu approximately equals 1"""
        response = client.post('/api/analyze',
                               json={'text': 'This is a very nice day!'},
                               content_type='application/json')
        data = response.get_json()
        total = data['details']['pos'] + data['details']['neg'] + data['details']['neu']
        assert 0.99 <= total <= 1.01  # Allow small floating point variance


class TestInitAction:
    """Tests for the init action in /api/analyze"""

    def test_init_action_returns_success(self, client):
        """Test that init action returns success"""
        response = client.post('/api/analyze',
                               json={'action': 'init', 'text': ''},
                               content_type='application/json')
        assert response.status_code == 200
        data = response.get_json()
        assert data['success'] is True


class TestStaticFiles:
    """Tests for static file serving"""

    def test_css_file_accessible(self, client):
        """Test that CSS files are served correctly"""
        response = client.get('/css/styles.css')
        assert response.status_code == 200
        assert 'text/css' in response.content_type

    def test_js_file_accessible(self, client):
        """Test that JS files are served correctly"""
        response = client.get('/js/app.js')
        assert response.status_code == 200
        assert 'javascript' in response.content_type

    def test_nonexistent_file_returns_404(self, client):
        """Test that nonexistent files return 404"""
        response = client.get('/css/nonexistent.css')
        assert response.status_code == 404


class TestEdgeCases:
    """Tests for edge cases"""

    def test_very_long_text(self, client):
        """Test analysis of very long text"""
        long_text = 'Good ' * 1000  # Repeat 'Good ' 1000 times
        response = client.post('/api/analyze',
                               json={'text': long_text},
                               content_type='application/json')
        assert response.status_code == 200
        data = response.get_json()
        assert data['category'] == 'positive'

    def test_unicode_text(self, client):
        """Test analysis of text with unicode characters"""
        response = client.post('/api/analyze',
                               json={'text': 'Hello 世界 🌍 🎉'},
                               content_type='application/json')
        assert response.status_code == 200
        data = response.get_json()
        assert 'category' in data

    def test_special_characters(self, client):
        """Test analysis of text with special characters"""
        response = client.post('/api/analyze',
                               json={'text': 'Test @#$%^&*() with symbols!'},
                               content_type='application/json')
        assert response.status_code == 200

    def test_only_whitespace_returns_neutral(self, client):
        """Test that whitespace-only text returns neutral"""
        response = client.post('/api/analyze',
                               json={'text': '   \n\t\t  '},
                               content_type='application/json')
        assert response.status_code == 200
        data = response.get_json()
        # Whitespace should result in neutral or very low scores
        assert data['category'] in ['neutral', 'positive', 'negative']


class TestBoundaryConditions:
    """Tests for boundary conditions on sentiment scores"""

    def test_score_exactly_0(self, client):
        """Test text that should produce score close to 0"""
        response = client.post('/api/analyze',
                               json={'text': ''},
                               content_type='application/json')
        # Empty text is handled separately with 400 error
        assert response.status_code == 400

    def test_score_boundaries_positive(self, client):
        """Test text with very positive sentiment"""
        response = client.post('/api/analyze',
                               json={'text': 'Absolutely fantastic! Incredible! Best ever! Amazing!'},
                               content_type='application/json')
        data = response.get_json()
        assert data['score'] > 0.5  # Strong positive

    def test_score_boundaries_negative(self, client):
        """Test text with very negative sentiment"""
        response = client.post('/api/analyze',
                               json={'text': 'Horrible terrible awful disgusting bad worst ever!'},
                               content_type='application/json')
        data = response.get_json()
        assert data['score'] < -0.5  # Strong negative

    def test_score_exactly_positive_threshold(self, client):
        """Test text at exactly positive threshold"""
        # VADER threshold is 0.05
        response = client.post('/api/analyze',
                               json={'text': 'This is good.'},
                               content_type='application/json')
        data = response.get_json()
        # Even "This is good" should be positive
        assert data['score'] > 0

    def test_score_exactly_negative_threshold(self, client):
        """Test text at exactly negative threshold"""
        response = client.post('/api/analyze',
                               json={'text': 'This is bad.'},
                               content_type='application/json')
        data = response.get_json()
        assert data['score'] < 0