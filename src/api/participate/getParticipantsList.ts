import API_URL from '../../globalData/API_URL';

/**
 * Method to get event participants list
 * https://hyecheol123.github.io/Club-Event-Calendar-API-Documentation/#operation/listEventTicket
 *
 * Admin Only
 *
 * @param {string} eventId unique event id
 * @return {Promise<Response>} Response object of GET /event/{eventId}/participate
 */
function getParticipantsList(eventId: string): Promise<Response> {
  return fetch(`${API_URL}/event/${eventId}/participate`);
}

export default getParticipantsList;
