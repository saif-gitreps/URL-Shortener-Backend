function sanitizeInput(obj) {
   for (let key in obj) {
      if (typeof obj[key] === "string") {
         obj[key] = obj[key].replace(/[&<>"']/g, function (m) {
            return {
               "&": "&amp;",
               "<": "&lt;",
               ">": "&gt;",
               '"': "&quot;",
               "'": "&#39;",
            }[m];
         });
      } else if (typeof obj[key] === "object") {
         sanitizeInput(obj[key]);
      }
   }
   return obj;
}

module.exports = sanitizeInput;
