import React, { useState, useEffect, useRef } from 'react';
import './AiTeacher.css';

/**
 * AI Teacher Component
 * A cute animated robot that reacts to the user's coding journey.
 * 
 * Props:
 * - emotion: 'neutral' | 'happy' | 'sad' | 'angry' | 'thinking' | 'surprised'
 * - message: string (Text to display in speech bubble)
 * - isTalking: boolean
 * - targetSelector: string (CSS selector to look at)
 */
export default function AiTeacher({
    emotion = 'neutral',
    message = '',
    isTalking = false,
    isPointing = false,
    targetSelector = null,
    className = ''
}) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    // Eye Tracking Logic
    useEffect(() => {
        const handleMouseMove = (e) => {
            // If a target exists, look at it instead of mouse
            let targetX = e.clientX;
            let targetY = e.clientY;

            if (targetSelector) {
                const el = document.querySelector(targetSelector);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    targetX = rect.left + rect.width / 2;
                    targetY = rect.top + rect.height / 2;
                }
            }

            setMousePos({ x: targetX, y: targetY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [targetSelector]);

    // Calculate Eye pupil movement
    useEffect(() => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Max movement in pixels
        const maxMove = 5;

        const angle = Math.atan2(mousePos.y - centerY, mousePos.x - centerX);
        const distance = Math.min(
            Math.hypot(mousePos.x - centerX, mousePos.y - centerY),
            200 // Limit the distance influence
        );

        // Smooth eye movement
        const moveX = Math.cos(angle) * (distance / 200) * maxMove;
        const moveY = Math.sin(angle) * (distance / 200) * maxMove;

        setEyeOffset({ x: moveX, y: moveY });
    }, [mousePos]);

    // Get mouth path based on emotion
    const getMouthPath = () => {
        switch (emotion) {
            case 'happy': return 'M 35 75 Q 50 85 65 75';
            case 'sad': return 'M 35 80 Q 50 70 65 80';
            case 'angry': return 'M 35 80 L 65 80'; // Straight line
            case 'surprised': return 'M 45 75 Q 50 85 55 75 Q 50 65 45 75'; // O shape
            case 'thinking': return 'M 35 80 L 50 75 L 65 80'; // Zigzag
            default: return 'M 40 80 L 60 80'; // Neutral
        }
    };

    // Get eye shape (e.g., squinting)
    const getEyeScaleY = () => {
        switch (emotion) {
            case 'thinking': return 0.6;
            case 'angry': return 0.7;
            default: return 1;
        }
    };

    return (
        <div ref={containerRef} className={`ai-teacher-container ai-teacher-float ${className}`}>
            {/* Speech Bubble */}
            <div className={`ai-speech-bubble ${message ? 'visible' : ''}`}>
                {message}
            </div>

            <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <radialGradient id="eye-glow" cx="0.5" cy="0.5" r="0.5">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="1" />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.3" />
                    </radialGradient>
                </defs>

                {/* Antenna */}
                <line x1="50" y1="20" x2="50" y2="5" className="ai-antenna-stick" />
                <circle cx="50" cy="5" r="4" className={`ai-antenna-bulb ${isTalking ? 'ai-antenna-bulb-active' : ''}`} />

                {/* Body (Tiny shoulders) */}
                <path d="M 30 100 Q 50 110 70 100 L 70 120 L 30 120 Z" className="ai-body" />

                {/* Arms */}
                {isPointing ? (
                    <path d="M 80 110 Q 110 80 130 50" className="ai-arm-pointing" fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round" />
                ) : emotion === 'thinking' ? (
                    <path d="M 30 110 Q 50 100 65 90" className="ai-arm" fill="none" />
                ) : (
                    <>
                        <circle cx="20" cy="110" r="8" className="ai-arm" />
                        <circle cx="80" cy="110" r="8" className="ai-arm" />
                    </>
                )}

                {/* Head Container */}
                <rect x="15" y="20" width="70" height="80" rx="15" className="ai-head" />

                {/* Face Screen */}
                <rect x="20" y="25" width="60" height="70" rx="10" className="ai-face-screen" />

                {/* Eyes Group */}
                <g className="ai-eyes-container" transform={`translate(${eyeOffset.x}, ${eyeOffset.y})`}>
                    {/* Left Eye */}
                    <ellipse
                        cx="35" cy="50" rx="8" ry={8 * getEyeScaleY()}
                        className="ai-eye"
                    />
                    <circle cx="37" cy="48" r="2" fill="white" opacity="0.8" />

                    {/* Right Eye */}
                    <ellipse
                        cx="65" cy="50" rx="8" ry={8 * getEyeScaleY()}
                        className="ai-eye"
                    />
                    <circle cx="67" cy="48" r="2" fill="white" opacity="0.8" />

                    {/* Eyebrows for Angry */}
                    {emotion === 'angry' && (
                        <>
                            <line x1="25" y1="40" x2="45" y2="45" stroke="#22d3ee" strokeWidth="3" />
                            <line x1="55" y1="45" x2="75" y2="40" stroke="#22d3ee" strokeWidth="3" />
                        </>
                    )}
                </g>

                {/* Mouth */}
                <path
                    d={getMouthPath()}
                    className="ai-mouth"
                    transform={`translate(0, ${isTalking ? 2 : 0})`}
                />
            </svg>
        </div>
    );
}
