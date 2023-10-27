export const elementCenter = (
  element: Element
): { x: number, y: number; } => {
  const { x, y, width, height } = element.getBoundingClientRect();
  return { x: x + width / 2, y: y + height / 2 };
};