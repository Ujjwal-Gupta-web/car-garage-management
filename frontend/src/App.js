import logo from './logo.svg';
import './App.css';
import Home from './pages/Home';
import Car from './pages/Car';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (<div>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/:numberplate" element={<Car />} />
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
