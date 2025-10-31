import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { translations } from '../utils/translations';

const AudioExplainButton = ({ text, language = 'en' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState('speechSynthesis' in window);

  const t = translations[language];

  const handleClick = () => {
    if (!isSupported) return;

    if (isPlaying) {
      // Stop current speech
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Start speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.8; // Slightly slower for clarity
      utterance.pitch = 1;

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return null; // Don't show button if speech synthesis is not supported
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors touch-target ${
        isPlaying
          ? 'bg-success-600 text-white hover:bg-success-700'
          : 'bg-primary-600 text-white hover:bg-primary-700'
      }`}
      aria-label={isPlaying ? (t.stopAudio || 'Stop audio explanation') : (t.playAudio || 'Play audio explanation')}
    >
      {isPlaying ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
      <span>
        {isPlaying ? (t.stop || 'Stop') : (t.explain || 'Explain')}
      </span>
    </button>
  );
};

export default AudioExplainButton;
