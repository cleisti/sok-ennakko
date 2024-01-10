// typet/interfacet voisi vielä mahdollisesti olla omassa filussa
type StorageType = 'localStorage' | 'sessionStorage';

const storageAvailable = (type: StorageType) => {
  try {
    typeof window[type];
    return true;
  } catch (e) {
    return false;
  }
};

const getStorage = (name: StorageType): Storage | null => {
  if (storageAvailable(name)) return window[name];
  return null;
};

export const dismissBanner = (name: string) => {
  getStorage('localStorage')?.setItem(`banner-${name}-dismissed`, 'true');
};

export const shouldShow = (name: string) => {
  if (!getStorage('localStorage')) return false;

  return !(
    getStorage('localStorage')?.getItem(`banner-${name}-dismissed`) === 'true'
  );
};

