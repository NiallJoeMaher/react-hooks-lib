import React, { useState, useEffect } from "react";
import { useDebounce, useLocalStorage, useToggle } from "react-hooks-lib";
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
        <ToggleExample />
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

const ToggleExample: React.FC = () => {
  const [isVisible, visibilityActions] = useToggle(false);
  const [isEnabled, enabledActions] = useToggle(true);
  const [showDetails, detailsActions] = useToggle();

  return (
    <section className="demo-section">
      <h2>🔄 useToggle Hook Demo</h2>
      <p>
        This hook provides boolean state management with convenient toggle
        functions.
      </p>

      <div className="toggle-demos">
        <div className="demo-group">
          <h3>Content Visibility</h3>
          <div className="toggle-controls">
            <button onClick={visibilityActions.toggle}>
              Toggle Visibility
            </button>
            <button onClick={visibilityActions.setTrue}>Show</button>
            <button onClick={visibilityActions.setFalse}>Hide</button>
          </div>
          <p>
            Status: <strong>{isVisible ? "Visible" : "Hidden"}</strong>
          </p>
          {isVisible && (
            <div className="toggle-content">
              <p>🎉 This content is now visible!</p>
            </div>
          )}
        </div>

        <div className="demo-group">
          <h3>Feature Toggle</h3>
          <div className="toggle-controls">
            <button onClick={enabledActions.toggle}>
              {isEnabled ? "Disable" : "Enable"} Feature
            </button>
          </div>
          <p>
            Feature Status:{" "}
            <strong>{isEnabled ? "Enabled" : "Disabled"}</strong>
          </p>
          <div
            className={`feature-indicator ${
              isEnabled ? "enabled" : "disabled"
            }`}
          >
            {isEnabled ? "✅ Feature is active" : "❌ Feature is inactive"}
          </div>
        </div>

        <div className="demo-group">
          <h3>Details Panel</h3>
          <div className="toggle-controls">
            <button onClick={detailsActions.toggle}>
              {showDetails ? "Hide" : "Show"} Details
            </button>
          </div>
          {showDetails && (
            <div className="details-panel">
              <h4>Additional Information</h4>
              <p>The useToggle hook provides:</p>
              <ul>
                <li>
                  <code>toggle()</code> - Switches between true/false
                </li>
                <li>
                  <code>setTrue()</code> - Forces value to true
                </li>
                <li>
                  <code>setFalse()</code> - Forces value to false
                </li>
              </ul>
              <p>
                Default initial value is <code>false</code> if not specified.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default App;
