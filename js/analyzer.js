/**
 * Sentiment Analyzer using VADER
 */
class SentimentAnalyzer {
    constructor() {
        this.vader = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return true;
        
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: '', action: 'init' })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            this.initialized = data.success;
            return this.initialized;
        } catch (error) {
            console.error('Failed to initialize analyzer:', error);
            throw error;
        }
    }

    async analyze(text) {
        if (!this.initialized) {
            await this.init();
        }

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, action: 'analyze' })
            });
            return await response.json();
        } catch (error) {
            console.error('Analysis failed:', error);
            throw error;
        }
    }

    getCategory(score) {
        if (score < -0.05) return 'negative';
        if (score > 0.05) return 'positive';
        return 'neutral';
    }

    getCategoryColor(category) {
        const colors = {
            positive: '#3fb950',
            neutral: '#8b949e',
            negative: '#f85149'
        };
        return colors[category] || colors.neutral;
    }

    extractKeywords(text) {
        const stopWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
            'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need',
            'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
            'we', 'they', 'what', 'which', 'who', 'when', 'where', 'why', 'how',
            'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other',
            'some', 'such', 'no', 'not', 'only', 'same', 'so', 'than', 'too',
            'very', 'just', 'also', 'now', 'here', 'there', 'then', 'if', 'else',
            'because', 'until', 'while', 'about', 'after', 'before', 'above',
            'below', 'between', 'into', 'through', 'during', 'under', 'again',
            'further', 'once', 'any', 'our', 'its', 'their', 'my', 'your', 'his',
            'her', 'our', 'your', 'me', 'him', 'them', 'us', 'being', 'get',
            'make', 'made', 'see', 'saw', 'look', 'looked', 'go', 'went', 'come',
            'came', 'use', 'used', 'using', 'take', 'took', 'know', 'knew', 'think',
            'thought', 'want', 'wanted', 'give', 'gave', 'find', 'found', 'tell',
            'told', 'ask', 'asked', 'work', 'worked', 'seem', 'seemed', 'feel',
            'felt', 'try', 'tried', 'leave', 'left', 'call', 'called', 'keep',
            'kept', 'let', 'begin', 'began', 'seem', 'seemed', 'help', 'helped',
            'show', 'showed', 'hear', 'heard', 'play', 'played', 'run', 'ran',
            'move', 'moved', 'live', 'lived', 'believe', 'believed', 'hold',
            'held', 'bring', 'brought', 'happen', 'happened', 'write', 'wrote',
            'provide', 'provided', 'sit', 'sat', 'stand', 'stood', 'lose', 'lost',
            'pay', 'paid', 'meet', 'met', 'include', 'included', 'continue',
            'continued', 'set', 'learn', 'learned', 'change', 'changed', 'lead',
            'led', 'understand', 'understood', 'watch', 'watched', 'follow',
            'followed', 'stop', 'stopped', 'create', 'created', 'speak', 'spoke',
            'read', 'allow', 'allowed', 'add', 'added', 'spend', 'spent', 'grow',
            'grew', 'open', 'opened', 'walk', 'walked', 'win', 'won', 'offer',
            'offered', 'remember', 'remembered', 'love', 'loved', 'consider',
            'considered', 'appear', 'appeared', 'buy', 'bought', 'wait', 'waited',
            'serve', 'served', 'die', 'died', 'send', 'sent', 'expect', 'expected',
            'build', 'built', 'stay', 'stayed', 'fall', 'fell', 'cut', 'reach',
            'reached', 'kill', 'killed', 'remain', 'remained'
        ]);

        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3 && !stopWords.has(word));

        const frequency = {};
        words.forEach(word => {
            frequency[word] = (frequency[word] || 0) + 1;
        });

        return Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 15)
            .map(([word, count]) => ({ word, count }));
    }
}

window.SentimentAnalyzer = SentimentAnalyzer;