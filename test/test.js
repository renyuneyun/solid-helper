/**
 * Unit tests
 * 
 * See ./e2e/test.js for end-to-end tests.
 */

import assert from "assert";
import { isStorageInLinkHeaderString } from "../dist/solid-helper.js";

// A legit but fake Pod URL without trailing slash, for testing
const POD_URL = "https://a.pod.url";

describe("isStorageInLinkHeaderString()", function () {
  it("No Storage", async function () {
    const linkHeader = `<http://www.w3.org/ns/ldp#Container>; rel="type"`;
    assert.ok(!isStorageInLinkHeaderString(linkHeader));
  });

  it("Only Storage", async function () {
    const linkHeader = `<http://www.w3.org/ns/pim/space#Storage>; rel="type"`;
    assert.ok(isStorageInLinkHeaderString(linkHeader));
  });

  it("Multiple link with Storage", async function () {
    const linkHeader = `<http://www.w3.org/ns/pim/space#Storage>; rel="type", <${POD_URL}/.acl>; rel="acl"`;
    assert.ok(isStorageInLinkHeaderString(linkHeader));
  });

  it("Multiple link multiple `rel=type` with Storage", async function () {
    const linkHeader = `<http://www.w3.org/ns/pim/space#Storage>; rel="type", ` +
                       `<http://www.w3.org/ns/ldp#Container>; rel="type", ` +
                       `<http://www.w3.org/ns/ldp#BasicContainer>; rel="type", ` +
                       `<http://www.w3.org/ns/ldp#Resource>; rel="type", ` + 
                       `<${POD_URL}/.acl>; rel="acl"`;
    assert.ok(isStorageInLinkHeaderString(linkHeader));
  });
});