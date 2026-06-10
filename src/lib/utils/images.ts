export function getCardCoverPath(path: string) {
  if (path.endsWith("-card.jpg")) {
    return path
  }

  return path.replace(/\.jpg$/i, "-card.jpg")
}
