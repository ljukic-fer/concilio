import { configureStore } from '@reduxjs/toolkit'
import rootReducer from './combiner'

const store = configureStore ({
    reducer: rootReducer
})

export default store