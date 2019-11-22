import request from "../common/js/request.js";
const test = params => {
  return request.get("/test", {
    params: params
  });
};
export default test;
