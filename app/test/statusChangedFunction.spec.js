import sinon from 'sinon';
import { expect } from "chai";
import { statusChanged,sendReason } from '../src/helpers/statusChanged.js';

describe('testing the functions statusChanged and sendReason', () => {
    let docStub;
    let setDocStub;
    let collectionStub;
    let addDocStub;

    beforeEach(() => {
        docStub = sinon.stub();
        setDocStub = sinon.stub().resolves();
        collectionStub = sinon.stub();
        addDocStub = sinon.stub().resolves();
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should update brb and checkin keys correctly', async () => {
      const user = { name: 'user', email: 'user@gmail.com', docId: '12347', isCheckIn: true };
      const db = {}; 
  
      await statusChanged(user, 'TABLE_NAME', db, {
          doc: docStub,
          setDoc: setDocStub
      });
      sinon.assert.calledOnce(setDocStub);
      const [docRef, data] = setDocStub.firstCall.args;
      expect(data).to.be.an('object').and.to.have.all.keys(
          'date', 'email', 'isOtpValid', 'tenant', 'timeBrb', 'timeCheckin', 'username', '_rawDate'
      );
      expect(data.date).to.be.a('number');
      expect(data.email).to.equal('user@gmail.com');
      expect(data.isOtpValid).to.be.true;
      expect(data.tenant).to.equal('lexart');
      expect(data.timeBrb).to.be.a('number');
      expect(data.timeCheckin).to.be.null;
      expect(data.username).to.equal('user');
      expect(data._rawDate).to.be.an.instanceOf(Date);
  });
    it('should add new document to collection with reason', async () => {
      const user = { name: 'user', email: 'user@gmail.com' };
      const reason = 'Test reason';
      const db = {}; 
      await sendReason(user, reason, db, {
          getCurrentUser: sinon.stub().resolves({ email: 'adm@gmail.com', displayName: 'adm' }),
          collection: collectionStub,
          getDocs: sinon.stub().resolves({ docs: [] }),
          doc: sinon.stub(),
          setDoc: sinon.stub(),
          addDoc: addDocStub
      });
      sinon.assert.calledOnce(addDocStub);
      const [collectionArg, newDocArg] = addDocStub.firstCall.args;
      expect(newDocArg.admEmail).to.equal('adm@gmail.com')
      expect(newDocArg.admName).to.equal('adm')
      expect(newDocArg.devName).to.equal('user')
      expect(newDocArg.devEmail).to.equal('user@gmail.com')
      expect(newDocArg.reason).to.equal(reason);
      expect(newDocArg._rawDate).to.be.an.instanceOf(Date);
  });
});
