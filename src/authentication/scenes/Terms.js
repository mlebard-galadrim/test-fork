import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Linking, View } from 'react-native';
import { connect } from 'react-redux';
import Config from 'react-native-config';
import I18n from 'i18n-js';
import Text from 'k2/app/modules/common/components/Text';
import { COLOR_PRIMARY, COLOR_LIGHT_BG } from 'k2/app/modules/common/styles/vars';
import { BigButton } from 'k2/app/modules/common/components/form';
import { acceptTerms } from 'k2/app/modules/authentication/actions/authenticationActions';
import { TimeoutError } from '../../common/api/ApiClient';
import ErrorMessage from '../../common/components/ErrorMessage';

class Terms extends Component {
  static propTypes = {
    acceptTerms: PropTypes.func.isRequired,
    error: PropTypes.instanceOf(Error),
    errorCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    error: null,
    errorCode: null,
  };

  static styles = {
    content: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: COLOR_PRIMARY,
      paddingHorizontal: 30,
    },
    link: {
      paddingVertical: 20,
    },
    linkText: {
      color: '#fff',
      textAlign: 'center',
      textDecorationLine: 'underline',
    },
    title: {
      color: 'white',
      textAlign: 'center',
      marginBottom: 20,
      fontSize: 24,
    },
    subtitle: {
      color: COLOR_LIGHT_BG,
      textAlign: 'center',
      marginBottom: 20,
    },
    button: {
      marginTop: 20,
    },
  };

  constructor() {
    super();

    this.state = {
      loading: false,
    };

    this.onAccept = this.onAccept.bind(this);
    this.renderError = this.renderError.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (
      // Either a bad response from API
      (prevProps.errorCode !== this.props.errorCode && this.props.errorCode !== null) ||
      // Either another fetch error (e.g: timeout)
      (prevProps.error !== this.props.error && this.props.error !== null)
    ) {
      this.setState({ loading: false });
    }
  }

  onAccept() {
    this.setState({ loading: true });
    this.props.acceptTerms();
  }

  renderError() {
    const { error } = this.props;

    if (!error) {
      return;
    }

    if (error instanceof TimeoutError) {
      return ErrorMessage.create(I18n.t('scenes.terms.error.timeout'));
    }

    return ErrorMessage.create(I18n.t('scenes.terms.error.generic'));
  }

  /**
   * {@inheritdoc}
   */
  render() {
    const { loading } = this.state;
    const { errorCode } = this.props;
    const { styles } = this.constructor;

    return (
      <View style={styles.content}>
        <Text style={styles.title}>{I18n.t('scenes.profile.terms_title')}</Text>
        <Text style={styles.subtitle}>{I18n.t('scenes.profile.terms_subtitle')}</Text>
        <TouchableOpacity style={styles.link} onPress={() => Linking.openURL(Config.PRIVACY_POLICY_URL)}>
          <Text style={styles.linkText}>{I18n.t('scenes.profile.read_privacy_policy')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => Linking.openURL(Config.TERMS_URL)}>
          <Text style={styles.linkText}>{I18n.t('scenes.profile.read_terms')}</Text>
        </TouchableOpacity>

        {errorCode && ErrorMessage.create(I18n.t(`scenes.login.error.${errorCode}`))}
        {this.renderError()}

        <BigButton
          loading={loading}
          style={styles.button}
          color="white"
          textColor={COLOR_PRIMARY}
          onPress={this.onAccept}
          label={I18n.t('scenes.profile.accept_terms')}
        />
      </View>
    );
  }
}

export default connect(
  state => ({
    errorCode: state.authentication.errorCode,
    error: state.authentication.error,
  }),
  dispatch => ({
    acceptTerms: () => dispatch(acceptTerms()),
  }),
)(Terms);
