import '@/app/globals.css';
import Panel from '@/app/Panel';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PencilIcon, TrashIcon, PlusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';

export default function Classes() {
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
  const [originalClasses, setOriginalClasses] = useState<{ id: number; name: string }[]>([]);
  const [newClass, setNewClass] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const response = await axios.get('/api/classes');
        setClasses(response.data);
        setOriginalClasses(response.data);
      } catch (error) {
        toast.error('Ошибка загрузки данных');
        console.error('Ошибка загрузки:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchClasses();
  }, []);

  const handleAddClass = () => {
    if (newClass.trim() === '') return;
    setClasses([...classes, { id: Date.now(), name: newClass }]);
    setNewClass('');
  };

  const handleDeleteClass = (id: number) => {
    setClasses(classes.filter((c) => c.id !== id));
  };

  const handleEditClass = (id: number, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleSaveEdit = () => {
    setClasses(classes.map((c) => (c.id === editingId ? { ...c, name: editingName } : c)));
    setEditingId(null);
    setEditingName('');
  };

  const handleSaveToBackend = async () => {
    setIsSaving(true);

    try {
      await axios.post('/api/classes', { classes });
      setOriginalClasses(classes);
      toast.success('Изменения успешно сохранены!');
    } catch (error) {
      toast.error('Ошибка при сохранении данных');
      console.error('Ошибка:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = JSON.stringify(classes) !== JSON.stringify(originalClasses);

  return (
    <Panel>
      <main className="p-4 flex flex-col h-full">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

        <h1 className="text-2xl font-bold mb-4">Список кабинетов</h1>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            className="border p-2 rounded w-full"
            placeholder="Добавить кабинет..."
          />
          <button
            onClick={handleAddClass}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-1 border border-green-700"
          >
            <PlusCircleIcon className="h-5 w-5" />
            Добавить
          </button>
        </div>

        {/* Контейнер списка с ограниченной высотой */}
        <div className="flex-1 overflow-y-auto border border-gray-300 rounded shadow-md p-2 bg-white max-h-[500]">
          {isLoading ? (
            <p className="text-gray-500 p-2">Загрузка данных...</p>
          ) : (
            <ul className="space-y-2">
              {classes.map((room) => (
                <li key={room.id} className="flex justify-between items-center bg-white p-3 rounded shadow-sm border border-gray-200">
                  {editingId === room.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="border p-2 rounded w-full"
                    />
                  ) : (
                    <span>{room.name}</span>
                  )}

                  <div className="flex gap-2">
                    {editingId === room.id ? (
                      <button
                        onClick={handleSaveEdit}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition border border-blue-700"
                      >
                        Сохранить
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditClass(room.id, room.name)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteClass(room.id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Кнопка "Сохранить изменения" */}
        {hasChanges && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSaveToBackend}
              disabled={isSaving}
              className={`px-6 py-2 rounded-lg flex items-center gap-2 transition border ${isSaving
                  ? 'bg-gray-400 cursor-not-allowed border-gray-500'
                  : 'bg-blue-600 text-white hover:bg-blue-700 border-blue-700'
                }`}
            >
              <CheckCircleIcon className="h-5 w-5" />
              {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        )}
      </main>
    </Panel>
  );
}
