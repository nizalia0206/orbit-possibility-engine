import React from 'react';

export default function Pill({ label, selected, onClick, cyan, disabled }) {
  return (
    <button
      type="button"
      className={`pill ${cyan ? 'cyan' : ''} ${selected ? 'selected' : ''}`}
      onClick={disabled ? undefined : onClick}
      style={disabled ? { cursor: 'default' } : undefined}
    >
      {label}
    </button>
  );
}
