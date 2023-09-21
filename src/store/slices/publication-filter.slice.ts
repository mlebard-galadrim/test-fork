import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    shouldReload: false,
    publicationType: [],
    subject: [],
    author: [],
}
const PublicationFilterSlice = createSlice({
    name: "PublicationFilters",
    initialState: initialState,
    reducers: {
        setPublicationType: (state, action) => ({...state, publicationType: action.payload}),
        setSubject: (state, action) => ({...state, subject: action.payload}),
        setAuthor: (state, action) => ({...state, author: action.payload}),
        setShouldReload: (state, action) => ({...state, shouldReload: action.payload}),

        reset: (state) => ({ ...initialState})
    }
});

export default PublicationFilterSlice;