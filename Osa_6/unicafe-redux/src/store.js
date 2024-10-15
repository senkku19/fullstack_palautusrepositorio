import { createStore } from "redux";
import counterReducer from './reducer'

const store = createStore(counterReducer)

store.subscribe(() => {
    const storeNow = store.getState()
    console.log(storeNow)
})

store.dispatch({ type: 'GOOD' })
store.dispatch({ type: 'OK' })
store.dispatch({ type: 'BAD' })
store.dispatch({ type: 'ZERO' })

export default store