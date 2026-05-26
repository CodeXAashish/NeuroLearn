import { useState } from "react"

import { generateQuiz } from "../services/quizService"

function Quiz() {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] =
    useState("easy")

  const [quiz, setQuiz] = useState("")

  const [loading, setLoading] =
    useState(false)

  const handleGenerateQuiz = async () => {
    try {
      setLoading(true)

      const data = await generateQuiz({
        topic,
        difficulty,
      })

      setQuiz(data.quiz)

      setLoading(false)
    } catch (error) {
      console.log(error)

      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold mb-8">
        AI Quiz Generator 🚀
      </h1>

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
            setDifficulty(e.target.value)
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
          onClick={handleGenerateQuiz}
          className="bg-blue-600 px-6 py-3 rounded"
        >
          {loading
            ? "Generating..."
            : "Generate Quiz"}
        </button>
      </div>

      <div className="mt-10 whitespace-pre-wrap bg-zinc-900 p-6 rounded-xl">
        {quiz}
      </div>
    </div>
  )
}

export default Quiz