const request = require('request');

const fetchMyIP = function(callback) {
  const apiUrl = 'https://geo.ipify.org/api/v2/country,city?apiKey=at_QZfcHYLqdNEflzl0gbgvfYMY1ChoZ&ipAddress=';

  request(apiUrl, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    } else if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
    } else {
      const ip = JSON.parse(body)["ip"];
      callback(null, ip);
    }
  });
};

const fetchCoordsByIP  = function(ip, callback) {
  const apiUrl = ` http://ipwho.is/${ip}`;
  request(apiUrl, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    const parsedBody = JSON.parse(body);
    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    } else {
      const latitude = JSON.parse(body)['latitude'];
      const longitude = JSON.parse(body)['longitude'];
      callback(null, {lat: latitude, lon: longitude});
    }
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const apiUrl = `https://iss-flyover.herokuapp.com/json/?lat=${coords.lat}&lon=${coords.lon}`;
  request(apiUrl, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }
    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
    }
    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        callback(error, null);
      }
      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          callback(error, null);
        }
        callback(null, nextPasses);
        });
      });
    });
  };



module.exports = {
  fetchCoordsByIP,
  fetchMyIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};