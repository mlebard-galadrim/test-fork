import I18n from 'i18n-js';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { navigate } from 'k2/app/navigation';
import { TextInput, Button } from '../../common/components/form';
import WrapperView from '../../common/components/WrapperView';
import { PIPE_SELECT_CONTAINER, PIPE_CONTAINER_INFOS } from '../constants';
import { GUTTER } from '../../common/styles/vars';

/**
 * SearchContainer
 */
class SearchContainer extends Component {
  static propTypes = {
    next: PropTypes.func,
    nextMethod: PropTypes.string,
    onSelectedContainer: PropTypes.func,
  };

  static defaultProps = {
    next: null,
    nextMethod: undefined,
    onSelectedContainer: () => {},
  };

  static styles = {
    button: {
      margin: GUTTER,
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      barcode: null,
    };

    this.setBarcode = this.setBarcode.bind(this);
    this.validate = this.validate.bind(this);
  }

  /**
   * @param {String} barcode
   */
  setBarcode(barcode) {
    this.setState({ barcode });
  }

  validate() {
    const { next, nextMethod, onSelectedContainer } = this.props;
    const { barcode } = this.state;

    if (!next) {
      return navigate(PIPE_CONTAINER_INFOS, { barcode });
    }

    navigate(PIPE_SELECT_CONTAINER, { next, barcode, nextMethod, onSelectedContainer }, nextMethod);
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = SearchContainer;
    const { barcode } = this.state;

    return (
      <WrapperView full scrollable title={I18n.t('scenes.container.search.title')}>
        <TextInput
          testID="barcode"
          title={I18n.t('scenes.container.search.barcode:label')}
          placeholder={I18n.t('scenes.container.search.barcode:placeholder')}
          onChangeText={this.setBarcode}
          onSubmitEditing={this.validate}
          defaultValue={barcode}
          autoFocus
        />
        <Button testID="submit" onPress={this.validate} valid={!!barcode} style={styles.button}>
          {I18n.t('scenes.container.search.submit')}
        </Button>
      </WrapperView>
    );
  }
}

export default connect((state, props) => ({
  next: props.navigation.getParam('next'),
  nextMethod: props.navigation.getParam('nextMethod'),
  onSelectedContainer: props.navigation.getParam('onSelectedContainer'),
}))(SearchContainer);
