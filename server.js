const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

let users = [];

io.on('connection', socket => {
  console.log('Foydalanuvchi ulandi');

  socket.on('join', data => {
    socket.data = data;

    let match = users.find(u =>
      u.gender === data.lookingFor &&
      u.lookingFor === data.gender &&
      u.age === data.lookingAge
    );

    if (match) {
      socket.emit('message', 'Suhbatdosh topildi!');
      match.socket.emit('message', 'Suhbatdosh topildi!');
      socket.match = match.socket;
      match.socket.match = socket;
      users = users.filter(u => u.socket !== match.socket);
    } else {
      users.push({ socket, ...data });
      socket.emit('message', 'Sizni kutmoqda...');
    }
  });

  socket.on('message', msg => {
    if (socket.match) socket.match.emit('message', msg);
  });

  socket.on('disconnect', () => {
    users = users.filter(u => u.socket !== socket);
  });
});

server.listen(3000, () => console.log('Server 3000-portda ishlayapti'));