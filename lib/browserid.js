// a function to verify an assertion.  arguments:
//   audience: the origin of the calling site (to whom assertions should
//             be targeted, e.g. 'https://mysite.com')
//   assertion: the assertion returned from navigator.id.getVerifiedEmail()
module.exports = function(args, cb) {
  if (typeof cb !== 'function') throw "missing required callback argument";

  if (typeof args !== 'object' ||
      typeof args.audience !== 'string' ||
      typeof args.assertion !== 'string')
  {
    setTimeout(function() { cb('missing required arguments'); }, 0);
    return;
  }
  
  setTimeout(function() { cb('not yet implemented'); }, 0);  
};
