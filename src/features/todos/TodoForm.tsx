import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../../store/store';
import { editTodo, addTodoForUser } from './todosSlice';
import { todoSchema } from '../../schemas/todoSchema';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';

interface TodoFormProps {
  editingTodo?: { id: string; text: string; dueDate: string };
  onCancel?: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ editingTodo, onCancel }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [formData, setFormData] = useState({
    text: editingTodo?.text || '',
    dueDate: editingTodo?.dueDate || ''
  });
  const [errors, setErrors] = useState<{ text?: string; dueDate?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = todoSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: { text?: string; dueDate?: string } = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as 'text' | 'dueDate'] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (editingTodo) {
      // For editing, we still need the user context
      if (user) {
        dispatch(editTodo({ 
          userEmail: user.email, 
          id: editingTodo.id, 
          text: formData.text, 
          dueDate: formData.dueDate 
        }));
        onCancel?.();
      }
    } else {
      // For adding new todos, associate with current user
      if (user) {
        dispatch(addTodoForUser({ 
          userEmail: user.email, 
          todo: { text: formData.text, dueDate: formData.dueDate } 
        }));
        setFormData({ text: '', dueDate: '' });
      }
    }
    setErrors({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  return (
    <Card className="mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {editingTodo ? 'Edit Todo' : 'Add New Todo'}
      </h3>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="text"
          label="Todo"
          value={formData.text}
          onChange={handleChange}
          error={errors.text}
          placeholder="Enter todo description"
        />
        <Input
          type="date"
          name="dueDate"
          label="Due Date"
          value={formData.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
        />
        <div className="flex gap-2">
          <Button type="submit">
            {editingTodo ? 'Update' : 'Add'} Todo
          </Button>
          {editingTodo && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
};