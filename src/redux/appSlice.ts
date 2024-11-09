import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    toDoList: [],
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setToDoList: (state, action) => {
            state.toDoList = action.payload
        },
    },
});

export const { setToDoList } = appSlice.actions;
export default appSlice.reducer