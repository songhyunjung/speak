import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

export interface Group {
  id: string;
  name: string;
}

export interface GroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  groupName: string;
  onGroupNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editingGroup: Group | null; // editingGroup 속성 추가
}

const GroupDialog: React.FC<GroupDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  groupName,
  onGroupNameChange,
  editingGroup, // editingGroup props 추가
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{editingGroup ? 'Edit Group' : 'Add Group'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Group Name"
          type="text"
          fullWidth
          value={groupName}
          onChange={onGroupNameChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onSubmit} color="primary">
          {editingGroup ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupDialog;
