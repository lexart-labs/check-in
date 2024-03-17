import { expect } from "chai";
import sinon from "sinon";
import { doLogout } from "../src/helpers/doLogoutFunction.js";

describe("doLogout test", () => {
  let isAdminUser;
  let doBrb;
  let getAuth;
  let signOut;
  let router;

  beforeEach(() => {
    isAdminUser = { value: false };
    doBrb = sinon.fake();
    getAuth = sinon.fake.resolves("auth");
    signOut = sinon.fake();
    router = { push: sinon.fake() };
  });

  it("should call doBrb, getAuth, signOut, and router.push if isAdminUser.value is false", async () => {
    await doLogout(isAdminUser, doBrb, getAuth, signOut, router);

    sinon.assert.callOrder(doBrb, getAuth, signOut, router.push);
    expect(signOut.calledOnceWith("auth")).to.be.true;
    expect(router.push.calledOnceWith("/")).to.be.true;
  });

  it("should not call doBrb, getAuth, signOut, nor router.push if isAdminUser.value is true", async () => {
    isAdminUser.value = true;

    await doLogout(isAdminUser, doBrb, getAuth, signOut, router);

    expect(doBrb.called).to.be.false;
    expect(getAuth.called).to.be.false;
    expect(signOut.called).to.be.false;
    expect(router.push.called).to.be.false;
  });
});
