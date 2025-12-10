import API from '../../../services/api';

/**
 * saveUserToDb(userObj)
 * userObj example: { name, email, authProvider }
 */
export async function saveUserToDb(userObj) {
  if (!userObj || !userObj.email) {
    throw new Error('saveUserToDb: missing user email');
  }
  // POST to /users (your server accepts /users and inserts user doc)
  const res = await API.post('/users', userObj);
  return res.data;
}

export default saveUserToDb;
