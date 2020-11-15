# 一. Docker介绍

## 1.1 引言

> 1. 我本地运行没问题啊。
>
>    ```
>     环境不一致
>    ```
>
> 2. 哪个哥们又写死循环了，怎么这么卡？
>
>    ```
>     在多用户的操作系统下，会互相影响。
>    ```
>
> 3. 淘宝在双11的时候，用户量暴增。
>
>    ```
>     运维成本过高的问题。
>    ```
>
> 4. 学习一门技术，学习安装成本过高。
>
>    ```
>     关于安装软件成本过高。
>    ```

## 1.2 Docker的思想

> 1. 集装箱：
>    1. 会将所有需要的内容放到不同的集装箱中，谁需要这些环境就直接拿到这个集装箱就可以了
> 2. 标准化：
>    1. 运输的标准化：Docker有一个码头，所有上传的集装箱都放在了这个码头上，当谁需要某一个环境，就直接指派大海豚去搬运这个集装箱就可以了。
>    2. 命令的标准化：Docker提供了一系列的命令，帮助我们去获取集装箱等等操作。
>    3. 提供了REST的API：衍生出了很多图形化界面，Rancher。
> 3. 隔离性：
>    1. Docker在运行集装箱内的内容时，会在LInux的内核中，单独的开辟一片空间，这片空间不会影响到其他程序。

> - 注册中心。（超级码头，上面放的就是集装箱）
> - 镜像。（集装箱）
> - 容器。（运行起来的镜像）

# 二. Docker的基本操作

## 2.1 安装Docker

```sh
# 1. 下载关于Docker的依赖环境
yum -y install yum-utils device-mapper-persistent-data lvm2
```

------

