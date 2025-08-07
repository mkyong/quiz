import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminQuizPage from "./components/AdminQuizPage";
import QuizUserPage from "./components/QuizUserPage";
import LoginPage from "./components/LoginPage";
import PublicQuizResultPage from "./components/result/PublicQuizResultPage";
import { AuthProvider, useAuth } from "./auth/AuthContext";

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
          <Route path="/quiz" element={<QuizUserPage />} />
          <Route path="*" element={<div className="p-8 text-center text-2xl">404 Not Found</div>} />
          
          {/* Public result page */}
          <Route path="/quiz/result/:shareCode" element={<PublicQuizResultPage />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;


