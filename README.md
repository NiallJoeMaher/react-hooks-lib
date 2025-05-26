# @nialljoemaher/react-hooks-lib

A production-ready React hooks library built with TypeScript and Rollup.js, featuring comprehensive testing with Vitest and modern development tools.

[![NPM Version](https://img.shields.io/npm/v/@nialljoemaher/react-hooks-lib.svg)](https://www.npmjs.com/package/@nialljoemaher/react-hooks-lib)
[![NPM Downloads](https://img.shields.io/npm/dm/@nialljoemaher/react-hooks-lib.svg)](https://www.npmjs.com/package/@nialljoemaher/react-hooks-lib)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Features

- **TypeScript**: Full type safety and excellent developer experience
- **Multiple Output Formats**: CommonJS, ES modules, and TypeScript declarations
- **Tree-shaking**: Optimized bundles with Rollup.js
- **Testing**: Comprehensive test suite with Vitest and React Testing Library
- **Linting**: ESLint with TypeScript and React hooks rules
- **CI/CD**: GitHub Actions for automated testing and building
- **Examples**: Complete demo application
- **Published**: Available on NPM as a scoped public package

## 📦 Installation

```bash
npm install @nialljoemaher/react-hooks-lib
```

## 🪝 Hooks Included

### `useDebounce<T>(value: T, delay: number): T`
Debounces a value to limit rapid function calls.

```tsx
import { useDebounce } from '@nialljoemaher/react-hooks-lib';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### `useLocalStorage<T>(key: string, initialValue: T)`
Manages localStorage with React state, including SSR compatibility and cross-tab synchronization.

```tsx
import { useLocalStorage } from '@nialljoemaher/react-hooks-lib';

function SettingsComponent() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

### `useToggle(initialValue?: boolean)`
Boolean state management with multiple toggle options.

```tsx
import { useToggle } from '@nialljoemaher/react-hooks-lib';

function ToggleComponent() {
  const [isOpen, { toggle, setTrue, setFalse }] = useToggle(false);

  return (
    <div>
      <p>Status: {isOpen ? 'Open' : 'Closed'}</p>
      <button onClick={toggle}>Toggle</button>
      <button onClick={setTrue}>Open</button>
      <button onClick={setFalse}>Close</button>
    </div>
  );
}
```

## 🛠️ Development

### Quick Start

```bash
# Clone the repository
git clone https://github.com/nialljoemaher/react-hooks-lib
cd react-hooks-lib

# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Watch mode for tests
npm run test:watch

# Lint code
npm run lint

# Type check
npm run type-check
```

### Project Structure

```
src/
├── hooks/
│   ├── __tests__/          # Vitest test files
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── useToggle.ts
├── setupTests.ts           # Vitest setup
└── index.ts               # Main exports
```

### Testing

This library uses [Vitest](https://vitest.dev/) for testing, which provides:
- ⚡ Fast execution with native ES modules
- 🔗 Compatible with Jest APIs
- 🎨 Beautiful UI for test debugging
- 📊 Built-in coverage reporting

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Open test UI in browser
npm run test:ui

# Watch mode during development
npm run test:watch
```

### Example Application

```bash
# Install example dependencies
npm run example:install

# Start example application
npm run example

# Build example for production
npm run example:build
```

## 📋 Scripts

- `npm run build` - Build the library
- `npm run dev` - Watch and rebuild during development
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Open Vitest UI
- `npm run lint` - Lint code with ESLint
- `npm run type-check` - TypeScript type checking

## 📦 Publishing

This package is published as a **scoped public package** on NPM:

```bash
# Publish updates (after making changes)
npm run build
npm publish --access public
```

The `prepublishOnly` script automatically runs cleaning and building before publishing.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

MIT © [Niall Maher](https://codewithniall.com)