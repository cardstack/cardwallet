import { getRequestDisplayDetails } from '@cardstack/parsers/signing-requests';

export const parseMessageRequestJson = (
  displayDetails: ReturnType<typeof getRequestDisplayDetails>
) => {
  let msg = displayDetails.request;

  try {
    msg = JSON.parse(msg);
  } catch (e) {}

  return JSON.stringify(msg, null, 4);
};
