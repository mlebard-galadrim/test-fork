import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Text from 'k2/app/modules/common/components/Text';
import Loader from 'k2/app/modules/common/components/Loader';
import { get } from 'k2/app/container';
import { navigate } from 'k2/app/navigation';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import MainListView from 'k2/app/modules/common/components/list/MainListView';
import { Button } from 'k2/app/modules/common/components/form';
import { PIPE_CREATE_CONTAINER, PIPE_UPDATE_CONTAINER } from 'k2/app/modules/container/constants';
import ContainerResultDetails from 'k2/app/modules/container/components/SelectContainer/ContainerResultDetails';
import Container from 'k2/app/modules/container/models/Container';
import View from 'k2/app/modules/common/components/View';
import { stylesheet } from 'k2/app/modules/common/styles/utils';
import { SPACING } from 'k2/app/modules/common/styles/vars';
import { sortForSearch } from 'k2/app/modules/container/utils/sort';
import { useCanCreateContainerWithFocus } from 'k2/app/modules/container/scenes/CreateContainer';
import { trans } from 'k2/app/I18n';

SelectContainer.propTypes = {
  barcode: PropTypes.string.isRequired,
  next: PropTypes.func.isRequired,
  nextMethod: PropTypes.string,
  onSelectedContainer: PropTypes.func,
};
SelectContainer.defaultProps = {
  nextMethod: undefined,
  onSelectedContainer: null,
};
SelectContainer.styles = stylesheet({
  spinner: {
    flex: 1,
    margin: 20,
  },
});

/**
 * Select a container from a list of results, during an intervention process.
 */
function SelectContainer({ barcode, next, nextMethod, onSelectedContainer }) {
  const containerRepository = get('container_repository');
  const { styles } = SelectContainer;
  const [containers, setContainers] = useState([]);
  const canCreateContainer = useCanCreateContainerWithFocus(barcode);

  const findContainer = useCallback(
    barcode => {
      setContainers(sortForSearch(containerRepository.search(barcode)));
    },
    [containerRepository],
  );

  /**
   * Search container on barcode change:
   */
  useEffect(() => {
    findContainer(barcode);
  }, [barcode, findContainer]);

  function onSelectContainer(container) {
    const goNext = () => next(undefined, nextMethod);

    const promise = onSelectedContainer && onSelectedContainer(container);

    if (promise instanceof Promise) {
      return promise
        .then(goNext)
        .catch(reason => {
          console.warn(
            `Selected container was rejected by \`props.onSelectedContainer\` in \`${SelectContainer.name}.js\``,
            { reason },
          );
        })
        .done();
    }

    goNext();
  }

  function onCreateContainer() {
    navigate(
      PIPE_CREATE_CONTAINER,
      {
        barcode,
        next,
        nextMethod,
        // Create then select the container:
        onContainerCreated: onSelectedContainer,
      },
      nextMethod,
    );
  }

  function onPressModify(container) {
    navigate(
      PIPE_UPDATE_CONTAINER,
      {
        container,
        next,
        nextMethod,
        // Modify, then select the container:
        onContainerUpdated: onSelectedContainer,
      },
      nextMethod,
    );
  }

  function getTitle(numberOfResult) {
    switch (numberOfResult) {
      case 0:
        return trans('scenes.container.select.title:none');
      case 1:
        return trans('scenes.container.select.title:unique');
      default:
        return trans('scenes.container.select.title:multiple', {
          total: numberOfResult,
        });
    }
  }

  // Loading state:
  if (containers === null) {
    return (
      <WrapperView title={trans('scenes.container.select.loading')}>
        <Loader style={styles.spinner} />
      </WrapperView>
    );
  }

  return (
    <WrapperView full title={getTitle(containers.length)} subTitle={barcode}>
      <ResultList containers={containers} onSelectContainer={onSelectContainer} onPressModify={onPressModify} />

      {canCreateContainer && (
        <Button onPress={onCreateContainer}>{trans('scenes.container.select.action.create')}</Button>
      )}
    </WrapperView>
  );
}

export default connect((state, props) => ({
  barcode: props.navigation.getParam('barcode'),
  next: props.navigation.getParam('next'),
  nextMethod: props.navigation.getParam('nextMethod'),
  onSelectedContainer: props.navigation.getParam('onSelectedContainer'),
}))(SelectContainer);

ResultList.propTypes = {
  containers: PropTypes.arrayOf(PropTypes.instanceOf(Container)).isRequired,
  onPressModify: PropTypes.func.isRequired,
  onSelectContainer: PropTypes.func.isRequired,
};

ResultList.styles = stylesheet({
  noResult: {
    flex: 1,
    margin: 20,
    textAlign: 'center',
  },
});
ResultList.styles.actions = stylesheet({
  row: {
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginRight: SPACING,
  },
  buttonLast: {
    marginRight: 0,
  },
});

function ResultList({ containers, onSelectContainer, onPressModify }) {
  const { styles } = ResultList;

  if (containers.length === 0) {
    return <Text style={styles.noResult}>{trans('scenes.container.select.no_result')}</Text>;
  }

  function renderContainer(container) {
    return (
      <ContainerResultDetails container={container}>
        <View styleName="horizontal" style={styles.actions.row}>
          <Button style={styles.actions.button} styleName="secondary" onPress={() => onPressModify(container)}>
            {trans('scenes.container.select.action.update')}
          </Button>
          <Button
            style={[styles.actions.button, styles.actions.buttonLast]}
            onPress={() => onSelectContainer(container)}
          >
            {trans('scenes.container.select.action.select')}
          </Button>
        </View>
      </ContainerResultDetails>
    );
  }

  return <MainListView data={containers} onPressItem={onSelectContainer} renderContent={renderContainer} />;
}
