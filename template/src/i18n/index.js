import Vue from "vue";
import VueI18n from "vue-i18n";
import messages from "./languages.js";
console.log(messages);
Vue.use(VueI18n);
// 支持的语言列表
const languages = ["en"];

let lang = navigator.language || navigator.userLanguage;
lang = lang.substr(0, 2); //截取lang前2位字符

if (languages.indexOf(lang) < 0) {
  lang = "en";
}

// langArr 配置多语言的语言简写数组
const i18n = new VueI18n({
  locale: lang, // set locale messages
  messages
});

export default i18n;
