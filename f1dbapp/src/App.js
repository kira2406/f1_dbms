import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Results from './pages/Results';
import Home from './pages/Home';
import Circuits from './pages/Circuits';
import { useEffect, useState } from 'react';
import { Footer } from './pages/Footer';

function App() {

  const [seasons, setSeasons] = useState([])

  useEffect(() => {
    const fetchSeasons = async () => {
        try {
            const response = await fetch('http://localhost:3001/getSeasons');
            const jsonData = await response.json();
            setSeasons(jsonData)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    fetchSeasons();
  
  }, []);

  return (
    <Router>
      <div className="App page montserrat-regular">
        <div className='container-fluid'>
          <Navigation />
        </div>
        <Routes>
          <Route
            path="/"
            element={<Home seasons={seasons}/>}
          ></Route>
          <Route
            path="/results"
            element={<Results seasons={seasons}/>}
          ></Route>
          <Route
            path="/circuits"
            element={<Circuits />}
          ></Route>
        </Routes>
        <div className='container-fluid'>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
