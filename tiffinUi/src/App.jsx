import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios'
import Tiffin from './components/Tiffin';

function App() {
  const [vegCurry, setVegCurry] = useState([]);

  useEffect(() => {

    axios.get("http://localhost:3000/vegcurry")
    .then((response) => {
      setVegCurry(response.data);
  })
  .catch((error) => {
    console.log( error)
  });

 }, []);

  return (
    <>
      <Router>
      <Routes>
      <Route path="/tiffin" element={<Tiffin />} />
        {/* Other routes if needed */}
      </Routes>
    </Router>

    </>
  )
}

export default App
