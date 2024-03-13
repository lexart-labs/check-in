export async function doCheckInIfJustLoggedIn(doCheckIn) {
  try {
    if (sessionStorage.getItem('justLoggedIn') === 'true') {
      sessionStorage.removeItem('justLoggedIn');
      await doCheckIn()
    }
  } catch (error) {
    console.error("Error in doCheckIn: ", error);
  }
}

export function setFlagJustLoggedIn() {
  sessionStorage.setItem('justLoggedIn', 'true');
}
