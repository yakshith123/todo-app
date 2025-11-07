import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { type RootState } from '../../store/store';
import { logout } from '../auth/authSlice';
import { type Todo, selectCurrentUserTodos } from './todosSlice';
import { TodoForm } from './TodoForm';
import { TodoItem } from './TodoItem';
import { SearchBar } from './SearchBar';
import { DateFilter } from './DateFilter';
import type { DateFilterType } from './DateFilter';
import { useDebounce } from '../../hooks/useDebounce';
import { Button } from '../../components/ui/Button';

export const TodosDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  // Use the new selector to get todos for the current user
  const todos = useSelector(selectCurrentUserTodos);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  };

  const filteredTodos = useMemo(() => {
    let filtered = todos;

    // Apply search filter
    if (debouncedSearch) {
      filtered = filtered.filter(todo =>
        todo.text.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Apply date filter
    if (dateFilter === 'today') {
      const today = getTodayDate();
      filtered = filtered.filter(todo => todo.dueDate === today);
    } else if (dateFilter === 'yesterday') {
      const yesterday = getYesterdayDate();
      filtered = filtered.filter(todo => todo.dueDate === yesterday);
    }

    return filtered;
  }, [todos, debouncedSearch, dateFilter]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Todos</h1>
              <p className="text-gray-600">Welcome, {user?.name}!</p>
            </div>
            <Button variant="danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Todo Form */}
        <TodoForm
          editingTodo={editingTodo ? { id: editingTodo.id, text: editingTodo.text, dueDate: editingTodo.dueDate } : undefined}
          onCancel={() => setEditingTodo(null)}
        />

        {/* Search and Filters */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <DateFilter activeFilter={dateFilter} onFilterChange={setDateFilter} />
        </div>

        {/* Todos List */}
        <div>
          {filteredTodos.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
              <p className="text-gray-500 text-lg">No todos found. Add one to get started!</p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onEdit={setEditingTodo}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};