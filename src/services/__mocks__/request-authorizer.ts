export const executeMock = jest.fn();

export const RequestAuthorizer = jest.fn().mockImplementation(() => ({
  execute: executeMock,
}));
