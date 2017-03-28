import { combineReducers } from 'redux'
import news from './routes/home/reducers'
import gallery from './components/gallery/reducers'
import galleryOverlay from './components/overlay/reducers'
import comments from './components/comment/reducers'

const rootReducer = combineReducers({
  news,
  gallery,
  galleryOverlay,
  comments,
})

export default rootReducer