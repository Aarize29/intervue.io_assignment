import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import QuestionForm from "../../components/QuestionForm ";
import PollResults from "../../components/PollResults ";
import Chat from "../../components/Chat";
import PollHistory from "../../components/PollHistory";

const socket = io("http://localhost:4000");

const Teacher = () => {
  const [students, setStudents] = useState([]);
  const [pollResults, setPollResults] = useState({});
  const [pollHistory, setPollHistory] = useState([]);  // State to store poll history
  const [activeTab, setActiveTab] = useState("ask");  // State to manage the active tab

  useEffect(() => {
    socket.on("pollResults", (results) => {
      setPollResults(results);
      setPollHistory((prevHistory) => [...prevHistory, results]);  // Add new poll results to history
    });

    socket.on("students", (studentsList) => {
      setStudents([...new Set(studentsList)]);  // Remove duplicates
    });

    return () => {
      socket.off("pollResults");
      socket.off("students");
    };
  }, []);

  const handleKickStudent = (studentName) => {
    socket.emit("kickStudent", studentName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-500 to-gray-800 flex flex-col">
      <nav className="flex justify-between items-center bg-black p-6 text-white shadow-md">
        <h1 className="text-3xl font-bold">Teacher Portal</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("ask")}
            className={`text-white py-2 px-4 rounded-lg ${activeTab === "ask" ? "bg-gray-700" : "bg-gray-500"}`}
          >
            Ask a Question
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`text-white py-2 px-4 rounded-lg ${activeTab === "history" ? "bg-gray-700" : "bg-gray-500"}`}
          >
            Poll History
          </button>
        </div>
      </nav>
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <Chat user="Teacher" />
          {activeTab === "ask" ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Ask a Question</h2>
              <QuestionForm />
              <PollResults pollResults={pollResults} />
              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h2 className="text-2xl font-bold mb-4">Current Students</h2>
                <ul>
                  {students.map((student, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center p-2 border-b"
                    >
                      <span className="text-lg">{student}</span>
                      <button
                        onClick={() => handleKickStudent(student)}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition duration-300"
                      >
                        Kick
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <PollHistory pollHistory={pollHistory} />  // Render PollHistory component if history tab is active
          )}
        </div>
      </div>
    </div>
  );
};

export default Teacher;
