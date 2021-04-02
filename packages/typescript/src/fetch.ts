import { readFileSync } from 'fs';
import fetch from 'node-fetch';
import unzipper from 'unzipper';

export default async function fetchFile(path: string) {
  try {
    const url = new URL(path);

    const res = await fetch(url);

    if (res.headers.get('content-type') === 'application/zip') {
      return new Promise<string>((resolve, reject) => {
        let buffer = [] as string[];

        const zip = unzipper.ParseOne(/\.xsd$/);

        res.body.pipe(zip);

        zip.on('data', (data) => {
          buffer.push(data.toString());
        })

        zip.on('end', () => {
          resolve(buffer.join(''));
        })

        zip.on('error', reject);
      });
    }

    return await res.text();
  } catch (e) {
    // pass through and try as local path
  }

  try {
    return readFileSync(path, 'utf8');
  } catch (e) {
    throw e;
  }
}
