# Solid Helper

This repo contains common helpers for developing [SoLiD (Social Linked Data)](https://solidproject.org/) Apps with JS/TS.

It emerged from my personal requirements, because I routinely or predictively need some functionalities.

# Docs

Under construction...

For the time being, please see `index.ts` for exported functions and types. They are mainly:

- `getUserInfo()`: Get some common information of the WebID (avatar, name, etc).
- `findStorage()`:  Get the Pod / storage (recursively up) from the specified URL. Mainly used when WebID does not have `space:storage` specified.
- `isStorageInLinkHeader()`: Identify if the given URL is a storage based on the `Link` header.

## Test

This repo comes with simple / naive tests, under `test/test.mjs`.

To run the test:

```sh
POD_URL='https://YOUR-POD-URL/' npm test
```

See document inside the file for more details.
