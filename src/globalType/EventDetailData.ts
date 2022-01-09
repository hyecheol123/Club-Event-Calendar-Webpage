/**
 * Globally used type - EventDetailData
 *   Storing event detail
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

type EventDetailData = {
  year: number;
  month: number;
  date: number;
  name: string;
  category?: string;
  detail?: string;
};

export default EventDetailData;
