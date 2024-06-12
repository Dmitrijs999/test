import Appsignal from '@appsignal/javascript';

import config from 'config';

export default new Appsignal({
  key: config.APPSIGNAL_KEY,
  namespace: 'FE',
  revision: import.meta.env.VITE_REVISION,
});
