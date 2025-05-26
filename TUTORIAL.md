# React Hooks Library Tutorial

Complete guide to building a production-ready React hooks library with TypeScript, Vitest, and Rollup.js.

## 🎯 What You'll Build

A professional React hooks library featuring:
- **Three custom hooks**: `useDebounce`, `useLocalStorage`, `useToggle`
- **TypeScript**: Full type safety and IntelliSense
- **Vitest**: Modern testing framework with beautiful UI
- **Rollup.js**: Optimized bundling for libraries
- **Example App**: Complete demo application
- **NPM Publishing**: Published as a scoped public package
- **CI/CD**: GitHub Actions workflow

**Final result**: `@nialljoemaher/react-hooks-lib` published on NPM!

## 📋 Prerequisites

- Node.js 16+ and npm
- Basic knowledge of React hooks
- TypeScript fundamentals
- Git and GitHub account

## 🚀 Quick Start

If you want to see the finished result:

```bash
# Install the published package
npm install @nialljoemaher/react-hooks-lib

# Or clone the complete project
git clone https://github.com/nialljoemaher/react-hooks-lib
cd react-hooks-lib
npm install
npm run build
npm run example
```

## 🏗️ Step-by-Step Tutorial

### Step 1: Project Setup

Create the project structure:

```bash
mkdir react-hooks-lib
cd react-hooks-lib
npm init -y
```

Install core dependencies:

```bash
# Production dependencies (none - it's a library!)
# All dependencies are dev dependencies

# TypeScript and build tools
npm install -D typescript @types/react rollup @rollup/plugin-typescript @rollup/plugin-node-resolve rollup-plugin-dts tslib

# Testing with Vitest
npm install -D vitest @vitest/ui @vitest/coverage-v8 happy-dom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Linting
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react-hooks

# React (peer dependency and dev)
npm install -D react
```

### Step 2: Configuration Files

**`tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "moduleResolution": "node",
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "jsx": "react-jsx"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "example"]
}
```

