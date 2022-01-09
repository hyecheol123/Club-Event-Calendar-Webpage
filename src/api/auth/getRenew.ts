import API_URL from '../../globalData/API_URL';

/**
 * Method to renew admin token
 * https://hyecheol123.github.io/Club-Event-Calendar-API-Documentation/#operation/renewToken
 *
 * @return {Promise<boolean>} Result of GET /auth/renew API Call
 *   true when success, otherwise fail
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */
async function getRenew(): Promise<boolean> {
  const response = await fetch(`${API_URL}/auth/renew`);
  if (response.status >= 200 && response.status < 300) {
    return true;
  } else {
    localStorage.removeItem('ADMIN_LOGIN');
    return false;
  }
}

export default getRenew;
