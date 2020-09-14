import updatableProps from '../updatable-props';

/**
 * Gets the video player configuration for the updated props.
 *
 * @param prevProps
 * @param props
 * @return {{}}
 */
export default function getUpdatedPlayerOpts(prevProps, props) {
  const playerOpts = {};
  const updated = Object.entries(props)
    .filter(([key]) => updatableProps.includes(key))
    .filter(([key, value]) => value !== prevProps[key]);

  for (let i = 0; i < updated.length; i += 1) {
    const [key, value] = updated[i];
    switch (key) {
      case 'isMuted':
        playerOpts.mute = !!value;
        break;
      case 'aspectRatio':
        if (value && value !== 'inherit') {
          playerOpts.aspectratio = value;
        }
        break;
      case 'isAutoPlay':
        playerOpts.autostart = !!value;
        break;

      default: break;
    }
  }

  return playerOpts;
}
