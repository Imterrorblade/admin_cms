## Info 11
## 安吉鲁家cms管理平台
## 2018.09.25

## Build Setup

``` bash

# Clone project
git clone http://192.168.11.50/Customer_anjilujia/anjilujia_cms.git

1. 依赖安装
    # Install dependencies
    npm install

    # 建议不要用cnpm  安装有各种诡异的bug 可以通过如下操作解决npm速度慢的问题
    npm install --registry=https://registry.npm.taobao.org

    # 不建议使用npm来安装依赖,项目中有一个 node_modules.rar 的压缩包,已经安装好依赖了,解压即可

2. 运行 开发环境
    # 开发环境
    npm run dev

3. 部署
    # 部署发布,该动作会生成 dist 目录,dist 目录即是最终部署的目录
    # 本动作需要有依赖支持,请务必完成上面第一步操作
    npm run build

# build for production and view the bundle analyzer report
npm run build --report
```


## 如果安装后跑不起来,自己重新安装一下sass

npm install node-sass -g
SASS_BINARY_SITE=https://npm.taobao.org/mirrors/node-sass/ npm install node-sass

    # https://github.com/lmk123/blog/issues/28
    # https://stackoverflow.com/questions/50555953/vue-webpack-template-missing-parser
    # 
    添加测试1
    添加测试2
    测试3