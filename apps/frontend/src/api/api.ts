import { supabase } from '../lib/supabase';

export interface Item {
  id: string;
  name: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateItemInput {
  name: string;
  description?: string;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (session) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  return headers;
}

export async function fetchHello(): Promise<{ message: string }> {
  const res = await fetch('/api/hello');
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
}

export async function fetchItems(): Promise<Item[]> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/items', { headers });
  if (!res.ok) throw new Error('Failed to fetch items');
  return res.json();
}

export async function createItem(input: CreateItemInput): Promise<Item> {
  const headers = await getAuthHeaders();
  const res = await fetch('/api/items', {
    method: 'POST',
    headers,
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to create item');
  }
  return res.json();
}

export async function updateItem(id: string, input: CreateItemInput): Promise<Item> {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/items/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error('Failed to update item');
  return res.json();
}

export async function deleteItem(id: string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`/api/items/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Failed to delete item');
}
