import { useMoving } from "hooks/useMoving";
import { useProxyState } from "hooks/useProxyState";
import { useRerender } from "hooks/useRerender";
import { useWindowEvent } from "hooks/useWindowEvent";
import { getSvgValue } from "library/getSvgValue";
import { minMax } from "library/math";
import { createContext, FC, ReactNode, useContext, useEffect, useRef, useState } from "react";

import styles from "./Scene.module.sass";

export type TSceneProps = {
  children?: ReactNode;
};

const SceneContext = createContext({ x: 0, y: 0, s: 1 });
const SceneProvider = SceneContext.Provider;

export const useSceneParams = () => {
  return useContext(SceneContext);
};

export const Scene: FC<TSceneProps> = ({ children }) => {
  const svg = useRef<SVGSVGElement>(null);
  const params = useProxyState({ x: 0, y: 0, s: 1 });
  const rerender = useRerender();
  const [viewBox, setViewBox] = useState<string | undefined>();
  const mouseState = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const elem = svg?.current;
    if (!elem) return;

    const width = elem.clientWidth;
    const height = elem.clientHeight;

    const cWidth = width / 2;
    const cHeight = height / 2;

    setViewBox([
      -cWidth / params.s + params.x,
      -cHeight / params.s + params.y,
      width / params.s,
      height / params.s,
    ].join(' '));
  }, [
    params.x, params.y, params.s,
    getSvgValue(svg.current?.width),
    getSvgValue(svg.current?.height)
  ]);

  useWindowEvent('resize', () => {
    rerender();
  });

  const moving = useMoving({
    scale: params.s,
    start() {
      mouseState.current.x = params.x;
      mouseState.current.y = params.y;
    },
    moving(dx, dy) {
      const { x, y } = mouseState.current;
      params.x = x - dx;
      params.y = y - dy;
    }
  });

  const glob2map = (X: number, Y: number) => {
    const elem = svg?.current;
    if (!elem) return;
    const { x, y, s } = params;

    const width = elem.clientWidth;
    const height = elem.clientHeight;

    const cWidth = width / 2;
    const cHeight = height / 2;

    return [
      X / s - cWidth / s + x,
      Y / s - cHeight / s + y,
    ] as [x: number, y: number];
  };

  glob2map;

  useWindowEvent('wheel', (e) => {
    params.s = minMax(params.s + -e.deltaY * 0.003, .2, 5);
  });

  const p10 = 16;
  const p100 = 128;

  return (
    <svg
      ref={svg}
      viewBox={viewBox}
      onMouseDown={moving}
      className={styles.scene}
    >
      <defs>
        <pattern id="p10" width={p10} height={p10} patternUnits="userSpaceOnUse">
          <path d={`M ${p10} 0 L 0 0 0 ${p10}`} fill="none" stroke="gray" strokeWidth={.5} />
        </pattern>
        <pattern id="p100" width={p100} height={p100} patternUnits="userSpaceOnUse">
          <rect width={p100} height={p100} fill="#333" />
          <rect width={p100} height={p100} fill="url(#p10)" />
          <path d={`M ${p100} 0 L 0 0 0 ${p100}`} fill="none" stroke="gray" strokeWidth={1} />
        </pattern>
      </defs>

      <rect x={-p100 * 50} y={-p100 * 50} width={p100 * 100} height={p100 * 100} fill="url(#p100)" />

      <SceneProvider value={params}>
        {children}
      </SceneProvider>
    </svg>
  );
};