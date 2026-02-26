const chatContainer = document.getElementById('chatContainer');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const newChatBtn = document.getElementById('newChatBtn');
const loadingIndicator = document.getElementById('loadingIndicator');

let sessionId = localStorage.getItem('sessionId') || generateSessionId();
localStorage.setItem('sessionId', sessionId);

function generateSessionId() {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function formatTime() {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

function addMessage(content, role, meta = '') {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${role}`;
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = role === 'user' ? '👤' : '🤖';
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = content;
  
  if (meta) {
    const metaDiv = document.createElement('div');
    metaDiv.className = 'message-meta';
    metaDiv.textContent = meta;
    contentDiv.appendChild(metaDiv);
  }
  
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(contentDiv);
  chatContainer.appendChild(messageDiv);
  
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;
  
  addMessage(message, 'user', formatTime());
  messageInput.value = '';
  sendBtn.disabled = true;
  loadingIndicator.style.display = 'flex';
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, message })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    
    const data = await response.json();
    const meta = `${formatTime()} • ${data.retrievedChunks} chunks • ${data.tokensUsed} tokens • similarity: ${data.maxSimilarity}`;
    addMessage(data.reply, 'assistant', meta);
    
  } catch (error) {
    addMessage(`Error: ${error.message}`, 'assistant', formatTime());
  } finally {
    sendBtn.disabled = false;
    loadingIndicator.style.display = 'none';
    messageInput.focus();
  }
}

sendBtn.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

newChatBtn.addEventListener('click', () => {
  sessionId = generateSessionId();
  localStorage.setItem('sessionId', sessionId);
  chatContainer.innerHTML = '';
  addMessage('Hello! I can help you with questions about account management, payments, security, and support. What would you like to know?', 'assistant', formatTime());
});

// Initial greeting
addMessage('Hello! I can help you with questions about account management, payments, security, and support. What would you like to know?', 'assistant', formatTime());
