/**
 * Apply padding CSS behaviour (with 1, 2 or 4 arguments)
 *
 * @return {Object}
 */
import { StyleSheet } from 'react-native';

export function padding(...values) {
  switch (values.length) {
    case 1:
      return { padding: values[0] };
    case 2:
      return {
        paddingTop: values[0],
        paddingBottom: values[0],
        paddingLeft: values[1],
        paddingRight: values[1],
      };
    case 3:
      return {
        paddingTop: values[0],
        paddingRight: values[1],
        paddingBottom: values[2],
        paddingLeft: values[1],
      };
    case 4:
      return {
        paddingTop: values[0],
        paddingRight: values[1],
        paddingBottom: values[2],
        paddingLeft: values[3],
      };
    default:
      throw new Error('padding expect 1, 2, 3 or 4 arguments');
  }
}

/**
 * Apply margin CSS behaviour (with 1, 2 or 4 arguments)
 *
 * @return {Object}
 */
export function margin(...values) {
  switch (values.length) {
    case 1:
      return { margin: values[0] };
    case 2:
      return {
        marginTop: values[0],
        marginBottom: values[0],
        marginLeft: values[1],
        marginRight: values[1],
      };
    case 3:
      return {
        marginTop: values[0],
        marginRight: values[1],
        marginBottom: values[2],
        marginLeft: values[1],
      };
    case 4:
      return {
        marginTop: values[0],
        marginRight: values[1],
        marginBottom: values[2],
        marginLeft: values[3],
      };
    default:
      throw new Error('margin expect 1, 2, 3 or 4 arguments');
  }
}

/**
 * Apply border CSS behaviour
 *
 * @return {Object}
 */
export function border(...values) {
  const width = values[0];
  const style = values[1];
  const color = values[2];

  switch (values.length) {
    case 1:
      return { borderWidth: width };
    case 2:
      return {
        borderWidth: width,
        borderStyle: style,
      };
    case 3:
      return {
        borderWidth: width,
        borderStyle: style,
        borderColor: color,
      };
    default:
      throw new Error('border expect 1, 2 or 3 arguments');
  }
}

export function stylesheet(styles) {
  return StyleSheet.create(styles);
}
