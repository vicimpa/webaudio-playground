import { useMemo } from "react";
import { proxy, useSnapshot } from "valtio";

export const useProxyState = <T extends object>(initial: T) => {
  const state = useMemo(() => proxy(initial), []);
  return (useSnapshot(state), state);
};