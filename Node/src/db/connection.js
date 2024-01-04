const mongoose = require('mongoose');
const uri = "mongodb+srv://medhelp:Helloworld5*@cluster0.z9fip.mongodb.net/Medhelp?retryWrites=true&w=majority";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('DB connected');
});
