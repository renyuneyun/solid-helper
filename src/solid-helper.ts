import NS from 'solid-namespace';
import parseLinkHeader from '@renyuneyun/parse-link-header-ts';
import { Parser, Store } from 'n3';

export interface UserInfoStruct {
  avatar?: string;
  name?: string;
}

const ns = NS();

/**
 * Identify if the given URL is a storage based on the `Link` header.
 */
export function isStorageInLinkHeaderString(linkHeader: string, base?: string): boolean {
  const parsed = parseLinkHeader(linkHeader, base);
  // console.log('Link header(0):', parsed);
  if ('type' in parsed) {
    for (const link of parsed['type']) {
      if (ns.space('Storage') == link.url) {
        // console.log('Has storage:', urlObject);
        return true;
      }
    }
  }
  return false;
}

/**
 * Identify if the given URL is a storage based on the `Link` header, of the given URL.
 */
export async function isStorageInLinkHeader(urlObject: URL): Promise<boolean> {
  let resp = undefined;
  try {
    resp = await fetch(urlObject);
  } catch (e: unknown) {} // TODO: Better (more specifically) handle 401 (etc) errors
  if (resp) {
    const linkHeader = resp.headers.get('Link');
    // console.log('Original Link header:', linkHeader);
    if (linkHeader) {
      return isStorageInLinkHeaderString(linkHeader, urlObject.href);
    }
  }
  return false;
}

/**
 * Find the Pod (root) of the resource denoted with `url`, by looking for `space:Storage` up the path (ref: https://solidproject.org/ED/protocol#storage-resource)
 * Note the `url` does not have to be a Solid resource, thus the callee should handle `undefined` return from this function.
 * @param url A URL to begin the look-up (does not have to ba a resource inside the Pod)
 * @returns Either the URL of the Pod, or `undefined` if not found
 */
export async function findStorage(url: string): Promise<string | undefined> {
  const urlObject = new URL(url);
  urlObject.hash = '';  // Remove any hash/anchor from the URL
  let isStorage = false;
  while (!isStorage && urlObject.pathname && urlObject.pathname != '/') {
    isStorage = await isStorageInLinkHeader(urlObject);
    if (!isStorage) {
      urlObject.pathname = urlObject.pathname.substring(
        0,
        urlObject.pathname.lastIndexOf('/')
      );
    }
  }
  if (!isStorage) {
    isStorage = await isStorageInLinkHeader(urlObject);
  }
  if (isStorage) {
    return urlObject.href;
  }
  return undefined;
}

export async function getUserInfo(webid: string): Promise<UserInfoStruct> {
  const userInfo: UserInfoStruct = {};
  try {
    const response = await fetch(webid, { headers: { Accept: 'text/turtle' } });
    if (!response.ok) return userInfo;
    const store = new Store(new Parser({ baseIRI: webid }).parse(await response.text()));
    userInfo.avatar = store.getObjects(null, ns.vcard('hasPhoto'), null)[0]?.value;
    userInfo.name = store.getObjects(null, ns.vcard('fn'), null)[0]?.value;
  } catch (_e) { /* return empty userInfo on any error */ }
  return userInfo;
}
