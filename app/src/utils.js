import { db } from "./main";
import { collection, getDocs } from "firebase/firestore";
import lodash from 'lodash';

const utils = {
    isToday: function (date) {
        const today = new Date();
        if (today.toDateString() === date.toDateString()) {
          return true;
        }
        return false;
    },
    /*
        FILTER_OBJECT: {
            uniqueProp: // the property to filter of,
            condChain: (INSIDE, OUTSIDE) {
                return // boolean
            }
        }
    */
    activeUsersToday: async function (TABLE_NAME, FILTER_OBJECT, OUTSIDE){
        const docRef = collection(db, TABLE_NAME);
        const docSnap = await getDocs(docRef);
        let items = []
        const itemsNew = []
    
        docSnap.docs.map( doc => {
          let item = doc.data()
          if(utils.isToday(new Date(item.date)) && FILTER_OBJECT.condChain(item, OUTSIDE) ){
            item.isCheckIn = item.timeBrb === null ? true : false
            item.name      = item.username
            itemsNew.push({
              name: item.username,
              isCheckIn: item.isCheckIn,
              brb: item.timeBrb !== null ? new Date(item.timeBrb) : 'N/A',
              checkin: item.timeCheckin !== null ? new Date(item.timeCheckin) : 'N/A',
              email: item.email,
              date: item.date,
              docId: doc.id
            })
          }
        })
        // Filter 
        itemsNew.sort( (a, b) => new Date(b.date) - new Date(a.date) )
    
        items = lodash.uniqBy(itemsNew, FILTER_OBJECT.uniqueProp)
        return {users: items, count: items.length}
    },
    clearIntervallAll: function (){
      for (let i = 1; i < 99999; i++) {
        window.clearInterval(i);
      }
      console.log("top: ", top, "clear ticker")
    }
}
export default utils;