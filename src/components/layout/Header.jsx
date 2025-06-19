import React from 'react';

const Header = () => {
  return (
    <header className="bg-blue-900 text-white py-6 shadow-md">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <span className="text-yellow-300">🧹</span>
          Todo App 
        </h1>
        <p className="text-primary-100 mt-1">Aplicación de gestión de tareas con API RESTful</p>
      </div>
    </header>
  );
};

export default Header;
