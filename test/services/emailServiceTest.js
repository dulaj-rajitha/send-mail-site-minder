const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('emailService', () => {
    const service = require('../../api/services/emailService');


    it('should send email successfully', () => {
        service.sendMail({}).then((value) => {
            expect(value).to.be.undefined;
        });
    });
});
