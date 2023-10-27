import { ReactiveSet } from "library/ReactiveSet";
import { createContext, createRef, RefObject, useContext } from "react";

export type TLayer = {
  isPre?: boolean;
  ref: RefObject<SVGSVGElement>;
};

export const SceneContext = createContext({
  params: { x: 0, y: 0, s: 1 },
  svg: createRef<SVGSVGElement>(),
  layers: new ReactiveSet<TLayer>(),
});

export const SceneProvider = SceneContext.Provider;

export const useSceneParams = () => {
  return useContext(SceneContext).params;
};

export const useSceneRef = () => {
  return useContext(SceneContext).svg;
};