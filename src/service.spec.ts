import { Service } from './service';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const should: any = chai.should();
const {expect, assert} = chai;

describe('Read file', () => {
    describe('get():', () => {
        it('should throw an error if file is not found', (done) => {
            Service.GetUsers('src/failed-path.txt').should.eventually.to.rejectedWith(
                'ENOENT: no such file or directory, open \'src/failed-path.txt\''
            ).notify(done);
        });
    });
});

describe('Get Users from a valid file:', () => {
    describe('get():', () => {
        it('should get all valid users and report lines that cannot be parsed', (done) => {
            Service.GetUsers('src/valid.test.txt').should.eventually.be.eql(
                {
                    users: [
                        {latitude: '1', user_id: 1, name: 'Batman', longitude: '-1'},
                        {latitude: '10', user_id: 2, name: 'Superman', longitude: '-10'},
                        {latitude: '20', user_id: 3, name: 'Normalman', longitude: '-20'}
                    ],
                    errors: [
                        'parsing error in file\'s line 0. with message: Unexpected token a in JSON at position 0',
                        'parsing error in file\'s line 2. with message: Unexpected end of JSON input',
                        'parsing error in file\'s line 4. with message: Unexpected token , in JSON at position 0'
                    ]
                }
            ).notify(done);
        });
    });
});
