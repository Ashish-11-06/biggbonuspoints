// src/store/notificationSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unreadCount: {}, // store count per user
};
console.log('Initial state:', initialState);
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setUnreadCount: (state, action) => {
      const { userId, count } = action.payload;
      console.log('Setting unread count:', userId, count);
      
      if (typeof count === 'number') {
        state.unreadCount[userId] = count;
      } else {
        state.unreadCount[userId] = (state.unreadCount[userId] || 0) + 1;
      }
    },
    clearUnreadCount: (state, action) => {
      const userId = action.payload;
      state.unreadCount[userId] = 0;
    },
  },
});

export const { setUnreadCount, clearUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;
