import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Home";
import Register from "./components/Register";
import Editor from "./components/Editor";
import "./App.css";
import Home from "./components/Home";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/editor" element={<Editor />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;