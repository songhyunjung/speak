import React, { useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';
import { Sentence } from './types';

interface FlashcardProps {
  sentences: Sentence[];
  onMarkDifficult: (id: string) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ sentences, onMarkDifficult }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sentences.length);
  };

  const handleMarkDifficult = () => {
    onMarkDifficult(sentences[currentIndex].id);
  };

  if (sentences.length === 0) {
    return <Typography>No sentences available</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Typography>{sentences[currentIndex].text}</Typography>
        <Button onClick={handleNext}>Next</Button>
        <Button onClick={handleMarkDifficult}>Mark as Difficult</Button>
      </CardContent>
    </Card>
  );
};

export default Flashcard;
