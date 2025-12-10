import API from '../../../services/api';

// named export required by your components
export async function saveUserToDb(user) {
  try {
    // try to POST user to old backend; if API missing this will throw and be caught
    await API.post('/users', user);
    return { ok: true };
  } catch (err) {
    // fallback: store minimal user locally so UI still works
    try {
      const existing = JSON.parse(localStorage.getItem('demo_users') || '[]');
      existing.push(user);
      localStorage.setItem('demo_users', JSON.stringify(existing));
    } catch (e) {}
    return { ok: false, error: err?.message || String(err) };
  }
}
