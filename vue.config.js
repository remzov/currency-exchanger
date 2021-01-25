module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/assets/styles/variables.scss";
          @import "@/assets/styles/mixins.scss";
        `
      }
    }
  }
};