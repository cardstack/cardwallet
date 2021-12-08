export const parseMessageRequestJson = (displayDetails: any) => {
  let msg = displayDetails.request;

  try {
    msg = JSON.parse(msg);
  } catch (e) {}

  return JSON.stringify(msg, null, 4);
};
