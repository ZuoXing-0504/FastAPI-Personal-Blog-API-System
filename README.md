# FastAPI Personal Blog API System

> 一个适合大二学生用于练手、作业展示和后端实习面试展示的 FastAPI 个人博客接口项目。

## 项目简介

这是一个基于 `FastAPI + MySQL + SQLAlchemy + JWT` 的个人博客后端接口系统，围绕“用户认证、文章管理、分类管理、权限控制、统一异常处理、参数校验”这几类典型后端能力进行完整实现。

项目目标不是只做几个能跑通的接口，而是尽量贴近真实后端开发中的工程化写法：

- 分层目录结构清晰，便于扩展
- 使用 ORM 操作 MySQL，避免手写大量 SQL
- 使用 JWT 做登录鉴权和接口权限拦截
- 使用 Pydantic 做请求参数校验
- 使用统一返回格式和全局异常处理提升接口规范性
- 支持 Swagger / ReDoc 自动生成接口文档

## 项目亮点

- 面向实习面试场景：覆盖登录注册、权限控制、文章 CRUD、分类管理等高频后端考点
- 结构清晰：按 `api / core / crud / db / models / schemas / exceptions` 分层
- 权限严格：未登录无法发文，只有作者本人可以修改和删除文章
- 功能完整：支持分页查询、分类筛选、阅读量统计
- 参数校验友好：用户名、密码、文章字段都有明确校验规则
- 返回规范统一：所有接口都使用统一 JSON 结构

## 技术栈

- Python 3.9+
- FastAPI
- MySQL 8.0
- SQLAlchemy ORM
- PyJWT
- Pydantic
- Passlib
- PyMySQL
- CORS Middleware

## 功能模块

### 1. 用户模块

- 用户注册
- 用户登录
- 密码加密存储
- JWT 令牌签发与校验
- 获取当前登录用户信息
- 未登录接口权限拦截

### 2. 文章模块

- 发布文章
- 查看文章列表
- 文章分页查询
- 按分类筛选文章
- 查看文章详情
- 阅读量自动统计
- 修改文章
- 删除文章
- 仅作者本人可修改或删除

### 3. 分类模块

- 创建分类
- 查询分类列表
- 发布文章时绑定分类

### 4. 通用模块

- 统一返回格式
- 全局异常处理
- 请求参数自动校验
- 自动生成接口文档
- CORS 跨域支持

## 统一返回格式

项目中的接口统一返回如下结构：

```json
{
  "code": 200,
  "msg": "操作成功",
  "data": {}
}
```

分页接口返回示例：

```json
{
  "code": 200,
  "msg": "查询文章列表成功",
  "data": {
    "items": [],
    "total": 0,
    "page": 1,
    "page_size": 10,
    "total_pages": 0
  }
}
```

## 项目目录结构

```text
FastAPI-Personal-Blog-API-System
├─ app
│  ├─ api
│  │  ├─ deps.py
│  │  └─ v1
│  │     ├─ api.py
│  │     └─ endpoints
│  │        ├─ auth.py
│  │        ├─ users.py
│  │        ├─ categories.py
│  │        └─ articles.py
│  ├─ core
│  │  ├─ config.py
│  │  ├─ response.py
│  │  └─ security.py
│  ├─ crud
│  │  ├─ user.py
│  │  ├─ category.py
│  │  └─ article.py
│  ├─ db
│  │  ├─ base.py
│  │  └─ database.py
│  ├─ exceptions
│  │  ├─ custom.py
│  │  └─ handlers.py
│  ├─ models
│  │  ├─ user.py
│  │  ├─ category.py
│  │  └─ article.py
│  ├─ schemas
│  │  ├─ common.py
│  │  ├─ user.py
│  │  ├─ auth.py
│  │  ├─ category.py
│  │  └─ article.py
│  └─ main.py
├─ sql
│  └─ blog_schema.sql
├─ .env.example
├─ .gitignore
├─ main.py
├─ README.md
└─ requirements.txt
```

