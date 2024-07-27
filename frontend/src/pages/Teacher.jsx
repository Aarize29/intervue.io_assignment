import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

const Teacher = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctOption, setCorrectOption] = useState("");
  const [students, setStudents] = useState([]);
  const [pollResults, setPollResults] = useState({});

  useEffect(() => {
    socket.on('pollResults', (results) => {
      setPollResults(results);
    });

    socket.on('students', (studentsList) => {
      setStudents(studentsList);
    });

    return () => socket.off();
  }, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleQuestionSubmit = (e) => {
    e.preventDefault();
    const questionData = {
      text: question,
      options: options.filter(option => option.trim()),
      correctOption
    };
    socket.emit('submitQuestion', questionData);
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectOption("");
  };

  const handleKickStudent = (studentName) => {
    socket.emit('kickStudent', studentName);
  };

  const totalVotes = Object.values(pollResults).reduce((a, b) => a + b, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Teacher Portal</h1>
      <form onSubmit={handleQuestionSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter your question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          {options.map((option, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="border p-2 w-full"
              />
              <input
                type="radio"
                id={`correct-${index}`}
                name="correctOption"
                value={option}
                checked={correctOption === option}
                onChange={(e) => setCorrectOption(e.target.value)}
              />
              <label htmlFor={`correct-${index}`}>Correct</label>
            </div>
          ))}
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Ask Question
        </button>
      </form>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Current Students</h2>
        <ul>
          {students.map((student, index) => (
            <li key={index} className="flex justify-between items-center">
              {student}
              <button
                onClick={() => handleKickStudent(student)}
                className="bg-red-500 text-white p-1 rounded ml-2"
              >
                Kick
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Poll Results</h2>
        {totalVotes > 0 ? (
          <div>
            {Object.entries(pollResults).map(([option, votes], index) => (
              <div key={index} className="mb-2">
                <p>{option}: {votes} votes ({((votes / totalVotes) * 100).toFixed(2)}%)</p>
                <div className="w-full bg-gray-200 rounded">
                  <div className="bg-blue-500 rounded" style={{ width: `${(votes / totalVotes) * 100}%` }}>
                    &nbsp;
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No results yet.</p>
        )}
      </div>
    </div>
  );
};

export default Teacher;
