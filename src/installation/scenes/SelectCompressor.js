import I18n from 'i18n-js';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import ComponentList from 'k2/app/modules/installation/components/ComponentList';
import Installation from '../models/Installation';
import { SELECT_COMPONENT } from '../constants';

const styles = {
  listView: {
    flex: 1,
  },
  column: {
    flexDirection: 'column',
  },
};

const SelectCompressor = ({ installation, next, selectCompressorAction }) => {
  const selectCompressor = compressor => {
    selectCompressorAction(compressor);
    next();
  };

  const compressorComponents = useMemo(() => {
    return Array.from(installation.primaryCircuit.components).filter(c => c.isCompressor());
  }, [installation.primaryCircuit.components]);

  return (
    <WrapperView full title={I18n.t('scenes.installation.installation.select_compressor.title')} style={styles.column}>
      <ComponentList style={styles.listView} components={compressorComponents} onPressItem={selectCompressor} />
    </WrapperView>
  );
};

SelectCompressor.propTypes = {
  next: PropTypes.func.isRequired,
  selectCompressorAction: PropTypes.func.isRequired,
  installation: PropTypes.instanceOf(Installation).isRequired,
};

export default connect(
  (state, props) => ({
    installation: state.installationManagementReducer.installation,
    next: props.navigation.getParam('next'),
  }),
  dispatch => ({
    selectCompressorAction: component => {
      dispatch({
        type: SELECT_COMPONENT,
        payload: { component },
      });
    },
  }),
)(SelectCompressor);
