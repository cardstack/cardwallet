import { orderBy, filter, includes, indexOf } from 'lodash';
import { IncidentType } from '@cardstack/types';

const order = ['critical', 'major', 'minor', 'maintenance', 'none'];

export const filterIncident = (
  incidents: IncidentType[]
): IncidentType | null => {
  const validIncidents = filter(incidents, incident =>
    includes(order, incident.impact)
  );

  if (validIncidents?.length === 0) {
    return null;
  }

  const highestImpactPresent = orderBy(validIncidents, ({ impact }) =>
    indexOf(order, impact)
  )[0].impact;

  const filtered = filter(validIncidents, ['impact', highestImpactPresent]);

  const incident = orderBy(filtered, 'started_at', 'desc')[0];
  if (!includes(order, incident.impact)) return null;

  return incident;
};
