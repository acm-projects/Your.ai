import React, { useState, useEffect } from 'react';

interface SpeechToTextProps {
  onSpeechResult: (text: string) => void; // This will pass the speech result back to the parent component
}

const SpeechToText: React.FC<SpeechToTextProps> = ({ onSpeechResult }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech recognition is not supported by this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        }
      }

      if (finalTranscript.trim()) {
        onSpeechResult(finalTranscript.trim());  // Pass the recognized text to the parent
      }
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
  }, [isListening, onSpeechResult]);

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={() => setIsListening((prev) => !prev)}
        className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <i className={`fas ${isListening ? 'fa-microphone-slash' : 'fa-microphone'} text-xl`} />
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default SpeechToText;
