exports.run = (inv, message, args) => {

const Init = require('aq3d');
const aq3d = new Init();
aq3d.character('0x53')
  .then(console.log);
  }
