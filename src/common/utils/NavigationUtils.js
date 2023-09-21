/**
 * Define if the scene is the current scene for the user
 *
 * @param {Object} props
 *
 * @return {Boolean}
 */
export function sceneIsCurrent(props) {
  const { navigation, navigationState } = props;
  const lastScene = navigation[navigation.length - 1];

  return navigationState.key === lastScene.key;
}

let lock;

export function throttle(callback, duration = 500) {
  function unlock() {
    lock = null;
  }

  return () => {
    const run = !lock;

    if (!lock) {
      lock = setTimeout(unlock, duration);
    }

    if (run) {
      callback();
    }
  };
}