## 数据库设计

项目核心包含三张表：

- `users`：用户表
- `categories`：分类表
- `articles`：文章表

其中：

- 一个用户可以发布多篇文章
- 一篇文章只能属于一个分类
- 删除用户时，其文章会级联删除

建表 SQL 已提供在：

```text
sql/blog_schema.sql
```

## 快速启动

### 1. 克隆项目

```bash
git clone https://github.com/ZuoXing-0504/FastAPI-Personal-Blog-API-System.git
cd FastAPI-Personal-Blog-API-System
```

### 2. 创建虚拟环境

```bash
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Linux / macOS:

```bash
source .venv/bin/activate
```

### 3. 安装依赖

```bash
pip install -r requirements.txt
```

### 4. 配置环境变量

复制 `.env.example` 为 `.env`，然后修改数据库连接信息：

Windows:

```bash
copy .env.example .env
```

Linux / macOS:

```bash
cp .env.example .env
```

推荐配置示例：

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=123456
MYSQL_DB=fastapi_blog

JWT_SECRET_KEY=replace-with-a-secure-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
```

### 5. 初始化数据库

先确保本地已经安装并启动 MySQL 8，然后执行：

```bash
mysql -uroot -p123456 < sql/blog_schema.sql
```

### 6. 启动项目

```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

启动成功后访问：

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`
- Health Check: `http://127.0.0.1:8000/health`

## 主要接口说明

### 用户接口

- `POST /api/v1/auth/register`：用户注册
- `POST /api/v1/auth/login`：用户登录
- `GET /api/v1/users/me`：获取当前登录用户

### 分类接口

- `POST /api/v1/categories`：创建分类
- `GET /api/v1/categories`：查询分类列表

### 文章接口

- `POST /api/v1/articles`：发布文章
- `GET /api/v1/articles`：分页查询文章列表
- `GET /api/v1/articles/{article_id}`：查看文章详情
- `PUT /api/v1/articles/{article_id}`：修改文章
- `DELETE /api/v1/articles/{article_id}`：删除文章

## 演示流程

这套项目可以完整演示下面这条后端业务链路：

1. 启动服务并打开 Swagger 文档
2. 注册用户
3. 登录获取 JWT Token
4. 在 Swagger 中点击右上角 `Authorize` 填入 `Bearer <token>`
5. 创建文章分类
6. 发布一篇文章
7. 分页查询文章列表，并按分类筛选
8. 查看文章详情，确认阅读量自动加 1
9. 修改自己发布的文章
10. 删除自己发布的文章
11. 使用另一个账号尝试修改该文章，确认被 403 拒绝
12. 不带 Token 调用需要登录的接口，确认返回 401

## 权限说明

- 未登录用户不能创建分类、发布文章、修改文章、删除文章
- 登录用户只能修改和删除自己创建的文章
- Token 过期、无效或缺失时会直接返回 401

## 参数校验规则

### 用户

- 用户名：3-20 位，仅支持字母、数字、下划线
- 密码：6-32 位，且必须同时包含字母和数字
- 邮箱：必须符合邮箱格式

### 文章

- 标题不能为空，最长 200 字符
- 摘要最长 500 字符
- 内容不能为空
- 分类 ID 必须为正整数

## 适合写进简历的描述

你可以把这个项目概括为：

> 基于 FastAPI、MySQL、SQLAlchemy、JWT 独立完成个人博客后端接口系统开发，实现用户注册登录、文章与分类管理、权限控制、统一异常处理、参数校验、分页查询与阅读量统计，并通过 Swagger 自动生成接口文档。

## 后续可扩展方向

- 评论模块
- 标签模块
- 文件上传
- 富文本编辑器支持
- Redis 缓存
- Docker 部署
- 单元测试 / 接口测试
- CI/CD 自动化部署

## License

本项目仅用于学习、课程作业展示和个人技术积累。
