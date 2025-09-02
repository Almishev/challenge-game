import React, { useState, useRef } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import './App.css';
import CategorySelector from './components/CategorySelector';
import ChallengeWheel from './components/ChallengeWheel';
import { challengesData } from './data/challengesData';

function App() {
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const selectedChallengeRef = useRef(null);
  const wheelRef = useRef(null);

  const handleChallengeSelect = (challenge) => {
    setSelectedChallenge(challenge);
    setTimeout(() => {
      if (selectedChallengeRef.current) {
        selectedChallengeRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
  };

  const Home = () => {
    const navigate = useNavigate();
    const handleCategorySelect = (category) => {
      setSelectedChallenge(null);
      navigate(`/category/${encodeURIComponent(category)}`);
    };
    return (
      <CategorySelector 
        categories={Object.keys(challengesData)} 
        onSelect={handleCategorySelect}
      />
    );
  };

  const CategoryView = () => {
    const navigate = useNavigate();
    const { name } = useParams();
    const category = decodeURIComponent(name || '');
    const challenges = challengesData[category] || [];

    const handleBack = () => {
      setSelectedChallenge(null);
      navigate('/');
    };

    return (
      <div className="challenge-container">
        <div className="category-header">
          <button onClick={handleBack} className="back-btn">← Назад към категории</button>
          <h2>📂 {category}</h2>
        </div>
        <ChallengeWheel 
          ref={wheelRef}
          challenges={challenges}
          onChallengeSelect={handleChallengeSelect}
        />
        {selectedChallenge && (
          <div className="selected-challenge" ref={selectedChallengeRef}>
            <h3>🎉 Избрано предизвикателство:</h3>
            <div className="challenge-card">
              <h4>{selectedChallenge.name}</h4>
              <p>{selectedChallenge.description}</p>
              <div className="challenge-details">
                <span className="difficulty">Трудност: {selectedChallenge.difficulty}</span>
                <span className="duration">Време: {selectedChallenge.duration}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎯 Предизвикателства</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:name" element={<CategoryView />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
