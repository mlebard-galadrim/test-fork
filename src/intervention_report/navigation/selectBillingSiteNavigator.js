import { navigate, pop } from 'k2/app/navigation';
import { PIPE_CLIENT_SELECTION, PIPE_SITE_SELECTION } from 'k2/app/modules/installation/constants';
import ClientFilter from 'k2/app/modules/installation/filters/ClientFilter';
import I18n from 'i18n-js';

/**
 * On selected billing site callback
 *
 * @callback selectBillingSite.onSelectedSite
 * @param {Site} selectedSite
 * @see {selectBillingSite}
 */

/**
 * Client/Site pipe selection for a billing site in the context of an intervention report.
 * @param {selectBillingSite.onSelectedSite} onSelectedSite
 */
export default function selectBillingSite(onSelectedSite) {
  const title = I18n.t('scenes.intervention_report.billing_site.title');
  // Select client:
  navigate(PIPE_CLIENT_SELECTION, {
    title,
    filter: ClientFilter.WITH_SITE,
    // Select site:
    next: () => {
      navigate(PIPE_SITE_SELECTION, {
        title,
        filter: null,
        // On selected site:
        next: ({ selectedSite }) => {
          onSelectedSite(selectedSite);
          pop(2); // back to sum up
        },
      });
    },
  });
}
