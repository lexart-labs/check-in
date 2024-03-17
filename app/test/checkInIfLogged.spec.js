import { expect } from "chai";
import sinon from "sinon";
import { doCheckInIfJustLoggedIn } from "../src/helpers/onLoginAction.js";

describe("doCheckInIfJustLoggedIn", () => {
  let doCheckIn;
  let consoleError;

  beforeEach(() => {
    doCheckIn = sinon.fake.resolves();
    consoleError = sinon.stub(console, "error");
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should call doCheckIn and remove "justLoggedIn" from sessionStorage if "justLoggedIn" is "true"', async () => {
    sessionStorage.setItem("justLoggedIn", "true");

    await doCheckInIfJustLoggedIn(doCheckIn);

    expect(doCheckIn.calledOnce).to.be.true;
    expect(sessionStorage.getItem("justLoggedIn")).to.be.null;
  });

  it('should not call doCheckIn if "justLoggedIn" is not "true"', async () => {
    sessionStorage.setItem("justLoggedIn", "false");

    await doCheckInIfJustLoggedIn(doCheckIn);

    expect(doCheckIn.called).to.be.false;
  });

  it("should log an error if doCheckIn throws an error", async () => {
    sessionStorage.setItem("justLoggedIn", "true");
    const error = new Error("doCheckIn error");
    doCheckIn = sinon.fake.rejects(error);

    await doCheckInIfJustLoggedIn(doCheckIn);

    expect(consoleError.calledOnceWith("Error in doCheckIn: ", error)).to.be
      .true;
  });
});
