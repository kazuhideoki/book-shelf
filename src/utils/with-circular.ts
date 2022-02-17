import { useSetRecoilState } from "recoil";
import { loadingState } from "../recoil/atom/loading";

export async function useWithCircular() {
  const setLoading = useSetRecoilState(loadingState);

  return function <T>(callback: T) {
    try {
      setLoading(true);
      const result = callback;
      setLoading(false);
      return result;
    } catch (error) {
      console.log(error);

      setLoading(false);
      throw error;
    }
  };
}
