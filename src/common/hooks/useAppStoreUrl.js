import { Linking, Platform } from 'react-native';

/**
 * Gets the app store URL according to the device.
 */
export default function useAppStoreUrl() {
  const { OS } = Platform;
  const url = getStoreUrl(OS);

  function open() {
    if (url) {
      openAppStoreUrl(url);
    }
  }

  return {
    /** @var {String|null} */
    url,
    /** @var {Function} */
    open,
  };
}

const Stores = {
  appStore: 'https://apps.apple.com/fr/app/climapp/id1201231301',
  gplay: 'https://play.google.com/store/apps/details?id=com.dehon.climalife.k2app',
};

/**
 * @param {String} os
 *
 * @returns {String}
 */
function getStoreUrl(os) {
  switch (os) {
    case 'ios':
      return Stores.appStore;

    case 'android':
      return Stores.gplay;

    default:
      throw new Error(`Unknown OS "${os}".`);
  }
}

/**
 * Opens the app store URL using the system.
 */
function openAppStoreUrl(url) {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    }
  });
}
