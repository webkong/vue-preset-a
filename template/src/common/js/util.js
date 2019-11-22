/**
 * 获取当前url指定参数值
 * @param name 参数名
 * @returns {string}
 */
const getUrlParam = name => {
  const u = window.location.search,
    reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"),
    r = u.substr(u.indexOf("?") + 1).match(reg);
  return r != null ? r[2] : "";
};
/**
 * 格式化文件大小
 * @param fileSize 文件大小（单位bytes）
 * @returns {string}
 */
const getFileSize = fileSize => {
  if (fileSize < 1024) {
    return fileSize + "B";
  } else if (fileSize < 1024 * 1024) {
    let temp = fileSize / 1024;
    temp = temp.toFixed(2);
    return temp + "KB";
  } else if (fileSize < 1024 * 1024 * 1024) {
    let temp = fileSize / (1024 * 1024);
    temp = temp.toFixed(2);
    return temp + "MB";
  } else {
    let temp = fileSize / (1024 * 1024 * 1024);
    temp = temp.toFixed(2);
    return temp + "GB";
  }
};
/**
 * 获取文件类型（项目类型）：contact/app/photo/music/video/file
 * @param type
 * @returns {string}
 */
const getMetaDataType = type => {
  if (!type) {
    return "file";
  }
  if (type.includes("video")) {
    return "video";
  } else if (type.includes("audio")) {
    return "music";
  } else if (type.includes("image")) {
    return "photo";
  } else if (type.includes("apk") || type.includes("package")) {
    //FIXME:  2019-11-15 16:03:49 因为app类型，需要上传app包名和appCode客户端才可以正确当成一个apk，所以，将app当成file上传
    return "file";
  } else {
    return "file";
  }
};
const getNameFormat = name => {
  const arr = name.split(".");
  let obj = {
    name: "",
    format: ""
  };
  obj.name = arr[0] || "";
  obj.format = arr[arr.length - 1] || "";
  return obj;
};
export { getUrlParam, getFileSize, getMetaDataType, getNameFormat };
