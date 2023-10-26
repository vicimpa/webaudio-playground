import { useLayoutEffect } from "react";

import { useEvent } from "./useEvent";

export const useWindowEvent = <K extends keyof WindowEventMap>(
  event: K,
  listener: (e: WindowEventMap[K]) => any
) => {
  const refListener = useEvent(listener);

  useLayoutEffect(() => {
    addEventListener(event, refListener);
    return () => removeEventListener(event, refListener);
  }, []);
};