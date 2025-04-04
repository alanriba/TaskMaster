import React, { useEffect, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Snackbar,
  Alert,
  SelectChangeEvent,
  Autocomplete,
  Chip,
} from "@mui/material";

import { TaskCreate } from "../../models/Task";
import { Tag } from "../../models/Tag";
import { TaskServiceApi } from "../../api/taskApi";

interface CreateTaskFormProps {
  open: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({
  open,
  onClose,
  onTaskCreated,
}) => {
  const [formData, setFormData] = useState<TaskCreate>({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
    due_date: null,
  });

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    severity: "success" | "error";
    open: boolean;
  }>({ message: "", severity: "success", open: false });

  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<(Tag | string)[]>([]);
  const [inputTagValue, setInputTagValue] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  useEffect(() => {
    TaskServiceApi.getAllTags()
      .then((res) => setAllTags(res))
      .catch(() => setAllTags([]));
  }, []);

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    console.log("formData", formData);
    try {
      const createdTags: Tag[] = [];

      for (const tag of selectedTags) {
        if (typeof tag === "string") {
          const tagName = tag.trim().toLowerCase();

          // Verifica si ya existe en allTags o entre los que ya creaste
          const existing = allTags.find(
            (t) => t.name.toLowerCase() === tagName
          ) || createdTags.find(
            (t) => t.name.toLowerCase() === tagName
          );

          if (existing) {
            createdTags.push(existing);
          } else {
            const newTag = await TaskServiceApi.createTag(tag);
            setAllTags(prev => [...prev, newTag]);
            createdTags.push(newTag);
          }
        } else {
          createdTags.push(tag);
        }
      }


      const tag_ids = createdTags.map((tag) => tag.id);

      await TaskServiceApi.create({ ...formData, tag_ids });
      setFeedback({
        message: "Task created successfully!",
        severity: "success",
        open: true,
      });
      onTaskCreated();
      onClose();
      setFormData({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        due_date: null,
      });
      setSelectedTags([]);
    } catch (error) {
      setFeedback({
        message:
          error instanceof Error ? error.message : "Failed to create task",
        severity: "error",
        open: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseFeedback = () => {
    setFeedback((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleInputChange}
            error={!!errors.title}
            helperText={errors.title}
            required
          />
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status"
              name="status"
              value={formData.status}
              label="Status"
              onChange={handleSelectChange}
            >
              <MenuItem value="pending">To Do</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
            <FormHelperText>
              Select the initial status for this task
            </FormHelperText>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel id="priority-label">Priority</InputLabel>
            <Select
              labelId="priority-label"
              id="priority"
              name="priority"
              value={formData.priority || ""}
              label="Priority"
              onChange={handleSelectChange}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
            <FormHelperText>Select the priority level</FormHelperText>
          </FormControl>

          <TextField
            margin="dense"
            id="due_date"
            name="due_date"
            label="Due Date"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            value={formData.due_date || ""}
            onChange={handleInputChange}
          />
          <Autocomplete
            multiple
            freeSolo
            options={allTags}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.name
            }
            value={selectedTags}
            inputValue={inputTagValue}
            onInputChange={(_e, newInputValue) => {
              setInputTagValue(newInputValue);
            }}
            onBlur={() => {
              if (inputTagValue.trim() !== "") {
                const name = inputTagValue.trim();
                const existing = allTags.find(
                  (tag) => tag.name.toLowerCase() === name.toLowerCase()
                );
                const newTag = existing || name;
                const alreadySelected = selectedTags.find(
                  (t) =>
                    (typeof t === "string" && t.toLowerCase() === name.toLowerCase()) ||
                    (typeof t !== "string" && t.name.toLowerCase() === name.toLowerCase())
                );
                if (!alreadySelected) {
                  setSelectedTags((prev) => [...prev, newTag]);
                }
                setInputTagValue("");
              }
            }}
            onChange={(_event, newValue) => {
              const processed = newValue.map((item) =>
                typeof item === "string" ? item.trim() : item.name.trim()
              );
              const uniqueNames = Array.from(new Set(processed));
              const mapped = uniqueNames.map((name) => {
                const existing = allTags.find(
                  (tag) => tag.name.toLowerCase() === name.toLowerCase()
                );
                return existing || name;
              });
              setSelectedTags(mapped);
            }}
            filterSelectedOptions
            isOptionEqualToValue={(option, value) =>
              typeof option !== "string" &&
              typeof value !== "string" &&
              option.id === value.id
            }
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={typeof option === "string" ? option : option.name}
                  {...getTagProps({ index })}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tags"
                placeholder="Select or create tags"
                margin="dense"
              />
            )}
          />

        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={feedback.open}
        autoHideDuration={6000}
        onClose={handleCloseFeedback}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseFeedback}
          severity={feedback.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CreateTaskForm;
