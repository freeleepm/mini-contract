let baseUrl = '';
let imgUrl = '';
// 开发环境
if (process.env.NODE_ENV === 'development') {
  // baseUrl = 'http://192.168.101.168:8763';
  // imgUrl = 'http://192.168.101.168:9090/r/';
  baseUrl = 'localhost';
  imgUrl = 'localhost';
}
// 生产环境
if (process.env.NODE_ENV === 'production') {
  baseUrl = 'localhost';
  imgUrl = 'localhost';
}

export default {
  baseUrl,
  imgUrl,
};
