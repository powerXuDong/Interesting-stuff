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

> 你需要编辑 MySQL 的配置文件（通常位于 /etc/my.conf 或 /etc/mysql/my.cnf 或 /etc/mysql/mysql.conf.d/mysqld.cnf）。

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
