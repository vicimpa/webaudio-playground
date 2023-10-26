import { useSceneParams } from "components/Scene";
import { MouseEventHandler, useCallback, useRef } from "react";

import { useEvent } from "./useEvent";
import { useWindowEvent } from "./useWindowEvent";

export interface IMoving {
  scale?: number;
  start?(): any;
  moving?(dx: number, dy: number): any;
  end?(): any;
}

export const useMoving = ({
  scale,
  start = () => { },
  moving = () => { },
  end = () => { },
}: IMoving): MouseEventHandler => {
  const params = useSceneParams();
  const refState = useRef({ x: 0, y: 0, down: false });
  const eventStart = useEvent(start);
  const eventMoving = useEvent(moving);
  const eventEnd = useEvent(end);
  const s = scale ?? params.s;

  useWindowEvent('mousemove', (e) => {
    if (!refState.current.down) return;
    const { x, y } = refState.current;
    eventMoving((e.clientX - x) / s, (e.clientY - y) / s);
  });

  useWindowEvent('mouseup', (e) => {
    if (!refState.current.down) return;
    refState.current.down = false;
    const { x, y } = refState.current;
    eventMoving((e.clientX - x) / s, (e.clientY - y) / s);
    eventEnd();
  });

  return useCallback((e) => {
    if (e.button) return;
    e.preventDefault();
    e.stopPropagation();
    refState.current.down = true;
    refState.current.x = e.clientX;
    refState.current.y = e.clientY;
    eventStart();
  }, []);
};