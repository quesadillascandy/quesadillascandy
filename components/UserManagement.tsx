
import React from 'react';
import { UserRole } from '../types';

const UserManagement: React.FC = () => {
  const users = [
    { id: '1', name: 'Juan Pérez', role: UserRole.ADMIN, email: 'juan@panaderia.com' },
    { id: '2', name: 'Maria Chef', role: UserRole.PROD_MANAGER, email: 'maria@cocina.com' },
    { id: '3', name: 'Pedro Vendedor', role: UserRole.WHOLESALE, email: 'pedro@ventas.com' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gestión de Usuarios</h2>
          <p className="text-gray-500">Administra los accesos y roles del sistema</p>
        </div>
        <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold shadow-lg">
          + Invitar Usuario
        </button>
      </header>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Nombre</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Rol</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium">{u.name}</td>
                <td className="px-6 py-4 text-gray-500">{u.email}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full uppercase">
                    {u.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-primary font-bold mr-4">Editar</button>
                  <button className="text-error font-bold">Suspender</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
