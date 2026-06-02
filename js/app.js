/**
 * Main Application for PR Sentiment Analyzer
 */
class PRSentimentApp {
    constructor() {
        this.analyzer = new SentimentAnalyzer();
        this.chartManager = new ChartManager();
        this.prs = [];
        this.stats = { total: 0, positive: 0, neutral: 0, negative: 0, avgScore: 0 };
    }

    async init() {
        try {
            await this.analyzer.init();
            this.chartManager.initCharts();
            this.bindEvents();
            this.updateUI();
        } catch (error) {
            console.error('Init error:', error);
            this.showError('Failed to initialize. Please refresh the page.');
        }
    }

    bindEvents() {
        const form = document.getElementById('prForm');
        const clearBtn = document.getElementById('clearBtn');
        const exportBtn = document.getElementById('exportBtn');
        const titleInput = document.getElementById('prTitle');
        const descInput = document.getElementById('prDescription');

        form.addEventListener('submit', (e) => this.handleSubmit(e));
        clearBtn.addEventListener('click', () => this.clearAll());
        exportBtn.addEventListener('click', () => this.exportResults());

        titleInput.addEventListener('input', () => this.updateCharCount('title', titleInput.value));
        descInput.addEventListener('input', () => this.updateCharCount('desc', descInput.value));

        document.addEventListener('click', (e) => {
            if (e.target.closest('.pr-delete')) {
                const id = e.target.closest('.pr-delete').dataset.id;
                this.deletePR(id);
            }
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const titleInput = document.getElementById('prTitle');
        const descInput = document.getElementById('prDescription');
        const title = titleInput.value.trim();
        const description = descInput.value.trim();

        if (!title) {
            this.showError('Please enter a PR title');
            return;
        }

        const fullText = `${title} ${description}`;
        
        try {
            this.setStatus('Analyzing...');
            const result = await this.analyzer.analyze(fullText);
            
            const pr = {
                id: this.generateId(),
                title: title,
                description: description,
                score: result.score,
                category: result.category,
                timestamp: new Date().toISOString(),
                keywords: this.analyzer.extractKeywords(fullText)
            };

            this.prs.push(pr);
            this.calculateStats();
            this.updateUI();
            this.updateCharts();
            this.addPRToList(pr);
            
            titleInput.value = '';
            descInput.value = '';
            this.updateCharCount('title', '');
            this.updateCharCount('desc', '');
            
            this.setStatus('Ready');
        } catch (error) {
            console.error('Analysis error:', error);
            this.showError('Failed to analyze PR. Please try again.');
            this.setStatus('Error');
        }
    }

    calculateStats() {
        const total = this.prs.length;
        if (total === 0) {
            this.stats = { total: 0, positive: 0, neutral: 0, negative: 0, avgScore: 0 };
            return;
        }

        const counts = { positive: 0, neutral: 0, negative: 0 };
        let sum = 0;

        this.prs.forEach(pr => {
            counts[pr.category]++;
            sum += pr.score;
        });

        this.stats = {
            total,
            ...counts,
            avgScore: sum / total
        };
    }

    updateUI() {
        const totalEl = document.getElementById('totalCount');
        const exportBtn = document.getElementById('exportBtn');

        if (totalEl) {
            totalEl.textContent = this.stats.total;
        }

        if (exportBtn) {
            exportBtn.disabled = this.prs.length === 0;
        }
    }

    updateCharts() {
        this.chartManager.updateCharts(this.prs, this.stats);
        this.updateKeywords();
    }

    updateKeywords() {
        const container = document.getElementById('keywordsDisplay');
        if (!container) return;

        if (this.prs.length === 0) {
            container.innerHTML = '<p class="empty-state">Add PRs to see keywords</p>';
            return;
        }

        const allKeywords = [];
        this.prs.forEach(pr => {
            if (pr.keywords) {
                pr.keywords.forEach(kw => {
                    kw.category = pr.category;
                    allKeywords.push(kw);
                });
            }
        });

        const topKeywords = allKeywords
            .sort((a, b) => b.count - a.count)
            .slice(0, 12);

        if (topKeywords.length === 0) {
            container.innerHTML = '<p class="empty-state">No keywords found</p>';
            return;
        }

        container.innerHTML = topKeywords.map(kw => 
            `<span class="keyword-tag ${kw.category}">${kw.word} <small>(${kw.count})</small></span>`
        ).join('');
    }

    addPRToList(pr) {
        const list = document.getElementById('prList');
        const emptyState = list.querySelector('.empty-state-container');
        
        if (emptyState) {
            list.innerHTML = '';
        }

        const prElement = document.createElement('div');
        prElement.className = 'pr-item';
        prElement.dataset.id = pr.id;
        prElement.innerHTML = `
            <div class="pr-item-header">
                <span class="pr-title">${this.escapeHtml(pr.title)}</span>
                <div class="pr-score">
                    <span class="score-badge ${pr.category}">${pr.score.toFixed(2)}</span>
                    <button class="pr-delete" data-id="${pr.id}" title="Remove PR">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
            ${pr.description ? `<p class="pr-description">${this.escapeHtml(pr.description.substring(0, 150))}${pr.description.length > 150 ? '...' : ''}</p>` : ''}
        `;

        list.appendChild(prElement);
    }

    deletePR(id) {
        this.prs = this.prs.filter(pr => pr.id !== id);
        this.calculateStats();
        this.updateUI();
        this.updateCharts();
        
        const prElement = document.querySelector(`.pr-item[data-id="${id}"]`);
        if (prElement) {
            prElement.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                prElement.remove();
                if (this.prs.length === 0) {
                    document.getElementById('prList').innerHTML = `
                        <div class="empty-state-container">
                            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                            </svg>
                            <p>No PRs analyzed yet</p>
                            <p class="empty-hint">Add a PR title and description to get started</p>
                        </div>
                    `;
                }
            }, 300);
        }
    }

    clearAll() {
        this.prs = [];
        this.calculateStats();
        this.updateUI();
        this.chartManager.clearCharts();

        document.getElementById('prList').innerHTML = `
            <div class="empty-state-container">
                <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <p>No PRs analyzed yet</p>
                <p class="empty-hint">Add a PR title and description to get started</p>
            </div>
        `;

        document.getElementById('keywordsDisplay').innerHTML = '<p class="empty-state">Add PRs to see keywords</p>';

        this.setStatus('Ready');
    }

    exportResults() {
        const data = {
            exportDate: new Date().toISOString(),
            stats: this.stats,
            prs: this.prs.map(pr => ({
                title: pr.title,
                description: pr.description,
                score: pr.score,
                category: pr.category,
                timestamp: pr.timestamp
            }))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pr-sentiment-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    updateCharCount(type, text) {
        const countEl = document.getElementById(`${type}Count`);
        if (countEl) {
            countEl.textContent = text.length;
        }
    }

    setStatus(status) {
        const statusText = document.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = status;
        }
    }

    showError(message) {
        console.error(message);
    }

    generateId() {
        return `pr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new PRSentimentApp();
    app.init();
});

window.PRSentimentApp = PRSentimentApp;