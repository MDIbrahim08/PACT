import fs from 'fs';

// Node 24 Windows compatibility shim: map EISDIR to EINVAL for fs.readlink on non-symlinks
const origReadlink = fs.readlink;
fs.readlink = function (path, opt, cb) {
  if (typeof opt === 'function') {
    cb = opt;
    opt = {};
  }
  return origReadlink.call(fs, path, opt, (err, linkString) => {
    if (err && (err.code === 'EINVAL' || err.code === 'EISDIR')) {
      const e = new Error(err.message);
      e.code = 'EINVAL';
      return cb(e);
    }
    if (cb) cb(err, linkString);
  });
};

const origReadlinkSync = fs.readlinkSync;
fs.readlinkSync = function (path, opt) {
  try {
    return origReadlinkSync.call(fs, path, opt);
  } catch (err) {
    if (err && (err.code === 'EINVAL' || err.code === 'EISDIR')) {
      const e = new Error(err.message);
      e.code = 'EINVAL';
      throw e;
    }
    throw err;
  }
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        // Apply institutional security headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(self), geolocation=()',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