```sh
# 2. 设置一下下载Docker的镜像源
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

------

```sh
# 3. 安装Docker
yum makecache fast
yum -y install docker-ce
```

------

```sh
# 4. 启动，并设置为开机自动启动，测试
# 启动Docker服务
systemctl start docker
# 设置开机自动启动
systemctl enable docker
# 测试
docker run hello-world
```

## 2.2 Docker的中央仓库

> 1. Docker官方的中央仓库：这个仓库是镜像最全的，但是下载速度很慢。[https://hub.docker.com](https://hub.docker.com/)
> 2. 国内的镜像网站：网易蜂巢、daoCloud...
>
> -  https://c.163yun.com/hub#/home
> -  [http://hub.daocloud.io](http://hub.daocloud.io/) (推荐使用)
>
> 1. 在公司内部会采用私服的方式拉取镜像。（添加配置）

```json
# 需要在/etc/docker/daemon.json
{
	"registry-mirrors":["https://registry.docker-cn.com"],
    "insecure-registries":["ip:port"]
}
# 重启两个服务
systemctl daemon-reload
systemctl restart docker
```

## 2.3 镜像的操作

```sh
# 拉取镜像到本地
docker pull 镜像名称[:tag]
# 举个例子
docker pull tomcat daocloud.io/library/tomcat:8.5.15-jre8
```

------

```sh
# 2. 查看全部本地的镜像
docker images
```

------

```sh
# 3. 删除本地镜像
docker rmi 镜像的标识
```

------

```sh
# 4. 镜像的导入导出（不规范）
# 将本地的镜像导出
docker save -o 导出的路径 镜像id
# 加载本地的镜像文件
docker load -i 镜像文件
# 修改镜像名称
docker tag 镜像id 新镜像名称:版本
```

## 2.4 容器的操作

```sh
# 1. 运行容器
# 简单操作
docker run 镜像的标识|镜像名称[:tag]
# 常用的参数
docker run -d -p 宿主机端口:容器端口 --name 容器名称 镜像的标识|镜像名称[:tag]
# -d：代表后台运行容器
# -p 宿主机端口:容器端口：为了映射当前Linux端口和容器端口
# --name 容器名称：指定容器的名称
```

------

```sh
# 2. 查看正在运行的容器
docker ps [-qa]
# -a：查看全部的容器，包括没有运行
# -p：只查看容器得到标识
```

------

```sh
# 3. 查看容器的日志
docker logs -f 容器id
# -f：可以滚动查看日志的最后几行
```

------

```sh
# 4. 进入到容器内部
docker exec -it 容器id bash
```

------

```sh
# 5. 删除容器（删除容器前，需要停止容器）
# 停止指定的容器
docker stop 容器id
# 停止全部容器
docker stop $(docker ps -qa)
# 删除指定的容器
docker rm 容器id
# 删除全部容器
docker rm $(docker ps -qa)
```

------

```sh
# 6. 启动容器
docker start 容器id
```

# 三. Docker应用

## 3.1 准备SSM工程

```sh
# MySQL数据库的连接用户名和密码改变了，修改db.properties
```

## 3.2 准备MySQL容器

```sh
# 运行MySQL容器
docker run -d -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=root daocloud.io/library/mysql:5.7.4
```

## 3.3 准备Tomcat容器

```sh
# 运行Tomcat容器，前面已经搞定，只需要将SSM项目的war包部署到Tomcat容器内部即可
# 可以通过命令将宿主机的内容服务到容器内部
docker cp 文件名称 容器id:容器内部路径
# 举个例子
docker cp ssm.war fe:/usr/local/tomcat/webapps
```

## 3.4 数据卷

> 为了部署SSM的工程，需要使用到cp命令将宿主机内的ssm.war文件复制到容器内部。
>
> 数据卷：**将宿主机的一个目录映射到容器的一个目录中**。
>
> 可以在宿主机中操作目录中的内容，那么容器内部映射的文件，也会跟着一起改变。

```sh
# 1. 创建数据卷
docker volume create 数据卷名称
# 创建数据卷之后，默认会存放在一个目录下 /var/lib/docker/volumes/数据卷名称/_data
```

------

```sh
# 2. 查看数据卷的详细信息
docker volume inspect 数据卷名称
```

------

```sh
# 3. 查看全部数据卷
docker volume ls
```

------

```sh
# 4. 删除数据卷
docker volume rm 数据卷名称
```

------

```sh
# 5. 应用数据卷
# 当你映射数据卷时，如果数据卷不存在，Docker会自动帮你创建，会将容器内部自带的文件，存储在默认的存放路径中
docker run -v 数据卷名称:容器内部的路径 镜像id
# 直接指定一个路径作为数据卷的存放位置，这个路径下是空的。
docker run -v 路径:容器内部的路径 镜像id
```

# 四. Docker自定义镜像

>  中央仓库上的镜像，也是Docker的用户自己上传过去的。

```sh
# 1. 创建一个Dockerfile文件，并且指定自定义镜像信息
# Dockerfile文件中常用的内容
from：指定当前自定义镜像依赖的环境
copy：将相对路径下的内容复制到自定义镜像中
workdir：声明镜像的默认工作目录
cmd：需要执行的命令（在workdir下执行的，cmd可以写多的，只以最后一个为准）
# 举个例子，自定义一个Tomcat镜像，并且将ssm.war部署到Tomcat中
from daocloud.io/library/tomcat:8.5.15-jre8
copy ssm.war /usr/local/tomcat/webapps
```

------

```sh
# 2. 将准备好的Dockerfile和相应的文件拖拽到Linux操作系统中，通过Docker的命令制作镜像
docker build -t 镜像名称:[tag]
```

# 五. Docker-Compose

> 之前运行一个镜像，需要添加大量的参数。
>
> 可以通过Docker-Compose编写这些参数。
>
> Docker-Compose可以帮助我们批量的管理容器。
>
> 只需要通过一个docker-compose.yml文件去维护即可。

## 5.1 下载Docker-Compose

```sh
# 1. 去GitHub官网搜索docker-compose，下载最新版本的Docker-Compose
# 2. 将下载好的文件，拖拽到Linux操作系统中
# 3. 需要将Docker-Compose文件名称修改一下，给予DockerCompose文件一个可执行的权限
mv docker-compose-Linux-x86_64 docker-compose
chmod 777 docker-compose
# 4. 方便后期操作，配置一个环境变量
# 将docker-compose文件移动到/usr/local/bin，修改了/etc/profile文件，给/usr/local/bin配置到PATH中
mv docker-compose /usr/local/bin
vi /etc/profile
	export PATH=$JAVA_HOME:/usr/local/bin:$PATH
source /etc/profile

# 5. 测试一下
# 在任意目录下输入docker-compose
```

## 5.2 Docker-Compose管理MySQL和Tomcat容器

>  yml文件以key:value方式指定配置信息
>
>  多个配置信息以换行+缩进的方式来区分
>
>  在docker-compose.yml文件中，不要使用制表符

```yaml
version: '3.1'
services:
  mysql:                     # 服务的名称
    restart: always          # 代表只要Docker启动，那么这个容器就跟着一起启动
    image: daocloud.io/library/mysql:5.7.4     # 指定镜像路径
    container_name: mysql    # 指定容器名称
    ports:
      - 3306:3306        # 指定端口号的映射
    environment:
      MYSQL_ROOT_PASSWORD: root         # 指定MySQL的ROOT用户登录密码
      TZ: Asia/Shanghai                 # 指定时区
    volumes:
      - /opt/docker_mysql-tomcat/mysql_data:/var/lib/mysql        # 映射数据卷
  tomcat:
    restart: always        
    image: daocloud.io/library/tomcat:8.5.15-jre8     # 指定镜像路径
    container_name: tomcat    # 指定容器名称
    ports:
      - 8080:8080        # 指定端口号的映射
    environment:
      MYSQL_ROOT_PASSWORD: root         # 指定MySQL的ROOT用户登录密码
      TZ: Asia/Shanghai                 # 指定时区
    volumes:
      - /opt/docker_mysql-tomcat/tomcat_webapps:/usr/local/tomcat/webapps        # 映射数据卷
      - /opt/docker_mysql-tomcat/tomcat_logs:/usr/local/tomcat/logs        # 映射数据卷
