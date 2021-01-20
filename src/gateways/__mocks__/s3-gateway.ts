export const uploadMock = jest.fn();

export const S3Gateway = jest.fn().mockImplementation(() => ({
  upload: uploadMock,
}));
