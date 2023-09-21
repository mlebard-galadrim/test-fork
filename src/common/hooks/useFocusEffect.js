import { useContext, useEffect } from 'react';
import { NavigationContext } from 'react-navigation';

/**
 * Execute a callback each time a screen will focus.
 *
 * @see https://reactnavigation.org/docs/4.x/navigation-context/#example-with-hooks
 * @see https://reactnavigation.org/docs/4.x/function-after-focusing-screen/
 */
export function useFocusEffect(callback) {
  const navigation = useContext(NavigationContext);

  useEffect(() => {
    const listener = navigation.addListener('willFocus', callback);

    return () => listener.remove();
  }, [callback, navigation]);
}
