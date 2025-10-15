// Simple Express backend for AI Customer Support Bot
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// In-memory session store (replace with DB in production)
let sessions = {};

// Load FAQs (could be externalized to a file/DB)
const faqs = [
  { question: 'How do I reset my password?', answer: 'To reset your password, click on "Forgot Password" on the login page and follow the instructions.' },
  { question: 'What\'s included in the Pro plan?', answer: 'The Pro plan includes advanced analytics, priority support, and unlimited usage.' },
  { question: 'How do I update my payment method?', answer: 'Go to your account settings and select "Billing" to update your payment method.' },
  { question: 'I need to speak to a human agent', answer: 'I can connect you to a human agent. Please wait while I escalate your request.' }
];

// Utility: Extract keywords from text (ASCII-friendly)
function extractKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && ![
      'the','and','for','but','are','you','can','how','why','who','what','when','where','with','from','all','our','not','any','has','have','had','will','was','did','get','got','lets','to','of','in','on','by','or','is','it','as','at','be','an','a','do','if','so','we','i','my','your','this','that','which','their','they','me','us','he','she','his','her','them','then','than','too','also','just','now','out','up','down','off','over','under','again','each','per','via','etc'
    ].includes(word));
}

// Utility: Calculate Jaccard similarity
function calculateSimilarity(text1, text2) {
  const set1 = new Set(extractKeywords(text1));
  const set2 = new Set(extractKeywords(text2));
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// Improved LLM/FAQ response
async function getLLMResponse(message, context) {
  let bestMatch = null;
  let bestScore = 0;
  for (const faq of faqs) {
    const score = calculateSimilarity(message, faq.question + ' ' + (faq.keywords ? faq.keywords.join(' ') : ''));
    if (score > bestScore) {
      bestScore = score;
      bestMatch = faq;
    }
  }
  const msg = message.toLowerCase();
  if (bestScore > 0.3 && bestMatch) return bestMatch.answer;
  if (['human','agent','representative','speak to someone','talk to person'].some(k => msg.includes(k))) {
    return faqs[3].answer;
  }
  return "I'm sorry, I couldn't find an answer. Would you like to speak to a human agent?";
}

// REST endpoint: Send message
app.post('/api/chat', async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Missing sessionId or message' });
    }

    // Contextual memory
    if (!sessions[sessionId]) sessions[sessionId] = [];
    sessions[sessionId].push({ role: 'user', content: message });

    // Get response from LLM (or FAQ)
    const response = await getLLMResponse(message, sessions[sessionId]);
    sessions[sessionId].push({ role: 'assistant', content: response });

    res.json({ response });
  } catch (err) {
    console.error('Chat handler error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// REST endpoint: Start session
app.post('/api/session', (req, res) => {
  const sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
  sessions[sessionId] = [];
  res.json({ sessionId });
});

// REST endpoint: Escalate
app.post('/api/escalate', (req, res) => {
  const { sessionId, reason } = req.body || {};
  // Simulate escalation
  res.json({ status: 'escalated', message: 'A human agent will join shortly.', reason: reason || 'unspecified' });
});


app.get('/api/session/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  res.json({ history: sessions[sessionId] || [] });
});

app.listen(PORT, () => {
  console.log(`AI Support Bot backend running on port ${PORT}`);
});