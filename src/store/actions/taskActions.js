export const SELECT_TASK = "SELECT_TASK";
export const CLEAR_TASK = "CLEAR_TASK";

export const selectTask = (task) => ({
  type: SELECT_TASK,
  payload: task,
});

export const clearTask = () => ({
  type: CLEAR_TASK,
});
