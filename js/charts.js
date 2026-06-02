/**
 * Chart Management for PR Sentiment Analyzer
 */
class ChartManager {
    constructor() {
        this.sentimentChart = null;
        this.scoresChart = null;
        this.trendChart = null;
        this.colors = {
            positive: '#3fb950',
            neutral: '#8b949e',
            negative: '#f85149'
        };
    }

    initCharts() {
        Chart.defaults.color = '#8b949e';
        Chart.defaults.borderColor = '#30363d';
        Chart.defaults.font.family = "'JetBrains Mono', monospace";
        Chart.defaults.font.size = 11;

        this.initSentimentChart();
        this.initScoresChart();
        this.initTrendChart();
    }

    initSentimentChart() {
        const ctx = document.getElementById('sentimentChart');
        if (!ctx) return;

        this.sentimentChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Positive', 'Neutral', 'Negative'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [this.colors.positive, this.colors.neutral, this.colors.negative],
                    borderColor: '#0d1117',
                    borderWidth: 3,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: '#21262d',
                        titleColor: '#e6edf3',
                        bodyColor: '#8b949e',
                        borderColor: '#30363d',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0;
                                return `${context.label}: ${context.raw} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 600,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    initScoresChart() {
        const ctx = document.getElementById('scoresChart');
        if (!ctx) return;

        this.scoresChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Sentiment Score',
                    data: [],
                    backgroundColor: [],
                    borderRadius: 4,
                    borderSkipped: false,
                    barThickness: 24
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        min: -1,
                        max: 1,
                        grid: {
                            color: '#21262d',
                            drawBorder: false
                        },
                        ticks: {
                            stepSize: 0.5,
                            callback: (value) => value.toFixed(1)
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: { size: 10 }
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#21262d',
                        titleColor: '#e6edf3',
                        bodyColor: '#8b949e',
                        borderColor: '#30363d',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => `Score: ${context.raw.toFixed(2)}`
                        }
                    }
                },
                animation: {
                    duration: 500,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    initTrendChart() {
        const ctx = document.getElementById('trendChart');
        if (!ctx) return;

        this.trendChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Sentiment Score',
                    data: [],
                    borderColor: '#58a6ff',
                    backgroundColor: 'rgba(88, 166, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#58a6ff',
                    pointBorderColor: '#0d1117',
                    pointBorderWidth: 2,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: {
                            color: '#21262d',
                            drawBorder: false
                        }
                    },
                    y: {
                        min: -1,
                        max: 1,
                        grid: {
                            color: '#21262d',
                            drawBorder: false
                        },
                        ticks: {
                            stepSize: 0.5,
                            callback: (value) => value.toFixed(1)
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#21262d',
                        titleColor: '#e6edf3',
                        bodyColor: '#8b949e',
                        borderColor: '#30363d',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => `Score: ${context.raw.toFixed(2)}`
                        }
                    }
                },
                animation: {
                    duration: 600,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    updateCharts(prs, stats) {
        if (this.sentimentChart) {
            this.sentimentChart.data.datasets[0].data = [
                stats.positive,
                stats.neutral,
                stats.negative
            ];
            this.sentimentChart.update('active');
        }

        if (this.scoresChart) {
            this.scoresChart.data.labels = prs.map((_, i) => `#${prs.length - i}`);
            this.scoresChart.data.datasets[0].data = prs.map(pr => pr.score).reverse();
            this.scoresChart.data.datasets[0].backgroundColor = prs.map(pr => {
                return this.colors[pr.category];
            }).reverse();
            this.scoresChart.update('active');
        }

        if (this.trendChart) {
            this.trendChart.data.labels = prs.map((_, i) => `#${i + 1}`);
            this.trendChart.data.datasets[0].data = prs.map(pr => pr.score);
            this.trendChart.update('active');
        }

        this.updateLegend(stats);
    }

    updateLegend(stats) {
        const legend = document.getElementById('sentimentLegend');
        if (!legend) return;

        legend.innerHTML = [
            { label: 'Positive', value: stats.positive, color: this.colors.positive },
            { label: 'Neutral', value: stats.neutral, color: this.colors.neutral },
            { label: 'Negative', value: stats.negative, color: this.colors.negative }
        ].map(item => `
            <div class="legend-item" data-category="${item.label.toLowerCase()}">
                <span class="legend-color" style="background: ${item.color}"></span>
                <span class="legend-label">${item.label}</span>
                <span class="legend-value">${item.value}</span>
            </div>
        `).join('');
    }

    clearCharts() {
        if (this.sentimentChart) {
            this.sentimentChart.data.datasets[0].data = [0, 0, 0];
            this.sentimentChart.update();
        }

        if (this.scoresChart) {
            this.scoresChart.data.labels = [];
            this.scoresChart.data.datasets[0].data = [];
            this.scoresChart.update();
        }

        if (this.trendChart) {
            this.trendChart.data.labels = [];
            this.trendChart.data.datasets[0].data = [];
            this.trendChart.update();
        }

        const legend = document.getElementById('sentimentLegend');
        if (legend) legend.innerHTML = '';
    }
}

window.ChartManager = ChartManager;