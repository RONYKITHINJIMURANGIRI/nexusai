import { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatPage from './pages/ChatPage';
import KnowledgePage from './pages/KnowledgePage';
import MemoryPage from './pages/MemoryPage';
import ModelsPage from './pages/ModelsPage';
import SettingsPage from './pages/SettingsPage';

const pages = {
  chat: ChatPage,
  knowledge: KnowledgePage,
  memory: MemoryPage,
  models: ModelsPage,
  settings: SettingsPage,
};

function App() {
  const [activePage, setActivePage] = useState('chat');
  const Page = pages[activePage];

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <main className="app-main">
        <Page />
      </main>
    </div>
  );
}

export default App;
