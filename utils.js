// Utility Functions for AI Customer Support Bot

// Text Processing Utilities
class TextProcessor {
    static normalize(text) {
        return text.toLowerCase().trim().replace(/[^\w\s]/g, '');
    }
    
    static extractKeywords(text) {
        const stopWords = new Set([
            'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
            'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
            'to', 'was', 'will', 'with', 'i', 'you', 'my', 'your', 'can', 'how'
        ]);
        
        return text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopWords.has(word));
    }
    
    static calculateSimilarity(text1, text2) {
        const words1 = new Set(this.extractKeywords(text1));
        const words2 = new Set(this.extractKeywords(text2));
        
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        
        return union.size === 0 ? 0 : intersection.size / union.size;
    }
    
    static detectSentiment(text) {
        const positiveWords = ['good', 'great', 'excellent', 'awesome', 'perfect', 'love', 'like', 'happy', 'satisfied', 'amazing'];
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'angry', 'frustrated', 'disappointed', 'useless'];
        
        const words = text.toLowerCase().split(/\s+/);
        let score = 0;
        
        words.forEach(word => {
            if (positiveWords.includes(word)) score += 1;
            if (negativeWords.includes(word)) score -= 1;
        });
        
        return {
            score,
            sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral'
        };
    }
}

// Session Management Utilities
class SessionManager {
    static generateId(prefix = 'session') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `${prefix}-${timestamp}-${random}`;
    }
    
    static calculateDuration(startTime, endTime = Date.now()) {
        const duration = endTime - startTime;
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }
    
    static getSessionSummary(messages) {
        const userMessages = messages.filter(m => m.role === 'user');
        const botMessages = messages.filter(m => m.role === 'assistant');
        
        return {
            totalMessages: messages.length,
            userMessages: userMessages.length,
            botMessages: botMessages.length,
            avgResponseTime: this.calculateAvgResponseTime(messages),
            topics: this.extractTopics(userMessages)
        };
    }
    
    static calculateAvgResponseTime(messages) {
        let totalTime = 0;
        let responseCount = 0;
        
        for (let i = 1; i < messages.length; i++) {
            if (messages[i-1].role === 'user' && messages[i].role === 'assistant') {
                const time1 = new Date(messages[i-1].timestamp).getTime();
                const time2 = new Date(messages[i].timestamp).getTime();
                totalTime += (time2 - time1);
                responseCount++;
            }
        }
        
        return responseCount > 0 ? Math.round(totalTime / responseCount) : 0;
    }
    
    static extractTopics(userMessages) {
        const allKeywords = userMessages
            .map(m => TextProcessor.extractKeywords(m.content))
            .flat();
        
        const frequency = {};
        allKeywords.forEach(keyword => {
            frequency[keyword] = (frequency[keyword] || 0) + 1;
        });
        
        return Object.entries(frequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([word]) => word);
    }
}

// Analytics Utilities
class Analytics {
    static calculateMetrics(sessions) {
        const totalSessions = sessions.length;
        const completedSessions = sessions.filter(s => s.status === 'completed');
        const escalatedSessions = sessions.filter(s => s.status === 'escalated');
        
        const avgDuration = completedSessions.length > 0 
            ? completedSessions.reduce((sum, s) => sum + s.duration, 0) / completedSessions.length
            : 0;
            
        const avgSatisfaction = completedSessions
            .filter(s => s.satisfaction !== null)
            .reduce((sum, s, _, arr) => sum + s.satisfaction / arr.length, 0);
            
        return {
            totalSessions,
            completionRate: totalSessions > 0 ? completedSessions.length / totalSessions : 0,
            escalationRate: totalSessions > 0 ? escalatedSessions.length / totalSessions : 0,
            avgDuration: Math.round(avgDuration * 100) / 100,
            avgSatisfaction: Math.round(avgSatisfaction * 100) / 100
        };
    }
    
