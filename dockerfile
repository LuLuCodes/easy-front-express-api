FROM keymetrics/pm2:12-alpine
LABEL maintainer="qian.qing@aliyun.com"

# 创建工作目录，对应的是应用代码存放在容器内的路径
WORKDIR /home/app

# 把 package.json，package-lock.json(npm@5+) 或 yarn.lock 复制到工作目录(相对路径)
COPY package.json *.lock pm2.json /home/app/

RUN npm install --registry=https://registry.npm.taobao.org --production

# 把其他源文件复制到工作目录
COPY dist /home/app/dist

# 替换成应用实际的端口号
EXPOSE 8000

# 这里根据实际起动命令做修改
CMD [ "pm2-runtime", "start", "pm2.json" ]