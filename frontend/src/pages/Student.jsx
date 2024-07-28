import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import PollResults from "../../components/PollResults ";
import Chat from "../../components/Chat";

const socket = io("http://localhost:4000");

const Student = () => {
    const [name, setName] = useState("");
    const [storedName, setStoredName] = useState("");
    const [question, setQuestion] = useState(null);
    const [selectedOption, setSelectedOption] = useState("");
    const [pollResults, setPollResults] = useState({});
    const [timer, setTimer] = useState(60);
    const [showResults, setShowResults] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [answered, setAnswered] = useState(false);
    const timerRef = useRef(null);
  
    useEffect(() => {
      const sessionName = sessionStorage.getItem("studentName");
      if (sessionName) {
        setStoredName(sessionName);
        socket.emit("setName", sessionName);
      }
  
      socket.on("question", (data) => {
        setQuestion(data);
        setTimer(60);
        setShowResults(false);
        setCorrectAnswer("");
        setAnswered(false);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          setTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              if (!answered) {
                socket.emit("submitAnswer", selectedOption);
                setAnswered(true);
              }
              setShowResults(true);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      });
  
      socket.on("pollResults", (results) => {
        setPollResults(results);
      });
  
      socket.on("correctAnswer", (answer) => {
        setCorrectAnswer(answer);
      });
  
      socket.on("kicked", () => {
        sessionStorage.removeItem("studentName");
        setStoredName("");
      });
  
      return () => {
        socket.off();
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, [answered, selectedOption]);
  
    const handleNameSubmit = (e) => {
      e.preventDefault();
      sessionStorage.setItem("studentName", name);
      setStoredName(name);
      socket.emit("setName", name);
    };
  
    const handleAnswerSubmit = (e) => {
      e.preventDefault();
      socket.emit("submitAnswer", selectedOption);
      setShowResults(true);
      setAnswered(true);
    };
  
    const handleWaitForNextQuestion = () => {
      setQuestion(null);
      setShowResults(false);
      setSelectedOption("");
      setPollResults({});
      setCorrectAnswer("");
      setAnswered(false);
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-r from-gray-500 to-gray-800 flex flex-col">
        <nav className="flex justify-between items-center bg-black p-6 text-white shadow-md">
          <h1 className="text-3xl font-bold">Student Portal</h1>
          <div>
            <p>{timer} seconds remaining</p>
          </div>
        </nav>
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
  
            {!storedName ? (
              <div className="mb-4">
                <form onSubmit={handleNameSubmit}>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 w-full mb-4 bg-gray-100 rounded-lg"
                  />
                  <button
                    type="submit"
                    className="bg-black text-white py-2 px-4 rounded-lg w-full"
                  >
                    Join
                  </button>
                </form>
              </div>
            ) : question ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">{question.text}</h2>
                <form onSubmit={handleAnswerSubmit} className="mb-4">
                  {question.options.map((option, index) => (
                    <div key={index} className="mb-2">
                      <input
                        type="radio"
                        id={`option-${index}`}
                        name="option"
                        value={option}
                        checked={selectedOption === option}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        className="mr-2"
                      />
                      <label htmlFor={`option-${index}`}>
                        {option}
                      </label>
                    </div>
                  ))}
                  <button
                    type="submit"
                    className={`py-2 px-4 rounded-lg mt-2 w-full ${answered ? "bg-red-500 cursor-not-allowed" : "bg-black text-white cursor-pointer"}`}
                    disabled={answered}
                  >
                    {answered ? "Submitted" : "Submit Answer"}
                  </button>
                </form>
                {showResults && (
                  <>
                    <PollResults pollResults={pollResults} />
                    <div className="mt-4">
                      <h3 className="text-xl font-bold">
                        Correct Answer: {correctAnswer}
                      </h3>
                      <button
                        onClick={handleWaitForNextQuestion}
                        className="bg-black text-white py-2 px-4 rounded-lg mt-2"
                      >
                        Wait for Next Question
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="mt-4">
                <h2 className="text-xl font-bold mb-2">
                  Waiting for the next question...
                </h2>
              </div>
            )}
          </div>
          <Chat user={storedName || "Student"} />
        </div>
      </div>
    );
  };
  
  export default Student;