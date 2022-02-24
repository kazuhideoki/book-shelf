import { useSetRecoilState } from "recoil";
import { loadingState } from "../recoil/atom/loading";

export const useWithLoading = () => {
  const setLoading = useSetRecoilState(loadingState);
  return async <T>(callback: Promise<T>): Promise<T> => {
    setLoading(true);
    const res = await callback;
    setLoading(false);
    return res;
  };
};
