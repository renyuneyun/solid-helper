# Solid Helper

This repo contains common helpers for developing [SoLiD (Social Linked Data)](https://solidproject.org/) Apps with JS/TS.

It emerged from my personal requirements, because I routinely or predictively need some functionalities.

# Docs

Under construction...

For the time being, please see `index.ts` for exported functions and types. They are mainly:

- `getUserInfo()`: Get some common information of the WebID (avatar, name, etc).
- `getStorageFromLink()`: Get the Pod / storage (recursively up) from the specified URL. Mainly used when WebID does not have `space:storage` specified.
