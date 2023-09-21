import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../../common/components/form';
import WrapperView from '../../common/components/WrapperView';
import { GUTTER } from '../../common/styles/vars';

class AbstractShunt extends Component {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
  };

  static defaultProps = {
    title: null,
    subtitle: null,
  };

  static styles = {
    wrapperView: {
      paddingTop: GUTTER,
    },
    button: {
      marginBottom: GUTTER,
    },
    subtitle: {
      marginBottom: GUTTER,
    },
  };

  constructor() {
    super();

    this.continueIntervention = this.continueIntervention.bind(this);
    this.endIntervention = this.endIntervention.bind(this);
  }

  getContinueLabel() {
    throw new Error('You must implement the "getContinueLabel" method.');
  }

  getEndLabel() {
    throw new Error('You must implement the "getEndLabel" method.');
  }

  continueIntervention() {
    throw new Error('You must implement the "continueIntervention" method.');
  }

  endIntervention() {
    throw new Error('You must implement the "endIntervention" method.');
  }

  renderInfos() {
    throw new Error('You must implement the "renderInfos" method.');
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { styles } = this.constructor;
    const { title, subtitle } = this.props;

    return (
      <WrapperView style={styles.wrapperView} title={title} subtitle={subtitle}>
        {this.renderInfos()}
        <Button testID="continue" style={styles.button} onPress={this.continueIntervention}>
          {this.getContinueLabel()}
        </Button>
        <Button testID="finish" style={styles.button} onPress={this.endIntervention}>
          {this.getFinishLabel()}
        </Button>
      </WrapperView>
    );
  }
}

export default AbstractShunt;
