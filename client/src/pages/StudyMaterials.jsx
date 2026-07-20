import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getMySyllabuses } from "../services/syllabusService"

function StudyMaterials() {
  const [syllabuses, setSyllabuses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSyllabuses = async () => {
      try {
        const data = await getMySyllabuses()
        setSyllabuses(data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchSyllabuses()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white text-xl">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white">

      <div className="mx-auto max-w-7xl p-8">

        <h1 className="text-4xl font-bold">
          📚 My Study Materials
        </h1>

        <p className="mt-2 text-slate-400">
          Manage all uploaded syllabuses.
        </p>

        <div className="mt-10">

  {syllabuses.length === 0 ? (

    <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/50 p-16 text-center">

      <div className="text-7xl mb-6">
        📚
      </div>

      <h2 className="text-3xl font-bold">
        No Study Materials Yet
      </h2>

      <p className="mt-3 text-slate-400">
        Upload your first syllabus and NeuroLearn will
        automatically create topics, planner,
        notes, quizzes and flashcards.
      </p>

      <Link
        to="/upload-syllabus"
        className="mt-8 inline-block rounded-xl bg-cyan-500 px-8 py-4 font-semibold text-black hover:bg-cyan-400"
      >
        Upload Syllabus
      </Link>

    </div>

  ) : (

    <div className="grid gap-6 md:grid-cols-2">

      {syllabuses.map((syllabus) => {

        const totalTopics =
          syllabus.subjects.reduce(
            (acc, subject) =>
              acc + subject.topics.length,
            0
          )

        const completedTopics =
          syllabus.subjects.reduce(
            (acc, subject) =>
              acc +
              subject.topics.filter(
                topic => topic.completed
              ).length,
            0
          )

        const progress =
          totalTopics === 0
            ? 0
            : Math.round(
                (completedTopics / totalTopics) * 100
              )

        return (

          <div
            key={syllabus._id}
            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl"
          >

            <h2 className="text-2xl font-bold">
              {syllabus.title}
            </h2>

            <p className="mt-2 text-slate-400">
              {totalTopics} Topics
            </p>

            <div className="mt-6">

              <div className="mb-2 flex justify-between">

                <span>Progress</span>

                <span>{progress}%</span>

              </div>

              <div className="h-3 rounded-full bg-slate-700">

                <div
                  className="h-full rounded-full bg-cyan-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>

            <button
              className="mt-8 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400"
            >
              Continue Learning
            </button>

          </div>

        )

      })}

    </div>

  )}

</div>
      </div>

    </div>
  )
}

export default StudyMaterials