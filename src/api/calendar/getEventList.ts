import API_URL from '../../globalData/API_URL';

/**
 * Method to get eventList
 * https://hyecheol123.github.io/Club-Event-Calendar-API-Documentation/#operation/getEventListOfMonth
 *
 * @param {number} year year of the month, support from the year 2021
 * @param {number} month month, support 1 to 12
 * @return {Promise<Response>|void} Response object of GET /{year}-{month}
 *   void when either year or month is invalid
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */
function getEventList(year: number, month: number): Promise<Response> | void {
  // Check for year and month range
  if (Boolean(year % 1) || Boolean(month % 1)) {
    return;
  }
  if (year < 2021) {
    return;
  }
  if (month < 1 || month > 12) {
    return;
  }

  return fetch(`${API_URL}/${year}-${month}`);
}

export default getEventList;
