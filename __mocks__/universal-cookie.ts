export const mockCookieGet = jest.fn();

export default jest.fn(() => ({
  get: mockCookieGet,
}));
