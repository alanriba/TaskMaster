import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput, Box } from '@mui/material';

interface Tag {
  id: number;
  name: string;
}

interface TagSelectorProps {
  tags: Tag[];
  selected: number[];
  onChange: (ids: number[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ tags, selected, onChange }) => {
  return (
    <FormControl fullWidth margin="normal">
      <InputLabel id="tag-selector-label">Tags</InputLabel>
      <Select
        multiple
        labelId="tag-selector-label"
        value={selected}
        onChange={(e) => onChange(e.target.value as number[])}
        input={<OutlinedInput label="Tags" />}
        renderValue={(selectedIds) => (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {selectedIds.map((id) => {
              const tag = tags.find((t) => t.id === id);
              return tag ? <Chip key={id} label={tag.name} /> : null;
            })}
          </Box>
        )}
      >
        {tags.map((tag) => (
          <MenuItem key={tag.id} value={tag.id}>
            {tag.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default TagSelector;
