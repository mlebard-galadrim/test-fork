import { useCallback, useState } from 'react';
import useApi from 'k2/app/modules/common/hooks/useApi';

/**
 * Hook to check the version of the app according to the minimal version set on our API.
 */
export default function useCheckVersion() {
  const api = useApi();
  // request state:
  const [loading, setLoading] = useState(false);
  const [called, setCalled] = useState(false);
  const [error, setError] = useState(null);
  // result:
  const [outdated, setOutdated] = useState(null);
  const [message, setMessage] = useState(null);

  const fetch = useCallback(
    function () {
      if (loading) {
        return;
      }

      setCalled(true);
      setLoading(true);
      setError(null);

      let outdatedFromResponse = null;

      // Wrap in a Promise, so consumer can react to the check version call with outdated result:
      return new Promise(resolve => {
        api
          .checkVersion()
          .then(data => {
            outdatedFromResponse = data?.outdated ?? false;
            console.info(outdatedFromResponse ? 'The app is outdated' : 'The app is up-to-date');
            setOutdated(outdatedFromResponse);
            setMessage(data?.message);
            // Forwards the outdated result to the Promise caller:
            resolve(outdatedFromResponse);
          })
          .catch(err => {
            console.warn('Unable to check the app version', err);
            setError(err);
            setOutdated(null);
            setMessage(null);
            // result is undetermined since the call failed, consider not outdated:
            resolve(null);
          })
          .finally(() => {
            setLoading(false);
          });
      });
    },
    [api, loading],
  );

  return {
    /** Whether it was called at least once */
    called,
    /** Is currently fetching */
    loading,
    /** Was there any error during last call */
    error,
    /** @var {Boolean|null} is the app outdated? */
    outdated,
    /** @var {String|null} */
    message,
    /** Triggers the API call */
    checkVersion: fetch,
  };
}
