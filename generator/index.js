module.exports = (api, options, rootOptions) => {
  // 复制并用 ejs 渲染 `./template` 内所有的文件
  api.render('../template')
  // 修改 `package.json` 里的字段
  api.extendPackage({
    dependencies: {
      "axios": "^0.19.0",
      "core-js": "^3.4.0",
      "regenerator-runtime": "^0.13.3",
      'vue-router': '^3.0.3',
      'vuex': '^3.1.0',
      'normalize.css': '^8.0.1',
      "vue-i18n": "^8.15.0"
    },
    devDependencies: {
      "npm-run-all": "^4.1.5",
      "prettier": "^1.18.2",
    },
    "scripts": {
      "serve": "vue-cli-service serve",
      "build": "npm-run-all build:client build:online",
      "build:dev": "npm-run-all build:dev:client build:online",
      "build:dev:client": "vue-cli-service build --mode development --client",
      "build:dev:server": "vue-cli-service build --mode development --server",
      "build:server": "vue-cli-service build --server",
      "build:client": "vue-cli-service build --client",
      "build:online": "vue-cli-service build --mode online",
      "lint": "vue-cli-service lint"
    }
  })

  if (options['ui-framework'] === 'element-ui') {
    api.extendPackage({
      dependencies: {
        'element-ui': '^2.4.5'
      }
    })
  }
}