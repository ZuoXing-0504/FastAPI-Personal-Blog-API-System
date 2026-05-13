# API Testing Guide

这份文档提供一套适合面试演示、作业验收和本地联调的接口测试流程。

## 1. 测试前准备

请先确保：

- FastAPI 服务已启动
- MySQL 已连接成功
- Swagger 文档可访问：`http://127.0.0.1:8000/docs`

默认地址：

```text
http://127.0.0.1:8000
```

## 2. 推荐测试顺序

1. 健康检查
2. 用户注册
3. 用户登录
4. 获取当前登录用户
5. 创建分类
6. 发布文章
7. 查询文章列表
8. 查看文章详情
9. 刷新 Token
10. 修改文章
11. 删除文章
12. 退出登录
13. 使用已退出的 Refresh Token 再次刷新，验证失败
14. 未登录访问受保护接口
15. 使用 Refresh Token 访问受保护接口，验证失败

## 3. curl 示例

Windows PowerShell 推荐使用 `curl.exe`。

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

登录后请记录：

- `data.access_token`
- `data.refresh_token`

### 3.4 获取当前登录用户

```bash
curl.exe -X GET "http://127.0.0.1:8000/api/v1/users/me" ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3.5 创建分类

```bash
curl.exe -X POST "http://127.0.0.1:8000/api/v1/categories" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" ^
  -d "{\"name\":\"技术\",\"description\":\"技术文章分类\"}"
```

请记录返回中的 `data.id` 作为 `category_id`。

### 3.6 查询分类列表

```bash
curl.exe -X GET "http://127.0.0.1:8000/api/v1/categories"
```

### 3.7 发布文章

```bash
curl.exe -X POST "http://127.0.0.1:8000/api/v1/articles" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" ^
  -d "{\"title\":\"FastAPI 项目演示文章\",\"summary\":\"用于展示接口能力\",\"content\":\"这是一篇用于测试接口的文章正文。\",\"category_id\":1}"
```

请记录返回中的 `data.id` 作为 `article_id`。

### 3.8 分页查询文章列表

```bash
curl.exe -X GET "http://127.0.0.1:8000/api/v1/articles?page=1&page_size=10"
```

### 3.9 按分类筛选文章

```bash
curl.exe -X GET "http://127.0.0.1:8000/api/v1/articles?page=1&page_size=10&category_id=1"
```

### 3.10 查看文章详情

```bash
curl.exe -X GET "http://127.0.0.1:8000/api/v1/articles/1"
```

重复请求该接口可以观察 `view_count` 自增。

### 3.11 刷新 Token

```bash
curl.exe -X POST "http://127.0.0.1:8000/api/v1/auth/refresh" ^
  -H "Content-Type: application/json" ^
  -d "{\"refresh_token\":\"YOUR_REFRESH_TOKEN\"}"
```

刷新成功后，你会拿到：

- 新的 `access_token`
- 新的 `refresh_token`

旧的 Refresh Token 会失效。

### 3.12 修改文章

```bash
curl.exe -X PUT "http://127.0.0.1:8000/api/v1/articles/1" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" ^
  -d "{\"title\":\"FastAPI 项目演示文章（已修改）\",\"summary\":\"作者本人修改成功\"}"
```

### 3.13 删除文章

```bash
curl.exe -X DELETE "http://127.0.0.1:8000/api/v1/articles/1" ^
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3.14 退出登录

```bash
curl.exe -X POST "http://127.0.0.1:8000/api/v1/auth/logout" ^
  -H "Content-Type: application/json" ^
  -d "{\"refresh_token\":\"YOUR_REFRESH_TOKEN\"}"
```

### 3.15 使用已退出的 Refresh Token 再次刷新

```bash
curl.exe -X POST "http://127.0.0.1:8000/api/v1/auth/refresh" ^
  -H "Content-Type: application/json" ^
  -d "{\"refresh_token\":\"YOUR_REFRESH_TOKEN\"}"
```

预期返回：

```json
{
  "code": 401,
  "msg": "刷新令牌已失效，请重新登录",
  "data": null
}
```

### 3.16 未登录访问受保护接口

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

### 3.17 使用 Refresh Token 访问受保护接口

```bash
curl.exe -X GET "http://127.0.0.1:8000/api/v1/users/me" ^
  -H "Authorization: Bearer YOUR_REFRESH_TOKEN"
```

预期返回：

```json
{
  "code": 401,
  "msg": "请使用访问令牌访问该接口",
  "data": null
}
```

## 4. 越权测试

验证“只有作者本人可以修改文章”：

1. 账号 A 登录并创建文章
2. 账号 B 登录
3. 使用账号 B 修改账号 A 的文章

示例：

```bash
curl.exe -X PUT "http://127.0.0.1:8000/api/v1/articles/1" ^
  -H "Content-Type: application/json" ^
  -H "Authorization: Bearer OTHER_USER_ACCESS_TOKEN" ^
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

## 5. 响应头验证

现在每个请求响应头都会返回：

```text
X-Request-ID
```

它可以用于日志排查和请求链路追踪。

## 6. Postman 测试

可导入：

```text
docs/FastAPI-Personal-Blog.postman_collection.json
```

如果你要继续升级集合，建议补上：

- `/api/v1/auth/refresh`
- `/api/v1/auth/logout`
- `X-Request-ID` 响应头观察

## 7. 推荐演示方式

如果你是为了面试展示，建议这样讲：

1. 先用 Swagger 跑主流程
2. 再用 curl 或 Postman 演示未登录拦截、越权失败、Refresh Token 轮换
3. 最后补一句工程化能力：
   - Alembic 迁移
   - pytest 自动化测试
   - Docker Compose 部署
   - 请求日志和 Request ID
