// store.js
import { createStore, combineReducers } from 'redux';

import rootReducer from '../src/components/Reducers/reducers';
import EquipmentCleaningReducers from './components/Reducers/EquipmentCleaningReducers';
import signatureReducer from './components/Reducers/saveSignatureReducer';
import areaAndEquipmentReducers from './components/Reducers/areaAndEquipmentReducers';

// const rootReducer = combineReducers({
//   signature: signatureReducer,
// });

const reducer=combineReducers({
    objects:rootReducer,
    equipment:EquipmentCleaningReducers,
    signature:signatureReducer,
    area:areaAndEquipmentReducers
})
const store = createStore(reducer);

export default store;