'use client';

import FadeIn from '@/components/FadeIn';
import { createClient } from '@/utils/supabase/client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Trash2, Edit3, Plus, X, Image as ImageIcon, Cog, Package, User } from 'lucide-react';

export default function AdminDashboard() {
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'stats', 'users', 'news'
  
  // Prodotti
  const [products, setProducts] = useState([]);
  const [components, setComponents] = useState([]);
  
  // Statistiche
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalUsers: 0, totalDevices: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  
  // Utenti
  const [allUsers, setAllUsers] = useState([]);
  
  // News
  const [news, setNews] = useState([]);
  const [editingNews, setEditingNews] = useState(null);
  const [newsForm, setNewsForm] = useState({ title: '', slug: '', content: '', custom_css: '', cover_image: '', is_published: true });


  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const fileInputRef = useRef(null);

  // Dialog Add/Edit
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', slug: '', category_id: 1, description: '', price: 0, stock_qty: 0, is_active: true, image_urls: ''
  });
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/account'); return; }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile?.is_admin) {
        setIsAdmin(false);
        router.push('/account/profilo');
        return;
      }

      setIsAdmin(true);
      refreshData();
    };

    checkAdminAndFetch();
  }, [supabase, router, activeTab]);

  const refreshData = async () => {
    switch (activeTab) {
      case 'products':
        fetchProducts();
        fetchComponents();
        break;
      case 'stats':
        fetchStats();
        break;
      case 'users':
        fetchUsers();
        break;
      case 'news':
        fetchNews();
        break;
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    // 1. Totali
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: devicesCount } = await supabase.from('devices').select('*', { count: 'exact', head: true });
    const { data: orders } = await supabase.from('orders').select('total_amount');
    
    // 2. Calcoli
    const totalRevenue = orders?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;
    const totalOrders = orders?.length || 0;

    setStats({ totalUsers: usersCount || 0, totalDevices: devicesCount || 0, totalRevenue, totalOrders });
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    if (!data.error) setAllUsers(data);
    setLoading(false);
  };

  const fetchNews = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/news');
    const data = await res.json();
    if (!data.error) setNews(data);
    setLoading(false);
  };

  const fetchProducts = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    if (!data.error) setProducts(data);
    else if (res.status === 403) router.push('/account/profilo');
    setLoading(false);
  };

  const fetchComponents = async () => {
    const { data } = await supabase.from('components').select('*').order('name');
    if (data) setComponents(data);
  };

  // Auto-genera slug dal nome
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[àáâä]/g, 'a').replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i').replace(/[òóôö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (name) => {
    const slug = generateSlug(name);
    setFormData({ ...formData, name, slug });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image_urls;
    setUploading(true);

    const ext = imageFile.name.split('.').pop();
    const fileName = `${formData.slug || 'product'}-${Date.now()}.${ext}`;

    const formDataUpload = new FormData();
    formDataUpload.append('file', imageFile);
    formDataUpload.append('fileName', fileName);

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formDataUpload
    });

    const result = await res.json();
    setUploading(false);

    if (result.error) {
      alert('Errore upload immagine: ' + result.error);
      return formData.image_urls;
    }

    return result.publicUrl;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const imageUrl = await uploadImage();

    const productPayload = {
      ...formData,
      image_urls: imageUrl || formData.image_urls,
    };

    let productId;

    if (editingProduct) {
      // Update tramite API Admin
      const res = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingProduct.id, ...productPayload })
      });
      const result = await res.json();
      if (!result.error) productId = editingProduct.id;
    } else {
      // Create tramite API Admin
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload)
      });
      const result = await res.json();
      productId = result?.id;
    }

    // 2. Aggiorna product_components (Ancora tramite Supabase se RLS lo permette o via API admin futura)
    if (productId) {
      await supabase.from('product_components').delete().eq('product_id', productId);
      if (selectedComponents.length > 0) {
        const rows = selectedComponents.map(cId => ({ product_id: productId, component_id: cId }));
        await supabase.from('product_components').insert(rows);
      }
    }

    resetForm();
    await fetchProducts();
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({ name: '', slug: '', category_id: 1, description: '', price: 0, stock_qty: 0, is_active: true, image_urls: '' });
    setSelectedComponents([]);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleDelete = async (id) => {
    if (confirm('Sicuro di voler eliminare questo prodotto?')) {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!result.error) fetchProducts();
      else alert(result.error);
    }
  };

  const handleEdit = async (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name, slug: p.slug, category_id: p.category_id,
      description: p.description, price: p.price, stock_qty: p.stock_qty, is_active: p.is_active, image_urls: p.image_urls || ''
    });
    setImagePreview(p.image_urls || null);
    setImageFile(null);

    // Carica componenti associati
    const { data: pcs } = await supabase.from('product_components').select('component_id').eq('product_id', p.id);
    setSelectedComponents(pcs ? pcs.map(pc => pc.component_id) : []);
  };

  const toggleComponent = (compId) => {
    setSelectedComponents(prev =>
      prev.includes(compId) ? prev.filter(id => id !== compId) : [...prev, compId]
    );
  };

  if (!isAdmin) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
        <FadeIn>
          <div style={{ textAlign: 'center' }}>
            <div className="loader" style={{ marginBottom: '20px' }}></div>
            <p style={{ color: 'var(--text-secondary)' }}>Verifica permessi amministratore...</p>
          </div>
        </FadeIn>
      </main>
    );
  }

  return (
    <main>
      <section className="page-hero text-center" style={{ padding: '80px 0 30px' }}>
        <div className="container">
          <FadeIn>
            <h1 className="hero-title" style={{ fontSize: '2.5rem' }}>Admin Dashboard</h1>
            <p className="hero-subtitle">Gestione Piattaforma PLANT</p>
            
            {/* Tab Selector */}
            <div style={{ 
              display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px',
              background: 'var(--card-bg)', padding: '6px', borderRadius: '40px', width: 'fit-content', margin: '30px auto 0',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              border: '1px solid var(--border-color)'
            }}>
              {[
                { id: 'stats', label: 'Statistiche', icon: <Cog size={18} /> },
                { id: 'products', label: 'Catalogo', icon: <Package size={18} /> },
                { id: 'users', label: 'Utenti', icon: <User size={18} /> },
                { id: 'news', label: 'News', icon: <Edit3 size={18} /> }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '10px 24px', borderRadius: '30px', border: 'none',
                    background: activeTab === tab.id ? 'var(--accent-green)' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#666',
                    cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px',
                    transition: 'all 0.3s'
                  }}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="account-section" style={{ paddingTop: '10px' }}>
        <div className="container">
          
          {/* SEZIONE STATISTICHE */}
          {activeTab === 'stats' && (
            <FadeIn>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="account-card" style={{ padding: '25px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Fatturato Totale</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-green)' }}>€{stats.totalRevenue.toFixed(2)}</div>
                </div>
                <div className="account-card" style={{ padding: '25px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Ordini Totali</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stats.totalOrders}</div>
                </div>
                <div className="account-card" style={{ padding: '25px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Utenti Registrati</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stats.totalUsers}</div>
                </div>
                <div className="account-card" style={{ padding: '25px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>Vasi Attivi</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stats.totalDevices}</div>
                </div>
              </div>
              
              <div className="account-card" style={{ padding: '30px', minHeight: '300px' }}>
                <h3>Grafico Vendite (Simulato)</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', height: '200px', marginTop: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
                  {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                    <div key={i} style={{ flex: 1, background: 'linear-gradient(to top, var(--accent-green), #4ade80)', height: `${h}%`, borderRadius: '6px 6px 0 0', position: 'relative' }}>
                      <div style={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.7rem', color: '#999' }}>G{i+1}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {/* SEZIONE PRODOTTI (Catalogo) */}
          {activeTab === 'products' && (
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>

            {/* Form Aggiungi / Modifica */}
            <div className="account-card" style={{ flex: '1 1 400px', padding: '30px' }}>
              <h3 style={{ marginBottom: '24px' }}>
                {editingProduct ? <><Edit3 size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Modifica Prodotto</> : <><Plus size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />Nuovo Prodotto</>}
              </h3>
              <form onSubmit={handleSave} className="account-form">
                {/* Nome → Auto Slug */}
                <div className="form-group">
                  <label>Nome Prodotto *</label>
                  <input type="text" value={formData.name} onChange={e => handleNameChange(e.target.value)} required placeholder="Es: PLANT Pro Max" />
                </div>
                <div className="form-group">
                  <label>Slug (auto-generato)</label>
                  <input type="text" value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required
                    style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--accent-green)' }} />
                </div>

                {/* Categoria e Prezzo */}
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Categoria *</label>
                    <select value={formData.category_id} onChange={e => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '1rem', background: 'var(--input-bg)', color: 'var(--text-primary)' }}>
                      <option value={1}>Vasi</option>
                      <option value={2}>Accessori</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Prezzo &euro; *</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={isNaN(formData.price) ? '' : formData.price} 
                      onChange={e => {
                        const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                        setFormData({ ...formData, price: isNaN(val) ? 0 : val });
                      }} 
                      required 
                    />
                  </div>
                </div>

                {/* Stock */}
                <div className="form-group">
                  <label>Quantità in Stock</label>
                  <input 
                    type="number" 
                    value={isNaN(formData.stock_qty) ? '' : formData.stock_qty} 
                    onChange={e => {
                      const val = e.target.value === '' ? 0 : parseInt(e.target.value);
                      setFormData({ ...formData, stock_qty: isNaN(val) ? 0 : val });
                    }} 
                  />
                </div>

                {/* Descrizione */}
                <div className="form-group">
                  <label>Descrizione *</label>
                  <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required
                    style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '12px', minHeight: '80px', fontSize: '1rem', fontFamily: 'inherit', background: 'var(--input-bg)', color: 'var(--text-primary)', resize: 'vertical' }} />
                </div>

                {/* Upload Immagine */}
                <div className="form-group">
                  <label>Immagine Prodotto</label>
                  <div style={{
                    border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '20px',
                    textAlign: 'center', cursor: 'pointer', transition: 'border-color 0.3s',
                    background: 'var(--bg-alt)'
                  }}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--accent-green)'; }}
                    onDragLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    onDrop={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--border-color)'; if (e.dataTransfer.files[0]) handleImageSelect({ target: { files: e.dataTransfer.files } }); }}
                  >
                    {imagePreview ? (
                      <div>
                        <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '160px', borderRadius: '8px', objectFit: 'cover', marginBottom: '10px' }} />
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                          <button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'none', border: '1px solid #ccc', borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>Cambia</button>
                          <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); setFormData({ ...formData, image_urls: '' }); }} style={{ background: 'none', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '4px', padding: '4px 8px', fontSize: '0.75rem', cursor: 'pointer' }}>Rimuovi</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Upload size={32} style={{ color: '#999', marginBottom: '10px' }} />
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Clicca o trascina un'immagine</p>
                        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#999' }}>PNG, JPG, WebP — Max 5MB</p>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} style={{ display: 'none' }} />
                  </div>
                </div>

                {/* Componenti / Sensori */}
                {components.length > 0 && (
                  <div className="form-group">
                    <label>Componenti e Sensori</label>
                    <div style={{
                      display: 'flex', flexWrap: 'wrap', gap: '8px',
                      padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-alt)'
                    }}>
                      {components.map(comp => (
                        <label key={comp.id} style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '6px 14px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '500',
                          background: selectedComponents.includes(comp.id) ? 'var(--accent-green)' : 'var(--card-bg)',
                          color: selectedComponents.includes(comp.id) ? 'white' : 'var(--text-primary)',
                          border: `1px solid ${selectedComponents.includes(comp.id) ? 'var(--accent-green)' : 'var(--border-color)'}`,
                          transition: 'all 0.2s'
                        }}>
                          <input type="checkbox" checked={selectedComponents.includes(comp.id)}
                            onChange={() => toggleComponent(comp.id)} style={{ display: 'none' }} />
                          {comp.name}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attivo */}
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--accent-green)' }} />
                    Attivo (Pubblicato)
                  </label>
                </div>

                {/* Bottoni */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary btn-full" disabled={loading || uploading}>
                    {uploading ? 'Upload immagine...' : loading ? 'Salvataggio...' : 'Salva Prodotto'}
                  </button>
                  {editingProduct && (
                    <button type="button" className="btn btn-secondary" onClick={resetForm}>
                      <X size={16} /> Annulla
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Listato Prodotti */}
            <div className="account-card" style={{ flex: '2 1 500px', padding: '30px' }}>
              <h3 style={{ marginBottom: '20px' }}>Catalogo ({products.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {products.map(p => (
                  <div key={p.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '15px', border: '1px solid var(--border-color)', borderRadius: '12px',
                    gap: '12px', flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                      {p.image_urls ? (
                        <img src={p.image_urls} alt={p.name} style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '50px', height: '50px', borderRadius: '10px', background: 'var(--bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ImageIcon size={20} style={{ color: '#999' }} />
                        </div>
                      )}
                      <div>
                        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {p.name}
                          <span style={{
                            fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px',
                            background: p.is_active ? 'var(--accent-green-light)' : 'var(--bg-alt)',
                            color: p.is_active ? 'var(--accent-green)' : 'var(--text-secondary)',
                            border: `1px solid ${p.is_active ? 'var(--accent-green)' : 'var(--border-color)'}`
                          }}>
                            {p.is_active ? 'Online' : 'Nascosto'}
                          </span>
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#666' }}>
                          <span style={{ fontFamily: 'monospace' }}>/{p.slug}</span> · Cat: {p.category_id === 1 ? 'Vaso' : 'Accessorio'} · &euro;{Number(p.price).toFixed(2)} · Stock: {p.stock_qty}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => handleEdit(p)} style={{
                        padding: '6px 14px', border: '1px solid var(--accent-green)', borderRadius: '8px',
                        background: 'transparent', color: 'var(--accent-green)', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem'
                      }}>
                        <Edit3 size={14} /> Edit
                      </button>
                      <button onClick={() => handleDelete(p.id)} style={{
                        padding: '6px 14px', border: '1px solid #ef4444', borderRadius: '8px',
                        background: 'transparent', color: '#ef4444', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem'
                      }}>
                        <Trash2 size={14} /> Del
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

          {/* SEZIONE UTENTI */}
          {activeTab === 'users' && (
            <FadeIn>
              <div className="account-card" style={{ padding: '30px' }}>
                <h3 style={{ marginBottom: '20px' }}>Gestione Utenti ({allUsers.length})</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '12px' }}>Utente</th>
                        <th style={{ padding: '12px' }}>Email</th>
                        <th style={{ padding: '12px' }}>Vasi</th>
                        <th style={{ padding: '12px' }}>Ordini</th>
                        <th style={{ padding: '12px' }}>Ruolo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>
                          <td style={{ padding: '12px' }}>{u.first_name} {u.last_name}</td>
                          <td style={{ padding: '12px', color: '#666' }}>{u.id.substring(0,8)}...</td>
                          <td style={{ padding: '12px' }}>{u.devices?.[0]?.count || 0}</td>
                          <td style={{ padding: '12px' }}>{u.orders?.[0]?.count || 0}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ 
                                padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', 
                                background: u.is_admin ? 'var(--accent-green-light)' : 'var(--bg-alt)', 
                                color: u.is_admin ? 'var(--accent-green)' : 'var(--text-secondary)',
                                border: `1px solid ${u.is_admin ? 'var(--accent-green)' : 'var(--border-color)'}`
                              }}>
                                {u.is_admin ? 'Admin' : 'Utente'}
                              </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </FadeIn>
          )}

          {/* SEZIONE NEWS */}
          {activeTab === 'news' && (
            <FadeIn>
              <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                <div className="account-card" style={{ flex: '1 1 400px', padding: '30px' }}>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    setLoading(true);
                    const payload = {
                      ...newsForm,
                      published_at: newsForm.is_published ? (newsForm.published_at || new Date().toISOString()) : null
                    };

                    // Se stiamo modificando, aggiungiamo l'ID e usiamo PATCH
                    if (editingNews) {
                      payload.id = editingNews.id;
                    }

                    const res = await fetch('/api/admin/news', {
                      method: editingNews ? 'PATCH' : 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload)
                    });
                    
                    const result = await res.json();
                    if (!result.error) {
                      setNewsForm({ title: '', slug: '', content: '', custom_css: '', cover_image: '', is_published: true });
                      setEditingNews(null);
                      fetchNews();
                    } else {
                      alert("Errore: " + result.error);
                    }
                    setLoading(false);
                  }} className="account-form">
                    <h3 style={{ marginBottom: '20px' }}>{editingNews ? 'Modifica News' : 'Scrivi News'}</h3>
                    <div className="form-group">
                      <label>Titolo News</label>
                      <input type="text" value={newsForm.title} onChange={e => {
                        const title = e.target.value;
                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                        setNewsForm({...newsForm, title, slug});
                      }} required />
                    </div>
                    <div className="form-group">
                      <label>Slug (URL)</label>
                      <input type="text" value={newsForm.slug} onChange={e => setNewsForm({...newsForm, slug: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Contenuto
                        <span style={{ fontSize: '0.7rem', color: 'var(--accent-green)', fontWeight: 'normal' }}>Supporta Markdown/HTML</span>
                      </label>
                      <textarea value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} required style={{ minHeight: '150px' }} placeholder="Usa il markdown o HTML custom..." />
                    </div>
                    <div className="form-group">
                      <label>CSS Custom (Opzionale)</label>
                      <textarea value={newsForm.custom_css} onChange={e => setNewsForm({...newsForm, custom_css: e.target.value})} style={{ minHeight: '80px' }} placeholder=".my-class { color: red; }" />
                    </div>
                    <div className="form-group">
                      <label>URL Immagine Copertina</label>
                      <input type="text" value={newsForm.cover_image} onChange={e => setNewsForm({...newsForm, cover_image: e.target.value})} placeholder="https://..." />
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input type="checkbox" id="is_published" checked={newsForm.is_published} onChange={e => setNewsForm({...newsForm, is_published: e.target.checked})} style={{ width: 'auto' }} />
                      <label htmlFor="is_published" style={{ margin: 0, cursor: 'pointer' }}>Pubblica immediatamente</label>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                        {editingNews ? 'Aggiorna News' : 'Salva News'}
                      </button>
                      {editingNews && (
                        <button 
                          type="button" 
                          onClick={() => {
                            setEditingNews(null);
                            setNewsForm({ title: '', slug: '', content: '', custom_css: '', cover_image: '', is_published: true });
                          }} 
                          className="btn" 
                          style={{ flex: 1, background: 'var(--bg-alt)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                        >
                          Annulla
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="account-card" style={{ flex: '2 1 500px', padding: '30px' }}>
                  <h3 style={{ marginBottom: '20px' }}>News Pubblicate ({news.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {news.map(n => (
                      <div key={n.id} style={{ padding: '15px', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)' }}>
                        <div>
                          <h4 style={{ margin: 0 }}>{n.title}</h4>
                          <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: '#666' }}>Postato il: {new Date(n.created_at).toLocaleDateString()}</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button onClick={() => {
                            setEditingNews(n);
                            setNewsForm({
                              title: n.title || '',
                              slug: n.slug || '',
                              content: n.content || '',
                              custom_css: n.custom_css || '',
                              cover_image: n.cover_image || '',
                              is_published: n.is_published,
                              published_at: n.published_at
                            });
                            // Scroll to form
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }} style={{ background: 'none', border: 'none', color: 'var(--accent-green)', cursor: 'pointer' }} title="Modifica">
                            <Edit3 size={18} />
                          </button>
                          <button onClick={async () => {
                            if (confirm("Eliminare questa news?")) {
                              await supabase.from('news').delete().eq('id', n.id);
                              fetchNews();
                              if (editingNews?.id === n.id) {
                                setEditingNews(null);
                                setNewsForm({ title: '', slug: '', content: '', custom_css: '', cover_image: '', is_published: true });
                              }
                            }
                          }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Elimina">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {news.length === 0 && <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>Nessuna news presente.</p>}
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

        </div>
      </section>
    </main>
  );
}
