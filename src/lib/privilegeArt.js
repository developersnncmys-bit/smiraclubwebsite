import fs from 'node:fs';
import path from 'node:path';

/**
 * The illustration drawn for each privilege.
 *
 * These are their own set, not the All Services artwork. A privilege and a
 * service tile are the same ten things, and borrowing one for the other put
 * identical pictures in two places on the same site. Same build — a tinted
 * body, a brand-blue line, one gold accent — drawn differently.
 *
 * Named after the privilege key, so adding a privilege and dropping in
 * `<key>.svg` is the whole job. A key with no file keeps its line icon,
 * the way the service tiles already behave.
 */

const DIR = path.join(process.cwd(), 'public', 'img', 'privileges');

const PREFERRED = ['.svg', '.webp', '.png'];

export function privilegeArt(keys) {
  const found = {};

  for (const key of keys) {
    for (const ext of PREFERRED) {
      try {
        if (fs.existsSync(path.join(DIR, key + ext))) {
          found[key] = `/img/privileges/${key}${ext}`;
          break;
        }
      } catch {
        // On any filesystem trouble the line icon is still a good answer.
      }
    }
  }

  return found;
}
