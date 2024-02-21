// store.js
import { createStore, combineReducers } from 'redux';
import signatureReducer from './reducers';

const rootReducer = combineReducers({
  signature: signatureReducer,
});

const store = createStore(rootReducer);

export default store;