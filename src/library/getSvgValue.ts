export const getSvgValue = (value?: { baseVal: { value: number; }; } | null) => {
  if (!value) return undefined;
  return value.baseVal.value;
};