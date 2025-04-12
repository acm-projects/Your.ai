// store.ts
import {configureStore} from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // default localStorage for the web
import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

// Define your actions
const SET_TASKS = 'SET_TASKS';


// Actions
export const setTasks = (tasks: Task[]) => ({
  type: SET_TASKS,
  payload: tasks,
});













const SET_COMPLETION_RATE = 'SET_COMPLETION_RATE';