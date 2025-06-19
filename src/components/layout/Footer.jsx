import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white py-6 mt-8">
      <div className="container mx-auto px-4 text-center text-sm text-gray-400">
        <p>Powered by Laravel 12 API + React + MobX</p>
        <p className="mt-1 text-xs">© {new Date().getFullYear()} Todo App. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
