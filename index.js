const { nextISSTimesForMyLocation } = require('./iss');


const printPassTimes = function(passTimes) {
  for (const item of passTimes){
    const date = new Date(0);
    date.setUTCSeconds(item.risetime);
    console.log(`Next pass at ${date} for ${item.duration} seconds!`);
  }
}

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});

module.exports = {
  printPassTimes
}