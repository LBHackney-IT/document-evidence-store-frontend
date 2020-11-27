// jest.mock('js-cookie');
// jest.mock('jsonwebtoken');
// jest.mock('./AuthGroups');

// import { email, isLoggedIn, isMemberOfGroups } from './auth';
// import Cookies from 'js-cookie';
// import jwt from 'jsonwebtoken';
// import { getAuthGroups, getGroupName } from './AuthGroups';

// describe('Cookie', () => {
//   describe('isLoggedIn', () => {
//     it('returns true if users group is in the allowed groups', () => {
//       Cookies.get.mockReturnValue(true);
//       jwt.decode.mockReturnValue({ groups: ['a-valid-prod-group'] });
//       getAuthGroups.mockReturnValue(['a-valid-prod-group']);
//       expect(isLoggedIn()).toBe(true);
//     });

//     it('returns false if users group is not in the allowed groups', () => {
//       Cookies.get.mockReturnValue(true);
//       jwt.decode.mockReturnValue({ groups: ['a-invalid-prod-group'] });
//       getAuthGroups.mockReturnValue(['a-valid-prod-group']);
//       expect(isLoggedIn()).toBe(false);
//     });

//     it('returns false if no hackney token', () => {
//       Cookies.get.mockReturnValue(undefined);
//       expect(isLoggedIn()).toBe(false);
//     });
//   });

//   describe('email', () => {
//     it('returns null if no hackney token', () => {
//       Cookies.get.mockReturnValue(false);
//       expect(email()).toBe(null);
//     });

//     it('returns null if token cannot be decoded', () => {
//       Cookies.get.mockReturnValue(false);
//       jwt.decode.mockReturnValue(false);
//       expect(email()).toBe(null);
//     });

//     it('returns null if token does not contain email', () => {
//       Cookies.get.mockReturnValue(false);
//       jwt.decode.mockReturnValue({});
//       expect(email()).toBe(null);
//     });

//     it('returns the email', () => {
//       Cookies.get.mockReturnValue(true);
//       jwt.decode.mockReturnValue({ email: 'me@email.com' });
//       expect(email()).toEqual('me@email.com');
//     });
//   });

//   describe('isMemberOfGroups', () => {
//     it('returns true if user is a member of a given group', () => {
//       Cookies.get.mockReturnValue(true);
//       jwt.decode.mockReturnValue({ groups: ['a-valid-prod-group'] });
//       getGroupName.mockReturnValue('a-valid-prod-group');
//       expect(isMemberOfGroups(['A_DIFFERENT_GROUP', 'A_VALID_GROUP'])).toBe(
//         true
//       );
//     });
//     it('returns false if user is not a member of a given group', () => {
//       Cookies.get.mockReturnValue(true);
//       jwt.decode.mockReturnValue({ groups: ['some-group'] });
//       getGroupName.mockReturnValue('a-valid-prod-group');
//       expect(isMemberOfGroups(['A_VALID_GROUP'])).toBe(false);
//     });
//     it('returns false if a given group does not exist', () => {
//       Cookies.get.mockReturnValue(true);
//       jwt.decode.mockReturnValue({ groups: ['a-different-group'] });
//       getGroupName.mockReturnValue(undefined);
//       expect(isMemberOfGroups(['A_DIFFERENT_GROUP'])).toBe(false);
//     });
//   });
// });
