module.exports = {
  apps: [
    {
      name: '@ohbug-server/manager',
      script: 'dist/src/main.js',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
