import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"

import { generateQuiz } from "../services/quizService"

function Quiz() {
  const location = useLocation()

  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] =
    useState("easy")

  const [quiz, setQuiz] = useState([])

  const [answers, setAnswers] =
    useState({})

  const [result, setResult] =
    useState(null)

  const [loading, setLoading] =
    useState(false)

  // Automatically fill topic if coming from Planner
  useEffect(() => {
    if (location.state?.topic) {
      setTopic(location.state.topic)
    }
  }, [location])

  const handleGenerateQuiz =
    async () => {
      try {
        setLoading(true)

        const data =
          await generateQuiz({
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

  const handleSubmitQuiz =
    async () => {
      try {
        const payload = {
          topic,

          answers: quiz.map(
            (q, index) => ({
              question:
                q.question,

              userAnswer:
                answers[index],

              correctAnswer:
                q.correctAnswer,
            })
          ),
        }

        const response =
          await axios.post(
            "http://localhost:5000/api/quiz/submit",
            payload
          )

        setResult(response.data)
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

        <select
          value={difficulty}
          onChange={(e) =>
            setDifficulty(
              e.target.value
            )
          }
          className="w-full p-3 rounded bg-zinc-900"
        >
          <option value="easy">
            Easy
          </option>

          <option value="medium">
            Medium
          </option>

          <option value="hard">
            Hard
          </option>
        </select>

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
          onClick={
            handleSubmitQuiz
          }
          className="bg-green-600 px-6 py-3 rounded"
        >
          Submit Quiz
        </button>
      )}

      {/* Result */}

      {result && (
        <div className="bg-zinc-900 p-6 rounded-xl mt-8">
          <h2 className="text-2xl font-bold">
            🎉 Score:
            {" "}
            {result.score}
            {" / "}
            {
              result.totalQuestions
            }
          </h2>
        </div>
      )}

    </div>
  )
}

export default Quiz