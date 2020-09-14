import isEqual from 'react-fast-compare';

/**
 * Returns true if any of the non-updatable props have been changed.
 *
 * @param prevProps
 * @param props
 * @return {boolean}
 */
export default function requireReInitialization(prevProps, props) {
  const hasFileChanged = prevProps.file !== props.file;
  const hasPlaylistChanged = !isEqual(prevProps.playlist, props.playlist);
  return hasFileChanged || hasPlaylistChanged;
}
