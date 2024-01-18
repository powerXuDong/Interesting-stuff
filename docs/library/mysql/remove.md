# 清除 mysql 所有文件及数据的步骤

* 停止 MySQL 服务

``` shell
sudo systemctl stop mysqld
```

* 卸载 MySQL 包：

``` shell
sudo yum remove mysql-server mysql-client
```

* 删除所有相关数据：

``` shell
sudo rm -rf /var/lib/mysql /var/log/mysqld.log /etc/my.cnf
```

* 清除所有未安装的依赖：

``` shell
sudo yum autoremove
```

* 清除所有剩余的 MySQL 文件：

使用 find 命令搜索系统中所有与 MySQL 相关的文件并手动删除它们。

``` shell
sudo find / -iname '*mysql*'
```

对于要删除的每个文件或目录，可以使用 rm 命令删除：

``` shell
sudo rm -rf /path/to/your/file_or_directory
```

例如，如果要删除名为 mysql_data 的目录，可以运行：

``` shell
sudo rm -rf /path/to/mysql_data
```
