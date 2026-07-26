import { useEffect, useRef, useState } from "react";
import { Bot, User, SendHorizontal } from "lucide-react";
import { sendMessage , getStudyContext } from "../services/chatService";
import { getAnalytics } from "../services/analyticsService";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studyContext, setStudyContext] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
  fetchStudyContext();
  fetchAnalytics();
}, []);

  const suggestedPrompts = [
    "Explain today's study topic",
    "Quiz me on today's lesson",
    "Revise my weak topics",
    "Help me prepare for my exam",
  ];

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      let enhancedMessage = message;

// Today's Topic
if (
  message.toLowerCase().includes("today's topic") ||
  message.toLowerCase().includes("today topic")
) {
  enhancedMessage = `
Explain today's study topic in detail in a beginner-friendly way.

Today's Topics:
${studyContext?.todayTopics?.join("\n") || "None"}

Student's Request:
${message}
`;
}

// Quiz
if (
  message.toLowerCase().includes("quiz") ||
  message.toLowerCase().includes("test me")
) {
  enhancedMessage = `
Generate a quiz for the student.

Today's Topics:
${studyContext?.todayTopics?.join("\n") || "None"}

Weak Topics:
${studyContext?.weakTopics?.join("\n") || "None"}

Instructions:
- Generate 5 multiple-choice questions.
- Prioritize Today's Topics.
- If Today's Topics are unavailable, use Weak Topics.
- Ask only ONE question at a time.
- Wait for the student's answer before asking the next question.
- At the end, calculate the score and explain every incorrect answer.

Student's Request:
${message}
`;
}

