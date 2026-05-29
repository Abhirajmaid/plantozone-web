module.exports = ({ env }) => {
  const provider = env('UPLOAD_PROVIDER', '');
  const cloudName = env('CLOUDINARY_NAME');
  const apiKey = env('CLOUDINARY_KEY');
  const apiSecret = env('CLOUDINARY_SECRET');
  const isDev = env('NODE_ENV', 'development') === 'development';

  // Use local disk in development (or when UPLOAD_PROVIDER=local).
  // Cloudinary is only used in production when credentials are set and provider is not forced to local.
  const useLocal =
    provider === 'local' ||
    (provider !== 'cloudinary' && isDev);

  if (useLocal || !cloudName || !apiKey || !apiSecret) {
    return {};
  }

  return {
    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: cloudName,
          api_key: apiKey,
          api_secret: apiSecret,
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
          delete: {},
        },
      },
    },
  };
};
