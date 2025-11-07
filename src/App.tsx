import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { type RootState } from './store/store';
import { LoginPage } from './features/auth/LoginPage';
import { SignUpPage } from './features/auth/SignUpPage';
import { TodosDashboard } from './features/todos/TodosDashboard';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <TodosDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? '/todos' : '/login'} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
