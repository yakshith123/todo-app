import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store/store';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  dueDate: string;
}

interface TodosState {
  // Store todos by user email
  userTodos: Record<string, Todo[]>;
}

export type { TodosState };

const initialState: TodosState = {
  userTodos: {}
};

// Selector to get todos for current user
export const selectCurrentUserTodos = createSelector(
  [(state: RootState) => state.auth.user, (state: RootState) => state.todos.userTodos],
  (user, userTodos) => {
    if (!user) return [];
    return userTodos[user.email] || [];
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    toggleTodo: (state, action: PayloadAction<{ userEmail: string; todoId: string }>) => {
      const { userEmail, todoId } = action.payload;
      const userTodos = state.userTodos[userEmail] || [];
      const todo = userTodos.find(t => t.id === todoId);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action: PayloadAction<{ userEmail: string; todoId: string }>) => {
      const { userEmail, todoId } = action.payload;
      if (!state.userTodos[userEmail]) return;
      state.userTodos[userEmail] = state.userTodos[userEmail].filter(t => t.id !== todoId);
    },
    editTodo: (state, action: PayloadAction<{ userEmail: string; id: string; text: string; dueDate: string }>) => {
      const { userEmail, id, text, dueDate } = action.payload;
      const userTodos = state.userTodos[userEmail] || [];
      const todo = userTodos.find(t => t.id === id);
      if (todo) {
        todo.text = text;
        todo.dueDate = dueDate;
      }
    },
    // New action to set todos for a specific user
    setUserTodos: (state, action: PayloadAction<{ userEmail: string; todos: Todo[] }>) => {
      state.userTodos[action.payload.userEmail] = action.payload.todos;
    },
    // New action to add a todo for a specific user
    addTodoForUser: (state, action: PayloadAction<{ userEmail: string; todo: Omit<Todo, 'id' | 'completed'> }>) => {
      const { userEmail, todo } = action.payload;
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text: todo.text,
        dueDate: todo.dueDate,
        completed: false
      };
      
      if (!state.userTodos[userEmail]) {
        state.userTodos[userEmail] = [];
      }
      
      state.userTodos[userEmail].push(newTodo);
    }
  }
});

export const { toggleTodo, deleteTodo, editTodo, setUserTodos, addTodoForUser } = todosSlice.actions;
export default todosSlice.reducer;
