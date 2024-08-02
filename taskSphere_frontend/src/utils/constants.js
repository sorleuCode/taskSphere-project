let apiRoot = ''

if (import.meta.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:3500'
}

if (import.meta.env.BUILD_MODE === 'production') {
  // Lưu ý: Đây là domain ví dụ sau khi Deploy Production (xem video 75 và video 76 để hiểu rõ kiến thức phần này, còn hiện tại mình đã xóa domain này rồi, đừng cố truy cập làm gì =))
  apiRoot = 'https://trello-api-0gbu.onrender.com'
}
// console.log('🚀 ~ file: constants.js:7 ~ apiRoot:', apiRoot)
export const API_ROOT = apiRoot
