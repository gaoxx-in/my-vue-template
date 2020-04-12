module.exports = {
  /** 区分打包环境与开发环境
   * process.env.NODE_ENV==='production'  (打包环境)
   * process.env.NODE_ENV==='development' (开发环境)
   * baseUrl: process.env.NODE_ENV==='production'?"https://cdn.didabisai.com/front/":'front/',
   */

  // 部署应用包时的基本url - 这个值也可以被设置为空字符串 ('') 或是相对路径 ('./')

  publicPath: "/", // vue-cli3.3+ 版本使用

  // build时生产环境构建文件的目录

  outputDir: "dist",

  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: "static",

  // 指定生成的 index.html 的输出路径 (相对于 outputDir)。也可以是一个绝对路径
  indexPath: "index.html",

  // 默认生成的静态资源在它们的文件名中包含了 hash 以便控制缓存
  filenameHashing: true,

  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码（在生产构建时禁用）
  lintOnSave: process.env.NODE_ENV !== "production",

  // 是否使用带有浏览器内编译器的完整构建版本
  runtimeCompiler: false,

  // babel-loader默认会跳过`node_modules`依赖。通过这个选项可以显式转译依赖
  transpileDependencies: [
    /* string or regex */
  ],

  // 不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  productionSourceMap: false,

  // 设置生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性(仅影响在构建时注入的标签)
  crossorigin: "",

  // 在生成的 HTML 中的 <link rel="stylesheet"> 和 <script> 标签上启用 Subresource Integrity (SRI)(仅影响在构建时注入的标签)
  integrity: false,

  // webpack 配置 [obj | Func]
  configureWebpack: {},

  // 允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: config => {
    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap(options => Object.assign(options, { limit: 10240 })); // 限制设置为 10k, 注意如果是/开头的绝对路径图片会被保留不变，@默认指向src
  },

  css: {
    /**
     * 默认情况下，只有 *.module.[ext] 结尾的文件才会被视作 CSS Modules 模块。
     * 设置为 false 后你就可以去掉文件名中的 .module 并将所有的 *.(css|scss|sass|less|styl(us)?) 文件视为 CSS Modules 模块。
     */
    requireModuleExtension: false,

    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v7 中，这个选项名是 "data"
        prependData: `@import "~@/variables.sass"`
      },
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `data` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置
      scss: {
        prependData: `@import "~@/variables.scss";`
      },
      // 给 less-loader 传递 Less.js 相关选项
      less: {
        // http://lesscss.org/usage/#less-options-strict-units `Global Variables`
        // `primary` is global variables fields name
        globalVars: {
          primary: "#fff"
        }
      }
    }
  },

  /**
   * 是否为 Babel 或 TypeScript 使用 thread-loader。
   * 该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
   */
  parallel: require("os").cpus().length > 1,

  // PWA 插件相关配置
  pwa: {},

  // configure webpack-dev-server behavior
  devServer: {
    host: "0.0.0.0",
    port: 8080,
    open: true,
    headers: {}, // 在所有响应中添加首部内容
    proxy: {
      "/context": {
        target: "http://www.4yec.com", // target host
        headers: {
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
        },
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          "^/conetxt": "/mock/203"
        }
      }
    }
  },

  // 第三方插件配置
  pluginOptions: {
    // ...
  }
};
