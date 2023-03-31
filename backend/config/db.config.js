/*
I created a separate database config file to makes it easier to update the  application's database connection settings.
When the settings need to be changed, I  only need to update the configuration file instead of editing multiple files.
*/
module.exports = {
  url: "mongodb+srv://manal:manal123@cluster0.nnnj3ty.mongodb.net/FlexIS?retryWrites=true&w=majority" 

};
