import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { MapPin, Calendar, Clock, Users, DollarSign, Car, FileText } from 'lucide-react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

import { useTripStore } from '../store/tripStore';
import { useAuthStore } from '../store/authStore';

interface CreateTripFormData {
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  availableSeats: number;
  price: number;
  carModel?: string;
  carColor?: string;
  description?: string;
  phone: string;
}

const CreateTrip: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { createTrip, isLoading, error } = useTripStore();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CreateTripFormData>();
  const [userPhone, setUserPhone] = useState('');

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Traer teléfono si existe en el perfil
  useEffect(() => {
    const fetchPhone = async () => {
      const db = getFirestore();
      const auth = getAuth();
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const userRef = doc(db, 'users', uid);
      const snapshot = await getDoc(userRef);
      const data = snapshot.data();
      if (data?.phone) {
        setUserPhone(data.phone);
        setValue('phone', data.phone); // setea en el formulario
      }
    };

    fetchPhone();
  }, [setValue]);

  // Guardar teléfono si no estaba ya en el perfil
  const guardarTelefonoUsuario = async (telefono: string) => {
    const db = getFirestore();
    const auth = getAuth();
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await setDoc(userRef, { phone: telefono });
    } else {
      const data = snapshot.data();
      if (!data.phone) {
        await setDoc(userRef, { ...data, phone: telefono });
      }
    }
  };

  const onSubmit = async (data: CreateTripFormData) => {
    try {
      const tripData = {
        ...data,
        availableSeats: Number(data.availableSeats),
        price: Number(data.price),
        departureDate: data.departureDate,
      };

      await guardarTelefonoUsuario(data.phone);
      await createTrip(tripData as any);
      navigate('/dashboard');
    } catch (error) {
      // El error ya se maneja en el store
    }
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-card p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Publicar un Viaje
            </h1>

            {error && (
              <div className="p-4 mb-6 bg-red-50 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Origen"
                    list="lugares"
                    placeholder="Ciudad de origen"
                    leftIcon={<MapPin className="h-5 w-5 text-gray-400" />}
                    error={errors.origin?.message}
                    {...register('origin', { required: 'El origen es requerido' })}
                  />

                  <Input
                    label="Destino"
                    list="lugares"
                    placeholder="Ciudad de destino"
                    leftIcon={<MapPin className="h-5 w-5 text-gray-400" />}
                    error={errors.destination?.message}
                    {...register('destination', { required: 'El destino es requerido' })}
                  />
                </div>

                <div>
                  <Input
                    label="Teléfono de contacto (WhatsApp)"
                    placeholder="Ej: 5491123456789"
                    error={errors.phone?.message}
                    {...register('phone', {
                      required: 'El número de teléfono es requerido',
                      pattern: {
                        value: /^549\d{10}$/,
                        message: 'Debe comenzar con 549 y tener 13 dígitos',
                      },
                    })}
                  />
                  <div className="text-sm mt-1 text-amber-600 flex items-center">
                    ⚠️ Asegurate de ingresar el número completo, incluyendo el código de país (ej: 549...). Es el que se usará para abrir WhatsApp.
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Fecha de salida"
                    type="date"
                    leftIcon={<Calendar className="h-5 w-5 text-gray-400" />}
                    error={errors.departureDate?.message}
                    {...register('departureDate', { required: 'La fecha es requerida' })}
                  />

                  <Input
                    label="Hora de salida"
                    type="time"
                    leftIcon={<Clock className="h-5 w-5 text-gray-400" />}
                    error={errors.departureTime?.message}
                    {...register('departureTime', { required: 'La hora es requerida' })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Asientos disponibles"
                    type="number"
                    min="1"
                    max="10"
                    leftIcon={<Users className="h-5 w-5 text-gray-400" />}
                    error={errors.availableSeats?.message}
                    {...register('availableSeats', { 
                      required: 'El número de asientos es requerido',
                      min: { value: 1, message: 'Debe haber al menos 1 asiento disponible' },
                      max: { value: 10, message: 'Máximo 10 asientos disponibles' }
                    })}
                  />

                  <Input
                    label="Precio por asiento"
                    type="number"
                    min="0"
                    step="100"
                    leftIcon={<DollarSign className="h-5 w-5 text-gray-400" />}
                    error={errors.price?.message}
                    {...register('price', { 
                      required: 'El precio es requerido',
                      min: { value: 0, message: 'El precio no puede ser negativo' }
                    })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Modelo del vehículo"
                    placeholder="Ej: Toyota Corolla 2020"
                    leftIcon={<Car className="h-5 w-5 text-gray-400" />}
                    {...register('carModel')}
                  />

                  <Input
                    label="Color del vehículo"
                    placeholder="Ej: Blanco"
                    {...register('carColor')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción (opcional)
                  </label>
                  <div className="relative">
                    <div className="absolute left-3 top-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      className="block w-full pl-10 pr-4 py-2 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      rows={3}
                      placeholder="Información adicional sobre el viaje..."
                      {...register('description')}
                    ></textarea>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    Cancelar
                  </Button>

                  <Button type="submit" variant="primary" isLoading={isLoading}>
                    Publicar Viaje
                  </Button>
                </div>
              </div>
            </form>

            <datalist id="lugares">
              <option value="Junín de los Andes" />
              <option value="San Martín de los Andes" />
              <option value="Bariloche" />
              <option value="Villa La Angostura" />
              <option value="Zapala" />
              <option value="Neuquén" />
              <option value="Esquel" />
              <option value="El Bolsón" />
              <option value="Trevelin" />
              <option value="La Pampa" />
            </datalist>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateTrip;
