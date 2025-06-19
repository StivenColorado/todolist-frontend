import React from 'react';

export const TodoStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
        <div className="text-sm text-blue-500">Total</div>
      </div>
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
        <div className="text-sm text-yellow-500">Pendientes</div>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
        <div className="text-sm text-green-500">Completadas</div>
      </div>
    </div>
  );
};