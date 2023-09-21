import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'k2/app/modules/common/components/Icon';
import TextInput from './TextInput';
import Scan from '../Scan';
import ModalView from '../modal/ModalView';
import { throttle } from '../../utils/NavigationUtils';
import { padding } from 'k2/app/modules/common/styles/utils';

class ScanInput extends Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    onChangeText: PropTypes.func.isRequired,
  };

  static defaultProps = {
    defaultValue: '',
  };

  static styles = {
    scanButton: {
      ...padding(5, 0, 5, 15),
    },
    scanIcon: {
      fontSize: 18,
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      scanning: false,
    };

    this.onPressScan = this.onPressScan.bind(this);
    this.onCode = this.onCode.bind(this);
    this.onCodeCancel = this.onCodeCancel.bind(this);
  }

  /**
   * On press scan button
   */
  onPressScan() {
    this.setState({ scanning: true });
  }

  /**
   * On code detected
   *
   * @param {String} code
   */
  onCode(code) {
    this.setState({ scanning: false });
    this.props.onChangeText(code);
  }

  /**
   * On code scan cancelled (back button)
   */
  onCodeCancel() {
    this.setState({ scanning: false });
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { scanning } = this.state;
    const { styles } = this.constructor;

    return (
      <View>
        <ModalView title="" full visible={scanning} onCloseModal={this.onCodeCancel}>
          <Scan active={scanning} onCode={this.onCode} />
        </ModalView>
        <TextInput {...this.props}>
          <TouchableOpacity onPress={throttle(this.onPressScan)} style={styles.scanButton}>
            <View>
              <Icon style={styles.scanIcon} name="camera" />
            </View>
          </TouchableOpacity>
        </TextInput>
      </View>
    );
  }
}

export default ScanInput;
