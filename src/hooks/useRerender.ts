import { useCallback, useState } from "react";

export const useRerender = () => {
  const [_, setState] = useState(0);
  return useCallback(() => setState(v => v + 1), []);
};