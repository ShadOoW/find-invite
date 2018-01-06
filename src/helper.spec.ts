import { expect } from 'chai';
import { Helper } from './helper';

describe('Users Sorting:', () => {
    describe('sort():', () => {
        ['1', ' 2 ', -1.1].forEach(value => {
            it('should sort users by id, from lowest to highest', () => {
                expect(
                    Helper.SortUsersByID([
                        {user_id: '100'},
                        {user_id: '-100'},
                        {user_id: 0},
                        {user_id: ' 5 '},
                        {user_id: -200},
                        {user_id: 5.5}
                    ]))
                    .eql([
                        {user_id: -200},
                        {user_id: '-100'},
                        {user_id: 0},
                        {user_id: ' 5 '},
                        {user_id: 5.5},
                        {user_id: '100'}
                    ]);
            });
        });
    });
});
