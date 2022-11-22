require('dotenv').config({ path: '.env.sample' });
import '@testing-library/jest-dom';
import { TextDecoder, TextEncoder } from 'util';

if (!process.env.ENABLE_TEST_LOGGING) {
  console.log = jest.fn();
  console.error = jest.fn();
}

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
