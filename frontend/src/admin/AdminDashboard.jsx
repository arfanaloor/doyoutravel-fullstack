import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, LogOut, Star, Loader2, ExternalLink } from 'lucide-react';
import { fetchPackages, deletePackage, resolveImageUrl } from '../lib/api';
import { useAdminAuth } from './useAdminAuth';
import PackageForm from './PackageForm';

export default function AdminDashboard() {
  const { status, username, logout } = useAdminAuth();
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [formState, setFormState] = useState(null); // null | 'new' | package object
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const loadPackages = useCallback(() => {
    setIsLoading(true);
    fetchPackages()
      .then(setPackages)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (status === 'authed') loadPackages();
  }, [status, loadPackages]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deletePackage(id);
      setPackages((pkgs) => pkgs.filter((p) => p.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-400" size={28} />
      </div>
    );
  }

  if (status !== 'authed') return null; // redirect already in flight

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Package Manager</h1>
            <p className="text-xs text-slate-500">Signed in as {username}</p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              View site <ExternalLink size={14} />
            </a>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Packages</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Changes here update the live site immediately.
            </p>
          </div>
          <button
            onClick={() => setFormState('new')}
            className="flex items-center gap-2 bg-slate-900 text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Plus size={18} /> Add Package
          </button>
        </div>

        {error && (
          <div className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="animate-spin text-slate-400" size={28} />
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">No packages yet. Add your first one to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {packages.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col">
                <div className="relative h-36 bg-slate-100">
                  <img src={resolveImageUrl(pkg.image)} alt={pkg.title} className="w-full h-full object-cover" />
                  {pkg.featured && (
                    <span className="absolute top-2 left-2 flex items-center gap-1 bg-white/95 text-amber-600 text-xs font-semibold px-2 py-1 rounded-full">
                      <Star size={12} fill="currentColor" /> Featured
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span>{pkg.category}</span>
                    <span>•</span>
                    <span>{pkg.region}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1 leading-snug">{pkg.title}</h3>
                  <p className="text-xs text-slate-500 mb-3">{pkg.duration}</p>
                  <p className="text-sm font-semibold text-slate-900 mb-4">
                    {pkg.price === 'Custom' ? 'Custom Quote' : `₹${pkg.price}`}
                  </p>

                  <div className="mt-auto flex items-center gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setFormState(pkg)}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-700 border border-slate-200 rounded-lg py-2 hover:bg-slate-50 transition-colors"
                    >
                      <Pencil size={14} /> Edit
                    </button>

                    {confirmDeleteId === pkg.id ? (
                      <div className="flex-1 flex items-center gap-1.5">
                        <button
                          onClick={() => handleDelete(pkg.id)}
                          disabled={deletingId === pkg.id}
                          className="flex-1 text-sm font-medium text-white bg-red-600 rounded-lg py-2 hover:bg-red-700 transition-colors disabled:opacity-60"
                        >
                          {deletingId === pkg.id ? '...' : 'Confirm'}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-sm font-medium text-slate-500 px-2"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(pkg.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-red-600 border border-red-100 rounded-lg py-2 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {formState && (
        <PackageForm
          editingPackage={formState === 'new' ? null : formState}
          onClose={() => setFormState(null)}
          onSaved={() => {
            setFormState(null);
            loadPackages();
          }}
        />
      )}
    </div>
  );
}
