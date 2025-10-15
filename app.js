// AI Customer Support Bot Application
class CustomerSupportBot {
    constructor() {
        this.currentSessionId = null;
        this.isTyping = false;
        // Allow overriding API base via window.API_BASE_URL
        this.API_BASE = (typeof window !== 'undefined' && window.API_BASE_URL) ? window.API_BASE_URL : 'http://localhost:3001';

        this.analytics = {
            totalSessions: 1247,
            avgSessionLength: 4.2,
            totalMessages: 5234,
            satisfactionRating: 4.3,
            escalationRate: 0.12,
            responseTime: { avg: 850, p95: 1200, p99: 2100 }
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeSession();
        this.setupNavigationTabs();
        this.loadSampleData();
        this.renderAnalytics();
        this.renderCharts();
        this.renderSessions();
    }

    // Helper: get or create local session object
        let session = this.conversations.get(id);
        if (!session) {
            this.conversations.set(id, session);
        }
        return session;
    }

    // FAQ Database
    getFAQDatabase() {
        return {
            billing: [
                {
                    question: "How do I update my payment method?",
                    answer: "You can update your payment method by going to Account Settings > Billing > Payment Methods. Click 'Add Payment Method' or 'Update' next to your current method. We accept all major credit cards and PayPal.",
                    keywords: ["payment", "billing", "update", "credit card", "paypal"],
                    confidence: 0.95
                },
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept Visa, Mastercard, American Express, Discover, and PayPal. For enterprise customers, we also support wire transfers and purchase orders.",
                    keywords: ["payment methods", "credit card", "paypal", "wire transfer"],
                    confidence: 0.92
                },
                {
                    question: "When will I be charged?",
                    answer: "You'll be charged on your billing date each month. You can find your next billing date in Account Settings > Billing. We'll send you an email receipt after each charge.",
                    keywords: ["billing date", "charged", "when", "monthly"],
                    confidence: 0.90
                },
                {
                    question: "How do I cancel my subscription?",
                    answer: "To cancel your subscription, go to Account Settings > Billing > Subscription and click 'Cancel Subscription'. Your access will continue until your current billing period ends.",
                    keywords: ["cancel", "subscription", "unsubscribe"],
                    confidence: 0.95
                },
                {
                    question: "Can I get a refund?",
                    answer: "We offer a 30-day money-back guarantee for new customers. For existing customers, refunds are considered on a case-by-case basis. Please contact our billing team for assistance.",
                    keywords: ["refund", "money back", "guarantee"],
                    confidence: 0.88
                }
            ],
            technical: [
                {
                    answer: "To reset your password, click 'Forgot Password' on the login page. Enter your email address and we'll send you a reset link. The link expires in 24 hours for security.",
                    keywords: ["password", "reset", "forgot", "login"],
                    confidence: 0.98
                },
                {
                    question: "Why can't I log in?",
                    answer: "If you can't log in, try these steps: 1) Check your email and password are correct, 2) Clear your browser cache, 3) Try incognito mode, 4) Reset your password if needed. Contact support if issues persist.",
                    keywords: ["login", "can't log in", "access", "sign in"],
                    confidence: 0.92
                },
                {
                    question: "How do I update my account information?",
                    answer: "Go to Account Settings > Profile to update your name, email, phone number, and other personal information. Some changes may require email verification.",
                    keywords: ["account", "profile", "update", "personal information"],
                    confidence: 0.89
                {
                    question: "The app is running slowly, what should I do?",
                    answer: "Try these steps to improve performance: 1) Close other browser tabs, 2) Clear your browser cache, 3) Check your internet connection, 4) Try a different browser, 5) Restart your device. Contact support if problems continue.",
                    confidence: 0.85
                },
                {
                    question: "How do I export my data?",
                    answer: "You can export your data from Account Settings > Data & Privacy > Export Data. Choose your preferred format (CSV, JSON, PDF) and we'll email you a download link within 24 hours.",
                    keywords: ["export", "data", "download", "backup"],
                    confidence: 0.91
                }
            ],
            products: [
                {
                    question: "What features are included in each plan?",
                    answer: "Basic Plan includes core features for up to 5 users. Pro Plan adds advanced analytics and 50 users. Enterprise Plan includes everything plus custom integrations, dedicated support, and unlimited users. Visit our pricing page for full details.",
                    keywords: ["features", "plans", "pricing", "basic", "pro", "enterprise"],
                    confidence: 0.93
                },
                {
                    question: "How do I upgrade my account?",
                    answer: "To upgrade your account, go to Account Settings > Billing > Subscription and click 'Upgrade Plan'. Choose your new plan and confirm payment details. The upgrade takes effect immediately.",
                    keywords: ["upgrade", "plan", "account", "subscription"],
                    confidence: 0.95
                },
                {
                    question: "Do you offer enterprise solutions?",
                    answer: "Yes, we offer Enterprise plans with custom pricing, dedicated support, advanced security features, and API access. Contact our sales team for a personalized quote and demo.",
                    keywords: ["enterprise", "business", "custom", "sales"],
                    confidence: 0.90
                },
                {
                    question: "What's the difference between plans?",
                    answer: "Basic ($9/mo): 5 users, core features. Pro ($29/mo): 50 users, analytics, integrations. Enterprise (custom): unlimited users, white-label, dedicated support, SLA. All plans include 24/7 support.",
                    keywords: ["difference", "plans", "comparison", "pricing"],
                    confidence: 0.87
                }
            ],
            account: [
                {
                    question: "How do I delete my account?",
                    answer: "To delete your account, go to Account Settings > Data & Privacy > Delete Account. This action is permanent and will remove all your data. You can also contact support for assistance.",
                    keywords: ["delete", "account", "remove", "permanent"],
                    confidence: 0.94
                },
                {
                    question: "How do I change my email address?",
                    answer: "Go to Account Settings > Profile > Email Address. Enter your new email and click 'Update'. You'll need to verify the new email address before the change takes effect.",
                    keywords: ["email", "change", "update", "address"],
                    confidence: 0.91
                },
                {
                    question: "Can I transfer my account to someone else?",
                    answer: "Yes, account transfers are available for Pro and Enterprise customers. Contact our support team with both email addresses to initiate the transfer process. Basic plan users need to upgrade first.",
                    keywords: ["transfer", "account", "ownership", "someone else"],
                    confidence: 0.82
                },
                {
                    question: "How do I view my usage statistics?",
                    answer: "Your usage statistics are available in the Dashboard > Usage tab. You can see monthly usage, feature utilization, team activity, and billing information. Pro+ plans get detailed analytics.",
                    keywords: ["usage", "statistics", "dashboard", "analytics"],
                    confidence: 0.89
                },
                {
                    question: "How do I enable two-factor authentication?",
                    answer: "Enable 2FA in Account Settings > Security > Two-Factor Authentication. You can use SMS, email, or authenticator apps like Google Authenticator. We recommend using an authenticator app for better security.",
                    keywords: ["2fa", "two factor", "authentication", "security"],
                    confidence: 0.96
                }
            ]
        };
    }

