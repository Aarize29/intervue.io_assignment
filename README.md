# Intervue.io SDE Intern Assignment


This project is a real-time classroom polling application that allows teachers to ask questions and gather responses from students. It includes a chat feature for real-time communication and a poll history for reviewing past poll results.

## Features

- **Teacher Portal**
  - Ask a new question to students
  - View current poll results
  - View poll history
  - Kick a student from the session
  - Chat with students

- **Student Portal**
  - Answer questions within 60 seconds
  - View live poll results after answering or after the timer expires
  - Chat with the teacher and other students

## Technology used

- **Frontend**
  - React js
  - Tailwind CSS
  - Socket-io client

- **Backend**
  - Node js
  - Express js
  - Socket io

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   https://github.com/Aarize29/intervue.io_assignment.git
   cd intervue.io_assignment
   ```
2.  Backend
   ```bash
    cd backend
    npm install
    npm run start
  ```
3. Frontend
     Change the port from prod to dev ( given in the codebase, just uncomment the dev url and comment the prod url)
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

### Deployed website
  - https://intervue-io-assignment.vercel.app/

### Assignment link:
- https://drive.google.com/file/d/15dPzzdBs9q7Lgbb2jGHMqgTULxL1tePl/view?usp=sharing
