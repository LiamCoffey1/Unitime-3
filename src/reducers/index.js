import { combineReducers } from 'redux'
import user from './user'
import creator from './creator'
import assignments from './assignments'

const rootReducer = combineReducers({
  user, creator, assignments
});

export default rootReducer