import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Delete, Edit, VolumeUp } from '@mui/icons-material';
import { useDrag, useDrop } from 'react-dnd';
import { Sentence } from './App';

interface SentenceItemProps {
  sentence: Sentence;
  index: number;
  onSpeak: (text: string) => void;
  onEdit: (sentence: Sentence) => void;
  onDelete: (id: string) => void;
  moveSentence: (dragIndex: number, hoverIndex: number) => void;
}

const ItemType = 'SENTENCE';

const SentenceItem: React.FC<SentenceItemProps> = ({ sentence, index, onSpeak, onEdit, onDelete, moveSentence }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveSentence(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <ListItem ref={node => ref(drop(node))} disablePadding>
      <ListItemText primary={sentence.text} secondary={sentence.group} />
      <ListItemSecondaryAction>
        <IconButton onClick={() => onSpeak(sentence.text)}>
          <VolumeUp />
        </IconButton>
        <IconButton onClick={() => onEdit(sentence)}>
          <Edit />
        </IconButton>
        <IconButton onClick={() => onDelete(sentence.id)}>
          <Delete />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default SentenceItem;
