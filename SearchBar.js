import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  return (
    <form className="search-bar" onSubmit={submit}>
      <input
        placeholder="Enter city name (e.g. London)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="city"
      />
      <button type="submit">Search</button>
    </form>
  );
}
