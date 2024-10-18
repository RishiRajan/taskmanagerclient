import { SELECT_TASK, CLEAR_TASK } from "../actions/taskActions";

const initialState = {
  selectedTask: null,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case SELECT_TASK:
      return {
        ...state,
        selectedTask: action.payload,
      };
    case CLEAR_TASK:
      return {
        ...state,
        selectedTask: null,
      };
    default:
      return state;
  }
};

export default taskReducer;
