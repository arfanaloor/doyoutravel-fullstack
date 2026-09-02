import React, { useState, useRef } from 'react';
import { X, UploadCloud, Loader2 } from 'lucide-react';
import { createPackage, updatePackage, uploadImage, resolveImageUrl } from '../lib/api';

const CATEGORIES = ['MICE', 'Group Fixed', 'Student'];
const REGIONS = ['Domestic', 'International'];

const emptyForm = {
  title: '',
  category: 'Group Fixed',
  region: 'Domestic',
  duration: '',
  price: '',
  image: '',
  tags: '',
  description: '',
  inclusions: '',
  featured: false,
  featuredDates: '',
  featuredRoute: ''
};

function packageToForm(pkg) {
  if (!pkg) return emptyForm;
  return {
    title: pkg.title || '',
    category: pkg.category || 'Group Fixed',
    region: pkg.region || 'Domestic',
    duration: pkg.duration || '',
    price: pkg.price || '',
    image: pkg.image || '',
    tags: (pkg.tags || []).join(', '),
    description: pkg.description || '',
    inclusions: (pkg.inclusions || []).join('\n'),
    featured: !!pkg.featured,
    featuredDates: pkg.featuredDates || '',
    featuredRoute: pkg.featuredRoute || ''
  };
}

export default function PackageForm({ editingPackage, onClose, onSaved }) {
  const [form, setForm] = useState(() => packageToForm(editingPackage));
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(editingPackage ? resolveImageUrl(editingPackage.image) : '');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const isEditing = !!editingPackage;

  const update = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.duration.trim() || !form.price.trim()) {
      setError('Title, duration, and price are required.');
      return;
    }
    if (!imageFile && !form.image.trim()) {
      setError('Please upload an image or provide an image URL.');
      return;
    }

    setIsSaving(true);
    try {
      let imageValue = form.image.trim();

      if (imageFile) {
        const uploadRes = await uploadImage(imageFile);
        imageValue = uploadRes.url;
      }

      const payload = {
        title: form.title.trim(),
        category: form.category,
        region: form.region,
        duration: form.duration.trim(),
        price: form.price.trim(),
        image: imageValue,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        description: form.description.trim(),
        inclusions: form.inclusions.split('\n').map((t) => t.trim()).filter(Boolean),
        featured: form.featured,
        featuredDates: form.featuredDates.trim(),
        featuredRoute: form.featuredRoute.trim()
      };

      if (isEditing) {
        await updatePackage(editingPackage.id, payload);
      } else {
        await createPackage(payload);
      }

      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-slate-900">
            {isEditing ? 'Edit Package' : 'Add New Package'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Package Image</label>
            <div className="flex items-center gap-4">
              <div className="w-28 h-20 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <UploadCloud size={22} className="text-slate-300" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-medium border border-slate-300 rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors"
                >
                  Upload image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  type="text"
                  placeholder="...or paste an image URL"
                  value={form.image}
                  onChange={update('image')}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={update('title')}
              placeholder="e.g. Kashmir Summer Escape"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={update('category')}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Region</label>
              <select
                value={form.region}
                onChange={update('region')}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration</label>
              <input
                type="text"
                value={form.duration}
                onChange={update('duration')}
                placeholder="e.g. 5 Days / 4 Nights"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Price</label>
              <input
                type="text"
                value={form.price}
                onChange={update('price')}
                placeholder='e.g. 24,999 or "Custom"'
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tags <span className="text-slate-400 font-normal">(comma-separated)</span></label>
            <input
              type="text"
              value={form.tags}
              onChange={update('tags')}
              placeholder="Best Seller, Adventure"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={update('description')}
              rows={3}
              placeholder="Shown in the package details popup on the site."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Inclusions <span className="text-slate-400 font-normal">(one per line)</span></label>
            <textarea
              value={form.inclusions}
              onChange={update('inclusions')}
              rows={4}
              placeholder={'Return airport transfers\n4-star hotel stay\nDaily breakfast'}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
            />
          </div>

          <div className="border border-slate-200 rounded-lg p-4 space-y-3 bg-slate-50">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" checked={form.featured} onChange={update('featured')} className="rounded border-slate-300" />
              Feature this on the "Group Fixed Departures" homepage section
            </label>
            {form.featured && (
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Dates label</label>
                  <input
                    type="text"
                    value={form.featuredDates}
                    onChange={update('featuredDates')}
                    placeholder="April 15 - April 20"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Route label</label>
                  <input
                    type="text"
                    value={form.featuredRoute}
                    onChange={update('featuredRoute')}
                    placeholder="Srinagar, Pahalgam, Gulmarg"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-60"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
