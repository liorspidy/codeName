import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers'; // Import your root reducer

const store = configureStore({
  reducer: rootReducer,
  // Optionally, you can add middleware or enhancers here
});

export default store;
