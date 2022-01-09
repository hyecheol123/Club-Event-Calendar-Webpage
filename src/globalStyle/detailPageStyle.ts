/**
 * Define globally used detail page style
 *
 * @author Hyecheol (Jerry) Jang <hyecheol123@gmail.com>
 */

import headerStyle from './headerStyle';

const detailPageStyle = {
  gridWrapper: { height: '100%' },
  backBtn: { height: '32px', width: '32px', color: 'white' },
  detailWrapper: {
    flexGrow: 1,
    display: 'inline-flex',
    justifyContent: 'center',
  },
  ...headerStyle,
};

export default detailPageStyle;
