import { useState } from "react"
import { generateFlashcards } from "../services/flashcardService"

function Flashcards() {
  const [topic, setTopic] = useState("")
  const [cards, setCards] = useState([])
  const [currentCard, setCurrentCard] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [loading, setLoading] = useState(false) 
  const [completed, setCompleted] = useState(false)

  const handleGenerate = async () => {
    try {
      setLoading(true)

      const data = await generateFlashcards({
        topic,
      })

      setCards(data.flashcards)
      setCompleted(false)
      setCurrentCard(0)
      setShowAnswer(false)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const nextCard = () => {
    if (currentCard < cards.length - 1) {
      setCurrentCard(currentCard + 1)
      setShowAnswer(false)
    } else {
        setCompleted(true)
    }
  }

  const previousCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1)
      setShowAnswer(false)
    }
  }

  const progress =
    cards.length > 0
      ? ((currentCard + 1) / cards.length) * 100
      : 0

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold text-center mb-10">
        🃏 AI Flashcards
      </h1>

      {/* Input Section */}

      <div className="bg-zinc-900 p-6 rounded-xl max-w-xl mx-auto">

        <input
          type="text"
          placeholder="Enter Topic (e.g. DBMS)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full p-3 rounded bg-zinc-800 mb-5 outline-none"
        />

        <button
          onClick={handleGenerate}
          className="bg-blue-600 hover:bg-blue-700 transition w-full py-3 rounded font-semibold"
        >
          {loading
            ? "Generating..."
            : "Generate Flashcards"}
        </button>

      </div>

      {completed && (
      <div className="max-w-3xl mx-auto mt-10 bg-zinc-900 rounded-2xl p-10 text-center">

    <h1 className="text-5xl font-bold text-green-400 mb-6">
      🎉 Congratulations!
    </h1>

    <p className="text-xl text-gray-300 mb-8">
      You have reviewed all {cards.length} flashcards.
    </p>

    <button
      onClick={() => {
        setCompleted(false)
        setCurrentCard(0)
        setShowAnswer(false)
      }}
      className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-semibold"
    >
      🔄 Review Again
    </button>

  </div>
)}

      {/* Flashcards */}

      {cards.length > 0 && !completed && (

        <div className="max-w-3xl mx-auto mt-10">

          {/* Counter */}

          <div className="flex justify-between items-center mb-4">

            <h2 className="text-xl font-semibold">
              Card {currentCard + 1} / {cards.length}
            </h2>

            <span className="text-gray-400">
              {Math.round(progress)}%
            </span>

          </div>

          {/* Progress Bar */}

          <div className="w-full bg-zinc-700 rounded-full h-3 mb-8">

            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            ></div>

          </div>

          {/* 3D Flashcard */}

          <div
            style={{
              perspective: "1000px",
            }}
          >

            <div
              onClick={() =>
                setShowAnswer(!showAnswer)
              }
              className="relative w-full h-80 cursor-pointer transition-transform duration-700"
              style={{
                transformStyle:
                  "preserve-3d",
                transform: showAnswer
                  ? "rotateY(180deg)"
                  : "rotateY(0deg)",
              }}
            >

              {/* Front */}

              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl flex flex-col justify-center items-center p-8"
                style={{
                  backfaceVisibility:
                    "hidden",
                  WebkitBackfaceVisibility:
                    "hidden",
                }}
              >

                <h2 className="text-xl font-bold mb-5">
                  🃏 Question
                </h2>

                <p className="text-2xl text-center">
                  {cards[currentCard].question}
                </p>

                <p className="mt-10 text-blue-200">
                  Click to Flip
                </p>

              </div>

              {/* Back */}

              <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-700 shadow-2xl flex flex-col justify-center items-center p-8"
                style={{
                  transform:
                    "rotateY(180deg)",
                  backfaceVisibility:
                    "hidden",
                  WebkitBackfaceVisibility:
                    "hidden",
                }}
              >

                <h2 className="text-xl font-bold mb-5">
                  🧠 Answer
                </h2>

                <p className="text-xl text-center">
                  {cards[currentCard].answer}
                </p>

                <p className="mt-10 text-green-200">
                  Click to Flip Back
                </p>

              </div>

            </div>

          </div>

          {/* Navigation */}

          <div className="flex justify-between mt-10">

            <button
              onClick={previousCard}
              disabled={currentCard === 0}
              className="bg-zinc-700 px-6 py-3 rounded disabled:opacity-40"
            >
              ⬅ Previous
            </button>

            <button
              onClick={nextCard}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded">
              {currentCard === cards.length - 1
               ? "Finish 🎉"
               : "Next ➡"}
            </button>

          </div>

        </div>

      )}

    </div>
  )
}

export default Flashcards