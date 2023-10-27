import { useState } from "react";

import { run, TListener, useFrame } from "./useFrame";

export const useCalc = <T extends TListener>(listener: T) => {
  const [state, setState] = useState(run(listener));

  useFrame(() => {
    const result = run(listener);
    if (state !== result)
      setState(result);
  });

  return state;
};