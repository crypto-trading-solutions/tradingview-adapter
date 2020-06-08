module.exports = {
    apps: [
      {
        name: "trading-view-adapter",
        script: "./index.js",
        exec_mode: "cluster",
        watch: true,
        instances: "max",
        ignore_watch: ["node_modules"],
        env: {
          NODE_ENV: "development"
        },
        env_production: {
          PORT: 80,
          NODE_ENV: "production"
        }
      }
    ]
  };