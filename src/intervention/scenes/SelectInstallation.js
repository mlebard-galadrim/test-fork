import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AbstractSelectInstallation from 'k2/app/modules/installation/scenes/AbstractSelectInstallation';
import InstallationFilter from 'k2/app/modules/installation/filters/InstallationFilter';
import { selectInstallation } from 'k2/app/modules/installation/actions/installationPipe';
import InterventionType from '../models/InterventionType';

class SelectInstallation extends AbstractSelectInstallation {
  static propTypes = {
    ...AbstractSelectInstallation.propTypes,
    filter: PropTypes.oneOf(InstallationFilter.values),
  };

  static defaultProps = {
    filter: null,
  };
}

export default connect(
  ({ installationPipe, interventionPipe }, props) => {
    let installations = installationPipe.site ? Array.from(installationPipe.site.installations) : [];

    installations = installations.filter(installation => !installation.synced || !installation.isDismantled());

    if (props.filter === InstallationFilter.LEAKING) {
      installations = installations.filter(installation => installation.leaking);
    }

    return {
      installations,
      siteName: installationPipe.site ? installationPipe.site.name : null,
      showLeakingAsDisabled:
        interventionPipe.intervention && interventionPipe.intervention.type === InterventionType.FILLING,
      next: props.navigation.getParam('next'),
    };
  },
  dispatch => ({
    selectInstallation: installation => dispatch(selectInstallation(installation)),
  }),
)(SelectInstallation);