```

## 5.3 使用Docker-Compose命令管理容器

>  在使用docker-compose的命令时，默认会在当前目录下找docker-complsose.yml文件

```sh
# 1. 基于docker-compose.yml启动管理的容器
docker-compose up -d
```

------

```sh
# 2. 关闭并删除容器
docker-compose down
```

------

```sh
# 3. 开启|关闭|重启已经存在的由docker-compose维护的容器
docker-compose start|stop|restart
```

------

```sh
# 4. 查看由docker-compose管理的容器
docker-compose ps
```

------

```sh
# 5. 查看日志
docker-compose logs -f
```

## 5.4 docker-compose配置Dockerfile使用

> 使用docker-compose.yml文件以及Dockerfile文件在生成自定义镜像的同时启动当前镜像，并且由docker-compose去管理容器

##### docker-compose.yml

```yaml
# yml文件
version: '3.1'
services:
  ssm:
    restart: always
    build:                           # 构建自定义镜像
      context: ../                   # 指定Dockerfile文件所在路径
      dockerfile: Dockerfile         # 指定Dockerfile文件名称
    image: ssm:1.0.1
    container_name: ssm
    ports:
      8081:8080
    environment:
      TZ: Asia/Shanghai
```

------

##### Dockerfile文件

```sh
from daocloud.io/library/tomcat:8.5.15-jre8
copy ssm.war /usr/local/tomcat/webapps
```

------

```sh
# 可以直接启动基于docker-compose.yml以及Dockerfile文件构建的自定义镜像
docker-compose up -d
# 如果自定义镜像不存在，会帮助我们构建出自定义镜像，如果自定义镜像已经存在，会直接运行这个自定义镜像
# 重新构建的话
# 重新构建自定义镜像
docker-compose build
# 运行前，重新构建
docker-compose up -d --build
```

# 六. Docker DI、CD

## 6.1 引言

>  项目部署
>
> 1. 将项目通过maven进行编译打包
> 2. 将文件上传到指定的服务器中
> 3. 将war包放到tomcat的目录中
> 4. 通过Dockerfile将Tomcat和war包转成一个镜像，由DockerCompose去运行容器
>
> 项目更新了
>
>  将上述流程再次的从头到尾的执行一次

## 6.2 CI介绍

> CI（ continuous intergration ）持续集成
>
> 持续集成：编写代码时，完成了一个功能后，立即提交代码到Git仓库中，将项目重新的构建并且测试
>
> - 快速发现错误
> - 防止代码偏离主分支

## 6.3 实现持续集成

### 6.3.1 搭建GItLab服务器

>  1、创建一个全新的虚拟机，并且至少指定4G的运行内存

>  2、安装docker以及docker-compose

>  3、将ssh的默认22端口，修改为60022端口

```sh
vi /etc/ssh/sshd_config
PORT 22 -> 60022
systemctl restart sshd
```

>  4、docker-compose.yml问价去安装GitLab

```yml
version: '3.1'
services:
 gitlab:
  image: 'twang2218/gitlab-ce-zh:11.1.4'
  container_name: "gitlab"
  restart: always
  privileged: true
  hostname: 'gitlab'
  environment:
   TZ: 'Asia/Shanghai'
   GITLAB_OMNIBUS_CONFIG: |
    external_url 'http://47.96.165.21'
    gitlab_rails['time_zone'] = 'Asia/Shanghai'
    gitlab_rails['smtp_enable'] = true
    gitlab_rails['gitlab_shell_ssh_port'] = 22
  ports:
   - '80:80'
   - '443:443'
   - '22:22'
  volumes:
   - /opt/docker_gitlab/config:/etc/gitlab
   - /opt/docker_gitlab/data:/var/opt/gitlab
   - /opt/docker_gitlab/logs:/var/log/gitlab
```

### 6.3.2 搭建GitLab-Runner

>  查看资料中的gitlab-runner文件即可安装

### 6.3.3 整合项目入门测试

>  1、创建maven工程，添加web.xml文件，编写html页面

>  2、编写gitlab-ci.yml文件

```yaml
stages: 
 - test

test:
  stage: test
  script: 
   - echo first test ci # 输入的命令
```

>  3、将maven工程推送到Gitlab中

>  4、可以在Gitlab中查看到gitlab-ci.yml编写的内容

### 6.3.4 编写gitlab-ci.yml文件

>  1、编写gitlab-ci.yml测试命令使用

```yaml
stages: 
 - test

test:
  stage: test
  script: 
   - echo first test ci # 输入的命令
   - /usr/local/maven/apache-maven-3.6.3/bin/mvn package
```

>  2、编写关于Dockerfile以及docker-compose文件的具体内容

```sh
# 1. Dockerfile
FROM daocloud.io/library/tomcat:8.5.15-jre8
COPY testci.war /usr/local/tomcat/webapps
```

------

```yaml
# 2. docker-compose.yml
version: "3.1"
services: 
  testci:
    build: docker
    restart: always
    container_name: testci
    ports: 
     - 8080:8080
```

>  3、测试
