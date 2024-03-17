export const doLogout = async function (isAdminUser, doBrb, getAuth, signOut, router) {
  if (!isAdminUser.value) {
    await doBrb();
    const auth = await getAuth();
    await signOut(auth);
    router.push("/");
  }
};
