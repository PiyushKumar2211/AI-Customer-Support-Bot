// Reusable Components for AI Customer Support Bot

// Message Component
class MessageComponent {
    constructor(message, options = {}) {
        this.message = message;
        this.options = {
            showAvatar: true,
            showTime: true,
            animate: true,
            ...options
        };
    }
    
    render() {
        const messageElement = document.createElement('div');
        messageElement.className = `message message--${this.message.role === 'user' ? 'user' : 'bot'}`;
        
        if (this.options.animate) {
            messageElement.style.opacity = '0';
            messageElement.style.transform = 'translateY(20px)';
        }
        
        // Avatar
        if (this.options.showAvatar) {
            const avatar = document.createElement('div');
            avatar.className = `message-avatar message-avatar--${this.message.role === 'user' ? 'user' : 'bot'}`;
            avatar.textContent = this.message.role === 'user' ? '👤' : '🤖';
            messageElement.appendChild(avatar);
        }
        
        // Content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'message-content';
        
        // Message bubble
        const bubble = document.createElement('div');
        bubble.className = `message-bubble message-bubble--${this.message.role === 'user' ? 'user' : 'bot'}`;
        
        // Handle different content types
        if (this.message.type === 'quick_replies') {
            bubble.appendChild(this.renderQuickReplies());
        } else {
            const textElement = document.createElement('p');
            textElement.innerHTML = this.formatMessage(this.message.content);
            bubble.appendChild(textElement);
        }
        
        contentContainer.appendChild(bubble);
        
        // Timestamp
        if (this.options.showTime) {
            const timeElement = document.createElement('div');
            timeElement.className = 'message-time';
            timeElement.textContent = this.formatTime(new Date(this.message.timestamp));
            contentContainer.appendChild(timeElement);
        }
        
        messageElement.appendChild(contentContainer);
        
        // Animate in
        if (this.options.animate) {
            setTimeout(() => {
                messageElement.style.transition = 'all 0.3s ease';
                messageElement.style.opacity = '1';
                messageElement.style.transform = 'translateY(0)';
            }, 50);
        }
        
        return messageElement;
    }
    
    formatMessage(content) {
        // Convert line breaks to <br>
        content = content.replace(/\n/g, '<br>');
        
        // Convert URLs to links
        content = content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
        
        // Convert **bold** to <strong>
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Convert *italic* to <em>
        content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        return content;
    }
    
    renderQuickReplies() {
        const container = document.createElement('div');
        container.className = 'quick-replies';
        
        const text = document.createElement('p');
        text.textContent = this.message.content;
        container.appendChild(text);
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'quick-reply-buttons';
        
        this.message.quick_replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'btn btn--sm btn--outline quick-reply-btn';
            button.textContent = reply.title;
            button.dataset.payload = reply.payload;
            buttonsContainer.appendChild(button);
        });
        
        container.appendChild(buttonsContainer);
        return container;
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
}

// Typing Indicator Component
class TypingIndicatorComponent {
    constructor() {
        this.element = null;
    }
    
    render() {
        const container = document.createElement('div');
        container.className = 'typing-indicator';
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar message-avatar--bot';
        avatar.textContent = '🤖';
        
        const content = document.createElement('div');
        content.className = 'typing-content';
        
        const bubble = document.createElement('div');
        bubble.className = 'typing-bubble';
        
        const dots = document.createElement('div');
        dots.className = 'typing-dots';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            dots.appendChild(dot);
        }
        
        bubble.appendChild(dots);
        content.appendChild(bubble);
        container.appendChild(avatar);
        container.appendChild(content);
        
        this.element = container;
        return container;
    }
    
    show(parentElement) {
        if (!this.element) this.render();
        
        this.element.style.opacity = '0';
        parentElement.appendChild(this.element);
        
        setTimeout(() => {
            this.element.style.transition = 'opacity 0.2s ease';
            this.element.style.opacity = '1';
        }, 50);
    }
    
    hide() {
        if (this.element && this.element.parentNode) {
            this.element.style.opacity = '0';
            setTimeout(() => {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }, 200);
        }
    }
}

// Analytics Card Component
class AnalyticsCardComponent {
    constructor(data) {
        this.data = data;
    }
    
