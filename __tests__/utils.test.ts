import * as utils from '../src/util';

describe('util', () => {
  describe('getFirstDate', () => {
    test('gets the start of the month with no offset', async () => {
      const date = new Date("2019-05-10")
      const subject = utils.getFirstDate(date, 0)

      expect(subject.getFullYear()).toEqual(2019)
      expect(subject.getMonth()).toEqual(4)
      expect(subject.getDate()).toEqual(1)
    });

    test('gets the start of the month with offset', async () => {
      const date = new Date("2019-05-10")
      const subject = utils.getFirstDate(date, 1)

      expect(subject.getFullYear()).toEqual(2019)
      expect(subject.getMonth()).toEqual(5)
      expect(subject.getDate()).toEqual(1)
    });

    test('gets the start of the month with offset next year', async () => {
      const date = new Date("2019-12-10")
      const subject = utils.getFirstDate(date, 1)

      expect(subject.getFullYear()).toEqual(2020)
      expect(subject.getMonth()).toEqual(0)
      expect(subject.getDate()).toEqual(1)
    });
  });

  describe('getLastDate', () => {
    test('gets the end of the month with no offset', async () => {
      const date = new Date("2019-05-10")
      const subject = utils.getLastDate(date, 0, 1)

      expect(subject.getFullYear()).toEqual(2019)
      expect(subject.getMonth()).toEqual(4)
      expect(subject.getDate()).toEqual(31)
    });

    test('gets the end of the month with offset', async () => {
      const date = new Date("2019-05-10")
      const subject = utils.getLastDate(date, 1, 1)

      expect(subject.getFullYear()).toEqual(2019)
      expect(subject.getMonth()).toEqual(5)
      expect(subject.getDate()).toEqual(30)
    });

    test('gets the end of the month with offset next year', async () => {
      const date = new Date("2019-12-10")
      const subject = utils.getLastDate(date, 1, 1)

      expect(subject.getFullYear()).toEqual(2020)
      expect(subject.getMonth()).toEqual(0)
      expect(subject.getDate()).toEqual(31)
    });
  });
});
