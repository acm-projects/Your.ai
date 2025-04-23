import React, { useState, useEffect } from 'react';

const TextToSpeech: React.FC = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechInstance, setSpeechInstance] = useState<SpeechSynthesisUtterance | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (speechInstance && speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, [speechInstance]);

  const speakPageText = (text: string) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance();
      speech.text = text;
      speech.lang = 'en-US';
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;

      speech.onstart = () => console.log('Speech started');
      speech.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
      };
      speech.onerror = (e) => {
        console.error('Speech error:', e);
        setError('An error occurred while speaking.');
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(speech);
      setSpeechInstance(speech);
      setIsSpeaking(true);
    } else {
      setError('Text-to-Speech is not supported in this browser.');
    }
  };

  const handleReadPageText = () => {
    const bodyText = getVisibleText();
    console.log("Text to speak:", bodyText);

    if (!bodyText) {
      setError('No text found to read.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.pause();
      setIsSpeaking(false);
    } else {
      if (speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        speakPageText(bodyText);
      }
      setIsSpeaking(true);
    }
  };

  const getVisibleText = () => {
    return document.body.innerText || '';
  };

  return (
    <div className="fixed bottom-20 left-4 z-50">
      <div
        onClick={handleReadPageText}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#4F46E5',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="white"
        >
          {isSpeaking ? (
            <path d="M6 4H18V20H6V4ZM4 2C3.45 2 3 2.45 3 3V21C3 21.55 3.45 22 4 22H20C20.55 22 21 21.55 21 21V3C21 2.45 20.55 2 20 2H4Z" />
          ) : (
            <path d="M8 5V19L19 12L8 5ZM6 3C5.45 3 5 3.45 5 4V20C5 20.55 5.45 21 6 21C6.28 21 6.54 20.91 6.76 20.74L18.76 12.74C19.06 12.56 19.06 12.28 18.76 12.1L6.76 4.1C6.54 3.93 6.28 3.84 6 3.84C5.45 3.84 5 3.45 5 3V4C5 3.45 5.45 3 6 3H6Z" />
          )}
        </svg>
      </div>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
    </div>
  );
};

export default TextToSpeech;
