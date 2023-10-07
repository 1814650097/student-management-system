// axios 公共配置
// 基地址
axios.defaults.baseURL='http://geek.itheima.net'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    token && (config.headers.Authorization=`Bearer ${token}`)

  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加相应拦截器
axios.interceptors.request.use(function (responese) {
  // 2xx 范围内的状态码都会触发该函数
  // 对响应数据做点什么 ,例如：直接返回服务器的相应结果
  const result=responese.data
  return responese
}, function (error) { 
  // 对请求错误做些什么
  if(error?.responese?.status===401){
    localStorage.clear()
    location.href='../login/index.html'
  }
  return Promise.reject(error)
})