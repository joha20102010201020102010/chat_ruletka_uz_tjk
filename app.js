const socket = io();
const setupForm = document.getElementById('setupForm');
const chatContainer = document.getElementById('chatContainer');
const startBtn = document.getElementById('startBtn');
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('messageInput');
const canvas = document.getElementById('chatCanvas');
const ctx = canvas.getContext('2d');

startBtn.onclick = () => {
  const gender = document.getElementById('gender').value;
  const lookingFor = document.getElementById('lookingFor').value;
  const age = document.getElementById('age').value;
  const lookingAge = document.getElementById('lookingAge').value;

  socket.emit('join', { gender, lookingFor, age, lookingAge });
  setupForm.style.display = 'none';
  chatContainer.style.display = 'block';
};

sendBtn.onclick = () => {
  const msg = messageInput.value.trim();
  if (!msg) return;
  socket.emit('message', msg);
  drawMessage('Siz', msg);
  messageInput.value = '';
};

socket.on('message', msg => drawMessage('U', msg));

function drawMessage(user, msg) {
  ctx.fillStyle = user === 'Siz' ? '#ff6f91' : '#6fb1fc';
  ctx.font = '16px Arial';
  ctx.fillText(`${user}: ${msg}`, 10, Math.random() * canvas.height);
}