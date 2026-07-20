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
import UploadSyllabus from "./pages/UploadSyllabus"
import StudyMaterials from "./pages/StudyMaterials"


function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />

        <Route path="/planner"
          element={
        <ProtectedRoute>
            <Planner />
         </ProtectedRoute>
        }
       />

<Route path="/notes"
  element={
    <ProtectedRoute>
      <Notes />
    </ProtectedRoute>
  }
/>

<Route path="/quiz"
  element={
    <ProtectedRoute>
      <Quiz />
    </ProtectedRoute>
  }
/>

<Route path="/flashcards"
  element={
    <ProtectedRoute>
      <Flashcards />
    </ProtectedRoute>
  }
/>

<Route path="/chat"
  element={
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  }
/>

      <Route path="/upload-syllabus"
           element={
             <ProtectedRoute>
               <UploadSyllabus />
            </ProtectedRoute>
            }
          />

          <Route path="/study-materials"
             element={
              <ProtectedRoute>
                <StudyMaterials />
             </ProtectedRoute>
  }
/>
  </Routes>
  )
}

export default App