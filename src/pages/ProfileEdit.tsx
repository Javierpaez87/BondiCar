import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getAuth, updateProfile, updateEmail, deleteUser } from 'firebase/auth';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const ProfileEdit: React.FC = () => {
  const { user, fetchUserData } = useAuthStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const handleSave = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      // Actualizar nombre
      await updateProfile(auth.currentUser, { displayName: name });

      // Actualizar email
      if (email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, email);
      }

      // Actualizar en Firestore (opcional según cómo guardes el user)
      // await updateUserInFirestore(auth.currentUser.uid, { name, phone, email });

      // Actualizar en estado global
      await fetchUserData();

      navigate('/dashboard?tab=profile');
    } catch (error) {
      console.error('Error al guardar:', error);
      alert('Hubo un error al guardar los cambios.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.');
    if (!confirmed || !auth.currentUser) return;

    try {
      await deleteUser(auth.currentUser);
      alert('Tu cuenta ha sido eliminada.');
      navigate('/');
    } catch (error) {
      console.error('Error al eliminar cuenta:', error);
      alert('Hubo un error al eliminar tu cuenta.');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-xl">
        <h1 className="text-2xl font-bold mb-6">Editar Perfil</h1>

        <div className="space-y-4">
          <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Teléfono" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Input label="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="mt-6 flex flex-col space-y-4">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>

          <button
            onClick={handleDeleteAccount}
            className="text-red-500 border border-red-500 px-4 py-2 rounded hover:bg-red-50"
          >
            Eliminar Cuenta
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ProfileEdit;
