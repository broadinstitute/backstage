import '@testing-library/jest-dom';

// Suppress Material-UI warnings in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    const message = String(args[0]);
    if (
      message.includes('findDOMNode is deprecated') ||
      message.includes('Warning: Failed prop type: Material-UI: The `anchorEl` prop') ||
      message.includes('Material-UI: The `anchorEl` prop provided to the component is invalid')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    const message = String(args[0]);
    if (
      message.includes('Material-UI: The `anchorEl` prop') ||
      message.includes('The anchor element should be part of the document layout')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
