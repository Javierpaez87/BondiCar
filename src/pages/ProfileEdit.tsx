import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getFirestore,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import {
  getAuth,
  deleteUser,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';
import Layout from '../components/layout/Layout';
import { useAuthStore } from '../store/authStore';

const ProfileEdit: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const reauthenticateUser = async (password: string) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser || !currentUser.email) {
      throw new Error('Usuario no autenticado');
    }

    const credential = EmailAuthProvider.credential(currentUser.email, password);
    await reauthenticateWithCredential(currentUser, credential);
  };

  const handleUpdate = async () => {
    if (!user) return;
    setLoading(true);

    const db = getFirestore();
    const auth = getAuth();
    const ref = doc(db, 'users', user.id);

    try {
      if (auth.currentUser && email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, email);
      }

      await updateDoc(ref, { name, phone, email });

      alert('Perfil actualizado correctamente.');
      navigate('/dashboard?tab=profile');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        const password = prompt('Por seguridad, por favor ingresá tu contraseña para continuar:');
        if (password) {
          try {
            await reauthenticateUser(password);
            return await handleUpdate();
          } catch {
            alert('La reautenticación falló. Verificá tu contraseña.');
          }
        }
      } else {
        console.error('Error al actualizar perfil:', error);
        alert('Error al actualizar perfil.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('¿Estás seguro que querés eliminar tu cuenta? Esta acción no se puede deshacer.')) return;

    const auth = getAuth();
    const db = getFirestore();

    try {
      await deleteDoc(doc(db, 'users', user!.id));
      await deleteUser(auth.currentUser!);
      await logout();
      alert('Tu cuenta ha sido eliminada.');
      navigate('/');
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        const password = prompt('Por seguridad, por favor ingresá tu contraseña para continuar:');
        if (password) {
          try {
            await reauthenticateUser(password);
            return await handleDeleteAccount();
          } catch {
            alert('La reautenticación falló. Verificá tu contraseña.');
          }
        }
      } else {
        console.error('Error al eliminar cuenta:', error);
        alert('Error al eliminar cuenta.');
      }
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
          className="w-full border p-2 rounded mb-4"
        />

        <label className="block mb-2 font-medium">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
