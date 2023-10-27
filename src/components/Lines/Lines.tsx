import { ReactiveSet } from "library/ReactiveSet";
import { createContext, FC, ReactNode } from "react";

import { LineItem, TLineOptions } from "./LineItem";

export type TLinesProps = {
  children?: ReactNode;
};

export const LinesContext = createContext(
  new ReactiveSet<TLineOptions>
);

export const Lines: FC<TLinesProps> = ({ children }) => {
  const lines = ReactiveSet.use<TLineOptions>();

  return (
    <>
      {[...lines].map((line, i) => (
        <LineItem key={i} line={line} />
      ))}

      <LinesContext.Provider value={lines}>
        {children}
      </LinesContext.Provider>
    </>
  );
};