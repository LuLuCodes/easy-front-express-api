# easy-front-express-api

<a name="O8p0G"></a>
# 一、概述
easy-front-express-api是基于nodejs和express的api接口框架模板，作用于为前端页面提供数据接口。

<a name="xlIgq"></a>
# 二、特点
<a name="Z9rdm"></a>
## 1、安全性：

1. 使用hmet中间件，解决常规的网络安全问题：
  - [csp](https://github.com/helmetjs/csp) 用于设置 `Content-Security-Policy` 头，帮助抵御跨站点脚本编制攻击和其他跨站点注入攻击。
  - [hidePoweredBy](https://github.com/helmetjs/hide-powered-by) 用于移除 `X-Powered-By` 头。
  - [hpkp](https://github.com/helmetjs/hpkp) 用于添加[公用密钥固定](https://developer.mozilla.org/en-US/docs/Web/Security/Public_Key_Pinning)头，防止以伪造证书进行的中间人攻击。
  - [hsts](https://github.com/helmetjs/hsts) 用于设置 `Strict-Transport-Security` 头，实施安全的服务器连接 (HTTP over SSL/TLS)。
  - [ieNoOpen](https://github.com/helmetjs/ienoopen) 用于为 IE8+ 设置 `X-Download-Options`。
  - [noCache](https://github.com/helmetjs/nocache) 用于设置 `Cache-Control` 和 Pragma 头，以禁用客户端高速缓存。
  - [noSniff](https://github.com/helmetjs/dont-sniff-mimetype) 用于设置 `X-Content-Type-Options`，以防止攻击者以 MIME 方式嗅探浏览器发出的响应中声明的 content-type。
  - [frameguard](https://github.com/helmetjs/frameguard) 用于设置 `X-Frame-Options` 头，提供 [clickjacking](https://www.owasp.org/index.php/Clickjacking) 保护。
  - [xssFilter](https://github.com/helmetjs/x-xss-protection) 用于设置 `X-XSS-Protection`，在最新的 Web 浏览器中启用跨站点脚本编制 (XSS) 过滤器。
2. 使用jw-token，对接口进行统一鉴权
2. 使用cors中间件，支持跨域，并对跨域头进行合法校验
2. 前后端数据通讯使用rsa非对称加密

<a name="6cnSi"></a>
## 2、易用性：
1、支持es6语法，比如import和export、async等<br />2、全新的log输出方式<br />3、环境变量集中配置<br />4、集成热更新，开发过程中修改代码，无需重启服务


<a name="W4Sdy"></a>
# 三、使用
<a name="tnxSp"></a>
## 1、目录结构介绍：
![image.png](https://cdn.nlark.com/yuque/0/2019/png/146103/1559205767570-8e1a50d9-0d59-4641-924a-c92fcfa1f979.png#align=left&display=inline&height=505&name=image.png&originHeight=509&originWidth=256&size=31847&status=done&width=254)

```
.vscode  // vscode开发配置文件，需自建，详情内容请看下文
dist  // 编译后的可执行文件均在此处
src  // 源码文件目录
 |--config // 配置文件夹，后端通讯、跨域、日志、session各个配置项均在此处
 |--libs  // 公共库文件夹，所有公共方法和第三库均放在此处
 |--middleware  // 中间件，所有中间件均放此处
 |--public  // 静态资源文件夹，暂无用处，忽略
 |--routers  // 路由文件夹
 |--utils  // 暂无用处，忽略
 |--views  // 页面文件夹，前后端分离无需用到，忽略
 |--app.js  // express启动文件
 |--env.js  // 环境变量加载方法文件
 |--index.js  // 程序入口文件
 |--log.js  // 日志方法文件
.babelrc  // babel配置文件
.env // 环境变量配置文件
.eslintrc  // eslint语法检查配置文件
.gitignore  // git忽略文件
package.json  // npm包文件
README.md
rsa-generator.js  // rsa秘钥生成器
```

<a name="8m96G"></a>
## 2、.env环境变量配置
1、环境变量集中配置在.env文件中，如下：<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/146103/1559207180284-63bc0942-ca59-4e18-be92-7d1b33dd9dbc.png#align=left&display=inline&height=330&name=image.png&originHeight=330&originWidth=603&size=44266&status=done&width=603)

2、所有配置在.env的环境变量，均可在其他代码中加上process.env.直接使用，如下：<br />![image.png](https://cdn.nlark.com/yuque/0/2019/png/146103/1559207297304-c3b8e254-6e34-46cf-b01c-330ed7896608.png#align=left&display=inline&height=274&name=image.png&originHeight=274&originWidth=716&size=74375&status=done&width=716)

3、在生产环境中，切记将.env中的NODE_ENV改成production，改环境变量不可删除

<a name="iJIfH"></a>
## 3、config程序配置项
1、config/cloud-config.js  api与云端的通讯配置文件<br />2、config/cors-config.js 跨域配置项，可设置跨域头以及跨域白名单，当NODE_ENV=debug时自动关闭跨域限制<br />3、config/log-config.js 日志配置项，可设置日志存放目录和日志文件名格式，一般不建议修改<br />4、config/session-config.js session配置项，包含redis配置和key等信息

<a name="aIoDn"></a>
## 4、libs公共方法库
1、libs下的cloud-log.js、cloud-req-generator.js、cloud-request.js分别是云端通讯日志库、云端请求参数生成器和云端通讯库，原则上不需要修改<br />2、libs下的common.js是公用函数库，可以根据业务需求修改

<a name="SR9mW"></a>
## 5、middleware中间件
1、auth.js是接口授权中间件，可自行在此处添加接口白名单<br />2、cloud-global.js是云端全局数据加载中间件，在api启动的时候一次性加载云端全局配置

<a name="lUtjV"></a>
## 6、数据通讯解密验签
后端会对前端的请求数据进行解密验签，目前只针对post请求

1、创建rsa秘钥

```shell
node rsa-generator.js
# 将在/src/pem目录下创建public.pem和private.pem，分别是公钥和私钥，公钥给前端加密，私钥给后端解密
```

2、是否启用加密
在.env中设置`APP_ENABLE_SIGN = '1'`

3、解密和验签过程，如下：
```
// 验证签名
app.post('*', async (req, res, next) => {
  if (!process.env.APP_ENABLE_SIGN) {
    next();
    return;
  }
  if (!req.body.S) {
    res.status(403);
    res.json({
      message: '缺少签名参数',
      error: {}
    });
    return;
  }
  if (!checkSign(req)) {
    res.status(403);
    res.json({
      message: '非法签名参数',
      error: {}
    });
    return;
  }

  next();
});
```

```
// 解密和验签算法
export function checkSign(req) {
  const privateKey = new NodeRSA(privatePem);
  privateKey.setOptions({ encryptionScheme: 'pkcs1' });

  let req_sign = req.body.S;
  req_sign = privateKey.decrypt(req_sign, 'utf8');
  
  delete req.body.S;
  let sign = JSON.stringify(req.body);
  sign = crypto
    .createHash('md5')
    .update(sign, 'utf8')
    .digest('hex')
    .toUpperCase();

  return req_sign === sign;
}
```

<a name="hqBzp"></a>
# 四、发布
1、运行npm run build后，会在项目根目录产生一个dist目录<br />2、运行pm2 start dist/index.js -i 4 --name="expess-api"后，就可以以pm2模式运行程序

<a name="c6xRC"></a>
# 五、VSCode开发配置
新建vscode开发配置项launch.json，内容如下：

```json
{
  // 使用 IntelliSense 了解相关属性。 
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
            "request": "launch",
            "name": "启动程序",
            "program": "${workspaceFolder}/src/index.js",
            "runtimeExecutable": "${workspaceFolder}/node_modules/.bin/babel-node"
    }
  ]
}
```

