import React, { useState, useEffect } from 'react';
import {
  SelectChangeEvent,
  Container,
  Typography,
  TextField,
  Button,
  List,
  Select,
  MenuItem,
  FormControl,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  InputLabel,
} from '@mui/material';
import { ref, onValue, push, set, remove, update, runTransaction } from 'firebase/database';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { database } from './firebaseConfig';
import SentenceItem from './SentenceItem';
import GroupItem from './GroupItem';

export interface Group {
  id: string;
  name: string;
}

export interface Sentence {
  id: string;
  text: string;
  group: string;
}

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [group, setGroup] = useState<string>('');
  const [groups, setGroups] = useState<Group[]>([]);
  const [isGroupDialogOpen, setIsGroupDialogOpen] = useState<boolean>(false);
  const [newGroupName, setNewGroupName] = useState<string>('');
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  useEffect(() => {
    const sentencesRef = ref(database, 'sentences');
    onValue(sentencesRef, (snapshot) => {
      const sentencesData = snapshot.val();
      if (sentencesData) {
        const sentencesArray = Object.entries(sentencesData).map(([id, data]) => ({
          id,
          ...(data as { text: string; group: string }),
        }));
        setSentences(sentencesArray);
      } else {
        setSentences([]);
      }
    });

    const groupsRef = ref(database, 'groups');
    onValue(groupsRef, (snapshot) => {
      const groupsData = snapshot.val();
      if (groupsData) {
        const groupsArray = Object.entries(groupsData).map(([id, data]) => ({
          id,
          ...(data as { name: string }),
        }));
        setGroups(groupsArray);
      } else {
        setGroups([]);
      }
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleGroupChange = (event: SelectChangeEvent<string>) => {
    setGroup(event.target.value);
  };

  const handleSubmit = () => {
    if (inputText.trim() !== '') {
      const newSentenceRef = push(ref(database, 'sentences'));
      set(newSentenceRef, { text: inputText, group }).then(() => {
        setInputText('');
      });
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      alert('This browser does not support speech synthesis.');
    }
  };

  const handleDelete = (id: string) => {
    remove(ref(database, `sentences/${id}`));
  };

  const handleEdit = (sentence: Sentence) => {
    setInputText(sentence.text);
    setGroup(sentence.group);
    handleDelete(sentence.id);
  };

  const saveToFile = () => {
    const fileData = sentences.map((sentence) => sentence.text).join('\n');
    const blob = new Blob([fileData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sentences.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const moveSentence = (dragIndex: number, hoverIndex: number) => {
    const dragSentence = sentences[dragIndex];
    const updatedSentences = [...sentences];
    updatedSentences.splice(dragIndex, 1);
    updatedSentences.splice(hoverIndex, 0, dragSentence);
    setSentences(updatedSentences);
  };

  const openGroupDialog = (group: Group | null = null) => {
    setEditingGroup(group);
    setNewGroupName(group ? group.name : '');
    setIsGroupDialogOpen(true);
  };

  const closeGroupDialog = () => {
    setIsGroupDialogOpen(false);
    setNewGroupName('');
    setEditingGroup(null);
  };

  const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewGroupName(e.target.value);
  };

  const handleGroupSubmit = () => {
    if (newGroupName.trim() !== '') {
      if (editingGroup) {
        // Update group name in groups collection
        update(ref(database, `groups/${editingGroup.id}`), { name: newGroupName }).then(() => {
          // Update group name in sentences that belong to this group
          const groupRef = ref(database, `sentences`);
          runTransaction(groupRef, (currentData) => {
            if (currentData === null) {
              return currentData;
            }
            Object.keys(currentData).forEach((sentenceId) => {
              const sentence = currentData[sentenceId];
              if (sentence.group === editingGroup.name) {
                currentData[sentenceId].group = newGroupName;
              }
            });
            return currentData;
          }).then(() => {
            closeGroupDialog();
          });
        });
      } else {
        const newGroupRef = push(ref(database, 'groups'));
        set(newGroupRef, { name: newGroupName }).then(() => {
          closeGroupDialog();
        });
      }
    }
  };

  const handleGroupDelete = (group: Group) => {
    remove(ref(database, `groups/${group.id}`));
  };

  const theme = createTheme({
    palette: {
      mode: 'dark',
      contrastThreshold: 3,
      tonalOffset: 0.2,
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom>
          Text to Speech
        </Typography>
        <Grid container spacing={3}>
          {/* 왼쪽 상단: 텍스트 입력 */}
          <Grid item xs={6}>
            <TextField
              label="Enter text"
              variant="outlined"
              fullWidth
              value={inputText}
              onChange={handleInputChange}
              style={{ marginBottom: '10px' }}
            />
            <FormControl fullWidth style={{ marginBottom: '10px' }}>
              <InputLabel>Group</InputLabel>
              <Select value={group} onChange={handleGroupChange}>
                {groups.map((grp) => (
                  <MenuItem key={grp.id} value={grp.name}>
                    {grp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSubmit}
              style={{ marginBottom: '20px' }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={saveToFile}
              style={{ marginBottom: '20px' }}
            >
              Save to File
            </Button>
          </Grid>

          {/* 왼쪽 하단: 그룹 매니지먼트 */}
          <Grid item xs={6}>
            <Typography variant="h5" gutterBottom>
              Groups Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => openGroupDialog()}
              style={{ marginBottom: '20px' }}
            >
              Add Group
            </Button>
            <List>
              {groups.map((group) => (
                <GroupItem
                  key={group.id}
                  group={group}
                  onEdit={() => openGroupDialog(group)}
                  onDelete={() => handleGroupDelete(group)}
                />
              ))}
            </List>
          </Grid>

          {/* 오른쪽: 전체 Saved Sentences */}
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Saved Sentences:
            </Typography>
            <DndProvider backend={HTML5Backend}>
              <List>
                {sentences.map((sentence, index) => (
                  <SentenceItem
                    key={sentence.id}
                    sentence={sentence}
                    index={index}
                    onSpeak={handleSpeak}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    moveSentence={moveSentence}
                  />
                ))}
              </List>
            </DndProvider>
          </Grid>
        </Grid>

        <Dialog open={isGroupDialogOpen} onClose={closeGroupDialog}>
          <DialogTitle>{editingGroup ? 'Edit Group' : 'Add Group'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Group Name"
              fullWidth
              value={newGroupName}
              onChange={handleGroupNameChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={closeGroupDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleGroupSubmit} color="primary">
              {editingGroup ? 'Save Changes' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  );
};

export default App;