**`vitest.config.ts`**
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    globals: true,
  },
});
```

**`rollup.config.js`**
```javascript
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      resolve(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
    external: ['react'],
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()],
  },
];
```

**`.eslintrc.json`**
```json
{
  "extends": [
    "eslint:recommended",
    "@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "react-hooks"],
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  "env": {
    "node": true,
    "es6": true
  },
  "globals": {
    "describe": "readonly",
    "it": "readonly",
    "expect": "readonly",
    "beforeEach": "readonly",
    "afterEach": "readonly",
    "vi": "readonly"
  }
}
```

### Step 3: Create the Hooks

**`src/hooks/useDebounce.ts`**
```typescript
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

**`src/hooks/useLocalStorage.ts`**
```typescript
import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = (value: T | ((val: T) => T)) => void;

export function useLocalStorage<T>(key: string, initialValue: T): [T, SetValue<T>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue: SetValue<T> = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  }, [key, storedValue]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.log(error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
```

**`src/hooks/useToggle.ts`**
```typescript
import { useState, useCallback, useMemo } from 'react';

interface UseToggleReturn {
  toggle: () => void;
  setTrue: () => void;
  setFalse: () => void;
}

export function useToggle(initialValue: boolean = false): [boolean, UseToggleReturn] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  const actions = useMemo(() => ({
    toggle,
    setTrue,
    setFalse
  }), [toggle, setTrue, setFalse]);

  return [value, actions];
}
```

### Step 4: Testing Setup

**`src/setupTests.ts`**
```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock window.addEventListener and removeEventListener
Object.defineProperty(window, 'addEventListener', {
  value: vi.fn(),
  writable: true,
});

Object.defineProperty(window, 'removeEventListener', {
  value: vi.fn(),
  writable: true,
});
```

**Write comprehensive tests** (see the `__tests__` folders for complete examples):

```typescript
// Example test structure
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  // ... more tests
});
```

### Step 5: Package Configuration

**Update `package.json`**
```json
{
  "name": "@nialljoemaher/react-hooks-lib",
  "version": "0.0.1",
  "type": "module",
  "description": "A reusable React hooks library built with TypeScript and Rollup",
  "main": "dist/index.js",
  "module": "dist/index.esm.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "example": "cd example && npm run dev",
    "example:install": "cd example && npm install",
    "clean": "rm -rf dist",
    "prepublishOnly": "npm run clean && npm run build"
  },
  "peerDependencies": {
    "react": ">=16.8.0"
  },
  "devDependencies": {
    // ... all your dev dependencies
  }
}
```

**Create `.npmignore`**
```
# Source files
src/
**/__tests__/
**/*.test.*
**/*.spec.*

# Config files
tsconfig.json
rollup.config.js
vitest.config.ts
.eslintrc.json

# CI/CD
.github/

# Development
example/
node_modules/
*.log
.DS_Store

# Lock files
package-lock.json
yarn.lock
```

### Step 6: Example Application

Create an example React app to demonstrate your hooks:

```bash
cd example
npm create vite@latest . -- --template react-ts
npm install
npm install ../
```

**Example usage in `example/src/App.tsx`**:
```tsx
import { useDebounce, useLocalStorage, useToggle } from '@nialljoemaher/react-hooks-lib';
import { useState, useEffect } from 'react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [isVisible, { toggle, setTrue, setFalse }] = useToggle(false);

  useEffect(() => {
    if (debouncedSearchTerm) {
      console.log('Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className={`app ${theme}`}>
      <h1>React Hooks Library Demo</h1>
      
      {/* useDebounce Demo */}
      <section>
        <h2>useDebounce</h2>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type to search (debounced 500ms)..."
        />
        <p>Debounced: {debouncedSearchTerm}</p>
      </section>

      {/* useLocalStorage Demo */}
      <section>
        <h2>useLocalStorage</h2>
        <p>Current theme: {theme}</p>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Toggle Theme
        </button>
      </section>

      {/* useToggle Demo */}
      <section>
        <h2>useToggle</h2>
        <p>Visibility: {isVisible ? 'Visible' : 'Hidden'}</p>
        <button onClick={toggle}>Toggle</button>
        <button onClick={setTrue}>Show</button>
        <button onClick={setFalse}>Hide</button>
      </section>
    </div>
  );
}

export default App;
```

### Step 7: Development Workflow

Add these npm scripts for a smooth development experience:

```json
{
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui",
    "lint": "eslint src --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "example": "cd example && npm run dev",
    "example:install": "cd example && npm install",
    "clean": "rm -rf dist",
    "prepublishOnly": "npm run clean && npm run build"
  }
}
```

### Step 8: Testing with Vitest

Run your tests:

```bash
# Watch mode (default)
npm test

# Run once
npm run test:run

# With coverage
npm run test:coverage

# Beautiful UI
npm run test:ui
```

Vitest provides:
- ⚡ **Fast execution**: Native ES modules, no compilation needed
- 🎨 **Beautiful UI**: Visual test runner and debugging
- 📊 **Coverage reports**: Built-in v8 coverage
- 🔗 **Jest compatibility**: Same APIs, easier migration

### Step 9: Publishing to NPM

1. **Create NPM account** (if you don't have one)
2. **Login to NPM**:
   ```bash
   npm login
   ```

3. **Build and publish**:
   ```bash
   npm run build
   npm publish --access public
   ```

   Note: Scoped packages (`@username/package`) are private by default. Use `--access public` to make them free and public.

4. **Verify publication**:
   ```bash
   npm view @nialljoemaher/react-hooks-lib
   ```

### Step 10: CI/CD with GitHub Actions

**`.github/workflows/test.yml`**
```yaml
name: Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm run test:run
      
    - name: Run linting
      run: npm run lint
      
    - name: Type check
      run: npm run type-check
      
    - name: Build
      run: npm run build
```

## 🎉 Congratulations!

You've built a complete React hooks library with:

- ✅ **29 tests passing** with Vitest
- ✅ **TypeScript** with full type safety
- ✅ **Multiple output formats** (CJS, ESM, TypeScript declarations)
- ✅ **Beautiful example application**
- ✅ **Published on NPM** as `@nialljoemaher/react-hooks-lib`
- ✅ **Professional documentation**
- ✅ **CI/CD pipeline**

## 📦 Using Your Package

Anyone can now install and use your library:

```bash
npm install @nialljoemaher/react-hooks-lib
```

```tsx
import { useDebounce, useLocalStorage, useToggle } from '@nialljoemaher/react-hooks-lib';

function MyComponent() {
  const [value, setValue] = useLocalStorage('my-key', 'default');
  const debouncedValue = useDebounce(value, 300);
  const [isOpen, { toggle }] = useToggle(false);

  return (
    <div>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <p>Debounced: {debouncedValue}</p>
      <button onClick={toggle}>
        {isOpen ? 'Close' : 'Open'}
      </button>
    </div>
  );
}
```

## 🔮 Next Steps

Check out `IMPROVEMENTS.md` for ideas on taking this library to the next level:

1. **Add more hooks** (useAsync, useInterval, useMediaQuery)
2. **Set up Prettier** for code formatting
3. **Add Husky** for git hooks
4. **Create Storybook** for interactive documentation
5. **Add bundle size monitoring**
6. **Set up semantic release** for automated versioning

## 📚 Key Learning Points

- **Vitest vs Jest**: Vitest provides faster execution, better ES module support, and a beautiful UI
- **Library bundling**: Rollup.js creates optimized bundles with tree-shaking
- **NPM publishing**: Scoped packages can be published for free with `--access public`
- **Testing patterns**: Comprehensive testing with mocking, timers, and React Testing Library
- **TypeScript for libraries**: Proper configuration for both development and distribution

**Happy coding! 🚀** Your React hooks library is now live and ready for the world to use. 