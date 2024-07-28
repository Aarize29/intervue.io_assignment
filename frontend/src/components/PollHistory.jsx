import React from "react";

const PollHistory = ({ pollHistory }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold mb-4">Poll History</h2>
      <div className="space-y-4">
        {pollHistory.length === 0 ? (
          <p>No past polls available.</p>
        ) : (
          pollHistory.map((poll, index) => (
            <div key={index} className="border p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-2">Poll {index + 1}</h3>
              <ul>
                {Object.keys(poll).map((option, idx) => (
                  <li key={idx}>
                    {option}: {poll[option]}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PollHistory;
