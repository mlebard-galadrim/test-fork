import I18n from 'i18n-js';
import React, { Component } from 'react';
import { Image } from 'react-native';
import { get } from 'k2/app/container';
import { backToDashboard } from 'k2/app/navigation';
import Text from 'k2/app/modules/common/components/Text';
import View from 'k2/app/modules/common/components/View';
import { TextInput, TextArea, Button } from '../components/form';
import Definition from '../components/Definition';
import SignatureBox from '../components/SignatureBox';
import WrapperView from '../components/WrapperView';
import TransitionModal from '../components/modal/TransitionModal';
import { GUTTER, COLOR_UNDERLAY } from '../styles/vars';
import checkImage from '../../../assets/icons/check.png';

/**
 * Abstract SumUp scene
 */
export default class AbstractSumUp extends Component {
  static styles = {
    wrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    signature: {
      flex: 1,
      marginLeft: GUTTER / 2,
      marginRight: GUTTER / 2,
    },
    iconConfirm: {
      width: 226 / 2,
      height: 226 / 2,
    },
    row: {
      flexDirection: 'row',
      marginLeft: -GUTTER,
      marginRight: -GUTTER,
    },
    button: {
      flex: 1,
      marginVertical: GUTTER,
    },
    fullWidth: {
      marginLeft: -GUTTER,
      marginRight: -GUTTER,
    },
    contentList: {
      maxHeight: 150,
    },
    signatures: {
      marginLeft: -GUTTER / 2,
      marginRight: -GUTTER / 2,
    },
    fieldset: {
      marginVertical: GUTTER,
    },
    label: {
      marginBottom: GUTTER / 2,
      fontSize: 13,
      fontWeight: '500',
      color: '#333',
    },
    input: {
      borderWidth: 1,
      borderColor: COLOR_UNDERLAY,
      borderRadius: 4,
      paddingHorizontal: GUTTER,
      paddingVertical: GUTTER / 2,
    },
    record: {
      container: {
        ...Definition.styles.definition,
        borderBottomWidth: 0,
        margin: 0,
        padding: 0,
        borderLeftWidth: 0,
      },
      label: {
        ...Definition.styles.term,
      },
      input: {
        ...Definition.styles.value,
        margin: 0,
        paddingHorizontal: GUTTER / 2,
        paddingVertical: 0,
        height: 30,
        borderWidth: 1,
        borderColor: COLOR_UNDERLAY,
        borderRadius: 4,
      },
    },
  };

  constructor(props, root, type) {
    super(props);

    this.root = root;
    this.type = type;
    this.state = {
      record: null,
      observations: null,
      showConfirmModal: false,
    };

    this.analytics = get('firebase-analytics');

    this.onValidate = this.onValidate.bind(this);
    this.renderSignature = this.renderSignature.bind(this);
    this.onSignature = this.onSignature.bind(this);
    this.onChangeRecord = this.onChangeRecord.bind(this);
    this.onChangeObservations = this.onChangeObservations.bind(this);
    this.onTerminate = this.onTerminate.bind(this);
    this.isComplete = this.isComplete.bind(this);
    this.renderTransitionModal = this.renderTransitionModal.bind(this);
    this.renderTransitionModalIcon = this.renderTransitionModalIcon.bind(this);
    this.renderPerformedAt = this.renderPerformedAt.bind(this);
    this.renderShouldCreateBsff = this.renderShouldCreateBsff.bind(this);
  }

  /**
   * On validate
   */
  onValidate() {
    throw new Error('The "onValidate" method must be implemented.');
  }

  /**
   * On signature box pressed
   *
   * @param {String} signature
   * @param {String} name
   */
  onSignature(signature, name) {
    throw new Error('The "onSignature" method must be implemented.');
  }

  /**
   * On record value changed
   *
   * @param {String} record
   */
  onChangeRecord(record) {
    this.setState({ record: record === '' ? null : record });
  }

