import React from 'react';
import { StoreProvider } from './stores/StoreProvider';
import TodoList from './views/TodoList';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import './index.css';
import './App.css';

function App() {
  return (
    <StoreProvider>
      <div className="App">
        <Header />
        
        <main className="app-main">
          <TodoList />
        </main>
        
        <Footer />
      </div>
    </StoreProvider>
  );
}

export default App;