    // Escalation triggers
    getEscalationTriggers() {
        return {
            keywords: [
                "human", "agent", "representative", "speak to someone", "talk to person",
                "customer service", "live chat", "help me", "frustrated", "angry",
                "complaint", "manager", "supervisor"
            ],
            confidenceThreshold: 0.6,
            sentimentTriggers: [
                "terrible", "awful", "horrible", "worst", "hate", "stupid", "useless"
            ]
        };
    }

    setupEventListeners() {
        // Chat input handling
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-button');
        const clearChatButton = document.getElementById('clear-chat');
        
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        messageInput.addEventListener('input', () => {
            const hasText = messageInput.value.trim().length > 0;
            sendButton.disabled = !hasText || this.isTyping;
        });
        
        sendButton.addEventListener('click', () => this.sendMessage());
        clearChatButton.addEventListener('click', () => this.clearChat());
        
        // Quick actions
        document.querySelectorAll('.quick-action').forEach(button => {
            button.addEventListener('click', () => {
                const message = button.dataset.message;
                messageInput.value = message;
                this.sendMessage();
            });
        });
        
        // Modal handling
        const escalationModal = document.getElementById('escalation-modal');
        const cancelEscalation = document.getElementById('cancel-escalation');
        const confirmEscalation = document.getElementById('confirm-escalation');
        const modalClose = document.querySelector('.modal-close');
        
        if (cancelEscalation) {
            cancelEscalation.addEventListener('click', () => {
                escalationModal.classList.add('hidden');
            });
        }
        
        if (confirmEscalation) {
            confirmEscalation.addEventListener('click', () => {
                this.handleEscalationConfirm();
            });
        }
        
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                escalationModal.classList.add('hidden');
            });
        }
    }

    setupNavigationTabs() {
        const chatTab = document.getElementById('chat-tab');
        const adminTab = document.getElementById('admin-tab');
        
        chatTab.addEventListener('click', () => {
            this.switchTab('chat');
        });
        
        adminTab.addEventListener('click', () => {
            this.switchTab('admin');
        });
    }

    switchTab(tab) {
        const chatTab = document.getElementById('chat-tab');
        const adminTab = document.getElementById('admin-tab');
        const chatView = document.getElementById('chat-view');
        const adminView = document.getElementById('admin-view');
        
        if (tab === 'chat') {
            chatTab.classList.add('nav-btn--active');
            adminTab.classList.remove('nav-btn--active');
            chatView.classList.remove('hidden');
            adminView.classList.add('hidden');
        } else {
            adminTab.classList.add('nav-btn--active');
            chatTab.classList.remove('nav-btn--active');
            adminView.classList.remove('hidden');
            chatView.classList.add('hidden');
            this.updateAnalytics();
        }
    }

    async initializeSession() {
        // Call backend to create a new session
        try {
            const res = await fetch(`${this.API_BASE}/api/session`, { method: 'POST' });
            if (!res.ok) throw new Error(`Session init failed: ${res.status}`);
            const data = await res.json();
            this.currentSessionId = data.sessionId;
            this.getSession(this.currentSessionId); // ensure local session exists
            document.getElementById('session-id').textContent = `Session: ${this.currentSessionId}`;
        } catch (e) {
            // Fallback to local-only session
            this.currentSessionId = 'session-local-' + Date.now();
            this.getSession(this.currentSessionId);
            document.getElementById('session-id').textContent = `Session: ${this.currentSessionId} (offline)`;
        }
        document.getElementById('quick-actions').style.display = 'block';
    }

    generateSessionId() {
        return 'session-' + Math.random().toString(36).substr(2, 9);
    }

    async sendMessage() {
        const input = document.getElementById('message-input');
        const sendBtn = document.getElementById('send-button');
        const message = input.value.trim();
        if (!message) return;

        input.value = '';
        sendBtn.disabled = true;
        document.getElementById('quick-actions').style.display = 'none';

        // Ensure session is initialized
        this.getSession(this.currentSessionId);

        this.addMessage({ role: 'user', content: message, timestamp: new Date().toISOString() });
        this.showTypingIndicator();

        try {
            const res = await fetch(`${this.API_BASE}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: this.currentSessionId, message })
            });

            if (!res.ok) {
                throw new Error(`Chat API error: ${res.status}`);
            }

            const data = await res.json();
            this.hideTypingIndicator();
            this.addMessage({ role: 'assistant', content: data.response, timestamp: new Date().toISOString() });
            if (data.response.toLowerCase().includes('human agent')) {
                setTimeout(() => {
                    this.showEscalationModal('user_request');
                }, 600);
            }
        } catch (e) {
            // Offline/local fallback using built-in heuristic + FAQ
            try {
                const localResult = await this.processMessage(message);
                this.hideTypingIndicator();
                this.addMessage({ role: 'assistant', content: localResult.content, timestamp: new Date().toISOString() });
                if (localResult.escalation) {
                    setTimeout(() => {
                        this.showEscalationModal(localResult.escalation);
                    }, 600);
                }
            } catch (err) {
                this.hideTypingIndicator();
                this.addMessage({
                    role: 'assistant',
                    content: 'Sorry, there was a problem connecting to support. Please try again.',
                    timestamp: new Date().toISOString()
                });
            }
        } finally {
            sendBtn.disabled = false;
        }
    }

    async processMessage(message) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, Math.random() * 1500 + 500));
        
        const normalizedMessage = message.toLowerCase().trim();
        const session = this.getSession(this.currentSessionId);
        
        // Check for escalation triggers
        const escalationCheck = this.checkEscalationTriggers(normalizedMessage, session);
        if (escalationCheck.shouldEscalate) {
            return {
                content: escalationCheck.response,
                escalation: escalationCheck.reason
            };
        }
        
        // Search FAQ database
        const faqMatch = this.findBestFAQMatch(normalizedMessage);
        
        // Generate response based on confidence
        if (faqMatch.confidence > 0.8 && faqMatch.faq) {
            return {
                content: this.generateFAQResponse(faqMatch),
                escalation: null
            };
        } else if (faqMatch.confidence > 0.5 && faqMatch.faq) {
            return {
                content: this.generateClarificationResponse(faqMatch),
                escalation: null
            };
        } else {
            // Low confidence - offer escalation
            return {
                content: this.generateFallbackResponse(),
                escalation: 'low_confidence'
            };
        }
    }

    checkEscalationTriggers(message, session) {
        const triggers = this.getEscalationTriggers();
        
        // Check for explicit escalation keywords
        for (const keyword of triggers.keywords) {
            if (message.includes(keyword)) {
                return {
                    shouldEscalate: true,
                    reason: 'user_request',
                    response: "I understand you'd like to speak with a human agent. Let me connect you with one of our customer service representatives who can provide personalized assistance."
                };
            }
        }
        
        // Check for negative sentiment
        for (const trigger of triggers.sentimentTriggers) {
            if (message.includes(trigger)) {
                return {
                    shouldEscalate: true,
                    reason: 'negative_sentiment',
                    response: "I can see you're having a frustrating experience. Let me connect you with a human agent who can better assist you and resolve this issue."
                };
            }
        }
        
        // Check for repeated confusion
        if (session.messages.length >= 4) {
            const recentBotMessages = session.messages
                .slice(-4)
                .filter(m => m.role === 'assistant')
                .map(m => m.content.toLowerCase());
            
            const confusionIndicators = ['sorry', "i don't understand", 'clarify', 'unclear'];
            const confusionCount = recentBotMessages.reduce((count, msg) => {
                return count + confusionIndicators.reduce((c, indicator) => {
                    return c + (msg.includes(indicator) ? 1 : 0);
                }, 0);
            }, 0);
            
            if (confusionCount >= 2) {
                return {
                    shouldEscalate: true,
                    reason: 'repeated_confusion',
                    response: "I apologize that I haven't been able to fully address your questions. Let me connect you with a human agent who can provide more detailed assistance."
                };
            }
        }
        
        return { shouldEscalate: false };
    }

    findBestFAQMatch(message) {
        const faqDb = this.getFAQDatabase();
        let bestMatch = { confidence: 0, faq: null, category: null };
        
        for (const [category, faqs] of Object.entries(faqDb)) {
            for (const faq of faqs) {
                let confidence = 0;
                
                const keywordMatches = faq.keywords.filter(keyword => 
                    message.includes(keyword.toLowerCase())
                ).length;
                
                if (keywordMatches > 0) {
                    confidence = (keywordMatches / faq.keywords.length) * faq.confidence;
                    
                    // Boost confidence for partial exact question match
                    if (message.includes(faq.question.toLowerCase().substring(0, 20))) {
                        confidence += 0.2;
                    }
                }
                
                if (confidence > bestMatch.confidence) {
                    bestMatch = { confidence, faq, category };
                }
            }
        }
        
        return bestMatch;
    }

    generateFAQResponse(match) {
        const responses = [
            `${match.faq.answer}\n\nIs there anything else I can help you with regarding this topic?`,
            `Here's what I can tell you: ${match.faq.answer}\n\nWould you like more information about this?`,
            `${match.faq.answer}\n\nDoes this answer your question? Feel free to ask if you need clarification on any part.`
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateClarificationResponse(match) {
        return `I think you're asking about "${match.faq.question}". ${match.faq.answer}\n\nIf this isn't what you were looking for, could you provide a bit more detail about what you need help with?`;
    }

    generateFallbackResponse() {
        const responses = [
            "I'm not entirely sure I understand your question. Could you please rephrase it or provide more details? Alternatively, I can connect you with a human agent who might be better able to assist you.",
            "I don't have a specific answer for that question in my knowledge base. Would you like me to connect you with a human customer service representative who can provide more detailed assistance?",
            "That's a great question, but I'd like to make sure I give you the most accurate information. Would you prefer to speak with one of our human agents who can provide personalized help?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    addMessage(message) {
        const session = this.getSession(this.currentSessionId);
        session.messages.push(message);
        session.lastActivity = Date.now();
        
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = this.createMessageElement(message);
        messagesContainer.appendChild(messageElement);
        
        // Auto-scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Update analytics
        this.analytics.totalMessages++;
    }

    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message--${message.role === 'user' ? 'user' : 'bot'}`;
        
        const avatar = document.createElement('div');
        avatar.className = `message-avatar message-avatar--${message.role === 'user' ? 'user' : 'bot'}`;
        avatar.textContent = message.role === 'user' ? '👤' : '🤖';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const bubble = document.createElement('div');
        bubble.className = `message-bubble message-bubble--${message.role === 'user' ? 'user' : 'bot'}`;
        
        const messageText = document.createElement('p');
        messageText.innerHTML = message.content.replace(/\n/g, '<br>');
        bubble.appendChild(messageText);
        
        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = this.formatTime(new Date(message.timestamp));
        
        content.appendChild(bubble);
        content.appendChild(time);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        
        return messageDiv;
    }

    showTypingIndicator() {
        this.isTyping = true;
        const indicator = document.getElementById('typing-indicator');
        indicator.classList.remove('hidden');
        
        // Auto-scroll to show typing indicator
        const messagesContainer = document.getElementById('chat-messages');
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }, 100);
    }

    hideTypingIndicator() {
        this.isTyping = false;
        const indicator = document.getElementById('typing-indicator');
        indicator.classList.add('hidden');
    }

    showEscalationModal(reason) {
        const modal = document.getElementById('escalation-modal');
        modal.classList.remove('hidden');
        // Optionally show reason or log it for analytics
        this._lastEscalationReason = reason;
    }

    async handleEscalationConfirm() {
        const modal = document.getElementById('escalation-modal');
        modal.classList.add('hidden');
        try {
            const res = await fetch(`${this.API_BASE}/api/escalate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: this.currentSessionId, reason: this._lastEscalationReason || 'User requested escalation' })
            });
            if (!res.ok) throw new Error(`Escalate error: ${res.status}`);
            const data = await res.json();
            this.addMessage({ role: 'assistant', content: data.message, timestamp: new Date().toISOString() });
        } catch (e) {
            this.addMessage({ role: 'assistant', content: 'Failed to escalate. Please try again.', timestamp: new Date().toISOString() });
        }
    }

    clearChat() {
        const messagesContainer = document.getElementById('chat-messages');
        
        // Keep only the initial welcome message
        const welcomeMessage = messagesContainer.querySelector('.message--bot');
        messagesContainer.innerHTML = '';
        if (welcomeMessage) {
            messagesContainer.appendChild(welcomeMessage);
        }
        
        // Reset session
        this.initializeSession();
        
        // Show quick actions again
        document.getElementById('quick-actions').style.display = 'block';
    }

    formatTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        
        return date.toLocaleDateString();
    }

    // Analytics and Admin Dashboard
    loadSampleData() {
        // Load sample conversations for demo
        const sampleSessions = [
            {
                id: 'demo-001',
                messages: 4,
                duration: '3m 24s',
                status: 'completed',
                satisfaction: 5,
                lastActivity: new Date(Date.now() - 300000) // 5 minutes ago
            },
            {
                id: 'demo-002',
                messages: 6,
                duration: '5m 12s',
                status: 'completed',
                satisfaction: 4,
                lastActivity: new Date(Date.now() - 900000) // 15 minutes ago
            },
            {
                id: 'demo-003',
                messages: 2,
                duration: '1m 45s',
                status: 'escalated',
                satisfaction: null,
                lastActivity: new Date(Date.now() - 1200000) // 20 minutes ago
            }
        ];
        
        this.sampleSessions = sampleSessions;
    }

    renderAnalytics() {
        document.getElementById('total-sessions').textContent = this.analytics.totalSessions.toLocaleString();
        document.getElementById('avg-session-length').textContent = `${this.analytics.avgSessionLength} min`;
        document.getElementById('satisfaction-rating').textContent = `${this.analytics.satisfactionRating}/5`;
        document.getElementById('escalation-rate').textContent = `${Math.round(this.analytics.escalationRate * 100)}%`;
    }

    renderCharts() {
        this.renderCategoryChart();
        this.renderResponseTimeChart();
    }

    renderCategoryChart() {
        const ctx = document.getElementById('categories-chart').getContext('2d');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Technical Support', 'Billing & Payments', 'Product Information', 'Account Management'],
                datasets: [{
                    data: [35, 28, 22, 15],
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }

    renderResponseTimeChart() {
        const ctx = document.getElementById('response-time-chart').getContext('2d');
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['< 500ms', '500ms-1s', '1s-2s', '2s-3s', '> 3s'],
                datasets: [{
                    label: 'Response Count',
                    data: [45, 32, 18, 8, 2],
                    backgroundColor: '#1FB8CD',
                    borderRadius: 4
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
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    renderSessions() {
        const container = document.getElementById('sessions-list');
        container.innerHTML = '';
        
        this.sampleSessions.forEach(session => {
            const sessionElement = document.createElement('div');
            sessionElement.className = 'session-item';
            
            sessionElement.innerHTML = `
                <div class="session-info">
                    <div class="session-id-display">${session.id}</div>
                    <div class="session-details">
                        ${session.messages} messages • ${session.duration} • ${this.formatTime(session.lastActivity)}
                    </div>
                </div>
                <div class="session-actions">
                    <span class="status status--${session.status === 'completed' ? 'success' : session.status === 'escalated' ? 'warning' : 'info'}">
                        ${session.status}
                    </span>
                </div>
            `;
            
            container.appendChild(sessionElement);
        });
    }

    updateAnalytics() {
        // Simulate real-time updates
        this.analytics.totalSessions += Math.floor(Math.random() * 3);
        this.analytics.totalMessages += Math.floor(Math.random() * 10);
        
        this.renderAnalytics();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const bot = new CustomerSupportBot();
    
    // Make bot available globally for debugging
    window.supportBot = bot;
});