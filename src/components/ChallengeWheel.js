import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import './ChallengeWheel.css';

const ChallengeWheel = forwardRef(({ challenges, onChallengeSelect }, ref) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef(null);
  const wheelContainerRef = useRef(null);
  const spinSoundRef = useRef(null);
  const stopSoundRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollToWheel: () => {
      if (wheelContainerRef.current) {
        wheelContainerRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  }));

  const spinWheel = () => {
    if (isSpinning) return;
    
    // Скролиране към колелото при натискане на бутона
    if (wheelContainerRef.current) {
      wheelContainerRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
    
    // Малко забавяне преди да започне въртенето, за да се види скролирането
    setTimeout(() => {
      // Възпроизвеждане на звук за завъртане
      if (spinSoundRef.current) {
        spinSoundRef.current.currentTime = 0;
        spinSoundRef.current.play().catch(e => console.log('Не може да се възпроизведе звук:', e));
      }
      
      setIsSpinning(true);
      const randomRotation = Math.random() * 3600 + 1800; // 5-10 full rotations
      const newRotation = rotation + randomRotation;
      
      setRotation(newRotation);
      
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${newRotation}deg)`;
      }
      
      // Calculate which challenge was selected
      setTimeout(() => {
        // Възпроизвеждане на звук когато спре
        if (stopSoundRef.current) {
          stopSoundRef.current.currentTime = 0;
          stopSoundRef.current.play().catch(e => console.log('Не може да се възпроизведе звук:', e));
        }
        
        const normalizedRotation = newRotation % 360;
        const challengeIndex = Math.floor((360 - normalizedRotation) / (360 / challenges.length));
        const selectedChallenge = challenges[challengeIndex % challenges.length];
        
        onChallengeSelect(selectedChallenge);
        setIsSpinning(false);
      }, 3000); // Match with CSS animation duration
    }, 300); // 300ms забавяне за скролиране
  };

  const getChallengeColor = (index) => {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="challenge-wheel-container" ref={wheelContainerRef}>
      {/* Скрыти аудио елементи */}
      <audio ref={spinSoundRef} preload="auto">
        <source src="/sounds/spin.mp3" type="audio/mpeg" />
        <source src="/sounds/spin.wav" type="audio/wav" />
      </audio>
      <audio ref={stopSoundRef} preload="auto">
        <source src="/sounds/stop.mp3" type="audio/mpeg" />
        <source src="/sounds/stop.wav" type="audio/wav" />
      </audio>
      
      <div className="wheel-wrapper">
        <div 
          ref={wheelRef}
          className={`challenge-wheel ${isSpinning ? 'spinning' : ''}`}
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {challenges.map((challenge, index) => {
            const angle = (360 / challenges.length) * index;
            const color = getChallengeColor(index);
            
            return (
              <div
                key={challenge.id}
                className="wheel-segment"
                style={{
                  transform: `rotate(${angle}deg)`,
                  backgroundColor: color
                }}
              >
                <div 
                  className="segment-content"
                  style={{ 
                    transform: `rotate(${angle + 90}deg)`,
                    transformOrigin: 'center'
                  }}
                >
                  <span className="challenge-name">{challenge.name}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="wheel-pointer"></div>
        
        <button 
          className={`spin-button ${isSpinning ? 'disabled' : ''}`}
          onClick={spinWheel}
          disabled={isSpinning}
        >
          {isSpinning ? 'Върти се...' : '🎯 Завърти колелото!'}
        </button>
      </div>
    </div>
  );
});

export default ChallengeWheel;
