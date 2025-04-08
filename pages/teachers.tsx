import '@/app/globals.css';
import Panel from '@/app/Panel';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { PencilIcon, TrashIcon, PlusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';

export default function Teachers() {
  const [teachers, setTeachers] = useState<{ id: number; name: string; subjects: number[] }[]>([]);
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);
  const [newTeacher, setNewTeacher] = useState({ name: '', subjects: [] as number[] });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({ name: '', subjects: [] as number[] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [teachersRes, subjectsRes] = await Promise.all([
          axios.get('/api/teachers'),
          axios.get('/api/subjects'),
        ]);
        setTeachers(teachersRes.data);
        setSubjects(subjectsRes.data);
      } catch (error) {
        toast.error('Ошибка при загрузке данных');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  const subjectOptions = subjects.map((s) => ({ value: s.id, label: s.name }));

  const handleAddTeacher = async () => {
    if (!newTeacher.name.trim()) return;
    try {
      const response = await axios.post('/api/teachers', newTeacher);
      setTeachers([...teachers, response.data]);
      setNewTeacher({ name: '', subjects: [] });
      toast.success('Учитель добавлен');
    } catch (error) {
      toast.error('Ошибка при добавлении');
    }
  };

  const handleDeleteTeacher = async (id: number) => {
    try {
      await axios.delete(`/api/teachers?id=${id}`);
      setTeachers(teachers.filter((t) => t.id !== id));
      toast.success('Учитель удалён');
    } catch (error) {
      toast.error('Ошибка при удалении');
    }
  };

  const handleEditTeacher = (t: typeof teachers[number]) => {
    setEditingId(t.id);
    setEditingData({ name: t.name, subjects: t.subjects });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put('/api/teachers', { id: editingId, ...editingData });
      setTeachers(teachers.map((t) =>
        t.id === editingId ? { ...t, ...editingData } : t
      ));
      setEditingId(null);
      toast.success('Изменения сохранены');
    } catch (error) {
      toast.error('Ошибка при сохранении');
    }
  };

  return (
    <Panel>
      <main className="p-4 flex flex-col h-full">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <h1 className="text-2xl font-bold mb-4">Учителя</h1>

        <div className="flex flex-col gap-2 mb-6">
          <input
            type="text"
            value={newTeacher.name}
            onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
            className="border p-2 rounded"
            placeholder="ФИО нового учителя"
          />
          <Select
            isMulti
            options={subjectOptions}
            value={subjectOptions.filter((opt) => newTeacher.subjects.includes(opt.value))}
            onChange={(selected) =>
              setNewTeacher({
                ...newTeacher,
                subjects: selected.map((s) => s.value),
              })
            }
          />
          <button
            onClick={handleAddTeacher}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-2 border border-green-700 mt-2"
          >
            <PlusCircleIcon className="h-5 w-5" />
            Добавить учителя
          </button>
        </div>

        <div className="flex-1 overflow-y-auto border border-gray-300 rounded shadow-md p-2 bg-white max-h-[450px]">
          {isLoading ? (
            <p className="text-gray-500 p-2">Загрузка данных...</p>
          ) : (
            <ul className="space-y-2">
              {teachers.map((t) => (
                <li key={t.id} className="flex flex-col bg-white p-4 rounded shadow-sm border border-gray-200">
                  {editingId === t.id ? (
                    <>
                      <input
                        type="text"
                        value={editingData.name}
                        onChange={(e) => setEditingData({ ...editingData, name: e.target.value })}
                        className="border p-2 rounded mb-2"
                      />
                      <Select
                        isMulti
                        options={subjectOptions}
                        value={subjectOptions.filter((opt) => editingData.subjects.includes(opt.value))}
                        onChange={(selected) =>
                          setEditingData({
                            ...editingData,
                            subjects: selected.map((s) => s.value),
                          })
                        }
                      />
                      <div className="flex justify-end mt-2 gap-2">
                        <button
                          onClick={handleSaveEdit}
                          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition border border-blue-700"
                        >
                          Сохранить
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{t.name}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditTeacher(t)}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTeacher(t.id)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Предметы:{' '}
                        {t.subjects.map((sid) => subjects.find((s) => s.id === sid)?.name).join(', ')}
                      </p>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </Panel>
  );
}
