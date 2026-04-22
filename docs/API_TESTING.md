# API Testing Guide

> 这份文档提供两种接口测试方式：
>
> - `curl` 命令行测试
> - Postman 导入集合测试

## 1. 测试前准备

请先确保：

- 本地服务已经启动
- MySQL 已连接成功
- 接口文档可访问：`http://127.0.0.1:8000/docs`

默认测试地址：

```text
http://127.0.0.1:8000
```

## 2. 推荐测试顺序

建议按照下面的顺序测试，最容易完整演示项目能力：

1. 健康检查
2. 用户注册
3. 用户登录获取 token
4. 获取当前登录用户信息
5. 创建分类
6. 发布文章
7. 分页查询文章列表
8. 查询文章详情
9. 修改自己的文章
10. 删除自己的文章
11. 未登录访问受保护接口
12. 使用另一个账号尝试修改他人文章

## 3. curl 示例

> Windows PowerShell 推荐使用 `curl.exe`，避免被 PowerShell 的别名行为影响。

### 3.1 健康检查

```bash
curl.exe http://127.0.0.1:8000/health
```

### 3.2 用户注册

```bash
curl.exe -X POST "http://127.0.0.1:8000/api/v1/auth/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"demo_user\",\"email\":\"demo_user@example.com\",\"password\":\"abc12345\"}"
```

### 3.3 用户登录

```bash
curl.exe -X POST "http://127.0.0.1:8000/api/v1/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"demo_user\",\"password\":\"abc12345\"}"
```

登录成功后，你会拿到：

- `data.access_token`
- `data.token_type`
- `data.user`

请把 `access_token` 保存下来，下面的受保护接口都要用。

### 3.4 获取当前登录用户信息

```bash
curl.exe -X GET "http://127.0.0.1:8000/api/v1/users/me" ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3.5 创建分类

```bash
curl.exe -X POST "http://127.0.0.1:8000/api/v1/categories" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"name\":\"技术\",\"description\":\"技术文章分类\"}"
```

记下返回中的 `data.id`，后面发布文章需要用到 `category_id`。

### 3.6 查询分类列表

```bash
curl.exe -X GET "http://127.0.0.1:8000/api/v1/categories"
```

### 3.7 发布文章

```bash
curl.exe -X POST "http://127.0.0.1:8000/api/v1/articles" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"title\":\"FastAPI 项目演示文章\",\"summary\":\"用于展示接口能力\",\"content\":\"这是一篇用于接口测试的文章正文。\",\"category_id\":1}"
```

记下返回中的 `data.id`，后面查看详情、修改、删除都需要用到 `article_id`。

### 3.8 分页查询文章列表

```bash
curl.exe -X GET "http://127.0.0.1:8000/api/v1/articles?page=1&page_size=10"
```

### 3.9 按分类筛选文章

```bash
curl.exe -X GET "http://127.0.0.1:8000/api/v1/articles?page=1&page_size=10&category_id=1"
```

### 3.10 查看文章详情并触发阅读量 +1

```bash
curl.exe -X GET "http://127.0.0.1:8000/api/v1/articles/1"
```

### 3.11 修改自己的文章

```bash
curl.exe -X PUT "http://127.0.0.1:8000/api/v1/articles/1" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_TOKEN" ^
  -d "{\"title\":\"FastAPI 项目演示文章（已修改）\",\"summary\":\"作者本人修改成功\"}"
```

### 3.12 删除自己的文章

```bash
curl.exe -X DELETE "http://127.0.0.1:8000/api/v1/articles/1" ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3.13 未登录访问受保护接口

```bash
curl.exe -X POST "http://127.0.0.1:8000/api/v1/categories" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"未登录分类\",\"description\":\"should fail\"}"
```

预期返回：

```json
{
  "code": 401,
  "msg": "未登录，请先登录",
  "data": null
}
```

### 3.14 用户名或密码错误

```bash
curl.exe -X POST "http://127.0.0.1:8000/api/v1/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"demo_user\",\"password\":\"wrong123\"}"
```

预期返回：

```json
{
  "code": 401,
  "msg": "用户名或密码错误",
  "data": null
}
```

### 3.15 参数校验失败示例

```bash
curl.exe -X POST "http://127.0.0.1:8000/api/v1/auth/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"username\":\"ab\",\"email\":\"test@example.com\",\"password\":\"123\"}"
```

预期返回：

```json
{
  "code": 422,
  "msg": "请求参数校验失败",
  "data": [
    {
      "field": "body.username",
      "msg": "用户名必须为 3-20 位字母、数字或下划线"
    },
    {
      "field": "body.password",
      "msg": "密码长度必须为 6-32 位"
    }
  ]
}
```

## 4. 越权测试示例

建议按如下顺序验证“只有作者本人能修改文章”：

1. 使用账号 A 登录并创建文章
2. 使用账号 B 登录
3. 让账号 B 调用修改文章接口，目标文章填账号 A 创建的文章 ID
4. 预期返回 `403`

示例：

```bash
curl.exe -X PUT "http://127.0.0.1:8000/api/v1/articles/1" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer OTHER_USER_TOKEN" ^
  -d "{\"title\":\"越权修改测试\"}"
```

预期返回：

```json
{
  "code": 403,
  "msg": "无权限操作该文章，仅作者本人可修改或删除",
  "data": null
}
```

## 5. Postman 测试说明

### 5.1 导入方式

Postman 中点击 `Import`，选择：

```text
docs/FastAPI-Personal-Blog.postman_collection.json
```

### 5.2 集合变量

集合中已经预置这些变量：

- `base_url`
- `username`
- `email`
- `password`
- `token`
- `category_id`
- `article_id`

### 5.3 自动化保存变量

集合里已经为这些请求内置了脚本：

- 注册后自动生成并保存 `username / email / password`
- 登录后自动保存 `token`
- 创建分类后自动保存 `category_id`
- 发布文章后自动保存 `article_id`

### 5.4 推荐运行顺序

1. Health Check
2. Register
3. Login
4. Current User
5. Create Category
6. List Categories
7. Create Article
8. List Articles
9. Article Detail
10. Update Article
11. Delete Article
12. Unauthorized Create Category

## 6. 建议的演示方式

如果你要在面试或答辩中展示这个项目，建议：

- 用 Swagger 演示主流程，比较直观
- 用 curl 或 Postman 演示“未登录拦截”和“越权失败”
- 一边展示接口，一边讲清楚 JWT、依赖注入、ORM、统一异常处理的实现思路
