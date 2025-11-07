import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '../../store/store';
import { toggleTodo, deleteTodo, type Todo } from './todosSlice';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleToggle = () => {
    if (user) {
      dispatch(toggleTodo({ userEmail: user.email, todoId: todo.id }));
    }
  };

  const handleDelete = () => {
    if (user) {
      dispatch(deleteTodo({ userEmail: user.email, todoId: todo.id }));
    }
  };

  const handleEdit = () => {
    onEdit(todo);
  };

  return (
    <Card className={`mb-3 ${todo.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={handleToggle}
            className="w-5 h-5 cursor-pointer"
          />
          <div className="flex-1">
            <p className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {todo.text}
            </p>
            <p className="text-sm text-gray-500">Due: {todo.dueDate}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={handleEdit}
            disabled={todo.completed}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};