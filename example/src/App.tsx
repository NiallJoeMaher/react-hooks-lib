import React, { useState, useEffect } from "react";
import { useDebounce, useLocalStorage } from "react-hooks-lib";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="app">
      <header className="app-header">
        <h1>React Hooks Library Demo</h1>
        <p>Demonstrating custom React hooks built with TypeScript and Rollup</p>
      </header>

      <main className="app-main">
        <DebounceExample />
        <LocalStorageExample />
      </main>
    </div>
  );
};

const DebounceExample: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Simulate API search
  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      // Simulate API delay
      const timer = setTimeout(() => {
        const mockResults = [
          `Result 1 for "${debouncedSearchTerm}"`,
          `Result 2 for "${debouncedSearchTerm}"`,
          `Result 3 for "${debouncedSearchTerm}"`,
        ];
        setSearchResults(mockResults);
        setIsSearching(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [debouncedSearchTerm]);

  return (
    <section className="demo-section">
      <h2>🔍 useDebounce Hook Demo</h2>
      <p>This hook debounces the search input to avoid excessive API calls.</p>

      <div className="input-group">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type to search... (debounced 500ms)"
          className="search-input"
        />

        <div className="search-info">
          <p>
            <strong>Current input:</strong> {searchTerm}
          </p>
          <p>
            <strong>Debounced value:</strong> {debouncedSearchTerm}
          </p>
        </div>
      </div>

      {isSearching && <div className="loading">Searching...</div>}

      {searchResults.length > 0 && (
        <div className="search-results">
          <h3>Search Results:</h3>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

const LocalStorageExample: React.FC = () => {
  const [name, setName] = useLocalStorage("userName", "");
  const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
  const [count, setCount] = useLocalStorage("count", 0);
  const [todos, setTodos] = useLocalStorage<string[]>("todos", []);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo.trim()]);
      setNewTodo("");
    }
  };

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
    <section className="demo-section">
      <h2>💾 useLocalStorage Hook Demo</h2>
      <p>
        This hook synchronizes React state with localStorage. Try refreshing the
        page!
      </p>

      <div className="storage-demos">
        <div className="demo-group">
          <h3>User Name</h3>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="storage-input"
          />
          <p>
            Stored value: <strong>{name || "None"}</strong>
          </p>
        </div>

        <div className="demo-group">
          <h3>Theme Preference</h3>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as "light" | "dark")}
            className="storage-select"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          <p>
            Current theme: <strong>{theme}</strong>
          </p>
        </div>

        <div className="demo-group">
          <h3>Counter</h3>
          <div className="counter-controls">
            <button onClick={() => setCount(count - 1)}>-</button>
            <span className="counter-value">{count}</span>
            <button onClick={() => setCount(count + 1)}>+</button>
            <button onClick={() => setCount(0)} className="reset-btn">
              Reset
            </button>
          </div>
        </div>

        <div className="demo-group">
          <h3>Todo List</h3>
          <div className="todo-input">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a todo..."
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
            />
            <button onClick={addTodo}>Add</button>
          </div>

          {todos.length > 0 && (
            <ul className="todo-list">
              {todos.map((todo, index) => (
                <li key={index} className="todo-item">
                  <span>{todo}</span>
                  <button
                    onClick={() => removeTodo(index)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="storage-info">
        <h3>localStorage Contents:</h3>
        <pre className="storage-display">
          {JSON.stringify(
            {
              userName: name,
              theme,
              count,
              todos,
            },
            null,
            2
          )}
        </pre>
      </div>
    </section>
  );
};

export default App;
