import { mainApi } from ".";
import { videoCreator } from "./videoCreator";

const songApi = mainApi.injectEndpoints({
  endpoints: (builder) => ({
    searchCreator: builder.query<videoCreator[], string>({
      query: (query) => ({
        url: `/video-creators/search?query=${query}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useSearchCreatorQuery } = songApi;
