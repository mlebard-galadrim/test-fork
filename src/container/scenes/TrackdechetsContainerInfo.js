import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Definition from 'k2/app/modules/common/components/Definition';
import Text from 'k2/app/modules/common/components/Text';
import Loader from 'k2/app/modules/common/components/Loader';
import { COLOR_SECONDARY } from 'k2/app/modules/common/styles/vars';
import CompanyCountry from 'k2/app/modules/installation/models/CompanyCountry';
import ErrorMessage from 'k2/app/modules/common/components/ErrorMessage';
import I18n from 'i18n-js';
import useApi from 'k2/app/modules/common/hooks/useApi';
import { get } from 'k2/app/container';

function useTrackdechetsContainerInfo(containerUuid) {
  const api = useApi();
  let [error, setError] = useState(false);
  let [loading, setLoading] = useState(false);
  let [currentBsff, setCurrentBsff] = useState(null);
  let [previousBsff, setPreviousBsff] = useState(null);

  const fetch = () => {
    setLoading(true);
    setError(false);

    api.getContainerBsffsInfo(
      containerUuid,
      ({ current, previous }) => {
        setPreviousBsff(previous?.bordereauId);
        setCurrentBsff(current?.bordereauId);
        setLoading(false);
      },
      apiError => {
        console.error(apiError);
        setError(true);
        setLoading(false);
      },
    );
  };

  return { error, loading, currentBsff, previousBsff, fetch };
}

/**
 * Display some Trackdechets information regarding a container:
 * - its current and previous BSFFs bordereau ids.
 */
function TrackdechetsContainerInfo({ containerUuid, offline }) {
  const { styles } = TrackdechetsContainerInfo;
  const { error, loading, currentBsff, previousBsff, fetch } = useTrackdechetsContainerInfo(containerUuid);

  // On component mount, attempt to fetch info:
  useEffect(
    () => {
      if (!offline) {
        fetch();
      }
    },
    // only re-fetch on network change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [offline],
  );

  return (
    <>
      <Text styleName="caption" style={styles.caption}>
        {I18n.t('scenes.trackdechets_container_infos.title')}
      </Text>

      {/* offline… */}
      {offline && <Text styleName="notice">{I18n.t('scenes.trackdechets_container_infos.offline')}</Text>}

      {/* loading… */}
      {loading && <Loader color={COLOR_SECONDARY} />}

      {/* on error */}
      {error && ErrorMessage.create(I18n.t('scenes.trackdechets_container_infos.error'))}

      {/* on result */}
      {!error && !loading && (
        <>
          <Definition
            value={previousBsff || I18n.t('scenes.trackdechets_container_infos.no_bsff')}
            label={I18n.t('scenes.trackdechets_container_infos.previous_bsff_bordereau_id')}
          />
          <Definition
            value={currentBsff || I18n.t('scenes.trackdechets_container_infos.no_bsff')}
            label={I18n.t('scenes.trackdechets_container_infos.current_bsff_bordereau_id')}
          />
        </>
      )}
    </>
  );
}

TrackdechetsContainerInfo.propTypes = {
  offline: PropTypes.bool.isRequired,
  containerUuid: PropTypes.string.isRequired,
};

TrackdechetsContainerInfo.styles = {
  caption: {
    marginBottom: 10,
  },
};

/**
 * Fetches & display container info related to Trackdéchets only if:
 * - the company uses Trackdéchets
 * - the container is already synced
 * - the container is transfer/recuperation
 */
function TrackdechetsContainerInfoGuard({ container, offline, usesTrackdechets }) {
  if (!usesTrackdechets) {
    return null;
  }

  if (!container.synced) {
    return null;
  }

  const unavailabilityRepository = get('unavailability_repository');
  // Don't show for articles unavailable for recup / transfer:
  if (!unavailabilityRepository.isAvailableForRecupOrTransfer(container.article.uuid)) {
    return null;
  }

  return <TrackdechetsContainerInfo containerUuid={container.id} offline={offline} />;
}

export default connect(state => ({
  offline: state.device.offline,
  usesTrackdechets: new CompanyCountry(state.authentication.userProfile.companyCountry).usesTrackdechets() || false,
}))(TrackdechetsContainerInfoGuard);
