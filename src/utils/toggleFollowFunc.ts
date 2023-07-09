import { api } from "~/utils/api";
import { toast } from "react-toastify";

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
      toast.success(addedFollow ? "Followed 😄" : "Unfollowed 💀")
    },
    onError: (err) => {
      toast.error(err.message + " 💀")
    }
  });
}