import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

const Student = () => {
  const [name, setName] = useState('');
  const [storedName, setStoredName] = useState('');
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [pollResults, setPollResults] = useState({});
  const [timer, setTimer] = useState(60);
  const [showResults, setShowResults] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [answered, setAnswered] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const sessionName = sessionStorage.getItem('studentName');
    if (sessionName) {
      setStoredName(sessionName);
      socket.emit('setName', sessionName);
    }

    socket.on('question', (data) => {
      setQuestion(data);
      setTimer(60);
      setShowResults(false);
      setCorrectAnswer('');
      setAnswered(false);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            if (!answered) {
              socket.emit('submitAnswer', selectedOption);
              setAnswered(true);
            }
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on('pollResults', (results) => {
      setPollResults(results);
    });

    socket.on('correctAnswer', (answer) => {
      setCorrectAnswer(answer);
    });

    socket.on('kicked', () => {
      sessionStorage.removeItem('studentName');
      setStoredName('');
    });

    return () => {
      socket.off();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [answered, selectedOption]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem('studentName', name);
    setStoredName(name);
    socket.emit('setName', name);
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    socket.emit('submitAnswer', selectedOption);
    setShowResults(true);
    setAnswered(true);
  };

  const handleNextQuestionClick = () => {
    setQuestion(null);
    setShowResults(false);
    setSelectedOption('');
    setPollResults({});
    setCorrectAnswer('');
    setAnswered(false);
  };

  const totalVotes = Object.values(pollResults).reduce((a, b) => a + b, 0);

  return (
    <div className="container mx-auto p-4">
      <nav className="flex justify-between items-center bg-gray-800 p-4 text-white">
        <h1 className="text-3xl font-bold">Student Portal</h1>
        <div>
          <p>{timer} seconds remaining</p>
        </div>
      </nav>
      <div className="p-4">
        {!storedName ? (
          <div className="mb-4">
            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full mb-2"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded"
              >
                Submit Name
              </button>
            </form>
          </div>
        ) : (
          <>
            {question && !showResults ? (
              <div>
                <div className="mb-2">
                  <p>{question.text}</p>
                  <div className="relative w-full bg-gray-200 rounded">
                    <div className="absolute top-0 left-0 h-full bg-blue-500 rounded" style={{ width: `${(60 - timer) / 60 * 100}%` }}></div>
                  </div>
                  <p>{timer} seconds remaining</p>
                </div>
                <form onSubmit={handleAnswerSubmit}>
                  {question.options.map((option, index) => (
                    <div key={index} className="mb-2">
                      <input
                        type="radio"
                        id={`option-${index}`}
                        name="option"
                        value={option}
                        onChange={(e) => setSelectedOption(e.target.value)}
                      />
                      <label htmlFor={`option-${index}`}>{option}</label>
                    </div>
                  ))}
                  <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Submit Answer
                  </button>
                </form>
              </div>
            ) : (
              <p>Waiting for teacher to ask a question...</p>
            )}
            {showResults && (
              <div>
                <h2>Polling Results</h2>
                {Object.keys(pollResults).length > 0 ? (
                  Object.entries(pollResults).map(([option, votes], index) => (
                    <div key={index} className="mb-2">
                      <p>{option}: {votes} votes ({totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(2) : 0}%)</p>
                      <div className="w-full bg-gray-200 rounded">
                        <div className="bg-blue-500 rounded" style={{ width: `${totalVotes > 0 ? (votes / totalVotes) * 100 : 0}%` }}>
                          &nbsp;
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No results yet...</p>
                )}
                {correctAnswer && (
                  <div>
                    <h2>Correct Answer</h2>
                    <p>The correct answer is: {correctAnswer}</p>
                    <button
                      onClick={handleNextQuestionClick}
                      className="bg-green-500 text-white p-2 rounded mt-4"
                    >
                      Waiting for next question
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Student;
