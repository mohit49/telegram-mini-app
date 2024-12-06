import { createSlice } from '@reduxjs/toolkit'

export const initialState = {
    tasks: [],
    isLoaded: false,
    user: undefined,
    mount: null,
    shopinfo: false,
    pubKey: null,
    priKey: null,
}

export const TaskReducer = createSlice({
    name: 'task',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setMountStore: (state, action) => {
            state.mount = action.payload
        },
        setUpadteShop: (state, action) => {
            state.shopinfo = action.payload
        },
        setTasks: (state, action) => {
            state.tasks = action.payload
            state.isLoaded = true
        },
        setKeyPairs: (state, action) => {
            state.pubKey = action.payload.publicKey
            state.priKey = action.payload.privateKey
            console.log(action.payload)
        },
        removeKeyPairs: (state, action) => {
            state.pubKey = null
            state.priKey = null
        },
    },
})

export const { setUser, setMountStore, setUpadteShop, setTasks, setKeyPairs, removeKeyPairs } = TaskReducer.actions

export default TaskReducer.reducer