import { mainApi } from "./api/global";
import { userApi } from "./api/user";
import store from "./store";

export const invalidateAllQueries = () => {
  store.dispatch(userApi.util.resetApiState());
  store.dispatch(mainApi.util.resetApiState());
};
