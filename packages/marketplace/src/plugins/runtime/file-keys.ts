export function sourceFileKey(listingId: string, version: string, path: string): string {
  return `${listingId}/${version}/source/${path}`;
}

export function artifactFileKey(
  listingId: string,
  version: string,
  artifactId: string,
  path: string,
): string {
  return `${listingId}/${version}/artifacts/${artifactId}/${path}`;
}
