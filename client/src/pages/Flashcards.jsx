import { useState } from "react"

import { generateFlashcards }
from "../services/flashcardService"

function Flashcards() {

  const [topic, setTopic] = useState("")

  const [cards, setCards] = useState([])

  const [currentCard, setCurrentCard] = useState(0)

  const [showAnswer, setShowAnswer] = useState(false)

  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    try {

      setLoading(true)

      const data =
        await generateFlashcards({
          topic,
        })

      setCards(data.flashcards)

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

    }

  }

  const previousCard = () => {

    if (currentCard > 0) {

      setCurrentCard(currentCard - 1)

      setShowAnswer(false)

    }

  }

  return (

    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-4xl font-bold mb-8">

        🃏 AI Flashcards

      </h1>

      <div className="bg-zinc-900 p-6 rounded-xl max-w-xl">

        <input
          type="text"
          placeholder="Enter Topic"
          value={topic}
          onChange={(e)=>
            setTopic(e.target.value)
          }
          className="w-full p-3 rounded bg-zinc-800 mb-5"
        />

        <button
          onClick={handleGenerate}
          className="bg-blue-600 w-full py-3 rounded"
        >
          {
            loading
              ? "Generating..."
              : "Generate Flashcards"
          }
        </button>

      </div>

      {
        cards.length > 0 && (

          <div className="bg-zinc-900 p-8 rounded-xl mt-10">

            <h2 className="text-xl mb-6">

              Card {currentCard + 1}
              / {cards.length}

            </h2>

            <div
              className="bg-zinc-800 rounded-xl p-10 min-h-[220px] flex justify-center items-center text-center text-xl cursor-pointer"
              onClick={()=>
                setShowAnswer(
                  !showAnswer
                )
              }
            >

              {
                showAnswer
                  ? cards[currentCard].answer
                  : cards[currentCard].question
              }

            </div>

            <p className="text-center mt-4 text-gray-400">

              Click card to flip

            </p>

            <div className="flex justify-between mt-8">

              <button
                onClick={previousCard}
                disabled={currentCard===0}
                className="bg-zinc-700 px-5 py-2 rounded disabled:opacity-40">

                ⬅ Previous

              </button>

              <button
                onClick={nextCard}
                disabled={
                  currentCard===cards.length-1
                }
                className="bg-blue-600 px-5 py-2 rounded disabled:opacity-40">

                Next ➡

              </button>

            </div>

          </div>

        )
      }

    </div>

  )

}

export default Flashcards