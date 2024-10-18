// index.js
import { createStore, combineReducers } from "redux";

import taskReducer from "./reducers/taskReducer";

const rootReducer = combineReducers({
  task: taskReducer,
});

const store = createStore(rootReducer);

export default store;
