/**
 * Globally used type - ParticipantInfo
 *   Storing participant information
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

type ParticipantInfo = {
  id: number | string;
  participantName: string;
  email: string;
  phoneNumber?: string;
  comment?: string;
};

export default ParticipantInfo;
