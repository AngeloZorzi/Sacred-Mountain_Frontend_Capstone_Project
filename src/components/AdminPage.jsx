import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    axiosClient
      .get("/api/admin/users")
      .then(({ data }) => {
        setUsers(data);
        setLoading(false);
      })
      // eslint-disable-next-line no-unused-vars
      .catch((err) => {
        setError("Errore nel caricamento utenti.");
        setLoading(false);
      });
  }, []);

  const handleReset = async (id) => {
    try {
      await axiosClient.patch(`/api/admin/users/${id}/reset`, {
        resetScore: true,
        resetStory: true,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, score: 0, storyState: "" } : u))
      );
    } catch {
      alert("Errore nel reset dell'utente");
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };
  const confirmDelete = async () => {
    try {
      await axiosClient.delete(`/api/admin/users/${userToDelete.id}`);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    } catch {
      alert("Errore nell'eliminazione dell'utente");
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-400 font-pixel">
        Caricamento utenti...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-pixel">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 p-6 sm:p-12 font-pixel text-gray-100">
      <h1 className="text-4xl sm:text-5xl font-bold mb-10 text-center text-indigo-400 tracking-wide">
        Gestione Utenti
      </h1>

      <div className="overflow-x-auto rounded-lg shadow-lg bg-gray-800">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-indigo-900">
            <tr>
              {["ID", "Username", "Ruolo", "Punteggio", "Azioni"].map(
                (head) => (
                  <th
                    key={head}
                    scope="col"
                    className="px-6 py-3 text-left text-sm sm:text-base font-semibold uppercase tracking-wider text-indigo-300 select-none"
                  >
                    {head}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {users.map(({ id, username, role, score }) => (
              <tr
                key={id}
                className="hover:bg-indigo-700 transition-colors cursor-default"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm sm:text-base font-mono text-indigo-200">
                  {id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate text-sm sm:text-base">
                  {username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm sm:text-base">
                  {role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-md md:text-base font-mono text-right">
                  {score}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center space-x-4">
                  <button
                    onClick={() => handleReset(id)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1 rounded-md transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    aria-label={`Reset punteggio e storia per ${username}`}
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => openDeleteModal({ id, username })}
                    className="bg-red-700 hover:bg-red-600 text-white font-semibold px-3 py-1 rounded-md transition focus:outline-none focus:ring-2 focus:ring-red-400"
                    aria-label={`Elimina utente ${username}`}
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setShowDeleteModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-gray-800 rounded-lg p-6 max-w-sm w-full text-indigo-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              Sei sicuro di eliminare l'utente{" "}
              <span className="text-red-500">{userToDelete?.username}</span>?
            </h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition"
              >
                Annulla
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 transition"
              >
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}

      {users.length === 0 && (
        <p className="text-center mt-6 text-indigo-400 text-lg">
          Nessun utente trovato.
        </p>
      )}
    </div>
  );
}

export default AdminPage;
