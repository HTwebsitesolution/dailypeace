const messages = require('./assets/rotations/messages.json');
const today = new Date();
const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
const reflectionIndex = dayOfYear % messages.length;
const reflection = messages[reflectionIndex];

console.log('📅 Today\'s Daily Reflection (Day ' + dayOfYear + '):');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('ID:', reflection.id);
console.log('Category:', reflection.category);
console.log('');
console.log('Text:');
console.log('"' + reflection.text + '"');
console.log('');
console.log('Verses:', reflection.verses.join(', '));
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('This message should now appear prominently at the top of the ChatScreen!');