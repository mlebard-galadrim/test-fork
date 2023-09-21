import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextInput } from 'react-native';

class TextArea extends Component {
  static propTypes = {
    minHeight: PropTypes.number,
    maxHeight: PropTypes.number,
    style: PropTypes.shape(),
  };

  static defaultProps = {
    minHeight: 40,
    maxHeight: 0,
    style: {},
  };

  constructor(props) {
    super(props);

    this.state = {
      height: 0,
    };

    this.onContentSizeChange = this.onContentSizeChange.bind(this);
  }

  onContentSizeChange(event) {
    const { height } = event.nativeEvent.contentSize;

    this.setState({ height });
  }

  restrictHeight(value, min = 0, max = 0) {
    const height = Math.max(value, min);

    return max ? Math.min(height, max) : height;
  }

  render() {
    const { style, minHeight, maxHeight, ...props } = this.props;
    const { height } = this.state;

    return (
      <TextInput
        multiline
        blurOnSubmit
        underlineColorAndroid="transparent"
        onContentSizeChange={this.onContentSizeChange}
        {...props}
        style={{
          ...style,
          height: this.restrictHeight(height, minHeight, maxHeight),
        }}
      />
    );
  }
}

export default TextArea;
