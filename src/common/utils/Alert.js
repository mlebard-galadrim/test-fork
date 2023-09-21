import I18n from 'i18n-js';
import { Alert as RNAlert } from 'react-native';

class Alert {
  /**
   * @param {String} root   Root translation
   * @param {Object} params Translation parameters
   *
   * @return {Function}
   */
  static getBlockingAlert(root, params = {}) {
    return Object.assign(
      cancel =>
        RNAlert.alert(
          I18n.t(`${root}.title`, params.title || params),
          I18n.t(`${root}.content`, params.content || params),
          [
            {
              text: I18n.t(`${root}.cancel`),
              onPress: cancel,
              style: 'cancel',
            },
          ],
        ),
      { blocking: true },
    );
  }

  /**
   * @param {String} root   Root translation
   * @param {Object} params Translation parameters
   *
   * @return {Function}
   */
  static getConfirmAlert(root, params = {}) {
    return Object.assign(
      (cancel, confirm) =>
        RNAlert.alert(
          I18n.t(`${root}.title`, params.title || params),
          I18n.t(`${root}.content`, params.content || params),
          [
            {
              text: I18n.t(`${root}.cancel`),
              onPress: cancel,
              style: 'cancel',
            },
            {
              text: I18n.t(`${root}.ok`),
              onPress: confirm,
              style: 'destructive',
            },
          ],
        ),
      { blocking: false },
    );
  }

  /**
   * @param {String} root   Root translation
   * @param {Object} params Translation parameters
   *
   * @return {Function}
   */
  static getWarningAlert(root, params = {}) {
    return Object.assign(
      (cancel, confirm) =>
        RNAlert.alert(
          I18n.t(`${root}.title`, params.title || params),
          I18n.t(`${root}.content`, params.content || params),
          [{ text: I18n.t(`${root}.ok`), onPress: confirm, style: 'cancel' }],
        ),
      { blocking: false },
    );
  }
}

export default Alert;
