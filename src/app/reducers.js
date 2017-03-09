import { combineReducers } from 'redux'
import { news } from './home/reducers'

const rootReducer = combineReducers({
  news,
})

export default rootReducer