const axios = require('axios');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const notfilled_file = new FileSync('db/notfilled.json');
const notfilled = low(notfilled_file);

const chat_ids_all = notfilled.get('conversations').value();

let chat_ids = [];
for (let index = 0; index < chat_ids_all.length; index++) {
  const element = chat_ids_all[index];
  if(!element.messages_loaded){
    chat_ids.push(element);
  }
}


let chat_next = [0,1,2,3,4,5,6,7,8,9,10,
                 10,11,12,13,14,15,16,17,18,19,
                 20,21,22,23,24,25,26,27,28,29];
let total = chat_ids.length;

for (let index = 0; index < chat_next.length; index++) {
  let next = chat_next[index];
  loadMessages(chat_ids[next].id, next, function (result, next){
    end_turn(result, next);
  });
}

function save(result, next){
  let id = chat_ids[next].id;
  notfilled.get('conversations').find({id: id}).assign({ messages_loaded: true, messages: messages_to_simple(result)}).write();
  console.log(`${parseInt(100*next/total, 10)}% - saving messages for ${id}`);
}


function message_to_simple(message){
  return {
    'id':message.id,
    'message':message.message,
    'from': message.from.name,
    'created_time': message.created_time
  }
}

function messages_to_simple(messages){
  let new_messages = [];
  for (let index = 0; index < messages.length; index++) {
    const element = messages[index];
    new_messages.push(message_to_simple(element));
  }
  return new_messages;
}

function end_turn(result, next){
  save(result, next);
  next += 25;
  if(next < chat_ids.length){
    loadMessages(chat_ids[next].id, next, function (result, next){
      end_turn(result, next);
    });
  }
}

function loadMessages(conversation_id, index, callback){
  let page_token = '<PAGE_TOKEN>';
  let url = `https://graph.facebook.com/v3.1/${conversation_id}/messages?access_token=${page_token}&fields=to,message,from,created_time`;
  axios.get(url)
  .then(function (response) {
    callback(response.data.data, index);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });
}

