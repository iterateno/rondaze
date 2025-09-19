import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CANVAS } from './game/constants.js';
import { startGame } from './game/game.js';
import './GameLoader.css';

const GameLoader = () => {
    const canvasRef = useRef(null);
    const [showInfo, setShowInfo] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [gameInstance, setGameInstance] = useState(null);
    const navigate = useNavigate();

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                                 (window.innerWidth <= 768 && 'ontouchstart' in window);
            setIsMobile(isMobileDevice);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                setShowInfo(false);
            }
        };

        if (!isMobile) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (!isMobile) {
                window.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [isMobile]);


    useEffect(() => {
        if (!showInfo) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');

            // Set canvas to fixed size or responsive size for mobile
            let updateCanvasSize;
            if (isMobile) {
                updateCanvasSize = () => {
                    const container = canvas.parentElement;
                    const containerWidth = container.clientWidth;
                    const containerHeight = container.clientHeight;
                    
                    // Maintain aspect ratio
                    const aspectRatio = CANVAS.WIDTH / CANVAS.HEIGHT;
                    let canvasWidth = containerWidth;
                    let canvasHeight = containerWidth / aspectRatio;
                    
                    if (canvasHeight > containerHeight) {
                        canvasHeight = containerHeight;
                        canvasWidth = containerHeight * aspectRatio;
                    }
                    
                    canvas.width = CANVAS.WIDTH;
                    canvas.height = CANVAS.HEIGHT;
                    canvas.style.width = `${canvasWidth}px`;
                    canvas.style.height = `${canvasHeight}px`;
                };
                
                updateCanvasSize();
                window.addEventListener('resize', updateCanvasSize);
                window.addEventListener('orientationchange', updateCanvasSize);
            } else {
                canvas.width = CANVAS.WIDTH;
                canvas.height = CANVAS.HEIGHT;
            }

            const game = startGame(canvas, ctx, navigate, { isMobile });
            setGameInstance(game);

            const handleGameOver = () => {
            };

            window.addEventListener("gameOver", handleGameOver);

            return () => {
                window.removeEventListener("gameOver", handleGameOver);
                if (isMobile && updateCanvasSize) {
                    window.removeEventListener('resize', updateCanvasSize);
                    window.removeEventListener('orientationchange', updateCanvasSize);
                }
                if (game && game.cleanup) {
                    game.cleanup();
                }
            };
        }
    }, [showInfo, navigate, isMobile]);

    const handleStartGame = () => {
        setShowInfo(false);
    };

    // Touch control handlers for mobile
    const handleTouchControl = (action, isStart = true) => {
        if (!gameInstance) return;
        
        // Add haptic feedback for supported devices
        if (isStart && navigator.vibrate && action === 'Space') {
            navigator.vibrate(50); // Short vibration for fire action
        }
        
        const event = new KeyboardEvent(isStart ? 'keydown' : 'keyup', {
            code: action,
            key: action,
            bubbles: true
        });
        
        document.dispatchEvent(event);
    };

    const touchControlHandlers = {
        left: {
            onTouchStart: (e) => {
                e.preventDefault();
                handleTouchControl('ArrowLeft', true);
            },
            onTouchEnd: (e) => {
                e.preventDefault();
                handleTouchControl('ArrowLeft', false);
            }
        },
        right: {
            onTouchStart: (e) => {
                e.preventDefault();
                handleTouchControl('ArrowRight', true);
            },
            onTouchEnd: (e) => {
                e.preventDefault();
                handleTouchControl('ArrowRight', false);
            }
        },
        up: {
            onTouchStart: (e) => {
                e.preventDefault();
                handleTouchControl('ArrowUp', true);
            },
            onTouchEnd: (e) => {
                e.preventDefault();
                handleTouchControl('ArrowUp', false);
            }
        },
        fire: {
            onTouchStart: (e) => {
                e.preventDefault();
                handleTouchControl('Space', true);
            },
            onTouchEnd: (e) => {
                e.preventDefault();
                handleTouchControl('Space', false);
            }
        }
    };

    return (
        showInfo ? (
            <div className="info-screen">
                <h2>Game Instructions</h2>
                <p>
                    {isMobile ? (
                        <>Use the touch controls to steer and fire.</>
                    ) : (
                        <>
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
                        </>
                    )}
                </p>
                {!isMobile && (
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
                )}
                <p>Stop asteroids from hitting the planet.</p>
                <button onClick={handleStartGame}>Start Game</button>
            </div>
        ) : (
            <div className="game-container">
                <canvas ref={canvasRef} id="canvas"></canvas>
                
                {/* Mobile touch controls */}
                {isMobile && (
                    <div className={`mobile-controls ${isMobile ? 'show' : ''}`}>
                        <div className="control-pad">
                            <div className="control-row">
                                <div 
                                    className="control-btn"
                                    {...touchControlHandlers.up}
                                >
                                    ↑
                                </div>
                            </div>
                            <div className="control-row">
                                <div 
                                    className="control-btn"
                                    {...touchControlHandlers.left}
                                >
                                    ←
                                </div>
                                <div 
                                    className="control-btn"
                                    {...touchControlHandlers.right}
                                >
                                    →
                                </div>
                            </div>
                        </div>
                        
                        <div 
                            className="control-btn fire-btn"
                            {...touchControlHandlers.fire}
                        >
                            FIRE
                        </div>
                    </div>
                )}
            </div>
        )
    );
};

export default GameLoader;