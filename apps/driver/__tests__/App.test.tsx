import App from '../App';

jest.mock('../src/core/firebase', () => ({
  initFirebaseServices: jest.fn(),
}));

test('exports the driver root app component', () => {
  expect(App).toBeDefined();
  expect(typeof App).toBe('function');
});
