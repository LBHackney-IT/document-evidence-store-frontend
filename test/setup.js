require('dotenv').config({ path: '.env.sample' });
import '@testing-library/jest-dom';

if (!process.env.ENABLE_TEST_LOGGING) {
  console.log = jest.fn();
  console.error = jest.fn();
}
