const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const dump_file = new FileSync('db/50tons/dump.json');
const ids_file = new FileSync('db/50tons/ids.json');
const notfilled_file = new FileSync('db/50tons/notfilled.json');
const dumb = low(dump_file);
const ids = low(ids_file);
const notfilled = low(notfilled_file);

const dumb_conversations = dumb.get('conversations').value();
const ids_conversations = ids.get('conversations').value();
const notfilled_conversations = notfilled.get('conversations').value();

// check how many is filled
function how_many_is_filled(conversations){
  let loaded = 0;
  for (let index = 0; index < conversations.length; index++) {
    const element = conversations[index];
    if(element.messages_loaded){
      loaded ++;
    }
  }
  return loaded;
}

// fecth not filled with ids not in dump
function fecthNotFilled(){
  let not_filled = [];
  for (let index = 0; index < ids_conversations.length; index++) {
    const conversation = ids_conversations[index];
    let el = dumb.get('conversations').find({id: conversation.id}).value();
    if(typeof el === 'undefined'){
      not_filled.push(conversation);
      console.log(`+ ${conversation.id} pushed to not filled`);
    }
  }
  notfilled.assign({'conversations':not_filled}).write();
}

// dump filled itens from notfilled
function dumpNotFilled(){
  for (let index = 0; index < notfilled_conversations.length; index++) {
    const conversation = notfilled_conversations[index];
    let el = dumb.get('conversations').find({id: conversation.id}).value();
    if(typeof el === 'undefined'){
      if(conversation.messages_loaded){
        dumb_conversations.push(conversation);
        console.log(`+ ${conversation.id} pushed cause is now filled`);
      }
    }
  }
  dumb.assign({'conversations':dumb_conversations}).write();
}


console.log(dumb_conversations.length);
console.log(ids_conversations.length);
// fecthNotFilled();
// console.log(how_many_is_filled(dumb_conversations));
// dumpNotFilled();
