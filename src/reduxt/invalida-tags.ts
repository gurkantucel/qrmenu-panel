export const withInvalidateTags = (targets: { api: any; tags: string[] }[]) => {
  return async (arg: any, { dispatch, queryFulfilled }: any) => {
    try {
      await queryFulfilled;
      targets.forEach(({ api, tags }) => {
        dispatch(api.util.invalidateTags(tags));
      });
    } catch (err) {
      console.error("Mutation failed:", err);
    }
  };
};