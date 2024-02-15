// store.js
import { createStore } from "redux";
import rootReducer from "./reducers"; // You'll define your reducers in this file

const store = createStore(rootReducer);

export default store;
