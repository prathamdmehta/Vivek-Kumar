import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, LogOut, Image, FolderOpen, Upload, Trash2,
  Plus, X, Eye, EyeOff, CheckCircle, AlertCircle,
  Github, ExternalLink, Tag, Loader2, LayoutDashboard, Mail
} from 'lucide-react';

// ─── Helper ──────────────────────────────────────────────────────────────────
const api = async (path, options = {}, token = null) => {
  const headers = { ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  const res = await fetch(path, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data;
};

// ─── Toast ───────────────────────────────────────────────────────────────────
const Toast = ({ msg, type, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
      className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white font-medium text-sm
        ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
      {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
      {msg}
    </motion.div>
  );
};

// ─── Forgot Password Screen ───────────────────────────────────────────────────
const ForgotPasswordScreen = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await api('/api/admin/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-orange-600/20 rounded-2xl"><Mail className="text-orange-400" size={24} /></div>
          <div>
            <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
            <p className="text-slate-400 text-sm">We'll email you a reset link</p>
          </div>
        </div>
        {sent ? (
          <div className="text-center py-6">
            <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Check your inbox!</h3>
            <p className="text-slate-400 text-sm mb-6">A password reset link has been sent to <strong className="text-white">{email}</strong>. It expires in 30 minutes.</p>
            <button onClick={onBack} className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition-colors">← Back to Login</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Admin Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="admin@portfolio.com" />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
              {loading ? 'Sending...' : 'Send Reset Link'}
            </motion.button>
            <button type="button" onClick={onBack} className="w-full text-slate-400 hover:text-white text-sm transition-colors py-2">
              ← Back to Login
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

// ─── Reset Password Screen ────────────────────────────────────────────────────
const ResetPasswordScreen = ({ resetToken, onDone }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirm) return setError('Passwords do not match.');
    setLoading(true);
    try {
      await api(`/api/admin/reset-password/${resetToken}`, { method: 'POST', body: JSON.stringify({ password }) });
      setDone(true);
      // Clear reset token from URL without reload
      window.history.replaceState(null, '', '/#admin');
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-emerald-600/20 rounded-2xl"><Lock className="text-emerald-400" size={24} /></div>
          <div>
            <h1 className="text-2xl font-bold text-white">New Password</h1>
            <p className="text-slate-400 text-sm">Set a strong password for your admin panel</p>
          </div>
        </div>
        {done ? (
          <div className="text-center py-6">
            <CheckCircle size={48} className="text-emerald-400 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">Password Updated!</h3>
            <p className="text-slate-400 text-sm mb-6">Your password has been changed successfully. You can now log in.</p>
            <motion.button onClick={onDone} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors">
              Go to Login
            </motion.button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">New Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pr-11 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Min. 8 characters" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Confirm Password</label>
              <input type={show ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Repeat your new password" />
            </div>
            {/* Strength bar */}
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                    password.length >= i * 3
                      ? i <= 1 ? 'bg-red-500' : i <= 2 ? 'bg-orange-500' : i <= 3 ? 'bg-yellow-500' : 'bg-emerald-500'
                      : 'bg-slate-700'
                  }`} />
                ))}
              </div>
              <p className="text-xs text-slate-500">{password.length === 0 ? 'Enter a password' : password.length < 8 ? 'Too short' : password.length < 12 ? 'Good' : 'Strong ✓'}</p>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
              {loading ? 'Updating...' : 'Update Password'}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

// ─── Login ───────────────────────────────────────────────────────────────────
const LoginScreen = ({ onLogin, onForgot }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const data = await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-600/20 rounded-2xl"><Lock className="text-blue-400" size={24} /></div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-slate-400 text-sm">Vivek Kumar Portfolio</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@portfolio.com" />
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Password</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pr-11 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••" />
              <button type="button" onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Forgot Password Link */}
            <button type="button" onClick={onForgot}
              className="mt-2 text-xs text-slate-500 hover:text-blue-400 transition-colors float-right">
              Forgot password?
            </button>
          </div>
          {error && <p className="text-red-400 text-sm clear-both">{error}</p>}
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

// ─── Photos Tab ──────────────────────────────────────────────────────────────
const PhotosTab = ({ token, toast }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('photo');
  const [caption, setCaption] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const load = async () => {
    setLoading(true);
    try {
      const data = await api('/api/media', {}, token);
      setPhotos(data.data || []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const upload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const form = new FormData();
      [...files].forEach(f => form.append('files', f));
      form.append('category', category);
      if (caption) form.append('caption', caption);
      await api('/api/admin/media', { method: 'POST', body: form }, token);
      toast('Files uploaded!', 'success');
      setCaption('');
      await load();
    } catch (err) {
      toast(err.message, 'error');
    } finally { setUploading(false); }
  };

  const del = async (id) => {
    if (!confirm('Delete this file?')) return;
    try {
      await api(`/api/admin/media/${id}`, { method: 'DELETE' }, token);
      toast('Deleted!', 'success');
      setPhotos(p => p.filter(x => x._id !== id));
    } catch (err) { toast(err.message, 'error'); }
  };

  const CATEGORIES = ['photo', 'hero', 'profile', 'svg', 'project', 'other'];

  return (
    <div className="space-y-8">
      {/* Upload Box */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
        <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2"><Upload size={20} className="text-blue-400" /> Upload Files</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-slate-400 mb-1 block">Caption (optional)</label>
            <input type="text" value={caption} onChange={e => setCaption(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. My workspace photo" />
          </div>
        </div>
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files); }}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all
            ${dragOver ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-blue-500/60 hover:bg-slate-800/50'}`}>
          <input ref={fileRef} type="file" multiple accept="image/*,.svg,.pdf" className="hidden"
            onChange={e => upload(e.target.files)} />
          {uploading
            ? <div className="flex flex-col items-center gap-2 text-blue-400"><Loader2 size={36} className="animate-spin" /><p>Uploading...</p></div>
            : <div className="flex flex-col items-center gap-2 text-slate-400">
                <Upload size={36} className="opacity-50" />
                <p className="font-medium">Drag & drop files here, or <span className="text-blue-400">click to browse</span></p>
                <p className="text-xs">PNG, JPG, SVG, WEBP up to 20MB</p>
              </div>}
        </div>
      </div>

      {/* Gallery */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
        <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2"><Image size={20} className="text-purple-400" /> All Media ({photos.length})</h2>
        {loading
          ? <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({length:8}).map((_,i) => <div key={i} className="aspect-square rounded-2xl bg-slate-800 animate-pulse" />)}</div>
          : photos.length === 0
          ? <p className="text-slate-500 text-center py-10">No files uploaded yet.</p>
          : <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map(photo => (
                <div key={photo._id} className="relative group rounded-2xl overflow-hidden bg-slate-800 aspect-square border border-slate-700">
                  {photo.mimeType?.includes('svg') || photo.mimeType?.includes('pdf')
                    ? <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400 p-3">
                        <FolderOpen size={32} />
                        <p className="text-xs text-center truncate w-full">{photo.originalName}</p>
                      </div>
                    : <img src={photo.url} alt={photo.caption || photo.originalName} className="w-full h-full object-cover" />}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 p-3">
                    <span className="text-xs text-white/80 bg-blue-600/80 px-2 py-0.5 rounded-full">{photo.category}</span>
                    <p className="text-white text-xs text-center truncate w-full">{photo.caption || photo.originalName}</p>
                    <div className="flex gap-2">
                      <a href={photo.url} target="_blank" rel="noreferrer" className="p-2 bg-slate-700 rounded-full hover:bg-blue-600 transition-colors"><Eye size={14} /></a>
                      <button onClick={() => del(photo._id)} className="p-2 bg-slate-700 rounded-full hover:bg-red-600 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>}
      </div>
    </div>
  );
};

// ─── Projects Tab ─────────────────────────────────────────────────────────────
const EMPTY_PROJECT = { title: '', description: '', imageUrl: '', repoLink: '', liveLink: '', tags: '' };

const ProjectsTab = ({ token, toast }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_PROJECT);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await api('/api/projects', {}, token);
      setProjects(data.data || []);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) };
    try {
      if (editId) {
        await api(`/api/admin/projects/${editId}`, { method: 'PUT', body: JSON.stringify(payload) }, token);
        toast('Project updated!', 'success');
      } else {
        await api('/api/admin/projects', { method: 'POST', body: JSON.stringify(payload) }, token);
        toast('Project added!', 'success');
      }
      setForm(EMPTY_PROJECT); setEditId(null); setShowForm(false);
      await load();
    } catch (err) { toast(err.message, 'error'); } finally { setSaving(false); }
  };

  const startEdit = (p) => {
    setForm({ ...p, tags: (p.tags || []).join(', ') });
    setEditId(p._id); setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const del = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api(`/api/admin/projects/${id}`, { method: 'DELETE' }, token);
      toast('Deleted!', 'success');
      setProjects(p => p.filter(x => x._id !== id));
    } catch (err) { toast(err.message, 'error'); }
  };

  const fields = [
    { key: 'title', label: 'Project Title', placeholder: 'My Awesome Project', col: 2 },
    { key: 'imageUrl', label: 'Image URL', placeholder: 'https://... or http://localhost:5000/uploads/file.jpg', col: 2 },
    { key: 'description', label: 'Description', placeholder: 'Short description of the project...', col: 2, textarea: true },
    { key: 'repoLink', label: 'GitHub Repo URL', placeholder: 'https://github.com/youruser/repo', col: 1 },
    { key: 'liveLink', label: 'Live Demo URL', placeholder: 'https://your-project.vercel.app', col: 1 },
    { key: 'tags', label: 'Tags (comma separated)', placeholder: 'React, Node.js, MongoDB', col: 2 },
  ];

  return (
    <div className="space-y-8">
      {/* Add/Edit Form */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus size={20} className="text-green-400" />
            {editId ? 'Edit Project' : 'Add New Project'}
          </h2>
          {!showForm
            ? <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                <Plus size={16} /> New Project
              </motion.button>
            : <button onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY_PROJECT); }}
                className="text-slate-400 hover:text-white"><X size={20} /></button>}
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSave} className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {fields.map(f => (
                  <div key={f.key} className={f.col === 2 ? 'md:col-span-2' : ''}>
                    <label className="text-sm text-slate-400 mb-1 block">{f.label}</label>
                    {f.textarea
                      ? <textarea value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} rows={3} required
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                      : <input type="text" value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder}
                          required={f.key !== 'tags'} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />}
                  </div>
                ))}
              </div>
              {form.imageUrl && (
                <div className="mb-4">
                  <p className="text-xs text-slate-500 mb-2">Image Preview:</p>
                  <img src={form.imageUrl} alt="preview" className="h-32 w-full object-cover rounded-xl border border-slate-700" onError={e => e.target.style.display='none'} />
                </div>
              )}
              <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
                {saving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                {saving ? 'Saving...' : editId ? 'Update Project' : 'Add Project'}
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Projects List */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6">
        <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
          <FolderOpen size={20} className="text-yellow-400" /> All Projects ({projects.length})
        </h2>
        {loading
          ? <div className="space-y-3">{Array.from({length:3}).map((_,i) => <div key={i} className="h-24 rounded-2xl bg-slate-800 animate-pulse" />)}</div>
          : projects.length === 0
          ? <p className="text-slate-500 text-center py-10">No projects yet. Add your first one above!</p>
          : <div className="space-y-4">
              {projects.map(p => (
                <div key={p._id} className="flex gap-4 bg-slate-800 rounded-2xl p-4 border border-slate-700 group hover:border-slate-600 transition-colors">
                  <img src={p.imageUrl} alt={p.title} className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-slate-700"
                    onError={e => { e.target.style.display = 'none'; }} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white truncate">{p.title}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mt-1">{p.description}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {(p.tags || []).map(tag => (
                        <span key={tag} className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Tag size={10} />{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <a href={p.liveLink} target="_blank" rel="noreferrer" className="p-2 bg-slate-700 rounded-xl hover:bg-blue-600 transition-colors" title="Live Demo">
                      <ExternalLink size={16} />
                    </a>
                    <a href={p.repoLink} target="_blank" rel="noreferrer" className="p-2 bg-slate-700 rounded-xl hover:bg-slate-500 transition-colors" title="GitHub Repo">
                      <Github size={16} />
                    </a>
                    <button onClick={() => startEdit(p)} className="p-2 bg-slate-700 rounded-xl hover:bg-yellow-600 transition-colors" title="Edit">
                      <Plus size={16} />
                    </button>
                    <button onClick={() => del(p._id)} className="p-2 bg-slate-700 rounded-xl hover:bg-red-600 transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>}
      </div>
    </div>
  );
};

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
const AdminDashboard = () => {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_token') || '');
  const [tab, setTab] = useState('photos');
  const [toast, setToast] = useState(null);
  const [screen, setScreen] = useState('login'); // 'login' | 'forgot'

  // Check for reset token in URL: /#admin?reset=TOKEN
  const resetToken = (() => {
    const hash = window.location.hash; // e.g. #admin?reset=abc123
    const q = hash.includes('?') ? hash.split('?')[1] : '';
    return new URLSearchParams(q).get('reset');
  })();

  const showToast = (msg, type = 'success') => setToast({ msg, type, id: Date.now() });

  const handleLogin = (t) => {
    sessionStorage.setItem('admin_token', t);
    setToken(t);
    setScreen('login');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token');
    setToken('');
  };

  // Reset password flow — comes from email link
  if (resetToken) {
    return <ResetPasswordScreen resetToken={resetToken} onDone={() => { window.history.replaceState(null,'','/#admin'); window.location.reload(); }} />;
  }

  if (!token) {
    if (screen === 'forgot') return <ForgotPasswordScreen onBack={() => setScreen('login')} />;
    return <LoginScreen onLogin={handleLogin} onForgot={() => setScreen('forgot')} />;
  }

  const tabs = [
    { id: 'photos', label: 'Photos & Media', icon: Image },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 rounded-xl"><LayoutDashboard size={20} className="text-blue-400" /></div>
          <div>
            <h1 className="font-bold text-white">Admin Dashboard</h1>
            <p className="text-xs text-slate-400">Vivek Kumar Portfolio</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-800 rounded-xl p-1 gap-1">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${tab === t.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>
                <t.icon size={16} />{t.label}
              </button>
            ))}
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm transition-colors px-3 py-2 rounded-xl hover:bg-red-900/20">
            <LogOut size={16} /> Logout
          </motion.button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
            {tab === 'photos' && <PhotosTab token={token} toast={showToast} />}
            {tab === 'projects' && <ProjectsTab token={token} toast={showToast} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toast && <Toast key={toast.id} msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
