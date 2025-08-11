import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminQuizPage from "./components/admin/AdminQuizPage";
import QuizListingPage from "./components/QuizListingPage";
import LoginPage from "./components/LoginPage";
import QuizResultPublic from "./components/result/QuizResultPublic";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import NotFoundPage from "./components/NotFoundPage";

import './styles/utilities.css';

function RequireAuth({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ...other routes */}
          <Route path="/admin" element={
            <RequireAuth>
              <AdminQuizPage />
            </RequireAuth>
          } />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/quiz" />} />
          <Route path="/quiz" element={<QuizListingPage />} />
          <Route path="*" element={<NotFoundPage />} />
          
          {/* Public result page */}
          <Route path="/quiz/result/:shareCode" element={<QuizResultPublic />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


