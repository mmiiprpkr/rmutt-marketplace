module.exports = {
   apps: {
      name: "rmutt-community-marketplace",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      port: 3000,
      watch: false,
      max_memory_restart: "1G",
   }
};