/*
  Summary:- Added feature of adding dynamic number of options to a question , and a button which sends question to the students
*/
import React, { useState } from "react";
import io from "socket.io-client";

const socket = io("https://intervue-io-assignment.onrender.com");  //Prod
// const socket = io("http://localhost:400");  //Dev 


const QuestionForm = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [correctOption, setCorrectOption] = useState("");

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
    socket.emit("submitQuestion", questionData);
    setQuestion("");
    setOptions([]);
    setCorrectOption("");
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  return (
    <form onSubmit={handleQuestionSubmit} className="mb-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="border p-2 w-full mb-2 bg-gray-100 text-black"
        />
        {options.map((option, index) => (
          <div key={index} className="mb-2 flex items-center">
            <input
              type="text"
              placeholder={`Option ${index + 1}`}
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="border p-2 w-full bg-gray-100 text-black"
            />
            <input
              type="radio"
              id={`correct-${index}`}
              name="correctOption"
              value={option}
              checked={correctOption === option}
              onChange={(e) => setCorrectOption(e.target.value)}
              className="ml-2"
            />
            <label htmlFor={`correct-${index}`} className="ml-2 text-black">Correct</label>
            <button
              type="button"
              onClick={() => removeOption(index)}
              className="ml-2 bg-red-500 text-white p-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addOption}
          className="bg-black text-white p-2 rounded mt-2"
        >
          Add Option
        </button>
      </div>
      <button type="submit" className="bg-black text-white p-2 rounded">
        Ask Question
      </button>
    </form>
  );
};

export default QuestionForm;
