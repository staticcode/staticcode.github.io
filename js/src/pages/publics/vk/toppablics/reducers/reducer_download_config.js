import { loadState } from '../../../../../components/localStorage';


export default function (state = loadState('_TS_VK_downloadCfg') || [], action) {
  switch (action.type) {
    case 'CHANGE_DOWNLOAD_CONFIG':
      return action.payload;
    default:
      return state;
  }
}
