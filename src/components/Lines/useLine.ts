import { useContext } from "react";

import { LinesContext } from "./Lines";

export const useLine = () => {
  const lines = useContext(LinesContext);
};