import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import {
  generateQuiz,
  submitQuiz,
} from "../services/quizService"
import { useNavigate} from "react-router-dom"

function Quiz() {
  const location = useLocation()

  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("easy")

  const [quiz, setQuiz] = useState([])

  const [answers, setAnswers] = useState({})

  const [result, setResult] = useState(null)

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  
  const [countdown, setCountdown] = useState(5)

  // Automatically fill topic if coming from Planner
  useEffect(() => {
  if (location.state?.topic) {
    const selectedTopic = location.state.topic

    const selectedDifficulty =
      location.state.difficulty || "easy"

    setTopic(selectedTopic)

    setDifficulty(selectedDifficulty)

    generateQuizAutomatically(
      selectedTopic,
      selectedDifficulty
    )
  }
}, [location])

useEffect(() => {
  if (!result) return;

  if (countdown === 0) {
    navigate("/dashboard");
    return;
  }

  const timer = setTimeout(() => {
    setCountdown((prev) => prev - 1);
  }, 1000);

  return () => clearTimeout(timer);
}, [result, countdown, navigate]);

  const generateQuizAutomatically = async (
  selectedTopic,
  selectedDifficulty
) => {
  try {
    setLoading(true)

    const data = await generateQuiz({
      topic: selectedTopic,
      difficulty: selectedDifficulty,
    })

    setQuiz(data.quiz)
    setAnswers({})
    setResult(null)

    setLoading(false)
  } catch (error) {
    console.log(error)
    setLoading(false)
  }
}

  const handleGenerateQuiz =
    async () => {
      try {
        setLoading(true)

        const data = await generateQuiz({
            topic,
            difficulty,
          })

        setQuiz(data.quiz)
        setAnswers({})
        setResult(null)

        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }

  const handleSubmitQuiz = async () => {
  try {
    const payload = {
      topic,

      answers: quiz.map((q, index) => ({
        question: q.question,
        userAnswer: answers[index],
        correctAnswer: q.correctAnswer,
      })),
    }
const data = await submitQuiz(payload);
     setResult(data)



setResult(data);
setCountdown(5);
  } catch (error) {
    console.log(error)
  }
}

  return (
    <div className="min-h-screen bg-black text-white p-10">

     <div className="text-center mb-10">
  <h1 className="text-5xl font-bold mb-4">
    🧠 AI Quiz Generator
  </h1>

  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
    Test your knowledge with AI-generated multiple-choice questions
    tailored to your selected topic.
  </p>
</div>
      {/* Topic */}

      <div className="max-w-xl  mx-auto space-y-4">

        <input
          type="text"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e) =>
            setTopic(e.target.value)
          }
          className="w-full p-3 rounded bg-zinc-900"
        />
        <select
  value={difficulty}
  onChange={(e) => setDifficulty(e.target.value)}
  className="w-full p-3 rounded bg-zinc-900"
>
  <option value="easy">🟢 Easy</option>
  <option value="medium">🟡 Medium</option>
  <option value="hard">🔴 Hard</option>
</select>


        <button
  onClick={handleGenerateQuiz}
  disabled={loading || !topic.trim()}
  className="w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded-xl font-semibold disabled:opacity-50"
>
  {loading
    ? "⚡ Generating Quiz..."
    : "✨ Generate Quiz"}
</button>

      </div>

      {/* Questions */}

      <div className="mt-10">

        {quiz.map(
          (q, index) => (
            <div
              key={index}
              className="bg-zinc-900 p-6 rounded-xl mb-6"
            >
              <h2 className="font-bold text-lg mb-4">
                {index + 1}.{" "}
                {q.question}
              </h2>

              {q.options.map(
                (option) => (
                  <label
  key={option}
  className={`block p-4 rounded-xl border cursor-pointer mb-3 transition
    ${
      answers[index] === option
        ? "bg-blue-600 border-blue-500"
        : "bg-zinc-800 border-zinc-700 hover:border-blue-400"
    }`}
>
  <input
    type="radio"
    className="hidden"
    name={`question-${index}`}
    value={option}
    checked={answers[index] === option}
    onChange={() =>
      setAnswers({
        ...answers,
        [index]: option,
      })
    }
  />

  {option}
</label>
                )
              )}
            </div>
          )
        )}

      </div>

      {/* Submit */}

      {quiz.length > 0 && (
        <button
          disabled = { loading || result }
          onClick={ handleSubmitQuiz }
          className="bg-green-600 px-6 py-3 rounded disabled:opacity-50"
        >
          Submit Quiz
        </button>
      )}

      {/* Result */}

    {result && (
  <div className="bg-zinc-900 p-6 rounded-xl mt-8 text-center">

    <h2 className="text-3xl font-bold text-green-400 mb-4">
      🎉 Quiz Completed!
    </h2>

    <p className="text-2xl mb-3">
      Score: {result.score} / {result.totalQuestions}
    </p>

    <p className="text-green-300">
      ✅ Quiz submitted successfully.
    </p>

    <p className="text-green-300 mb-5">
      📈 Updating your learning progress...
    </p>

    <p className="text-gray-400">
      Redirecting to Dashboard in...
    </p>

    <h1 className="text-6xl font-bold text-blue-500 mt-4">
      {countdown}
    </h1>

   </div>
  )}

    </div>
  )
}

export default Quiz