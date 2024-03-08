/**
 * This is a very simple and naive test for this library, assuming single-WebID-single-Pod in structures like NSS.
 * For advanced cases, you'll need to adapt it to your own needs.
 * 
 * To use this test, provide your own POD_URL through environmental variable. See also README.md.
 */

import assert from "assert";
import { findStorage, isStorageInLinkHeader } from "../dist/solid-helper.js";

const POD_URL = process.env['POD_URL'];

describe("isStorageInLinkHeader()", function () {
  it("Root of Pod returns true", async function () {
    assert.ok(await isStorageInLinkHeader(new URL(POD_URL)));
  });

  it("Profile card file returns false", async function () {
    assert.ok(
      !(await isStorageInLinkHeader(new URL(`${POD_URL}profile/card`)))
    );
  });
});

describe("findStorage()", function () {
  it("Root of Pod returns itself", async function () {
    assert.equal(await findStorage(POD_URL), POD_URL);
  });
  it("Profile file returns root of Pod", async function () {
    assert.equal(await findStorage(`${POD_URL}profile/card`), POD_URL);
  });
  it("Profile IRI returns root of Pod without hash", async function () {
    assert.equal(await findStorage(`${POD_URL}profile/card#me`), POD_URL);
  });
});