    render() {
        const card = document.createElement('div');
        card.className = 'card analytics-card';
        
        const body = document.createElement('div');
        body.className = 'card__body';
        
        const title = document.createElement('h3');
        title.className = 'analytics-title';
        title.textContent = this.data.title;
        
        const value = document.createElement('div');
        value.className = 'analytics-value';
        value.textContent = this.data.value;
        
        const change = document.createElement('div');
        change.className = `analytics-change ${this.data.trend > 0 ? 'analytics-change--positive' : ''}`;
        change.textContent = `${this.data.trend > 0 ? '+' : ''}${this.data.trend}% from last month`;
        
        body.appendChild(title);
        body.appendChild(value);
        body.appendChild(change);
        card.appendChild(body);
        
        // Add animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, Math.random() * 200);
        
        return card;
    }
}

// Session Item Component
class SessionItemComponent {
    constructor(session, onAction) {
        this.session = session;
        this.onAction = onAction;
    }
    
    render() {
        const item = document.createElement('div');
        item.className = 'session-item';
        
        const info = document.createElement('div');
        info.className = 'session-info';
        
        const sessionId = document.createElement('div');
        sessionId.className = 'session-id-display';
        sessionId.textContent = this.session.id;
        
        const details = document.createElement('div');
        details.className = 'session-details';
        details.innerHTML = `
            ${this.session.messages} messages • 
            ${this.session.duration} • 
            ${this.formatTime(this.session.lastActivity)}
        `;
        
        info.appendChild(sessionId);
        info.appendChild(details);
        
        const actions = document.createElement('div');
        actions.className = 'session-actions';
        
        const status = document.createElement('span');
        status.className = `status status--${this.getStatusClass()}`;
        status.textContent = this.session.status;
        
        actions.appendChild(status);
        
        // Add action buttons if needed
        if (this.session.status === 'active') {
            const viewBtn = document.createElement('button');
            viewBtn.className = 'btn btn--sm btn--outline';
            viewBtn.textContent = 'View';
            viewBtn.onclick = () => this.onAction('view', this.session.id);
            actions.appendChild(viewBtn);
        }
        
        item.appendChild(info);
        item.appendChild(actions);
        
        return item;
    }
    
    getStatusClass() {
        const statusMap = {
            'completed': 'success',
            'escalated': 'warning',
            'active': 'info',
            'timeout': 'error'
        };
        return statusMap[this.session.status] || 'info';
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
}

// Escalation Notice Component
class EscalationNoticeComponent {
    constructor(reason, onAction) {
        this.reason = reason;
        this.onAction = onAction;
    }
    
    render() {
        const notice = document.createElement('div');
        notice.className = 'escalation-notice';
        
        const content = document.createElement('div');
        content.className = 'escalation-content';
        
        const icon = document.createElement('div');
        icon.className = 'escalation-icon';
        icon.innerHTML = '⚠️';
        
        const text = document.createElement('div');
        text.className = 'escalation-text';
        
        const title = document.createElement('h4');
        title.textContent = 'Escalation Recommended';
        
        const description = document.createElement('p');
        description.textContent = this.getEscalationMessage();
        
        text.appendChild(title);
        text.appendChild(description);
        
        const actions = document.createElement('div');
        actions.className = 'escalation-actions';
        
        const escalateBtn = document.createElement('button');
        escalateBtn.className = 'btn btn--sm btn--primary';
        escalateBtn.textContent = 'Connect to Agent';
        escalateBtn.onclick = () => this.onAction('escalate');
        
        const continueBtn = document.createElement('button');
        continueBtn.className = 'btn btn--sm btn--outline';
        continueBtn.textContent = 'Continue with AI';
        continueBtn.onclick = () => this.onAction('continue');
        
        actions.appendChild(escalateBtn);
        actions.appendChild(continueBtn);
        
        content.appendChild(icon);
        content.appendChild(text);
        notice.appendChild(content);
        notice.appendChild(actions);
        
        return notice;
    }
    
    getEscalationMessage() {
        const messages = {
            'low_confidence': 'I may not have the most accurate information for your specific question. A human agent could provide better assistance.',
            'user_request': 'You requested to speak with a human agent. I\'m ready to connect you with our support team.',
            'negative_sentiment': 'I sense you may be frustrated. Let me connect you with a human agent who can provide more personalized help.',
            'repeated_confusion': 'It seems we\'re not quite connecting on this issue. A human agent might be able to help resolve this more effectively.'
        };
        
        return messages[this.reason] || 'A human agent may be better suited to help with your inquiry.';
    }
}

// Toast Notification Component
class ToastComponent {
    constructor(message, type = 'info', duration = 3000) {
        this.message = message;
        this.type = type; // info, success, warning, error
        this.duration = duration;
    }
    
