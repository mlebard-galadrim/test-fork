import I18n from 'i18n-js';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { get } from 'k2/app/container';
import Site from 'k2/app/modules/installation/models/Site';
import { saveShipping } from '../actions/shippingPipe';
import { GUTTER, COLOR_UNDERLAY } from 'k2/app/modules/common/styles/vars';
import { Select } from 'k2/app/modules/common/components/form';
import AbstractSumUp from 'k2/app/modules/common/scenes/AbstractSumUp';
import Definition from 'k2/app/modules/common/components/Definition';
import ShippingType from '../models/ShippingType';
import Carrier from '../models/Carrier';
import ContainerShippingList from '../components/ContainerShippingList';

/**
 * ShippingSumUp scene
 */
class ShippingSumUp extends AbstractSumUp {
  static propTypes = {
    saveShipping: PropTypes.func.isRequired,
    shippingType: PropTypes.instanceOf(ShippingType).isRequired,
    site: PropTypes.instanceOf(Site),
    containerIdentifiers: PropTypes.arrayOf(PropTypes.string).isRequired,
    carrier: PropTypes.instanceOf(Carrier),
  };

  static defaultProps = {
    carrier: null,
  };

  static styles = {
    ...AbstractSumUp.styles,
    treatment: {
      input: {
        alignSelf: 'center',
        margin: 0,
        paddingHorizontal: GUTTER / 2,
        paddingVertical: 0,
        flex: 2,
        height: 30,
        borderWidth: 1,
        borderColor: COLOR_UNDERLAY,
        borderRadius: 4,
        marginBottom: GUTTER,
      },
      text: {
        fontSize: 13,
      },
    },
  };

  constructor(props) {
    super(props, 'scenes.shipping', props.shippingType.value);

    this.containerRepository = get('container_repository');
    this.treatmentSiteOptions = Array.from(get('site_repository').findAllTreatmentSite());
    this.unavailabilityRepository = get('unavailability_repository');

    this.state = {
      ...this.state,
      hasRecuperationContainer: this.computeHasFilledDrainageContainer(),
      carrierSignature: null,
      treatmentSite: null,
    };

    this.renderContainerRow = this.renderContainerRow.bind(this);
    this.onSelectedTreatmentSite = this.onSelectedTreatmentSite.bind(this);
    this.renderSelectTreatmentSite = this.renderSelectTreatmentSite.bind(this);
  }

  /**
   * On validate shipping
   */
  onValidate() {
    const { observations, record, carrierSignature, treatmentSite } = this.state;

    this.props.saveShipping(record, observations, carrierSignature, treatmentSite);

    this.setState({ showConfirmModal: true });
  }

  /**
   * On signature box pressed
   *
   * @param {String} signature
   */
  onSignature(signature, name) {
    this.setState({ [name]: signature });
  }

  /**
   * @param {Object|null} selectedOption
   */
  onSelectedTreatmentSite(treatmentSite = null) {
    this.setState({ treatmentSite });
  }

  computeHasFilledDrainageContainer() {
    const { containerIdentifiers } = this.props;
    const { containerRepository } = this;

    return containerIdentifiers.some(uuid => {
      const container = containerRepository.find(uuid);

      return (
        this.unavailabilityRepository.isAvailableForRecupOrTransfer(container.article.uuid) &&
        container.getCurrentLoad() > 0
      );
    });
  }

  isComplete() {
    const { hasRecuperationContainer, carrierSignature } = this.state;

    return !(hasRecuperationContainer && !carrierSignature);
  }

  /**
   * @param {String} uuid A container uuid
   *
   * @return {View}
   */
  renderContainerRow(uuid) {
    const { styles } = this.constructor;
    const { containerRepository } = this.props;
    const { barcode, competitor } = containerRepository.find(uuid);

    return (
      <View key={`container-${barcode}`} style={styles.containerList.row}>
        <Icon name="database" size={15} style={styles.containerList.icon} />
        <Text ellipsizeMode="tail" numberOfLines={1}>
          {barcode} -{competitor ? competitor.designation : 'Climalife'}
        </Text>
      </View>
    );
  }

  /**
   * @return {View}
   */
  renderContent() {
    const { shippingType, containerIdentifiers } = this.props;
    const { styles } = this.constructor;

    return (
      <View style={styles.fieldset}>
        <Text style={styles.label}>{I18n.t(`scenes.shipping.sum_up.containers:${shippingType.value}`)}</Text>
        <ContainerShippingList
          style={{ ...styles.fullWidth, ...styles.contentList }}
          containerIdentifiers={containerIdentifiers}
        />
      </View>
    );
  }

  /**
   * Render optional select for sites with treatment site (only shipping out)
   *
   * @return {Select}
   */
  renderSelectTreatmentSite() {
    const { styles } = this.constructor;
    const { shippingType, site } = this.props;
    const { hasRecuperationContainer, treatmentSite } = this.state;

    if (!site || site.treatmentSite || !hasRecuperationContainer || !shippingType.is(ShippingType.OUT)) {
      return null;
    }

    return (
      <Select
        key="treatment-site"
        title={I18n.t('scenes.shipping.sum_up.treatmentSite:label')}
        placeholder={I18n.t('scenes.shipping.sum_up.treatmentSite:placeholder')}
        value={treatmentSite}
        options={this.treatmentSiteOptions}
        renderOption={option => option.name}
        onPressOption={this.onSelectedTreatmentSite}
        style={styles.record.container}
        inputStyle={styles.treatment.input}
        textStyle={styles.treatment.text}
        labelStyle={styles.record.label}
        optional
      />
    );
  }

  getSignatures() {
    const signatures = [];

    if (this.state.hasRecuperationContainer) {
      signatures.push(this.renderSignature(I18n.t('scenes.shipping.sum_up.carrierSign'), 'carrierSignature'));
    }

    return signatures;
  }

  getTitle() {
    return I18n.t('scenes.shipping.sum_up.title');
  }

  getSubtitle() {
    return I18n.t(this.props.shippingType.toString());
  }

  getInfos() {
    const { shippingType, carrier, site } = this.props;
    const infos = [];

    if (site) {
      infos.push(
        <Definition key="client" label={I18n.t('scenes.intervention.sum_up.client')} value={site.client.name} />,
        <Definition key="site" label={I18n.t(`scenes.shipping.sum_up.site:${shippingType.value}`)} value={site.name} />,
      );
    }

    if (shippingType.is(ShippingType.OUT)) {
      infos.push(
        <Definition
          key="carrier"
          label={I18n.t('scenes.shipping.sum_up.carrier')}
          value={carrier ? carrier.name : I18n.t('scenes.shipping.sum_up.carrier:not_selected')}
        />,
      );
    }

    infos.push(this.renderSelectTreatmentSite());

    return infos;
  }
}

export default connect(
  state => ({
    shippingType: state.shippingReducer.type,
    site: state.shippingReducer.site,
    containerIdentifiers: state.shippingReducer.containerIdentifiers,
    carrier: state.shippingReducer.carrier,
  }),
  dispatch => ({
    saveShipping: (...args) => dispatch(saveShipping(...args)),
  }),
)(ShippingSumUp);
