import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from './pages/Login';
import SignUp from './pages/SignUp'
import Home from './pages/Home';
import ProtectedRoute from './routes/ProtectedRoute';
import IsLoggedIn from './routes/IsLoggedIn';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <IsLoggedIn>
            <Login />
          </IsLoggedIn>
        } />
        <Route path="/register" element={
          <IsLoggedIn>
            <SignUp />
          </IsLoggedIn>
        } />
        <Route path='/home' element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
