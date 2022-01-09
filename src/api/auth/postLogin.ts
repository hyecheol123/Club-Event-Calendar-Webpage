import API_URL from '../../globalData/API_URL';

/**
 * Method to get access/refresh token using admin username and password
 * https://hyecheol123.github.io/Club-Event-Calendar-API-Documentation/#operation/login
 *
 * @param {string} id admin username
 * @param {string} password admin password
 * @return {Promise<Response>} Response object of POST /auth/login
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */
function postLogin(id: string, password: string): Promise<Response> {
  return fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id, password: password }),
  });
}

export default postLogin;
