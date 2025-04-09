/* eslint-disable */
import '@/app/globals.css';
import Panel from '@/app/Panel';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select, { MultiValue } from 'react-select';
import { PencilIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import React from 'react';

type Subject = { id: number; name: string };
type GroupSubject = { subjectId: number; lessons: number };
type Group = { id: number; name: string; subjects: GroupSubject[] };

export default function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [newGroup, setNewGroup] = useState({ name: '', subjects: [] as GroupSubject[] });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingData, setEditingData] = useState({ name: '', subjects: [] as GroupSubject[] });
  const [isLoading, setIsLoading] = useState(true);
  const [_, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [groupsRes, subjectsRes] = await Promise.all([
          axios.get('/api/groups'),
          axios.get('/api/subjects'),
        ]);
        setGroups(groupsRes.data);
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


  const handleSubjectSelection = (
    selected: MultiValue<{ value: number; label: string }> | null,
    setter: (value: GroupSubject[]) => void,
    current: GroupSubject[]
  ) => {
    const selectedArray = selected ?? []; // если null, то делаем пустой массив

    const updated = selectedArray.map(({ value }) => {
      const existing = current.find((s) => s.subjectId === value);
      return { subjectId: value, lessons: existing?.lessons || 1 };
    });

    setter(updated);
  };

  const handleLessonChange = (
    subjectId: number,
    lessons: number,
    stateUpdater: React.Dispatch<React.SetStateAction<typeof newGroup | typeof editingData>>
  ) => {
    stateUpdater((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s) =>
        s.subjectId === subjectId ? { ...s, lessons: lessons } : s
      ),
    }));
  };

  const handleAddGroup = async () => {
    if (!newGroup.name.trim()) return;
    try {
      const response = await axios.post('/api/groups', newGroup);
      setGroups([...groups, response.data]);
      setNewGroup({ name: '', subjects: [] });
      toast.success('Группа добавлена');
    } catch (error) {
      toast.error('Ошибка при добавлении');
    }
  };

  const handleDeleteGroup = async (id: number) => {
    try {
      await axios.delete(`/api/groups?id=${id}`);
      setGroups(groups.filter((g) => g.id !== id));
      toast.success('Группа удалена');
    } catch (error) {
      toast.error('Ошибка при удалении');
    }
  };

  const handleEditGroup = (g: Group) => {
    setEditingId(g.id);
    setEditingData({ name: g.name, subjects: g.subjects });
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put('/api/groups', { id: editingId, ...editingData });
      setGroups(groups.map((g) => (g.id === editingId ? { ...g, ...editingData } : g)));
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
        <h1 className="text-2xl font-bold mb-4">Группы</h1>

        <div className="flex flex-col gap-2 mb-6">
          <input
            type="text"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            className="border p-2 rounded"
            placeholder="Название новой группы"
          />
          <Select
            isMulti
            options={subjectOptions}
            value={subjectOptions.filter((opt) =>
              newGroup.subjects.some((s) => s.subjectId === opt.value)
            )}
            onChange={(selected) =>
              handleSubjectSelection(selected, (subjects) =>
                setNewGroup((prev) => ({ ...prev, subjects })), newGroup.subjects
              )
            }
          />
          {newGroup.subjects.map((s) => (
            <div key={s.subjectId} className="flex items-center gap-2 mt-1">
              <span className="text-sm w-40">{subjects.find((subj) => subj.id === s.subjectId)?.name}</span>
              <input
                type="number"
                min={1}
                value={s.lessons}
                onChange={(e) => handleLessonChange(s.subjectId, Number(e.target.value), setNewGroup)}
                className="border p-1 rounded w-20"
              />
              <span className="text-sm">уроков</span>
            </div>
          ))}
          <button
            onClick={handleAddGroup}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-2 border border-green-700 mt-2"
          >
            <PlusCircleIcon className="h-5 w-5" />
            Добавить группу
          </button>
        </div>

        <div className="flex-1 overflow-y-auto border border-gray-300 rounded shadow-md p-2 bg-white max-h-[450px]">
          {isLoading ? (
            <p className="text-gray-500 p-2">Загрузка данных...</p>
          ) : (
            <ul className="space-y-2">
              {groups.map((g) => (
                <li key={g.id} className="flex flex-col bg-white p-4 rounded shadow-sm border border-gray-200">
                  {editingId === g.id ? (
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
                        value={subjectOptions.filter((opt) =>
                          editingData.subjects.some((s) => s.subjectId === opt.value)
                        )}
                        onChange={(selected) =>
                          handleSubjectSelection(
                            selected,
                            (subjects) => setEditingData((prev) => ({ ...prev, subjects })),
                            editingData.subjects
                          )
                        }
                      />
                      {editingData.subjects.map((s) => (
                        <div key={s.subjectId} className="flex items-center gap-2 mt-1">
                          <span className="text-sm w-40">{subjects.find((subj) => subj.id === s.subjectId)?.name}</span>
                          <input
                            type="number"
                            min={1}
                            value={s.lessons}
                            onChange={(e) =>
                              handleLessonChange(s.subjectId, Number(e.target.value), setEditingData)
                            }
                            className="border p-1 rounded w-20"
                          />
                          <span className="text-sm">уроков</span>
                        </div>
                      ))}
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
                        <span className="font-semibold">{g.name}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditGroup(g)}
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteGroup(g.id)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Предметы:{' '}
                        {g.subjects
                          .map(
                            (s) =>
                              `${subjects.find((subj) => subj.id === s.subjectId)?.name} (${s.lessons} ур.)`
                          )
                          .join(', ')}
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

