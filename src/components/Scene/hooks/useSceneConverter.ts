import { useEvent } from "hooks/useEvent";

import { useSceneRef } from "..";

const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')!;
const point = svg.createSVGPoint();

export const useSceneConverter = () => {
  const svgRef = useSceneRef();
  return useEvent((X: number, Y: number) => {
    const elem = svgRef.current;
    point.x = X;
    point.y = Y;
    if (!elem) return point;
    return point.matrixTransform(elem.getScreenCTM()!.inverse());
  });
};
