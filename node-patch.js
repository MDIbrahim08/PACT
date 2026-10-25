const fs = require('fs');

function patch(target) {
  if (!target) return;
  
  if (target.readlinkSync) {
    const origSync = target.readlinkSync;
    target.readlinkSync = function (...args) {
      try {
        return origSync.apply(this, args);
      } catch (err) {
        if (err && (err.code === 'EINVAL' || err.code === 'EISDIR')) {
          const e = new Error(err.message);
          e.code = 'EINVAL';
          throw e;
        }
        throw err;
      }
    };
  }

  if (target.readlink) {
    const origAsync = target.readlink;
    target.readlink = function (...args) {
      const cb = typeof args[args.length - 1] === 'function' ? args.pop() : null;
      if (cb) {
        return origAsync.call(this, ...args, (err, link) => {
          if (err && (err.code === 'EINVAL' || err.code === 'EISDIR')) {
            const e = new Error(err.message);
            e.code = 'EINVAL';
            return cb(e, link);
          }
          return cb(err, link);
        });
      }
      // If returning promise
      const p = origAsync.apply(this, args);
      if (p && typeof p.then === 'function') {
        return p.catch((err) => {
          if (err && (err.code === 'EINVAL' || err.code === 'EISDIR')) {
            const e = new Error(err.message);
            e.code = 'EINVAL';
            throw e;
          }
          throw err;
        });
      }
      return p;
    };
  }
}

patch(fs);
if (fs.promises) patch(fs.promises);
try {
  const gfs = require('graceful-fs');
  patch(gfs);
  if (gfs.promises) patch(gfs.promises);
} catch (e) {}

console.log('[Pact Node 24 Patch]: Applied fs.readlink EISDIR -> EINVAL compatibility fix');
