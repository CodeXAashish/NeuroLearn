import { useState } from "react"
import { generateNotes } from "../services/notesService"
import { useNavigate } from "react-router-dom"
import NotesSection from "../components/NotesSection";

function Notes() {
  const [topic, setTopic] = useState("")
  const [type, setType] = useState("Detailed Notes")
  const [notes, setNotes] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleGenerateNotes = async () => {
    try {
      setLoading(true)

      const data = await generateNotes({
        topic,
        type,
      })

      try {
  const parsedNotes = JSON.parse(data.notes);
  setNotes(parsedNotes);
} catch (error) {
  console.error("Invalid JSON:", error);
  setNotes(null);
}
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }
  //console.log(notes);
  return (
    <div className="min-h-screen bg-black text-white p-10">

      <div className="mb-8">
  <h1 className="flex items-center gap-3 text-4xl font-bold text-white">
    📚 AI Notes Generator
  </h1>

  <p className="mt-2 text-slate-400">
    Generate AI-powered notes for exams, interviews, revision,
    and quick learning.
  </p>
</div>

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

        <div className="grid grid-cols-2 gap-4">
{[
  {
    title: "📖 Detailed Notes",
    value: "Detailed Notes",
    description: "Complete topic explanation",
  },
  {
    title: "⚡ Revision Notes",
    value: "Revision Notes",
    description: "Quick exam revision",
  },
  {
    title: "💼 Interview Notes",
    value: "Interview Notes",
    description: "Interview preparation",
  },
  {
    title: "🎤 Viva Notes",
    value: "Viva Notes",
    description: "Important viva questions",
  },
].map((noteType) => (
  <button
    key={noteType.value}
    type="button"
    onClick={() => setType(noteType.value)}
    className={`rounded-xl border p-4 text-left transition-all ${
      type === noteType.value
        ? "border-cyan-500 bg-cyan-500/10"
        : "border-slate-700 bg-slate-800 hover:border-cyan-400"
    }`}
  >
    <h3 className="text-lg font-semibold text-white">
      {noteType.title}
    </h3>

    <p className="mt-1 text-sm text-slate-400">
      {noteType.description}
    </p>
  </button>
))}
</div>

        <button
  onClick={handleGenerateNotes}
  disabled={loading}
  className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl bg-cyan-500 px-6 py-4 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
>
  {loading ? (
    <>
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
      Generating AI Notes...
    </>
  ) : (
    <>
      ✨ Generate AI Notes
    </>
  )}
</button>

      </div>

    {notes && (
  <div className="bg-zinc-900 rounded-xl p-6 mt-8">

    <div className="mb-8">

      <h1 className="mb-8 text-4xl font-bold text-white">
        {notes.title}
      </h1>
    {notes.introduction && (
  <NotesSection
    icon="📖"
    title="Introduction"
  >
    <p>{notes.introduction}</p>
  </NotesSection>
)}

{notes.sections?.map((section, index) => (
  <NotesSection
    key={index}
    icon="📘"
    title={section.heading}
  >
    <p>{section.content}</p>
  </NotesSection>
))}
    </div>

    {/* Keep your action buttons here */}
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
        onClick={() =>navigate("/quiz", {
        state: {
        topic,
        difficulty: "easy",
        source: "notes",
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