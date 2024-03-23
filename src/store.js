// store.js
import { createStore, combineReducers } from 'redux';

import rootReducer from '../src/components/Reducers/reducers';
import EquipmentCleaningReducers from './components/Reducers/EquipmentCleaningReducers';
import signatureReducer from './components/Reducers/saveSignatureReducer';
import areaAndEquipmentReducers from './components/Reducers/areaAndEquipmentReducers';
import DifferentialPressureReducers from './components/Reducers/DifferentialPressureReducer';
import DPRpanelReducers from './components/Reducers/DPRpanelReducers';
import TemperatureRecordReducers from './components/Reducers/TemperatureRecordReducers';

// const rootReducer = combineReducers({
//   signature: signatureReducer,
// });

const reducer=combineReducers({
    objects:rootReducer,
    equipment:EquipmentCleaningReducers,
    signature:signatureReducer,
    area:areaAndEquipmentReducers,
    tableData:DifferentialPressureReducers,
    dprPanelData:DPRpanelReducers,
    temperature:TemperatureRecordReducers
})
const store = createStore(reducer);

export default store;