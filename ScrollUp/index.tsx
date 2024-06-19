import { useEffect } from 'react';

import { useHistory } from 'react-router-dom';

const ScrollToTop = (): null => {
  const history = useHistory();

  useEffect(() => {
    const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
    if (!isMac) {
      document.getElementsByTagName('body')[0].classList.add('windows');
    }

    history.listen(() =>
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 0)
    );
  }, []);

  return null;
};

export default ScrollToTop;
