const requestCounts = {};

const countRequests = (req, res, next) => {
   const route = req.path;
   requestCounts[route] = (requestCounts[route] || 0) + 1;

   console.log(requestCounts);

   let totalRequests = 0;

   for (let req of Object.values(requestCounts)) {
      totalRequests += req;
   }

   console.log("Total requests: ", totalRequests);

   next();
};

module.exports = countRequests;
