import React from "react";

const PollResults = ({ pollResults }) => {
  const totalVotes = Object.values(pollResults).reduce((a, b) => a + b, 0);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2 text-black">Poll Results</h2>
      {totalVotes > 0 ? (
        <div>
          {Object.entries(pollResults).map(([option, votes], index) => (
            <div key={index} className="mb-2">
              <p>{option}: {votes} votes ({((votes / totalVotes) * 100).toFixed(2)}%)</p>
              <div className="w-full bg-gray-200 rounded">
                <div className="bg-black text-white rounded" style={{ width: `${(votes / totalVotes) * 100}%` }}>
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
  );
};

export default PollResults;
