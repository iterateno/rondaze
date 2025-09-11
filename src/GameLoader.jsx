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
                <p>Use the arrow keys for steering.</p>
                <p>Press the spacebar to launch nukes.</p>
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