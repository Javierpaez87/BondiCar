import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth, deleteUser } from 'firebase/auth';
import Layout from '../components/layout/Layout';
import { useAuthStore } from '../store/authStore';

const ProfileEdit: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);
    const db = getFirestore();
    const ref = doc(db, 'users', user.id);

    await updateDoc(ref, { name, phone });
    setLoading(false);
    alert('Perfil actualizado');
    navigate('/dashboard');
  };

  const handleDeleteAccount = async () => {
    if (!confirm('¿Estás seguro que querés eliminar tu cuenta? Esta acción no se puede deshacer.')) return;

    const auth = getAuth();
    const db = getFirestore();

    try {
      // 🔥 Eliminar de Firestore y Auth
      await deleteDoc(doc(db, 'users', user!.id));
      await deleteUser(auth.currentUser!);
      await logout();

      alert('Tu cuenta ha sido eliminada.');
      navigate('/');
    } catch (error) {
      alert('Error al eliminar cuenta. Reautenticación puede ser requerida.');
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Editar Perfil</h2>

        <label className="block mb-2 font-medium">Nombre</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block mb-2 font-medium">Teléfono</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border p-2 rounded mb-6"
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-3"
        >
          Guardar Cambios
        </button>

        <button
          onClick={handleDeleteAccount}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Eliminar Cuenta
        </button>
      </div>
    </Layout>
  );
};

export default ProfileEdit;
