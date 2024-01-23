# 安装 mysql 的问题

## 查看当前安装的 yum 仓库

* 查看已安装的仓库：

``` shell
yum repolist
```

* 删除仓库文件：

仓库文件通常存储在 /etc/yum.repos.d/ 目录中

``` shell
sudo rm /etc/yum.repos.d/repository-name.repo
```

将 repository-name.repo 替换为您要删除的仓库文件的实际名称。

* 清除仓库缓存：

``` shell
sudo yum clean all
```

## Access denied for user 'root'@'localhost' (using password: YES)

在给 mysql 设置密码时，初始密码我们不知道，这个时候就需要设置免密登录，具体如下：

* 停止 MySQL 服务:

``` shell
sudo systemctl stop mysql
```

* 设置 MySQL 服务的特殊选项以跳过权限表:（免密登录）

> 你需要编辑 MySQL 的配置文件（通常位于 /etc/my.cnf 或 /etc/mysql/my.cnf 或 /etc/mysql/mysql.conf.d/mysqld.cnf）。

### 在 [mysqld] 部分添加以下行

``` shell
skip-grant-tables
```

保存文件并退出。

* 重启 MySQL 服务:

``` shell
sudo systemctl start mysql
```

* 登录到 MySQL:（这个时候就可以免密登录了）

``` shell
mysql -u root
```

* 重置 root 用户的密码:

> 在 MySQL 命令行中，输入以下命令来重置 root 用户的密码（将 new_password 替换为你的新密码）：

``` shell
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
```

> 如果 ALTER USER 命令不起作用，你也可以尝试老版本的命令：

``` shell
UPDATE mysql.user SET authentication_string=PASSWORD('new_password') WHERE User='root';
FLUSH PRIVILEGES;
```

> 退出 MySQL 命令行：

``` shell
exit
```

* 撤销对配置文件的更改:

> 再次编辑 MySQL 的配置文件，移除或注释掉 skip-grant-tables 选项。
> 保存并关闭文件。

* 重启 MySQL 服务:

``` shell
sudo systemctl restart mysql
```

* 使用新密码登录:

> 现在你应该可以使用新设置的密码登录到 MySQL 了：

``` shell
mysql -u root -p
```

# 云服务器ECS 如何允许远程连接

要使云服务器上的 MySQL 数据库允许远程连接，你需要进行以下配置：

1. 修改 MySQL 配置:

> 你需要编辑 MySQL 的配置文件（通常位于 /etc/my.cnf 或 /etc/mysql/my.cnf 或 /etc/mysql/mysql.conf.d/mysqld.cnf）。

找到 bind-address 配置项，将其设置为 0.0.0.0。这样 MySQL 将监听所有网络接口，从而允许来自任何 IP 地址的连接。例如：

``` shell
bind-address = 0.0.0.0
```

保存更改并退出编辑器

2. 创建或修改用户以允许远程访问:

* 登录 MySQL：mysql -u root -p
* 创建一个新用户或更新现有用户，允许从任意主机连接。替换 username 和 password 为你选择的用户名和密码：
  
``` sql
CREATE USER 'username'@'%' IDENTIFIED BY 'password';
```

或者，如果用户已存在，更新其权限：

``` sql
GRANT ALL PRIVILEGES ON *.* TO 'username'@'%' WITH GRANT OPTION;
```

* 应用更改：

``` sql
FLUSH PRIVILEGES;
```

* 退出 MySQL。

3. 调整防火墙设置:

* 如果你的服务器运行的是防火墙（如 UFW），确保打开 MySQL 默认端口（3306）的入站规则：

``` shell
sudo ufw allow 3306
```

* 如果你使用的是云服务提供商（如阿里云、AWS、Azure 等），还需要在其安全组或网络安全设置中允许3306端口的流量

4. 重启 MySQL 服务:

* 应用配置更改，重启 MySQL 服务：

``` sql
sudo systemctl restart mysqld
```

5. 测试远程连接:

* 从远程机器使用 MySQL 客户端测试连接：

``` sql
mysql -h [服务器IP地址] -u username -p
```

* 输入你在创建用户时设置的密码

# 如何把 root 账户下的数据库分享给其他账户

要将 root 账户下的数据库共享给其他账户，你需要为那个账户创建一个 MySQL 用户（如果尚未存在）并授予对特定数据库的访问权限。下面是具体步骤：

1. 登录 MySQL：

* 首先，使用 root 账户登录到 MySQL：

``` sql
mysql -u root -p
```

2. 创建新用户（如果需要）:

* 如果其他账户的用户尚未存在，你需要先创建它。替换 new_user 和 user_password 为你希望设置的用户名和密码：
  
``` sql
CREATE USER 'new_user'@'%' IDENTIFIED BY 'user_password';
```

* '%' 表示该用户可以从任何 IP 地址连接。如果你想限制用户只能从特定 IP 地址连接，请将 % 替换为那个特定的 IP 地址。

3. 授予权限:

* 然后，授予该用户访问特定数据库的权限。替换 database_name 为你想要共享的数据库名：

``` sql
GRANT ALL PRIVILEGES ON `database_name`.* TO 'new_user'@'%';
```

* 这里使用的 ALL PRIVILEGES 会授予用户对指定数据库的所有权限。如果你需要更细粒度的控制，可以指定特定的权限，如 SELECT, INSERT, UPDATE 等。

4. 应用权限更改:

* 执行以下命令来应用权限更改：

``` sql
FLUSH PRIVILEGES;
```

5. 完成后，退出 MySQL：
   
``` sql
exit
```

现在，新用户 new_user 应该能够访问并操作 database_name 数据库了。请确保使用强密码并只授予必要的权限，以保持数据库的安全性。

# 当我们远程使用 Node 连接 Mysql 时会有一些权限问题

## nodejs.ER_NOT_SUPPORTED_AUTH_MODEError: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client

> 当你在 Node.js 中遇到 ER_NOT_SUPPORTED_AUTH_MODE 错误时，这通常意味着 MySQL 服务端使用了不被 Node.js MySQL 客户端支持的认证方式。MySQL 5.7 及以上版本引入了一种新的默认认证插件 - caching_sha2_password，而某些版本的 Node.js MySQL 客户端可能还不支持这种认证方式。

要解决这个问题，你有几个选项：

1. 首先，使用 root 账户登录到 MySQL：

``` sql
mysql -u root -p
```

**必须以最高权限的账户登录，设置认证方式**

2. 运行以下 SQL 命令来更改认证方式，将 username 替换成你的用户名：

``` sql
ALTER USER 'username'@'%' IDENTIFIED WITH mysql_native_password BY 'password';
```

* 执行以下命令来应用权限更改：

``` sql
FLUSH PRIVILEGES;
```

**一般是修改专门远程的用户的认证方式，root 用户因为和 localhost 绑定了，不允许所有的 IP 访问**

> 检查用户和 localhost 机器绑定，还是 % 所有的 IP 绑定，我们可以这样查询，usename 就是当前查询的用户

``` sql
SELECT user, host FROM mysql.user WHERE user = 'usename';
```

3. 退出 MySQL 并重启 Mysql 服务：
   
``` sql
exit
```

``` sql
sudo systemctl restart Mysqld;
```
   



