import { useState } from "react"
import { FaCloudUploadAlt, FaFilePdf } from "react-icons/fa"
import { uploadSyllabus } from "../services/syllabusService"

function UploadSyllabus() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF first.")
      return
    }

    try {
      setLoading(true)

      const data = await uploadSyllabus(file)
      
      console.log(data.syllabus)
      alert(data.message)

    } catch (err) {
      console.log(err)
      
      alert("Upload failed.")
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center px-6">

      <div className="w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl p-10">

        <h1 className="text-4xl font-bold">
          Upload Study Material
        </h1>

        <p className="mt-3 text-slate-400">
          Upload your syllabus PDF to automatically generate
          notes, planner, quizzes and flashcards.
        </p>

        <label
          htmlFor="pdf"
          className="mt-10 flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-cyan-500/40 py-16 transition hover:border-cyan-400 hover:bg-slate-800/40"
        >

          <FaCloudUploadAlt
            className="text-cyan-400"
            size={70}
          />

          <h2 className="mt-6 text-2xl font-semibold">
            Drag & Drop PDF Here
          </h2>

          <p className="mt-2 text-slate-400">
            or click to browse your computer
          </p>

          <input
            id="pdf"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />

        </label>

        {file && (

          <div className="mt-8 flex items-center gap-4 rounded-2xl bg-slate-800 p-5">

            <FaFilePdf
              className="text-red-500"
              size={40}
            />

            <div className="flex-1">

              <h3 className="font-semibold">
                {file.name}
              </h3>

              <p className="text-sm text-slate-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>

            </div>

          </div>

        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-8 w-full rounded-2xl bg-cyan-500 py-4 text-lg font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {loading
            ? "Uploading..."
            : "Upload Syllabus"}

        </button>

      </div>

    </div>
  )
}

export default UploadSyllabus