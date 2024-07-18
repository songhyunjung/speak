// GroupDialog.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Group } from './types'; // Group 타입을 불러옵니다.

export interface GroupDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  groupName: string;
  onGroupNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editingGroup: Group | null;
  onGroupDelete: (group: Group) => void; // onGroupDelete 함수를 추가합니다.
}

const GroupDialog: React.FC<GroupDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  groupName,
  onGroupNameChange,
  editingGroup,
  onGroupDelete,
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
        {editingGroup && (
          <Button onClick={() => onGroupDelete(editingGroup)}>
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default GroupDialog;
