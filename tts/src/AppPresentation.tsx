import React from 'react';
import { Group, Sentence } from './types';

interface AppPresentationProps {
  inputText: string;
  group: string;
  groups: Group[];
  sentences: Sentence[];
  onInputChange: (text: string) => void;
  onGroupChange: (group: string) => void;
  onSubmit: () => void;
  onSpeak: (text: string) => void;
}

const AppPresentation: React.FC<AppPresentationProps> = ({
  inputText,
  group,
  groups,
  sentences,
  onInputChange,
  onGroupChange,
  onSubmit,
  onSpeak,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  };

  const handleGroupChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    const selectedGroup = e.target.value as string;
    onGroupChange(selectedGroup);
  };

  const handleSubmit = () => {
    onSubmit();
  };

  const handleSpeak = () => {
    onSpeak(inputText);
  };

  console.log('Current group:', group); // 그룹 선택 상태를 콘솔에 출력해보기

  return (
    <div>
      {/* 텍스트 입력과 그룹 선택 */}
      <input type="text" value={inputText} onChange={handleInputChange} />
      <select value={group} onChange={handleGroupChange}>
        {groups.map((grp) => (
          <option key={grp.id} value={grp.name}>
            {grp.name}
          </option>
        ))}
      </select>
      
      {/* 세이브드 센텐스 */}
      <div>
        {sentences
          .filter((sentence) => sentence.group === group)
          .map((sentence) => (
            <div key={sentence.id}>
              {sentence.text}
            </div>
          ))}
      </div>

      {/* 저장 버튼 */}
      <button onClick={handleSubmit}>Save</button>

      {/* Text to Speech 버튼 */}
      <button onClick={handleSpeak}>Text to Speech</button>
    </div>
  );
};

export default AppPresentation;
