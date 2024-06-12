import { useEffect, useRef, useState } from 'react';

import { DeviceType } from 'types';

export const useOnClickOutside = (
  ref: { current: null | { contains: (arg0: unknown) => unknown } },
  handler: (ev: MouseEvent | TouchEvent) => void
): void => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!event.target || !ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

// handle multiple calls
const disableScroll = (function () {
  let trigger = 0;
  return function (disable: boolean) {
    if (disable) {
      trigger += 1;
      document.body.style.overflow = 'hidden';
    } else {
      if (trigger) {
        trigger -= 1;
      }
      if (!trigger) {
        document.body.style.overflow = 'unset';
      }
    }
  };
})();

export const allowBodyScroll = (): void => disableScroll(false);
export const disableBodyScroll = (): void => disableScroll(true);

export const bigintComparator = (a?: bigint, b?: bigint): number => {
  if (!a) {
    return -1;
  }
  if (!b) {
    return 1;
  }
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  } else {
    return 0;
  }
};

export const numberComparator = (a?: number, b?: number): number => {
  if (!a) {
    return -1;
  }
  if (!b) {
    return 1;
  }
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  } else {
    return 0;
  }
};

export const getDeviceType = (): DeviceType => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return DeviceType.Tablet;
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return DeviceType.Mobile;
  }
  return DeviceType.Desktop;
};

export const OnlyPositive = (v: bigint): bigint => {
  if (v > BigInt(0)) {
    return v;
  }
  return BigInt(0);
};

export const useProgressLoader = (
  isLoading: boolean,
  requestTime = 2000
): number => {
  const [progress, setProgress] = useState(0);
  const prevLoading = useRef<boolean>();
  useEffect(() => {
    if (!prevLoading.current && isLoading) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 99) {
            clearInterval(interval);
            return p;
          } else {
            return p + 1;
          }
        });
      }, requestTime / 100);
    }
    prevLoading.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (progress === 99 && !isLoading) {
      setProgress(100);
    }
  }, [progress, isLoading]);
  return progress;
};

export const maxBigInt = (...args: bigint[]): bigint =>
  args.reduce((m, e) => (e > m ? e : m), BigInt(0));