  /**
   * On observations value changed
   *
   * @param {String} value
   */
  onChangeObservations(value) {
    const observations = value === '' ? null : value;

    if (observations) {
      this.analytics.logEvent('intervention_observation');
    }

    this.setState({ observations });
  }

  /**
   * Dispatch and close the current intervention
   */
  onTerminate() {
    backToDashboard();
  }

  getSubmitLabel() {
    return I18n.t('common.submit');
  }

  getSignatures() {
    return [];
  }

  getTitle() {
    throw new Error('The "getTitle" method must be implemented.');
  }

  getSubtitle() {
    throw new Error('The "getSubtitle" method must be implemented.');
  }

  isComplete() {
    throw new Error('The "isComplete" method must be implemented.');
  }

  renderRecordNumber() {
    const { styles } = this.constructor;
    const { record } = this.state;

    return (
      <TextInput
        key="record-number"
        style={styles.record.container}
        inputStyle={styles.record.input}
        labelStyle={styles.record.label}
        title={I18n.t(`${this.root}.sum_up.record_number`)}
        placeholder="AUTO"
        defaultValue={record}
        onChangeText={this.onChangeRecord}
      />
    );
  }

  renderObservations() {
    const { styles } = this.constructor;
    const { observations } = this.state;

    return (
      <View style={styles.fieldset}>
        <Text styleName="caption" style={styles.label}>
          {I18n.t(`${this.root}.sum_up.observations:label`)}
        </Text>
        <TextArea
          placeholder={I18n.t(`${this.root}.sum_up.observations:placeholder`)}
          style={styles.input}
          defaultValue={observations}
          onChangeText={this.onChangeObservations}
          maxLength={255}
          returnKeyType="done"
        />
      </View>
    );
  }

  renderShouldCreateBsff() {
    return null;
  }

  renderSignatures() {
    const { styles } = this.constructor;
    const signatures = this.getSignatures();

    if (!signatures.length) {
      return null;
    }

    return (
      <View styleName="horizontal" style={{ ...styles.fieldset, ...styles.signatures }}>
        {signatures}
      </View>
    );
  }

  /**
   * Render signature block
   *
   * @param {String} label User label
   * @param {String} name
   *
   * @return {View}
   */
  renderSignature(label, name) {
    const { styles } = this.constructor;

    return (
      <View key={`signature-${name}`} style={styles.signature}>
        <Text styleName="caption" style={styles.label}>
          {label}
        </Text>
        <SignatureBox title={label} onSignature={signature => this.onSignature(signature, name)} />
      </View>
    );
  }

  renderPerformedAt() {
    return null;
  }

  /**
   * Renders the sum up specific content
   *
   * @return {View}
   */
  renderContent() {
    throw new Error('You must implement the "renderContent" method.');
  }

  renderTransitionModal(visible) {
    return (
      <TransitionModal
        onClose={this.onTerminate}
        visible={visible}
        title={I18n.t(`${this.root}.sum_up_validation.title.${this.type}`)}
        subtitle={I18n.t(`${this.root}.sum_up_validation.subtitle`)}
        icon={this.renderTransitionModalIcon()}
      />
    );
  }

  renderTransitionModalIcon() {
    const { styles } = this.constructor;

    return <Image style={styles.iconConfirm} source={checkImage} />;
  }

  /**
   * @inheritdoc
   */
  render() {
    const { styles } = this.constructor;
    const { showConfirmModal } = this.state;

    return (
      <WrapperView scrollable keyboardAware title={this.getTitle()} subtitle={this.getSubtitle()}>
        <View style={styles.fieldset}>
          {this.getInfos()}
          {this.renderRecordNumber()}
          {this.renderPerformedAt()}
        </View>

        {this.renderContent()}
        {this.renderObservations()}
        {this.renderShouldCreateBsff()}
        {this.renderSignatures()}

        <Button testID="submit" style={styles.button} valid={this.isComplete()} onPress={this.onValidate}>
          {this.getSubmitLabel()}
        </Button>

        {this.renderTransitionModal(showConfirmModal)}
      </WrapperView>
    );
  }
}
