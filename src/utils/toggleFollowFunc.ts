import { api } from "~/utils/api";

export const toggleFollowFunc = (id: string) => {
  const trpcUtils = api.useContext();
  return api.profile.toggleFollow.useMutation({
    onSuccess: ({ addedFollow }) => {
      trpcUtils.profile.getById.setData({ id }, (oldData) => {
        if (oldData == null) return;

        const countModifier = addedFollow ? 1 : -1;
        return {
          ...oldData,
          isFollowing: addedFollow,
          followersCount: oldData.followersCount + countModifier,
        }
      })
    }
  });
}