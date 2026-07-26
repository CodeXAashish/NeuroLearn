import React from "react";
import { useEffect, useState } from "react";
import { getMistakes, resolveMistake, explainMistake} from "../services/mistakeService";

function MistakeReview() {
    const [mistakes, setMistakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedExplanation, setSelectedExplanation] = useState("");
    const [explainingId, setExplainingId] = useState(null);

    const fetchMistakes = async () => {
  try {
    const data = await getMistakes();
    setMistakes(data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

const handleResolve = async (id) => {
  try {
    await resolveMistake(id);

    setMistakes((prev) =>
      prev.filter((mistake) => mistake._id !== id)
    );
  } catch (error) {
    console.error(error);
  }
};
const handleExplain = async (mistake) => {
  try {
    setExplainingId(mistake._id);

    const data = await explainMistake(mistake);

    setSelectedExplanation(data.explanation);
  } catch (error) {
    console.error(error);
  } finally {
    setExplainingId(null);
  }
};

useEffect(() => {
  fetchMistakes();
}, []);
console.log(mistakes);
  return (
  <div className="min-h-screen bg-[#020617] text-white p-8">
    <h1 className="mb-8 text-4xl font-bold">
      Mistake Review
    </h1>

    {loading ? (
      <p>Loading...</p>
    ) : mistakes.length === 0 ? (
      <p>No unresolved mistakes 🎉</p>
    ) : (
      <div className="space-y-6">
        {mistakes.map((mistake) => (
          <div
            key={mistake._id}
            className="rounded-2xl border border-slate-700 bg-slate-900 p-6"
          >
            <p className="text-sm text-cyan-400">
              {mistake.topic}
            </p>

             <h2 className="mt-2 text-xl font-semibold">
              {mistake.question}
             </h2>

             <div className="mt-6 space-y-3">
              <div>
                <p className="text-red-400 font-semibold">
                  ❌ Your Answer
                </p>

                <p>{mistake.userAnswer}</p>
              </div>

              <div>
                <p className="text-green-400 font-semibold">
                  ✅ Correct Answer
                </p>

                <p>{mistake.correctAnswer}</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
  <button
    onClick={() => handleExplain(mistake)}
    className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700"
  >
    {explainingId === mistake._id ? "Explaining..." : "🤖 Explain with AI"}
  </button>

  <button
    onClick={() => handleResolve(mistake._id)}
    className="rounded-lg bg-green-600 px-4 py-2 font-medium hover:bg-green-700"
  >
    Mark as Resolved
  </button>
</div>
{selectedExplanation && (
  <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-6">
    <h2 className="mb-4 text-2xl font-bold">
      AI Explanation
    </h2>

    <p className="whitespace-pre-wrap">
      {selectedExplanation}
    </p>
  </div>
)}
            
          </div>
        ))}
      </div>
    )}
  </div>
);
}

export default MistakeReview;