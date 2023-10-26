import { useCallback, useRef } from "react";

export const useEvent = <T extends (...args: any[]) => any>(listener: T) => {
  const ref = useRef(listener);
  ref.current = listener;
  return useCallback((...args: Parameters<T>) => {
    return ref.current(...args) as ReturnType<T>;
  }, []);
};