import { Routes, Route } from "react-router-dom"

import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"

import ProtectedRoute from "./components/ProtectedRoute"
import Quiz from "./pages/Quiz"
import Chat from "./pages/Chat"
import Planner from "./pages/Planner"
import Notes from "./pages/Notes"
import Flashcards from "./pages/Flashcards"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

         <Route path="/quiz" element={<Quiz />} />

         <Route path="/chat" element={<Chat />} />

         <Route path="/planner" element={<Planner />} />

         <Route path = "/notes" element = {<Notes/>}/>

         <Route path="/flashcards" element = { <Flashcards /> }/>
         

    </Routes>
  )
}

export default App