    render() {
        const toast = document.createElement('div');
        toast.className = `toast toast--${this.type}`;
        
        const content = document.createElement('div');
        content.className = 'toast-content';
        content.textContent = this.message;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => this.hide();
        
        toast.appendChild(content);
        toast.appendChild(closeBtn);
        
        this.element = toast;
        return toast;
    }
    
    show(container = document.body) {
        if (!this.element) this.render();
        
        // Create toast container if it doesn't exist
        let toastContainer = container.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container';
            container.appendChild(toastContainer);
        }
        
        toastContainer.appendChild(this.element);
        
        // Animate in
        this.element.style.opacity = '0';
        this.element.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            this.element.style.transition = 'all 0.3s ease';
            this.element.style.opacity = '1';
            this.element.style.transform = 'translateX(0)';
        }, 50);
        
        // Auto hide
        if (this.duration > 0) {
            setTimeout(() => this.hide(), this.duration);
        }
    }
    
    hide() {
        if (this.element && this.element.parentNode) {
            this.element.style.opacity = '0';
            this.element.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }, 300);
        }
    }
}

// Chart Component
class ChartComponent {
    constructor(canvasId, config) {
        this.canvasId = canvasId;
        this.config = config;
        this.chart = null;
    }
    
    render() {
        const canvas = document.getElementById(this.canvasId);
        if (!canvas) {
            console.error(`Canvas element with id '${this.canvasId}' not found`);
            return;
        }
        
        // Destroy existing chart if it exists
        if (this.chart) {
            this.chart.destroy();
        }
        
        // Create new chart
        this.chart = new Chart(canvas, this.config);
        return this.chart;
    }
    
    updateData(newData) {
        if (this.chart) {
            this.chart.data = newData;
            this.chart.update();
        }
    }
    
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }
}

// Modal Component
class ModalComponent {
    constructor(title, content, actions = []) {
        this.title = title;
        this.content = content;
        this.actions = actions;
        this.element = null;
        this.isOpen = false;
    }
    
    render() {
        const modal = document.createElement('div');
        modal.className = 'modal hidden';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        // Header
        const header = document.createElement('div');
        header.className = 'modal-header';
        
        const title = document.createElement('h3');
        title.textContent = this.title;
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'modal-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => this.hide();
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // Body
        const body = document.createElement('div');
        body.className = 'modal-body';
        
        if (typeof this.content === 'string') {
            body.innerHTML = this.content;
        } else {
            body.appendChild(this.content);
        }
        
        // Footer
        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        
        this.actions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = `btn ${action.class || 'btn--outline'}`;
            btn.textContent = action.text;
            btn.onclick = action.handler;
            footer.appendChild(btn);
        });
        
        modalContent.appendChild(header);
        modalContent.appendChild(body);
        if (this.actions.length > 0) {
            modalContent.appendChild(footer);
        }
        
        modal.appendChild(modalContent);
        
        // Click outside to close
        modal.onclick = (e) => {
            if (e.target === modal) {
                this.hide();
            }
        };
        
        this.element = modal;
        return modal;
    }
    
    show(container = document.body) {
        if (!this.element) this.render();
        
        container.appendChild(this.element);
        this.element.classList.remove('hidden');
        this.isOpen = true;
        
        // Focus management
        const firstButton = this.element.querySelector('button');
        if (firstButton) {
            firstButton.focus();
        }
    }
    
    hide() {
        if (this.element && this.element.parentNode) {
            this.element.classList.add('hidden');
            setTimeout(() => {
                if (this.element && this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element);
                }
            }, 150);
        }
        this.isOpen = false;
    }
    
    updateContent(newContent) {
        const body = this.element.querySelector('.modal-body');
        if (body) {
            if (typeof newContent === 'string') {
                body.innerHTML = newContent;
            } else {
                body.innerHTML = '';
                body.appendChild(newContent);
            }
        }
    }
}

// Export components for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MessageComponent,
        TypingIndicatorComponent,
        AnalyticsCardComponent,
        SessionItemComponent,
        EscalationNoticeComponent,
        ToastComponent,
        ChartComponent,
        ModalComponent
    };
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.MessageComponent = MessageComponent;
    window.TypingIndicatorComponent = TypingIndicatorComponent;
    window.AnalyticsCardComponent = AnalyticsCardComponent;
    window.SessionItemComponent = SessionItemComponent;
    window.EscalationNoticeComponent = EscalationNoticeComponent;
    window.ToastComponent = ToastComponent;
    window.ChartComponent = ChartComponent;
    window.ModalComponent = ModalComponent;
}