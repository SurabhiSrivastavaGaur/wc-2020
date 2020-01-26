export default function parseText(text: string) {
  const textRows = text.toUpperCase().split("\n");
  return textRows;
}
