const TABLE_NAME_CHANGED_CHECKIN ='changedCheckin'

export async function sendReason(user,reason,db,firebaseFunctions){
    const {getCurrentUser,collection,getDocs,doc,setDoc,addDoc} = firebaseFunctions
    const adm = await getCurrentUser()
    const docRef = collection(db,TABLE_NAME_CHANGED_CHECKIN)
    const docSnap = await getDocs(docRef);
    let exist = false;
    let docId = null;
    docSnap.docs.forEach((i)=>{
      let item = i.data()
      if(item.devEmail===user.email){
        exist = true
        docId = i.id
      }
    })
    const newDoc = {
      date: +new Date(),
      admEmail:adm.email,
      admName:adm.displayName,
      devName:user.name,
      devEmail:user.email,
      reason:reason,
      _rawDate: new Date()
    }
    if(exist){
      const docUser = doc(db,TABLE_NAME_CHANGED_CHECKIN,docId)
      await setDoc(docUser, {...newDoc});
    }else{
      await addDoc(collection(db,TABLE_NAME_CHANGED_CHECKIN),{...newDoc})

    }
}

export async function statusChanged(user,TABLE_NAME,db,firebaseFunctions){
    const {doc,setDoc} = firebaseFunctions
    const docRef  = doc(db, TABLE_NAME, user.docId)
    await setDoc(docRef, {
    date: +new Date(),
    email: user.email,
    isOtpValid: true,
    tenant: 'lexart',
    timeBrb: user.isCheckIn? +new Date():null,
    timeCheckin:  user.isCheckIn? null:+new Date(),
    username: user.name,
    _rawDate: new Date()
    });
}

