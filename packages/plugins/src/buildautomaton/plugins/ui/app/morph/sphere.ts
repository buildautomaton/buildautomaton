import type { Vec3 } from './project.js';

export const STACKS = 22;
export const SLICES = 40;
export const FACE_COUNT = STACKS * SLICES;
export const FACE_XYZ = new Float32Array(FACE_COUNT * 12);

export type Face = { corners: [Vec3, Vec3, Vec3, Vec3] };

let built: Face[] | null = null;

/** Quad faces of a polygonal sphere, row by row from the top. */
export function sphereFaces(): Face[] {
  if (built) return built;
  const faces: Face[] = [];
  let offset = 0;
  for (let stack = 0; stack < STACKS; stack += 1) {
    const v0 = stack / STACKS;
    const v1 = (stack + 1) / STACKS;
    for (let slice = 0; slice < SLICES; slice += 1) {
      const u0 = slice / SLICES;
      const u1 = (slice + 1) / SLICES;
      const corners = [point(u0, v0), point(u1, v0), point(u1, v1), point(u0, v1)] as Face['corners'];
      faces.push({ corners });
      for (const corner of corners) {
        FACE_XYZ[offset] = corner[0];
        FACE_XYZ[offset + 1] = corner[1];
        FACE_XYZ[offset + 2] = corner[2];
        offset += 3;
      }
    }
  }
  built = faces;
  return faces;
}

function point(u: number, v: number): Vec3 {
  const phi = v * Math.PI;
  const theta = u * Math.PI * 2;
  const ring = Math.sin(phi);
  return [Math.cos(theta) * ring, Math.cos(phi), Math.sin(theta) * ring];
}
