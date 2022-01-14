import { orderBy, filter, includes, indexOf } from 'lodash';
import { IncidentType } from '@cardstack/types';

const order = ['critical', 'major', 'minor', 'none'];

export const filterIncident = (
  incidents: IncidentType[]
): IncidentType | null => {
  if (incidents?.length === 0) {
    return null;
  }

  const highestImpactPresent = orderBy(incidents, ({ impact }) =>
    indexOf(order, impact)
  )[0].impact;

  const filtered = filter(incidents, ['impact', highestImpactPresent]);

  const incident = orderBy(filtered, 'started_at', 'desc')[0];
  if (!includes(order, incident.impact)) return null;

  return incident;
};
