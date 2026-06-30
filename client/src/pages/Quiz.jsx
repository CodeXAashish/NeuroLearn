import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { generateQuiz } from "../services/quizService"
import { useNavigate} from "react-router-dom"

function Quiz() {
  const location = useLocation()

  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] =
    useState("easy")

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

  const generateQuizAutomatically = async (
  selectedTopic,
  selectedDifficulty
) => {
  try {
    setLoading(true)

    const data = await generateQuiz({
      topic: selectedTopic,
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

    const response = await axios.post(
      "http://localhost:5000/api/quiz/submit",
      payload
    )

   setResult(response.data)

setCountdown(5)

const interval = setInterval(() => {
  setCountdown((prev) => {
    if (prev === 1) {
      clearInterval(interval)
      navigate("/dashboard")
      return 0
    }

    return prev - 1
  })
}, 1000)

  } catch (error) {
    console.log(error)
  }
}

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold mb-8">
        AI Quiz Generator 🚀
      </h1>

      {/* Topic */}

      <div className="max-w-xl space-y-4">

        <input
          type="text"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e) =>
            setTopic(e.target.value)
          }
          className="w-full p-3 rounded bg-zinc-900"
        />


        <button
          onClick={
            handleGenerateQuiz
          }
          className="bg-blue-600 px-6 py-3 rounded"
        >
          {loading
            ? "Generating..."
            : "Generate Quiz"}
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
                    className="block mb-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={
                        option
                      }
                      checked={
                        answers[index] ===
                        option
                      }
                      onChange={() =>
                        setAnswers({
                          ...answers,
                          [index]:
                            option,
                        })
                      }
                    />

                    <span className="ml-2">
                      {option}
                    </span>
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