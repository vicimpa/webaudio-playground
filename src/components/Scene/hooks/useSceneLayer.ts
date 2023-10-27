import { createRef, useContext, useEffect, useMemo } from "react";

import { SceneContext, TLayer } from "..";

export const useSceneLayer = (isPre = false) => {
  const { layers } = useContext(SceneContext);
  const ref = useMemo(() => createRef<SVGSVGElement>(), []);
  const layer = useMemo<TLayer>(() => ({ isPre, ref }), [isPre]);

  useEffect(() => {
    layers.add(layer);
    return () => {
      layers.delete(layer);
    };
  }, [isPre]);

  return ref;
};
