export default function alpha(hexaColor, opacity) {
  const hexAlpha = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255)
    .toString(16)
    .toUpperCase();

  return `${hexaColor}${hexAlpha}`;
}
