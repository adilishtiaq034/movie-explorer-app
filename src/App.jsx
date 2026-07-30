import { useState } from "react";
import MovieDetails from "./pages/moviedetails.jsx";
import Homepage from "./pages/homepage.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

import "./App.css";
function App() {
  return(
 
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
   
  

  )
}

export default App;