// Weak Topics
if (
  message.toLowerCase().includes("weak topic") ||
  message.toLowerCase().includes("revise")
) {
  enhancedMessage = `
Help the student revise their weak topics.

Weak Topics:
${studyContext?.weakTopics?.join("\n") || "None"}

Explain each topic simply with examples and give a few practice questions.

Student's Request:
${message}
`;
}
     const conversation = [
       {
         role: "system",
         content: `You are NeuroLearn AI Tutor.

You are a personalized study assistant.

Always use the student's current study context when answering.

Rules:
- Explain concepts in a simple, beginner-friendly way.
- If the user asks for today's topic, use Today's Topics.
- If the user asks for revision, prioritize Weak Topics.
- Give examples whenever possible.
- If appropriate, suggest practice questions.
- Keep answers clear and structured.

Current Day: ${studyContext?.currentDay || "N/A"}

Today's Topics:
${studyContext?.todayTopics?.join("\n") || "None"}

Weak Topics:
${studyContext?.weakTopics?.join("\n") || "None"}

Average Score:
${analytics?.averageScore || "N/A"}%

Teaching Style:

- If the average score is below 50%, explain concepts very simply with basic examples.
- If the average score is between 50% and 80%, explain concepts normally and include practice questions.
- If the average score is above 80%, provide more advanced explanations, challenging questions, and interview-oriented tips.
`,
    },

  ...messages.map((msg) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.text,
  })),

  {
    role: "user",
    content: enhancedMessage,
  },
];
      const data = await sendMessage(conversation);

      const aiMessage = {
        sender: "ai",
        text: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);

      setMessage("");
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  const fetchStudyContext = async () => {
  try {
    const data = await getStudyContext();
    console.log(data);
    setStudyContext(data);
  } catch (error) {
    console.error("Failed to load study context:", error);
  }
 };

 const fetchAnalytics = async () => {
  try {
    const data = await getAnalytics();
    setAnalytics(data);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto max-w-7xl p-8">

        {/* Hero */}
        <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 p-8">
          <span className="rounded-full bg-cyan-500/20 px-4 py-2 text-cyan-300">
            🤖 AI Tutor
          </span>

          <h1 className="mt-5 text-5xl font-black">
            Your Personal Study Assistant
          </h1>

          <p className="mt-4 max-w-3xl text-slate-400">
            Ask questions, revise today's topics, understand difficult
            concepts, and get personalized explanations based on your study
            progress.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">

  {/* LEFT SIDE - Study Context */}
  <div className="lg:col-span-1">

    <div className="sticky top-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl shadow-lg">

      <h2 className="mb-6 text-xl font-bold">
        📚 Study Context
      </h2>

      <div className="space-y-6">

        <div>
          <p className="text-sm text-slate-400">
            Current Day
          </p>

          <h3 className="mt-1 text-lg font-semibold text-cyan-300">
  {studyContext?.currentDay
    ? `Day ${studyContext.currentDay}`
    : "No active study plan"}
</h3>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Today's Topic
          </p>

          <div className="mt-2 space-y-2">
  {studyContext?.todayTopics?.length ? (
    studyContext.todayTopics.map((topic) => (
      <div
        key={topic}
        className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-cyan-300"
      >
        {topic}
      </div>
    ))
  ) : (
    <p className="text-slate-400">
      No topics for today
    </p>
  )}
</div>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Weak Topics
          </p>

          <div className="mt-3 space-y-2">
  {studyContext?.weakTopics?.length ? (
    studyContext.weakTopics.map((topic) => (
      <div
  key={topic}
  className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 text-cyan-300 line-clamp-3"
>
  {topic}
</div>
    ))
  ) : (
    <p className="text-slate-400">
      No weak topics 🎉
    </p>
  )}
</div>
        </div>

        <div>
          <p className="text-sm text-slate-400">
            Average Score
          </p>

          <h3 className="mt-1 text-lg font-bold text-green-400">
            {analytics ? `${analytics.averageScore}%` : "0%"}
          </h3>
        </div>

      </div>

    </div>

  </div>

  {/* RIGHT SIDE - Chat */}
  <div className="lg:col-span-3">
            {/* Chat Box */}
            <div className="mb-6 h-[600px] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl shadow-lg">

              {messages.length === 0 && !loading && (
                <div className="mb-8">
                  <h2 className="mb-6 text-xl font-bold">
                    💡 Suggested Questions
                  </h2>

                  <div className="grid gap-4 md:grid-cols-2">
                    {suggestedPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => setMessage(prompt)}
                        className="rounded-2xl border border-slate-700 bg-slate-800 p-5 text-left transition hover:border-cyan-400 hover:bg-slate-700"
                      >
                        <p className="font-semibold">{prompt}</p>

                        <p className="mt-2 text-sm text-slate-400">
                          Click to ask the AI Tutor.
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
                            {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-6 flex ${
                    msg.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[80%] gap-3 ${
                      msg.sender === "user"
                        ? "flex-row-reverse"
                        : ""
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        msg.sender === "user"
                          ? "bg-cyan-500 text-black"
                          : "bg-slate-700"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <User size={20} />
                      ) : (
                        <Bot size={20} />
                      )}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl p-4 whitespace-pre-wrap ${
                        msg.sender === "user"
                          ? "bg-cyan-500 text-black"
                          : "bg-slate-800 text-white"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-700">
                    <Bot size={20} />
                  </div>

                  <div className="rounded-2xl bg-slate-800 px-5 py-3">
                    <div className="flex gap-2">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"></span>

                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"
                        style={{ animationDelay: "0.15s" }}
                      ></span>

                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-cyan-400"
                        style={{ animationDelay: "0.3s" }}
                      ></span>
                    </div>
                  </div>

                </div>
              )}

              <div ref={messagesEndRef} />

            </div>

            {/* Input */}

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-xl">

              <div className="flex items-center gap-4">

                <input
                  type="text"
                  placeholder="Ask anything about your studies..."
                  value={message}
                  onChange={(e) =>
                    setMessage(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !loading &&
                      message.trim()
                    ) {
                      handleSend();
                    }
                  }}
                  disabled={loading}
                  className="flex-1 rounded-2xl border border-slate-700 bg-slate-800 px-5 py-4 text-white outline-none transition focus:border-cyan-400"
                />

                <button
                  onClick={handleSend}
                  disabled={
                    loading || !message.trim()
                  }
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500 text-black transition hover:scale-105 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
                >
                  <SendHorizontal size={22} />
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Chat;