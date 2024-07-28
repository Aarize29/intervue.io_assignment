const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
  },
});

let students = [];
let currentQuestion = null;
let pollResults = {};
let correctAnswer = '';

//establishing web socket connection 
io.on('connection', (socket) => {
  console.log('New client connected');

  //student login  
  socket.on('setName', (name) => {
    students.push({ id: socket.id, name });
    io.emit('students', students.map(student => student.name));
  });

  //function triggers when teacher submit the question
  socket.on('submitQuestion', (questionData) => {
    currentQuestion = questionData;
    correctAnswer = questionData.correctOption;
    pollResults = questionData.options.reduce((acc, option) => {
      acc[option] = 0;
      return acc;
    }, {});
    io.emit('question', questionData);
  });

  //function triggers when student submit there answer
  socket.on('submitAnswer', (answer) => {
    if (pollResults.hasOwnProperty(answer)) {
      pollResults[answer]++;
    }
    io.emit('pollResults', pollResults);
  });


  //function to remove student

  socket.on('kickStudent', (studentName) => {
    const student = students.find(s => s.name === studentName);
    if (student) {
      io.to(student.id).emit('kicked');
      students = students.filter(s => s.id !== student.id);
      io.emit('students', students.map(student => student.name));
    }
  });

  // chat functionality 
  
  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    students = students.filter(s => s.id !== socket.id);
    io.emit('students', students.map(student => student.name));
  });

  setInterval(() => {
    if (currentQuestion) {
      io.emit('correctAnswer', correctAnswer);
    }
  }, 60000); // Emit correct answer every 60 seconds
});

server.listen(4000, () => console.log('Server is running on port 4000'));
