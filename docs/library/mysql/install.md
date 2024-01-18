# 安装 mysql

* 添加 MySQL Yum 仓库（以 CentOS 为例）：

``` shell
sudo yum localinstall https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
```

* 安装 MySQL 服务器：

``` shell
sudo yum install mysql-server
```

* 启动 MySQL 服务：

``` shell
sudo systemctl start mysqld
```

* 运行安全脚本：

> 在这个过程中，您将被要求输入初始临时密码，然后设置新密码，并按照提示完成其他安全设置。
> ** 安装 mysql 后会有一个初始的临时密码，我们可能不知道是啥所以会报错，这个时候需要免密登录，设置密码，具体操作请求 FAQ **

``` shell
sudo mysql_secure_installation
```

* 设置开机启动：

``` shell
sudo systemctl enable mysqld
```

* 登录 mysql

``` shell
mysql -u root -p
```
