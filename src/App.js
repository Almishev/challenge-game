import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import './App.css';
import CategorySelector from './components/CategorySelector';
import ChallengeWheel from './components/ChallengeWheel';
 
import { getCategories, getChallengesByCategory } from './services/api';

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
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      let mounted = true;
      getCategories()
        .then((data) => {
          if (!mounted) return;
          // Подразбираме, че API връща масив от имена или обекти с name
          const list = Array.isArray(data)
            ? data.map((c) => (typeof c === 'string' ? c : c.name))
            : [];
          setCategories(list);
        })
        .catch(() => setError('Грешка при зареждане на категории'))
        .finally(() => setLoading(false));
      return () => {
        mounted = false;
      };
    }, []);
    const handleCategorySelect = (category) => {
      setSelectedChallenge(null);
      navigate(`/category/${encodeURIComponent(category)}`);
    };
    if (loading) return <p>Зареждане...</p>;
    if (error) return <p>{error}</p>;
    return (
      <CategorySelector 
        categories={categories}
        onSelect={handleCategorySelect}
      />
    );
  };

  const CategoryView = () => {
    const navigate = useNavigate();
    const { name } = useParams();
    const category = decodeURIComponent(name || '');
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      let mounted = true;
      setLoading(true);
      getChallengesByCategory(category)
        .then((items) => {
          if (!mounted) return;
          setChallenges(Array.isArray(items) ? items : []);
        })
        .catch(() => setError('Грешка при зареждане на предизвикателства'))
        .finally(() => setLoading(false));
      return () => {
        mounted = false;
      };
    }, [category]);

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
        {loading && <p>Зареждане...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
        <ChallengeWheel 
          ref={wheelRef}
          challenges={challenges}
          onChallengeSelect={handleChallengeSelect}
        />)}
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
