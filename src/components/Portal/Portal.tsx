import { useCalc } from "hooks/useCalc";
import { FC, ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";

export type Elem = Element | DocumentFragment;

export type TPortalProps = {
  target: Elem | RefObject<Elem>;
  children?: ReactNode;
};

export const Portal: FC<TPortalProps> = ({
  target,
  children
}) => {
  const elem = useCalc(() => {
    if ('current' in target)
      return target.current;

    return target;
  });

  if (!(elem instanceof Element || elem instanceof DocumentFragment))
    return null;


  return createPortal(children, elem);
};