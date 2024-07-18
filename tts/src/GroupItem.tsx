import React from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Group } from './App';

interface GroupItemProps {
  group: Group;
  onEdit: () => void;
  onDelete: () => void;
}

const GroupItem: React.FC<GroupItemProps> = ({ group, onEdit, onDelete }) => {
  return (
    <ListItem disablePadding>
      <ListItemText primary={group.name} />
      <ListItemSecondaryAction>
        <IconButton onClick={onEdit}>
          <Edit />
        </IconButton>
        <IconButton onClick={onDelete}>
          <Delete />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default GroupItem;
