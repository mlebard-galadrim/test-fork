import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import connectToQuery from '@elao/react-native-realm-connect';
import Text from 'k2/app/modules/common/components/Text';
import { get } from 'k2/app/container';
import { navigate } from 'k2/app/navigation';
import Container from 'k2/app/modules/container/models/Container';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import MainListView from 'k2/app/modules/common/components/list/MainListView';
import { Button } from 'k2/app/modules/common/components/form';
import { PIPE_CREATE_CONTAINER, PIPE_UPDATE_CONTAINER } from 'k2/app/modules/container/constants';
import ContainerResultDetails from 'k2/app/modules/container/components/SelectContainer/ContainerResultDetails';
import { stylesheet } from 'k2/app/modules/common/styles/utils';
import { trans } from 'k2/app/I18n';
import { sortForSearch } from 'k2/app/modules/container/utils/sort';
import { useCanCreateContainerWithFocus } from 'k2/app/modules/container/scenes/CreateContainer';

ContainerInfos.propTypes = {
  barcode: PropTypes.string.isRequired,
  containers: PropTypes.arrayOf(PropTypes.instanceOf(Container)).isRequired,
};
ContainerInfos.styles = {
  content: {
    flex: 1,
  },
  message: {
    textAlign: 'center',
  },
};
ContainerInfos.styles.actions = stylesheet({
  row: {
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
  },
});

function ContainerInfos({ barcode, containers }) {
  const { styles } = ContainerInfos;
  const canCreateContainer = useCanCreateContainerWithFocus(barcode);

  function onPressCreate() {
    navigate(PIPE_CREATE_CONTAINER, { barcode });
  }

  function onPressModify(container) {
    navigate(PIPE_UPDATE_CONTAINER, { container });
  }

  return (
    <WrapperView
      full
      title={trans('scenes.container_infos.infos.title', { count: containers.length })}
      subtitle={trans('scenes.container_infos.infos.search', { barcode })}
    >
      <MainListView
        data={sortForSearch(containers)}
        renderContent={container => (
          <ContainerResultDetails container={container}>
            <Button style={[styles.actions.button, styles.actions.buttonLast]} onPress={() => onPressModify(container)}>
              {trans('scenes.container.select.action.update')}
            </Button>
          </ContainerResultDetails>
        )}
        noDataContent={
          <View style={styles.content}>
            <Text style={styles.message}>{trans('scenes.container_infos.unknown_container.content', { barcode })}</Text>
          </View>
        }
      />
      {canCreateContainer && <Button onPress={onPressCreate}>{trans('scenes.container.select.action.create')}</Button>}
    </WrapperView>
  );
}

export default connect((state, props) => ({
  barcode: props.navigation.getParam('barcode'),
}))(
  connectToQuery({
    containers: props => get('container_repository').search(props.barcode, true),
  })(ContainerInfos),
);
