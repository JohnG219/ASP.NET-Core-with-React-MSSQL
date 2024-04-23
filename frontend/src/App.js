import logo from './logo.svg';
import './App.css';
import Formperson from './Formperson/Formperson';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App container">
        <Routes>
          <Route path='/' element={<Formperson />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;