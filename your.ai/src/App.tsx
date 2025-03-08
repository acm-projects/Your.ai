import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Homepage from './homepage';
import About from './About';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        {/* Navigation Buttons */}
        <nav>
          <Link to="/">
            <button>Home</button>
          </Link>
          <Link to="/about">
            <button>About</button>
          </Link>
        </nav>

        {/* Page Content */}
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
