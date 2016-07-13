/* eslint-disable no-unused-expressions, no-underscore-dangle, func-names */

const expect = require('chai').expect;
const sinon = require('sinon');
const Dog = require('../../dst/models/dog');

describe('Dog', () => {
  beforeEach(() => {
    sinon.stub(Dog, 'find').yields(null, []);
  });

  afterEach(() => {
    Dog.find.restore();
  });

  describe('#feed', () => {
    it('should add 10 to the dogs health', sinon.test(function (done) {
      const d = new Dog({ name: 'fido',
                          age: 3,
                          health: 50,
                          toy: 'Bones' });
      this.stub(d, 'save').yields(null, {});
      d.feed(() => {
        expect(d.save.getCall(0).thisValue.health).to.equal(60);
        done();
      });
    }));
  });

  describe('constructor', () => {
    it('should create a dog object', (done) => {
      const d = new Dog({ name: 'fido',
                          age: 3,
                          health: 50,
                          toy: 'Bones' });
      d.validate(err => {
        expect(err).to.be.undefined;
        expect(d.name).to.equal('fido');
        expect(d._id).to.be.ok;
        expect(d.dateCreated).to.be.ok;
        done();
      });
    });

    it('should NOT create a dog object - negative health', (done) => {
      const d = new Dog({ name: 'fido',
                          age: 3,
                          health: -50,
                          toy: 'Bones' });
      d.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });

    it('should NOT create a dog object - name missing', (done) => {
      const d = new Dog({ age: 3,
                          health: 50,
                          toy: 'Bones' });
      d.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });

    it('should NOT create a dog object - name too short', (done) => {
      const d = new Dog({ name: 'ab',
                          age: 3,
                          health: 50,
                          toy: 'Bones' });
      d.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });

    it('should NOT create a dog object - invalid toy', (done) => {
      const d = new Dog({ name: 'fido',
                          age: 3,
                          health: 50,
                          toy: 'Cat' });
      d.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });

    it('should NOT create a dog object - duplicate dog found', done => {
      Dog.find.yields(null, [{ name: 'max' }]);
      const d = new Dog({ name: 'max',
                          age: 3,
                          health: 50,
                          toy: 'Bones' });
      d.validate(err => {
        expect(err).to.be.ok;
        sinon.assert.calledWith(Dog.find, { name: 'max' });
        done();
      });
    });
  });
});
