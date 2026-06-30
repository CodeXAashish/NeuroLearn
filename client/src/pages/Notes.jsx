import { useState } from "react"
import { generateNotes } from "../services/notesService"
import { useNavigate } from "react-router-dom"

function Notes() {
  const [topic, setTopic] = useState("")
  const [type, setType] = useState("Detailed Notes")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleGenerateNotes = async () => {
    try {
      setLoading(true)

      const data = await generateNotes({
        topic,
        type,
      })

      setNotes(data.notes)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold mb-8">
        📚 AI Notes Generator
      </h1>

      <div className="bg-zinc-900 p-6 rounded-xl max-w-2xl">

        <label className="block mb-2 font-semibold">
          Topic
        </label>

        <input
          type="text"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e) =>
            setTopic(e.target.value)
          }
          className="w-full p-3 rounded bg-zinc-800 mb-6"
        />

        <label className="block mb-2 font-semibold">
          Notes Type
        </label>

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
          className="w-full p-3 rounded bg-zinc-800 mb-6"
        >
          <option>
            Detailed Notes
          </option>

          <option>
            Short Notes
          </option>

          <option>
            Revision Notes
          </option>

          <option>
            Viva Questions
          </option>
        </select>

        <button
          onClick={handleGenerateNotes}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded w-full"
        >
          {loading
            ? "Generating..."
            : "Generate Notes"}
        </button>

      </div>

      {notes && (
  <div className="bg-zinc-900 rounded-xl p-6 mt-8">

    <h2 className="text-2xl font-bold mb-6">
      📚 Generated Notes
    </h2>

    <div className="whitespace-pre-wrap leading-8 mb-8">
      {notes}
    </div>

    <div className="flex flex-wrap gap-4">

      <button
        onClick={() =>
          navigator.clipboard.writeText(notes)
        }
        className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded"
      >
        📋 Copy Notes
      </button>

      <button
        onClick={() => navigate("/quiz", {
        state: {
        topic,
      },
    })
  }
  className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded">
  📝 Generate Quiz
</button>

      <button
        className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded"
      >
        🃏 Flashcards
      </button>

      <button
        className="bg-orange-600 hover:bg-orange-700 px-5 py-3 rounded"
      >
        📄 Download PDF
      </button>

    </div>

  </div>
)}

    </div>
  )
}

export default Notes