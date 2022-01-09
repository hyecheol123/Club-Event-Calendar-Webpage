import API_URL from '../../globalData/API_URL';

/**
 * Method to renew admin token
 * https://hyecheol123.github.io/Club-Event-Calendar-API-Documentation/#operation/renewToken
 *
 * @return {Promise<Response>} Response object of GET /auth/renew API Call
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */
function getRenew(): Promise<Response> {
  return fetch(`${API_URL}/auth/renew`);
}

export default getRenew;
