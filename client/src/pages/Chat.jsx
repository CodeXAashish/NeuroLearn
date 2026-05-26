import { useState } from "react"

import { sendMessage } from "../services/chatService"

function Chat() {
  const [message, setMessage] =
    useState("")

  const [messages, setMessages] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const handleSend = async () => {
    if (!message) return

    const userMessage = {
      sender: "user",
      text: message,
    }

    setMessages((prev) => [
      ...prev,
      userMessage,
    ])

    setLoading(true)

    try {
      const conversation = [
  ...messages.map((msg) => ({
    role:
      msg.sender === "user"
        ? "user"
        : "assistant",

    content: msg.text,
  })),

  {
    role: "user",
    content: message,
  },
]

const data = await sendMessage(
  conversation
)

      const aiMessage = {
        sender: "ai",
        text: data.reply,
      }

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ])

      setMessage("")
    } catch (error) {
      console.log(error)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-6">
        NeuroLearn AI Tutor 💬
      </h1>

      <div className="bg-zinc-900 rounded-xl p-4 h-[500px] overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.sender === "user"
                ? "text-right"
                : "text-left"
            }`}
          >
            <div
             className={`inline-block p-3 rounded-xl max-w-[70%] whitespace-pre-wrap ${
             msg.sender === "user"
             ? "bg-blue-600"
             : "bg-zinc-700"
             }`}
             >
             {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <p>AI is thinking...</p>
        )}
      </div>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Ask anything..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          className="flex-1 p-3 rounded bg-zinc-900"
        />

        <button
          onClick={handleSend}
          className="bg-blue-600 px-6 rounded"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat