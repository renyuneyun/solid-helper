# Solid Helper

This repo contains common helpers for developing [SoLiD (Social Linked Data)](https://solidproject.org/) Apps with JS/TS.

It emerged from my personal requirements, because I routinely or predictively need some functionalities.

# Docs

Under construction...

For the time being, please see `index.ts` for exported functions and types. They are mainly:

- `getUserInfo()`: Get some common information of the WebID (avatar, name, etc).
- `findStorage()`:  Get the Pod / storage (recursively up) from the specified URL. Mainly used when WebID does not have `space:storage` specified.
- `isStorageInLinkHeader()`: Identify if the given URL is a storage based on the `Link` header, of the given URL.
- `isStorageInLinkHeaderString()`: Identify if the given URL is a storage based on the `Link` header.

## Test

This repo comes with simple / naive unit tests and end-to-end (E2E) tests, under `test/`.

Remember to run `npm run build` first before testing.

### Unit test

To run the unit test:

```sh
npm test
```

### E2E test

To run the E2E test:

```sh
POD_URL='https://YOUR-POD-URL/' npm run test-e2e
```

See document inside the file (`test/e2e/test.js`) for more details.
