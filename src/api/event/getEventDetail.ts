import API_URL from '../../globalData/API_URL';

/**
 * Method to get event detail
 * https://hyecheol123.github.io/Club-Event-Calendar-API-Documentation/#operation/getEvent
 *
 * @param {string} eventId unique event id
 * @return {Promise<Response>} Response object of GET /event/{eventId}
 */
function getEventDetail(eventId: string): Promise<Response> {
  return fetch(`${API_URL}/event/${eventId}`);
}

export default getEventDetail;