    static generateTimeSeriesData(sessions, interval = 'hour') {
        const now = new Date();
        const data = [];
        const intervalMs = interval === 'hour' ? 3600000 : 86400000; // hour or day
        
        for (let i = 23; i >= 0; i--) {
            const timeSlot = new Date(now.getTime() - (i * intervalMs));
            const sessionCount = sessions.filter(s => {
                const sessionTime = new Date(s.startTime);
                return sessionTime >= timeSlot && sessionTime < new Date(timeSlot.getTime() + intervalMs);
            }).length;
            
            data.push({
                time: timeSlot,
                count: sessionCount,
                label: interval === 'hour' 
                    ? timeSlot.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
                    : timeSlot.toLocaleDateString()
            });
        }
        
        return data;
    }
    
    static categorizeQueries(messages) {
        const categories = {
            'Technical Support': ['password', 'login', 'error', 'bug', 'slow', 'not working'],
            'Billing & Payments': ['payment', 'billing', 'charge', 'refund', 'subscription'],
            'Product Information': ['features', 'plans', 'pricing', 'upgrade', 'enterprise'],
            'Account Management': ['account', 'profile', 'delete', 'transfer', '2fa']
        };
        
        const results = {};
        Object.keys(categories).forEach(cat => results[cat] = 0);
        
        messages.filter(m => m.role === 'user').forEach(message => {
            const text = message.content.toLowerCase();
            let categorized = false;
            
            for (const [category, keywords] of Object.entries(categories)) {
                if (keywords.some(keyword => text.includes(keyword)) && !categorized) {
                    results[category]++;
                    categorized = true;
                    break;
                }
            }
            
            if (!categorized) {
                results['Other'] = (results['Other'] || 0) + 1;
            }
        });
        
        return results;
    }
}

// API Simulation Utilities
class APISimulator {
    static async simulateDelay(min = 300, max = 1500) {
        const delay = Math.random() * (max - min) + min;
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    
    static simulateError(errorRate = 0.05) {
        return Math.random() < errorRate;
    }
    
    static generateAPIResponse(data, success = true) {
        return {
            success,
            data: success ? data : null,
            error: success ? null : 'An error occurred processing your request',
            timestamp: new Date().toISOString(),
            requestId: SessionManager.generateId('req')
        };
    }
    
    static async mockAPICall(endpoint, data) {
        await this.simulateDelay();
        
        if (this.simulateError()) {
            throw new Error('API request failed');
        }
        
        // Simulate different response types based on endpoint
        switch (endpoint) {
            case '/api/chat':
                return this.generateAPIResponse({
                    message: 'Response generated successfully',
                    confidence: Math.random() * 0.5 + 0.5,
                    processingTime: Math.random() * 1000 + 200
                });
                
            case '/api/escalate':
                return this.generateAPIResponse({
                    escalationId: SessionManager.generateId('esc'),
                    estimatedWaitTime: Math.floor(Math.random() * 300) + 60,
                    queuePosition: Math.floor(Math.random() * 5) + 1
                });
                
            default:
                return this.generateAPIResponse({ result: 'Success' });
        }
    }
}

// DOM Utilities
class DOMUtils {
    static createElement(tag, className, content) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.textContent = content;
        return element;
    }
    
    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        const start = performance.now();
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    static fadeOut(element, duration = 300) {
        const start = performance.now();
        const initialOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(currentTime) {
            const elapsed = currentTime - start;
            const progress = Math.min(elapsed / duration, 1);
            
            element.style.opacity = initialOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    static scrollToBottom(element, smooth = true) {
        element.scrollTo({
            top: element.scrollHeight,
            behavior: smooth ? 'smooth' : 'auto'
        });
    }
    
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Export utilities for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TextProcessor,
        SessionManager,
        Analytics,
        APISimulator,
        DOMUtils
    };
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.TextProcessor = TextProcessor;
    window.SessionManager = SessionManager;
    window.Analytics = Analytics;
    window.APISimulator = APISimulator;
    window.DOMUtils = DOMUtils;
}