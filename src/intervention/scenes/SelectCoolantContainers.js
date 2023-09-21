import React, { useMemo } from 'react';
import WrapperView from 'k2/app/modules/common/components/WrapperView';
import { Button } from 'k2/app/modules/common/components/form';
import { FloatInput, Select } from '../../common/components/form';
import CoolantContainerType from '../models/CoolantContainerType';
import { trans } from 'k2/app/I18n';
import Fieldset from '../../common/components/Fieldset';
import { Text, TouchableOpacity, View } from 'react-native';
import I18n from 'i18n-js';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { COLOR_ERROR, COLOR_PRIMARY } from '../../common/styles/vars';
import { connect, useDispatch } from 'react-redux';
import { get } from 'k2/app/container';
import { padding } from '../../common/styles/utils';
import { addCoolantContainer, editCoolantContainer, removeCoolantContainer } from '../actions/interventionPipe';

export function SelectCoolantContainers({ installation, coolantContainers, next }) {
  const dispatch = useDispatch();

  const styles = SelectCoolantContainers.styles;

  const translations = useMemo(() => {
    return I18n.t('scenes.intervention.select_coolant_container');
  }, []);

  const validator = useMemo(() => {
    return get('validator');
  }, []);

  const drainedLoad = useMemo(() => {
    return coolantContainers.reduce((accumulator, container) => {
      return accumulator + container.load;
    }, 0);
  }, [coolantContainers]);

  const initialLoad = useMemo(() => {
    const foundInstalltion = get('installation_repository').find(installation);
    if (foundInstalltion && foundInstalltion.primaryCircuit) {
      return foundInstalltion.primaryCircuit.coolantQuantity;
    }
    return 0;
  }, [installation]);

  const validate = () => {
    return coolantContainers.length && checkValidFields();
  };

  const checkValidFields = () => {
    const res = coolantContainers.some(c => {
      return c.type === '' || c.load === '' || c.load === 0;
    });
    return !res;
  };

  const onValidate = () => {
    validator.validate(validator.isCoolantDrainagePossible(drainedLoad), () => next());
  };

  return (
    <>
      <WrapperView style={styles.quantityWrapper} title={"Caloporteur dans l'installation"}>
        <Text>{I18n.t('scenes.intervention.select_coolant_container.initial_quantity', { qty: initialLoad })}</Text>
        <Text>{I18n.t('scenes.intervention.select_coolant_container.drained_quantity', { qty: drainedLoad })}</Text>
      </WrapperView>
      <WrapperView scrollable keyboardAware full title={translations.title} style={styles.column}>
        {coolantContainers.map((container, index) => {
          return (
            <Fieldset title={`${translations.container} ${index + 1}`} key={index}>
              <WrapperView style={styles.row}>
                <View style={styles.flex}>
                  <Select
                    title={translations['type:label']}
                    placeholder={translations['type:placeholder']}
                    value={container.type}
                    options={CoolantContainerType.values}
                    renderOption={option => (option ? trans(CoolantContainerType.readableFor(option)) : null)}
                    onPressOption={type => dispatch(editCoolantContainer(index, 'type', type))}
                    labelStyle={styles.labelType}
                    hideStripe
                  />
                </View>
                <View style={styles.flex}>
                  <FloatInput
                    title={translations['load:label']}
                    placeholder={''}
                    onChangeText={load => dispatch(editCoolantContainer(index, 'load', Number(load)))}
                    value={container.load}
                    maxLength={10}
                    labelStyle={styles.labelQuantity}
                    unit={'kg'}
                    hideStripe
                  />
                </View>
                <TouchableOpacity onPress={() => dispatch(removeCoolantContainer(index))}>
                  <Icon name="minus-circle" size={30} color={COLOR_PRIMARY} />
                </TouchableOpacity>
              </WrapperView>
            </Fieldset>
          );
        })}
        <Button onPress={() => dispatch(addCoolantContainer())}>{translations.add_container}</Button>
        <Button valid={validate()} onPress={() => onValidate()}>
          {translations.finish_intervention}
        </Button>
      </WrapperView>
    </>
  );
}
//TODO Replace raw text with translation keys
// And also drop the inline styles lol

SelectCoolantContainers.styles = {
  textError: {
    color: COLOR_ERROR,
  },
  errorContent: {
    fontSize: 13,
    ...padding(5, 8),
  },
  quantityWrapper: {
    flex: 0,
    marginBottom: 10,
  },
  column: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
  labelType: {
    flexBasis: 50,
  },
  labelQuantity: {
    flexBasis: 60,
  },
};

export default connect((state, props) => ({
  installation: state.interventionPipe.intervention.installation,
  coolantContainers: state.interventionPipe.intervention.coolantContainers,
  next: props.navigation.getParam('next'),
}))(SelectCoolantContainers);
