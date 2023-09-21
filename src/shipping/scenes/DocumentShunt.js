import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dimensions, Text, View } from 'react-native';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import { Button } from 'k2/app/modules/common/components/form';
import { COLOR_LIGHT_BG, COLOR_SECONDARY, GUTTER } from 'k2/app/modules/common/styles/vars';
import { border } from 'k2/app/modules/common/styles/utils';
import { setIsUsingDocument } from 'k2/app/modules/shipping/actions/shippingPipe';

/**
 * Choose whether or not using document for the shipping
 */
class DocumentShunt extends Component {
  static propTypes = {
    next: PropTypes.func.isRequired,
    setIsUsingDocument: PropTypes.func.isRequired,
  };

  static styles = {
    wrapper: {
      maxHeight: 450,
    },
    option: {
      flex: 1,
      margin: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    button: {
      minHeight: 120,
      margin: GUTTER / 2,
      padding: GUTTER / 2,
      ...border(2, 'solid', 'transparent'),
      borderRadius: 3,
      backgroundColor: COLOR_LIGHT_BG,
      width: (Dimensions.get('window').width - 3 * GUTTER) / 2,
    },
    buttonLabel: {
      color: COLOR_SECONDARY,
      fontWeight: 'bold',
      fontSize: 13,
      textAlign: 'center',
      margin: 0,
    },
  };

  constructor(props) {
    super(props);

    this.selectOption = this.selectOption.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  /**
   * {@inheritdoc}
   */
  componentWillUnmount() {
    this.props.setIsUsingDocument(null);
  }

  selectOption(isUsingDocument) {
    this.props.setIsUsingDocument(isUsingDocument);
    this.props.next();
  }

  /**
   * @param {{ key: String, value: Boolean }} item
   */
  renderItem(item) {
    const { styles } = this.constructor;

    return (
      <View style={styles.option} key={item.key}>
        <Button
          onPress={() => this.selectOption(item.value)}
          style={{
            ...styles.button,
          }}
        >
          <Text
            style={{
              ...styles.buttonLabel,
            }}
          >
            {I18n.t(`scenes.shipping.document_shunt.${item.key}`).toUpperCase()}
          </Text>
        </Button>
      </View>
    );
  }

  /**
   * @inheritdoc
   */
  render() {
    return (
      <WrapperView full title={I18n.t('scenes.shipping.document_shunt.title')} style={this.constructor.styles.wrapper}>
        {[
          { key: 'without-document', value: false },
          { key: 'with-document', value: true },
        ].map(this.renderItem)}
      </WrapperView>
    );
  }
}

export default connect(
  (state, props) => ({
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    setIsUsingDocument: isUsingDocument => dispatch(setIsUsingDocument(isUsingDocument)),
  }),
)(DocumentShunt);
