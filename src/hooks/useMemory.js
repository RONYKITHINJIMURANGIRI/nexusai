import { useState } from 'react';

function useMemory() {
  const [memoryItems, setMemoryItems] = useState([
    { id: 'm1', title: 'Project goals', content: 'Keep the app lightweight and easy to navigate.' },
    { id: 'm2', title: 'Release notes', content: 'Track changes for the next deployment.' },
  ]);

  return {
    memoryItems,
    addMemory: (item) => setMemoryItems((current) => [...current, item]),
    removeMemory: (id) => setMemoryItems((current) => current.filter((item) => item.id !== id)),
  };
}

export default useMemory;
