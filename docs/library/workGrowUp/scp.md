# SCP

## 从服务器复制文件到本地：

``` shell
scp root@192.168.1.100:/data/test.txt /home/myfile/

补充：多文件拷贝

scp root@192.168.1.100:/data/\{test1.txt,test2.cpp,test3.bin,test.*\} /home/myfile/
```

> root@192.168.1.100   root是目标服务器（有你需要拷贝文件的服务器）的用户名，192.168.1.100是IP地址，后面紧跟的 “：” 不要忘记，/data/test.txt（多文件还有test1.txt，test2.cpp，test3.bin，test.a，test.c等） 是目标服务器中你要拷贝文件的地址，接一个空格，后面的 /home/myfile/ 是本地接收文件的地址。


## 从服务器复制文件夹到本地：

``` shell
scp -r root@192.168.1.100:/data/ /home/myfile/
```

> 只需在前面加 -r 即可，就可以拷贝整个文件夹。

## 从本地复制文件到服务器：

``` shell
scp /home/myfile/test.txt root@192.168.1.100:/data/

补充：多文件拷贝

scp /home/myfile/test1.txt test2.cpp test3.bin test.* root@192.168.1.100:/data/
```

## 从本地复制文件夹到服务器：

``` shell
scp -r /home/myfile/ root@192.168.1.100:/data/
```
