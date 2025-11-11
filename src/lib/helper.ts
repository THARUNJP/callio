export const getMicroPhone = async (): Promise<boolean> => {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    return true;
  } catch (err) {
    return false;
  }
};
// need to chenge it as permission API