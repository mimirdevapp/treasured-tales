import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Article from './pages/Article';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <div style={{ padding: 40, color: "black", fontSize: 24 }}>
      APP SHELL RENDERED
    </div>
  );
}

export default App;
