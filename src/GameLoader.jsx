import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CANVAS } from './game/constants.js';
import { startGame } from './game/game.js';
import './GameLoader.css';

const GameLoader = () => {
    const canvasRef = useRef(null);
    const [showInfo, setShowInfo] = useState(true);
    const [score, setScore] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                setShowInfo(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        console.log(score)
    }, [score]);

    useEffect(() => {
        if (!showInfo) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Set canvas to fixed size
            canvas.width = CANVAS.WIDTH;
            canvas.height = CANVAS.HEIGHT;


            setScore(startGame(canvas, ctx, navigate));

            const handleGameOver = () => {
            };

            window.addEventListener("gameOver", handleGameOver);

            return () => {
                window.removeEventListener("gameOver", handleGameOver);
            };
        }
    }, [showInfo, navigate]);

    const handleStartGame = () => {
        setShowInfo(false);
    };

    return (
        showInfo ? (
            <div className="info-screen">
                <h2>Game Instructions</h2>
                <p>
                    Use the arrow keys for steering.<br />
                    <span style={{ display: 'inline-block', margin: '10px 0' }}>
                        {/* Arrow keys SVG */}
                        <svg width="90" height="60" viewBox="0 0 90 60" style={{ verticalAlign: 'middle' }}>
                            {/* Up Arrow */}
                            <rect x="35" y="5" width="20" height="20" rx="4" fill="#eee" stroke="#888" />
                            <text x="45" y="15" textAnchor="middle" fontSize="16" fill="#333" fontFamily="sans-serif" dominantBaseline="middle">↑</text>
                            {/* Left Arrow */}
                            <rect x="10" y="30" width="20" height="20" rx="4" fill="#eee" stroke="#888" />
                            <text x="20" y="40" textAnchor="middle" fontSize="16" fill="#333" fontFamily="sans-serif" dominantBaseline="middle">←</text>
                            {/* Down Arrow */}
                            <rect x="35" y="30" width="20" height="20" rx="4" fill="#eee" stroke="#888" />
                            <text x="45" y="40" textAnchor="middle" fontSize="16" fill="#333" fontFamily="sans-serif" dominantBaseline="middle">↓</text>
                            {/* Right Arrow */}
                            <rect x="60" y="30" width="20" height="20" rx="4" fill="#eee" stroke="#888" />
                            <text x="70" y="40" textAnchor="middle" fontSize="16" fill="#333" fontFamily="sans-serif" dominantBaseline="middle">→</text>
                        </svg>
                    </span>
                </p>
                <p>
                    Press the spacebar to launch nukes.<br />
                    <span style={{ display: 'inline-block', margin: '10px 0' }}>
                        {/* Spacebar SVG */}
                        <svg width="100" height="30" viewBox="0 0 100 30" style={{ verticalAlign: 'middle' }}>
                            <rect x="5" y="5" width="90" height="20" rx="6" fill="#eee" stroke="#888" />
                            <text x="50" y="20" textAnchor="middle" fontSize="14" fill="#333" fontFamily="sans-serif" dy="1">Space</text>
                        </svg>
                    </span>
                </p>
                <p>Stop asteroids from hitting the planet.</p>
                <button onClick={handleStartGame}>Start Game</button>
            </div>
        ) : (
            <div className="game-container" >
                <canvas ref={canvasRef} id="canvas"></canvas>
            </div>
        )
    );
};

export default GameLoader;