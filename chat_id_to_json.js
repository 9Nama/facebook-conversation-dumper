const axios = require('axios');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const ids_file = new FileSync('db/50tons/ids.json');
const ids = low(ids_file);

let page_id = '<PAGE_ID>';
let page_token = '<PAGE_TOKEN>';
let url = `https://graph.facebook.com/v3.1/${page_id}/conversations?access_token=${page_token}&fields=id,updated_time,message_count`


function loadChats(url){
     axios.get(url)
    .then(function (response) {
      // handle success
      let conversations = ids.get('conversations').value();
      for (let index = 0; index < response.data.data.length; index++) {
          const element = response.data.data[index];
          conversations.push(element);
          console.log(`save conversation : ${element.id}` );
      }
      ids.assign({'conversations':conversations}).write();
      if(typeof response.data.paging.next !== 'undefined'){
        loadChats(response.data.paging.next);
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    });
}

loadChats(url);