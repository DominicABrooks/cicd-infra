import { useState, useEffect } from 'react';
import { Item, fetchItems, createItem, updateItem, deleteItem } from '../api/api';
import { Plus, Trash2, Edit3, Loader2, Package, Check, X } from 'lucide-react';

export function ItemsList() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const loadItems = async () => {
    try {
      const data = await fetchItems();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newItem = await createItem({ name, description });
      setItems([newItem, ...items]);
      setIsAdding(false);
      setName('');
      setDescription('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create item');
    }
  };

  const handleUpdate = async (id: string) => {
    try {
      const updated = await updateItem(id, { name, description });
      setItems(items.map(item => item.id === id ? updated : item));
      setEditingId(null);
      setName('');
      setDescription('');
    } catch (err) {
      alert('Failed to update item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await deleteItem(id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const startEditing = (item: Item) => {
    setEditingId(item.id);
    setName(item.name);
    setDescription(item.description || '');
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loader2 className="animate-spin" size={32} color="var(--accent-primary)" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Your Items</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your personal collection</p>
        </div>
        {!isAdding && (
          <button className="btn-primary" onClick={() => setIsAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={20} /> Add Item
          </button>
        )}
      </div>

      {isAdding && (
        <div className="glass-card" style={{ marginBottom: '2rem', border: '1px solid var(--accent-primary)' }}>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <input className="input-field" placeholder="Item Name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div style={{ flex: 2 }}>
                <input className="input-field" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" className="btn-secondary" onClick={() => setIsAdding(false)}>Cancel</button>
              <button type="submit" className="btn-primary">Create Item</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {items.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
            <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p>No items found. Create your first one!</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} data-testid="item-card" className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {editingId === item.id ? (
                <div style={{ flex: 1, display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input className="input-field" aria-label="Edit item name" style={{ flex: 1 }} value={name} onChange={e => setName(e.target.value)} autoFocus />
                  <input className="input-field" aria-label="Edit item description" style={{ flex: 2 }} value={description} onChange={e => setDescription(e.target.value)} />
                  <button onClick={() => handleUpdate(item.id)} aria-label="Save changes" style={{ color: 'var(--success)', background: 'none' }}><Check size={24} /></button>
                  <button onClick={() => setEditingId(null)} aria-label="Cancel editing" style={{ color: 'var(--error)', background: 'none' }}><X size={24} /></button>
                </div>
              ) : (
                <>
                  <div>
                    <h3 style={{ fontWeight: 600, fontSize: '1.125rem' }}>{item.name}</h3>
                    {item.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{item.description}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => startEditing(item)} aria-label="Edit item" style={{ padding: '0.5rem', borderRadius: '0.375rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)' }}>
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} aria-label="Delete item" style={{ padding: '0.5rem', borderRadius: '0.375rem', color: 'var(--error)', background: 'rgba(239,68,68,0.1)' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
