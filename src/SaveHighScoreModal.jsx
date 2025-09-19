import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SaveHighScoreModal.css';


const SaveHighScoreModal = ({ score, refetch }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [showModal, setShowModal] = useState(score > 0);
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        try {
            const response = await fetch('https://rondaze-server-749067412044.europe-west1.run.app/api/highscores', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playerName: name, score }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save score');
            }

            refetch();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving score:', error);
            setError(error.message || 'Failed to save score. Please try again.');
        }
    };

    const handleRetry = () => {
        setShowModal(false);
        navigate('/game'); // Navigate to the game page like in StartScreen
    };

    const close = async () => {
        // Save the score before closing if name is entered
        if (name.trim()) {
            await handleSave();
        }
        setShowModal(false);
    };

    return (
        <>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h1>Game Over</h1>
                        <h2>Your Score: {score}</h2>
                        {error && <p className="error">{error}</p>}
                        <div width="600px">
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <button  onClick={handleSave}>Save</button>
                        <button  onClick={handleRetry}>Retry</button>
                        <button onClick={close}>Cancel</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default SaveHighScoreModal;