import React, { useState, useEffect } from 'react';

const SpeechToText: React.FC = () => {
  const [isListening, setIsListening] = useState(false);  
  const [transcript, setTranscript] = useState('');  
  const [interimTranscript, setInterimTranscript] = useState('');  
  const [error, setError] = useState('');  

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech Recognition API is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;  
    recognition.interimResults = true;  
    recognition.lang = 'en-US'; 
    
    recognition.onstart = () => {
      setIsListening(true);
      setError('');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptPart = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += transcriptPart;
        } else {
          interimTranscript += transcriptPart;
        }
      }

      setTranscript(finalTranscript);  
      setInterimTranscript(interimTranscript);  
    };

    recognition.onerror = (event: any) => {
      setError(`Error occurred: ${event.error}`);
    };

    if (isListening) {
      recognition.start();
    } else {
      recognition.stop();
    }

    return () => {
      recognition.stop();  
    };
  }, [isListening]);  

  return (
    <div style={{ textAlign: 'center' }}>
      {}
      <div
        onClick={() => setIsListening((prev) => !prev)}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: 'blue',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        {}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="white"
        >
          <path d="M12 1C10.9 1 10 1.9 10 3V14C10 15.1 10.9 16 12 16C13.1 16 14 15.1 14 14V3C14 1.9 13.1 1 12 1ZM7 3C7 4.1 6.1 5 5 5C3.9 5 3 4.1 3 3C3 1.9 3.9 1 5 1C6.1 1 7 1.9 7 3ZM17 3C17 4.1 16.1 5 15 5C13.9 5 13 4.1 13 3C13 1.9 13.9 1 15 1C16.1 1 17 1.9 17 3ZM12 17C10.9 17 10 17.9 10 19H14C14 17.9 13.1 17 12 17ZM19 8C19 7.4 18.6 6.9 18.1 6.7C17.7 6.6 17.4 6.9 17.3 7.2C17.1 7.7 16.7 8.1 16.2 8.2C14.9 8.5 13.9 9.2 13.2 10.1C12.8 10.5 12.1 10.6 11.6 10.2C11.1 9.9 10.9 9.2 11.2 8.7C12.3 6.9 14.2 5.9 16.2 5.6C16.6 5.5 17 5.9 17.1 6.2C17.2 6.5 17.5 7 17.7 7.4C18.2 8 18.5 8.6 19 8Z"/>
        </svg>
      </div>

      {}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {}
      <p><strong>Final Transcript:</strong> {transcript}</p>
      <p><strong>Interim Transcript:</strong> {interimTranscript}</p>
    </div>
  );
};

export default SpeechToText;
