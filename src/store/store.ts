import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import todosReducer from '../features/todos/todosSlice';
import type { AuthState } from '../features/auth/authSlice';
import type { TodosState } from '../features/todos/todosSlice';

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('todoAppState');
    if (serializedState === null) {
      return undefined;
    }
    
    const parsedState = JSON.parse(serializedState);
    
    // Handle migration from old state structure to new structure
    if (parsedState.todos && !('userTodos' in parsedState.todos)) {
      // Old structure detected - migrate to new structure
      console.log('Migrating todos state structure');
      return {
        ...parsedState,
        todos: {
          userTodos: {} // Initialize new structure
        }
      };
    }
    
    return parsedState;
  } catch (err) {
    console.warn('Failed to parse localStorage state:', err);
    return undefined;
  }
};

// Get persisted state
const persistedState = loadState();

// Define the root state type explicitly
export interface RootState {
  auth: AuthState;
  todos: TodosState;
}

// Create store with persisted state
export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todosReducer
  },
  preloadedState: persistedState
});

export type { AuthState, TodosState };
export type AppDispatch = typeof store.dispatch;

const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify({
      auth: state.auth,
      todos: state.todos
    });
    localStorage.setItem('todoAppState', serializedState);
  } catch (err) {
    // Ignore write errors
  }
};

// Subscribe to store updates and save to localStorage
store.subscribe(() => {
  saveState(store.getState() as RootState);
});