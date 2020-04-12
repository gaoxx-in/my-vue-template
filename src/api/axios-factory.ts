import qs from 'qs'
import axios from 'axios'
let escape = window.escape

axios.defaults.baseURL = 'zhfw'

// 处理中文传参
let reg = /^[\u0391-\uFFE5%]+$/
axios.interceptors.request.use((request) => {
  if (request.method === 'get') {
    let pid = window.sessionStorage.getItem('platformId') || ''
    request.params['platformId'] = pid
  }
  if (request.data && request.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
    request.data = qs.stringify(request.data, { allowDots: true })
  }
  if (request.method === 'get' && request.params) {
    let params = request.params
    for (let key in params) {
      let value = params[key]
      if (typeof value === 'string') {
        let newS = ''
        for (let i = 0; i < value.length; i++) {
          if (request.url !== '/v3/geocode/geo' && reg.test(value.charAt(i))) {
            newS += escape(value.charAt(i))
          }
          else {
            newS += value.charAt(i)
          }
        }
        params[key] = newS
      }
      params['_app_encoding_tag_'] = 1
    }
  }
  return request
})

// 处理token
export function init ({ token = '' }) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// method
export function axiosFactory ({ method, url, params, data }) {
  return new Promise((resolve, reject) => {
    axios({
      method,
      url,
      params, // 不能在这里直接设置headers，会覆盖Authorization
      data
    }).then(({ data }) => {
      if (data.hasOwnProperty('success')) {
        data.success ? resolve(data.data) : reject(data)
      }
      else {
        data.status ? resolve(data) : reject(data.info)
      }
    }, (err) => {
      reject(err)
    }).catch((err) => {
      reject(err)
    })
  })
}

// method: post
export function axiosPostFactory ({url, data}) {
  axios.defaults.baseURL = window.CONTEXT || 'zhfw'
  data.platformId = window.sessionStorage.getItem('platformId') || ''
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url,
      data,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    })
    .then(({ data }) => {
      if (data.success) {
        if (data.data) {
          if (data.data.msg) { // 将成功消息也返回
            data.data.msg = data.msg
          }
          resolve(data.data)
        }
        else {
          resolve(data) // post可能只有成功，没有消息
        }
      }
      else {
        reject(data)
      }
    })
    .catch((error) => {
      reject(error)
    })
  })
}
// method: post上传文件
export function axiosPostUploadFactory ({url, data}) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url,
      data,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(({ data }) => {
      if (data.success) {
        if (data.data) {
          if (data.data.msg) { // 将成功消息也返回
            data.data.msg = data.msg
          }
          resolve(data.data)
        }
        else {
          resolve(data) // post可能只有成功，没有消息
        }
      }
      else {
        reject(data)
      }
    })
    .catch((error) => {
      reject(error)
    })
  })
}
