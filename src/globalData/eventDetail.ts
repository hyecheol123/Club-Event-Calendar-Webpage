/**
 * Globally used data - eventDetail
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import EventDetailData from '../globalType/EventDetailData';

// Data
const currentDate = new Date();
const data: { [index: string]: EventDetailData } = {
  1: {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    date: 14,
    name: '디스코드 비대면 모각코',
    detail:
      '디스코드 방에 신규로 가입하고자 하시는 분들은 abc@gmail.com으로 연락 부탁드립니다.',
  },
  2: {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    date: 24,
    name: '서면 스타벅스 정기 모임',
    category: '정기모임',
  },
  3: {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    date: 28,
    name: 'mm 정기모임 - 당신이 사랑하는 프로그래밍 언어는?',
    category: '비대면',
    detail: '참여하실 분은 신청시 음(mm) 아이디를 적어주세요.',
  },
  4: {
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    date: 28,
    name: '디스코드 비대면 모각코',
  },
};

export default data;
