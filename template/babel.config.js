module.exports = {
  presets: [
    [
      "@vue/app",
      {
        useBuiltIns: "entry",
        polyfills: [
          "es.array.flat",
          "es.array.flat-map",
          "es.array.unscopables.flat ",
          "es.array.unscopables.flat-map"
        ]
      }
    ]
  ]
};
