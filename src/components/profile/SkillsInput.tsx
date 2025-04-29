
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';

interface SkillsInputProps {
  initialSkills?: string[];
  onChange: (skills: string[]) => void;
}

const SkillsInput = ({ initialSkills = [], onChange }: SkillsInputProps) => {
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() !== '' && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      onChange(updatedSkills);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);
    onChange(updatedSkills);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex space-x-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill..."
          className="flex-1"
        />
        <Button type="button" size="icon" onClick={addSkill}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge key={index} variant="secondary" className="py-1 px-2">
            {skill}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 ml-1"
              onClick={() => removeSkill(skill)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {skill}</span>
            </Button>
          </Badge>
        ))}
        {skills.length === 0 && (
          <p className="text-sm text-muted-foreground">No skills added yet.</p>
        )}
      </div>
    </div>
  );
};

export default SkillsInput;
