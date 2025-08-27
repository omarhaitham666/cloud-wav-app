import store from "../store";
import { mainApi } from "./global";
import { userApi } from "./user";

const invalidateAllQueries = () => {
  store.dispatch(userApi.util.resetApiState());
  store.dispatch(mainApi.util.resetApiState());
};

export { invalidateAllQueries, mainApi, userApi };
