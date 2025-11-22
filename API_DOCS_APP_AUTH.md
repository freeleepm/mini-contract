# App 端认证中心 API 文档

**模块提供**: `yudao-module-member`
**前置URL**: `/api/v1/member`
**更新日期**: 2025年 7月 12日

**重要提示**: 
1.  使用本 API 前，请确保后端的 `yudao-module-member` 模块已在主 `pom.xml` 文件中启用。
2.  **租户ID说明**：
    *   **认证相关接口**（如登录、注册、发送验证码）位于 `/api/v1/member/auth` 下，**均不需要**在请求头中传递 `tenant-id`。
    *   **业务相关接口**（如获取用户信息、实名认证、修改资料）位于 `/api/v1/member/user` 或 `/api/v1/member/verify` 等路径下，在用户登录成功后，访问这些接口时**必须**传递 `tenant-id`。

---

## 1. 认证接口 (`/api/v1/member/auth`)

### 1.1 手机号 + 密码登录

*   **功能描述**: 用户通过手机号和密码进行身份验证，获取访问令牌。
*   **HTTP 方法**: `POST`
*   **接口地址**: `/api/v1/member/auth/login`
*   **Content-Type**: `application/json`
*   **认证**: 否

#### 请求参数 (Body)

| 参数名   | 类型   | 是否必填 | 描述   |
| :------- | :----- | :------- | :----- |
| `mobile` | String | 是       | 手机号码 |
| `password` | String | 是       | 用户密码 |

#### 请求示例

```json
{
  "mobile": "15601691234",
  "password": "admin"
}
```

#### 响应示例 (成功)

```json
{
  "code": 0,
  "data": {
    "userId": 1,
    "token": "ACCESS_TOKEN_STRING",
    "refreshToken": "REFRESH_TOKEN_STRING"
  },
  "msg": "成功"
}
```

---

### 1.2 手机号 + 验证码登录/注册

*   **功能描述**: 通过手机号和验证码进行登录。如果手机号未注册，系统将自动创建一个新用户并完成登录。这是一个两步过程。

#### 1.2.1 发送手机验证码

*   **HTTP 方法**: `POST`
*   **接口地址**: `/api/v1/member/auth/send-sms-code`
*   **Content-Type**: `application/json`
*   **认证**: 否

##### 请求参数 (Body)

| 参数名   | 类型   | 是否必填 | 描述                               |
| :------- | :----- | :------- | :--------------------------------- |
| `mobile` | String | 是       | 手机号码                           |
| `scene`  | Integer| 是       | 发送场景。`1`: 登录/注册, `4`: 重置/忘记密码 |

##### 请求示例

```json
{
  "mobile": "15601691234",
  "scene": 1
}
```

#### 1.2.2 验证码登录

*   **HTTP 方法**: `POST`
*   **接口地址**: `/api/v1/member/auth/sms-login`
*   **Content-Type**: `application/json`
*   **认证**: 否

##### 请求参数 (Body)

| 参数名   | 类型   | 是否必填 | 描述     |
| :------- | :----- | :------- | :------- |
| `mobile` | String | 是       | 手机号码 |
| `code`   | String | 是       | 短信验证码 |

---

### 1.3 刷新令牌

*   **功能描述**: 当 `accessToken` 过期时，使用 `refreshToken` 获取新的令牌。
*   **HTTP 方法**: `POST`
*   **接口地址**: `/api/v1/member/auth/refresh-token?refreshToken=YOUR_REFRESH_TOKEN`
*   **认证**: 否

---

### 1.4 登出

*   **功能描述**: 用户主动登出，服务端会使当前 `accessToken` 失效。
*   **HTTP 方法**: `POST`
*   **接口地址**: `/api/v1/member/auth/logout`
*   **认证**: 是 (需要携带有效的 `accessToken`)

---

## 2. 密码管理 (`/api/v1/member/user`)

### 2.1 重置密码 (忘记密码)

*   **功能描述**: 用户在未登录状态下，通过"手机号+验证码"重置密码。
*   **HTTP 方法**: `PUT`
*   **接口地址**: `/api/v1/member/user/reset-password`
*   **Content-Type**: `application/json`
*   **认证**: 否

#### 请求参数 (Body)

| 参数名     | 类型   | 是否必填 | 描述             |
| :--------- | :----- | :------- | :--------------- |
| `mobile`   | String | 是       | 手机号码         |
| `code`     | String | 是       | 使用场景 `4` 收到的短信验证码 |
| `password` | String | 是       | 要设置的新密码   |

---

### 2.2 修改密码 (已登录)

*   **功能描述**: 用户在登录状态下，修改自己的密码。
*   **HTTP 方法**: `PUT`
*   **接口地址**: `/api/v1/member/user/update-password`
*   **Content-Type**: `application/json`
*   **认证**: 是

#### 请求参数 (Body)

| 参数名        | 类型   | 是否必填 | 描述   |
| :------------ | :----- | :------- | :----- |
| `oldPassword` | String | 是       | 旧密码 |
| `newPassword` | String | 是       | 新密码 |

---

## 3. 用户信息 (`/api/v1/member/user`)

### 3.1 获取个人信息

*   **功能描述**: 获取当前登录用户的详细信息。
*   **HTTP 方法**: `GET`
*   **接口地址**: `/api/v1/member/user/get`
*   **认证**: 是

### 3.2 修改个人信息

*   **功能描述**: 修改当前登录用户的昵称、头像等基本信息。
*   **HTTP 方法**: `PUT`
*   **接口地址**: `/api/v1/member/user/update`
*   **Content-Type**: `application/json`
*   **认证**: 是

#### 请求参数 (Body)

| 参数名     | 类型   | 是否必填 | 描述       |
|:-----------|:-------|:---------|:-----------|
| `nickname` | String | 否       | 用户昵称   |
| `avatar`   | String | 否       | 用户头像，应为文件上传后返回的 URL |

---

## 4. 通用业务流程：文件上传与数据提交

在许多业务场景中，例如实名认证、企业认证或更新带图片的资料，都需要前端遵循一个标准的两步流程。这个流程解耦了文件传输和业务数据处理，是推荐的最佳实践。

### 4.1 核心流程详解

1.  **第一步：上传文件**
    *   **目的**：将图片、文档等二进制文件上传到服务器，并获取一个可用于后续引用的唯一标识（通常是文件 URL）。
    *   **接口**：调用通用的**文件上传接口** (`/infra/file/upload`)。该接口的详细定义见本文档第 6 节。
    *   **操作**：前端使用 `multipart/form-data` 格式，将文件作为 `file` 参数进行 `POST` 请求。
    *   **结果**：成功后，前端会从响应中获得一个字符串，即文件的访问 URL，例如 `"/infra/file/2025/07/12/your-file-name.jpg"`。

2.  **第二步：提交业务数据**
    *   **目的**：将业务相关的信息（如表单字段）与第一步中获取的文件 URL 一同提交给相应的业务接口。
    *   **接口**：调用具体的业务接口，例如**个人实名认证接口** (`/member/verify/submit`)。
    *   **操作**：前端构建一个 JSON 对象，将表单字段和文件 URL 作为其中的属性，然后通过 `application/json` 格式进行 `POST` 或 `PUT` 请求。
    *   **结果**：后端服务接收到业务数据和文件 URL，完成整个业务逻辑。

### 4.2 流程示例：个人实名认证

以下是结合上述流程完成个人实名认证的完整步骤。

#### 步骤 1: 上传人脸照片

前端调用文件上传接口，记录下返回的 `data` 字段（文件 URL）。

*   **Request**:
    ```http
    POST /infra/file/upload HTTP/1.1
    Host: api.your-domain.com
    Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW
    Authorization: Bearer YOUR_ACCESS_TOKEN

    ------WebKitFormBoundary7MA4YWxkTrZu0gW
    Content-Disposition: form-data; name="file"; filename="face.jpg"
    Content-Type: image/jpeg

    (二进制文件内容)
    ------WebKitFormBoundary7MA4YWxkTrZu0gW--
    ```
*   **Response**:
```json
{
  "code": 0,
      "data": "/infra/file/2025/07/12/face.jpg",
  "msg": "成功"
}
```

#### 步骤 2: 提交认证信息

前端使用上一步获得的 URL，调用个人实名认证接口：

*   **Request**:
    ```http
    POST /member/verify/submit HTTP/1.1
    Host: api.your-domain.com
    Content-Type: application/json
    Authorization: Bearer YOUR_ACCESS_TOKEN

    {
      "name": "张三",
      "idCard": "11010119900307213X",
      "faceImage": "/infra/file/2025/07/12/face.jpg"
    }
    ```
至此，整个带有文件上传的业务流程完成。

---

## 5. 认证与资料接口

### 5.1 个人实名认证提交

*   **功能描述**: 提交个人用户的真实姓名、身份证和人脸照片以进行实名认证。**请务必遵循第 4 节描述的"先上传，后提交"流程**。
*   **HTTP 方法**: `POST`
*   **接口地址**: `/member/verify/submit`
*   **Content-Type**: `application/json`
*   **认证**: 是

#### 请求参数 (Body)

| 参数名      | 类型   | 是否必填 | 描述                           |
| :---------- | :----- | :------- | :----------------------------- |
| `name`      | String | 是       | 真实姓名                       |
| `idCard`    | String | 是       | 身份证号码                     |
| `faceImage` | String | 是       | 人脸照片 URL（通过文件上传接口获取） |

#### 请求示例
```json
{
  "name": "张三",
  "idCard": "11010119900307213X",
  "faceImage": "/infra/file/2025/07/12/face.jpg"
}
```

---

### 5.2 企业认证提交

*   **功能描述**: 提交企业的详细信息和相关证件以进行认证。**同样遵循第 4 节描述的流程**，需要预先上传所有证件图片。认证成功后，提交的信息将自动更新到您的企业档案中。
*   **HTTP 方法**: `POST`
*   **接口地址**: `/member/verify/submit-enterprise`
*   **Content-Type**: `application/json`
*   **认证**: 是

#### 请求参数 (Body)

| 参数名                   | 类型   | 是否必填 | 描述                           |
| :----------------------- | :----- | :------- | :----------------------------- |
| `enterpriseId`           | Long   | 是       | 企业ID                         |
| `name`                   | String | 是       | 企业名称                       |
| `creditCode`             | String | 是       | 统一社会信用代码               |
| `legalName`              | String | 是       | 企业法人姓名                   |
| `legalIdCard`            | String | 是       | 法人身份证号码                 |
| `contactName`            | String | 是       | 联系人姓名                     |
| `contactMobile`          | String | 是       | 联系人手机                     |
| `location`               | String | 否       | 公司所在地                     |
| `industry`               | String | 否       | 公司行业                       |
| `scale`                  | String | 否       | 公司规模                       |
| `description`            | String | 否       | 公司简介                       |
| `businessLicenseUrl`     | String | 否       | 营业执照图片URL（通过文件上传接口获取） |
| `legalIdCardFrontUrl`    | String | 否       | 法人身份证正面URL（通过文件上传接口获取） |
| `legalIdCardBackUrl`     | String | 否       | 法人身份证背面URL（通过文件上传接口获取） |


#### 请求示例
```json
{
  "enterpriseId": 1024,
  "name": "示例科技有限公司",
  "creditCode": "91310000MA1H2K3L4M",
  "legalName": "李四",
  "legalIdCard": "310101198501015678",
  "contactName": "王五",
  "contactMobile": "13888888888",
  "location": "上海市浦东新区",
  "industry": "信息技术",
  "businessLicenseUrl": "/infra/file/2025/07/12/license.jpg"
}
```

---

### 5.3 查询认证状态

*   **功能描述**: 查询当前用户的企业认证或个人实名认证的最新状态。
*   **HTTP 方法**: `GET`
*   **接口地址**: `/member/verify/get-status`
*   **认证**: 是

#### 响应示例 (企业认证审核中)
```json
{
  "code": 0,
  "data": {
    "verifyType": 2, // 1: 个人, 2: 企业
    "verifyStatus": 2, // 0: 未申请, 1: 审核通过, 2: 审核中, 3: 审核不通过
    "enterprise": {
      "name": "示例科技有限公司",
      "licenseNumber": "91310000MA1H2K3L4M",
      // ... 其他企业信息
    },
    "personal": null,
    "verifyReason": null
  },
  "msg": "成功"
}
```

---

## 6. 文件上传 (`/infra/file`)

*   **功能描述**: 上传文件（如头像、证件照片），返回文件访问 URL。该接口由 `yudao-module-infra` 模块提供。
*   **HTTP 方法**: `POST`
*   **接口地址**: `/infra/file/upload`
*   **Content-Type**: `multipart/form-data`
*   **认证**: 是

#### 请求参数 (Form Data)

| 参数名 | 类型 | 是否必填 | 描述     |
| :----- | :--- | :------- | :------- |
| `file` | File | 是       | 要上传的文件内容 |
| `path` | String | 否 | 自定义文件路径 |

#### 响应示例 (成功)
```json
{
  "code": 0,
  "data": "/infra/file/2025/07/12/your-file-name.jpg",
  "msg": "成功"
}
```

---

## 7. 印章管理接口

印章管理支持个人印章和企业印章两种类型，根据用户身份自动区分。

### 7.1 印章类型与权限说明

- **个人印章**：归属于个人用户，只能由本人创建和使用，不需要授权
- **企业印章**：归属于企业，由企业管理员创建，需要授权给成员使用

### 7.2 统一印章查询接口

*   **功能描述**: 根据当前活动身份（个人/企业）获取对应的印章列表。
*   **HTTP 方法**: `GET`
*   **接口地址**: `/member/seal/page`
*   **认证**: 是

#### 请求参数 (Query)

| 参数名        | 类型    | 是否必填 | 描述                       |
| :------------ | :------ | :------- | :------------------------- |
| `pageNo`      | Integer | 否       | 页码，默认为1              |
| `pageSize`    | Integer | 否       | 每页记录数，默认为10       |
| `name`        | String  | 否       | 印章名称，模糊匹配         |
| `identityType`| Integer | 否       | 身份类型：1-个人，2-企业   |
| `enterpriseId`| Long    | 否       | 企业编号，当身份类型为企业时必填 |

#### 响应示例
```json
{
  "code": 0,
  "data": {
    "list": [
      {
        "id": 1,
        "name": "我的个人印章",
        "picture": "/infra/file/2025/07/12/seal1.png",
        "createType": 1,
        "identityType": 1,
        "createTime": "2025-07-12T10:00:00"
      }
    ],
    "total": 1
  },
  "msg": "成功"
}
```

### 7.3 个人印章管理

#### 7.3.1 创建个人印章

*   **功能描述**: 创建个人印章。**请务必遵循第 4 节描述的"先上传，后提交"流程**。
*   **HTTP 方法**: `POST`
*   **接口地址**: `/member/user-seal/create`
*   **Content-Type**: `application/json`
*   **认证**: 是

##### 请求参数 (Body)

| 参数名      | 类型    | 是否必填 | 描述                           |
| :---------- | :------ | :------- | :----------------------------- |
| `name`      | String  | 是       | 印章名称                       |
| `picture`   | String  | 是       | 印章图片URL（通过文件上传接口获取） |
| `createType`| Integer | 是       | 创建方式：1-模板生成，2-手绘，3-上传图片 |

##### 请求示例
```json
{
  "name": "我的个人印章",
  "picture": "/infra/file/2025/07/12/seal1.png",
  "createType": 1
}
```

#### 7.3.2 更新个人印章

*   **功能描述**: 更新个人印章信息。
*   **HTTP 方法**: `PUT`
*   **接口地址**: `/member/user-seal/update`
*   **Content-Type**: `application/json`
*   **认证**: 是

##### 请求参数 (Body)

| 参数名      | 类型    | 是否必填 | 描述                           |
| :---------- | :------ | :------- | :----------------------------- |
| `id`        | Long    | 是       | 印章编号                       |
| `name`      | String  | 是       | 印章名称                       |
| `picture`   | String  | 是       | 印章图片URL                    |
| `createType`| Integer | 是       | 创建方式：1-模板生成，2-手绘，3-上传图片 |

#### 7.3.3 删除个人印章

*   **功能描述**: 删除个人印章。
*   **HTTP 方法**: `DELETE`
*   **接口地址**: `/member/user-seal/delete`
*   **认证**: 是

##### 请求参数 (Query)

| 参数名 | 类型 | 是否必填 | 描述     |
| :----- | :--- | :------- | :------- |
| `id`   | Long | 是       | 印章编号 |

#### 7.3.4 获取个人印章详情

*   **功能描述**: 获取个人印章详细信息。
*   **HTTP 方法**: `GET`
*   **接口地址**: `/member/user-seal/get`
*   **认证**: 是

##### 请求参数 (Query)

| 参数名 | 类型 | 是否必填 | 描述     |
| :----- | :--- | :------- | :------- |
| `id`   | Long | 是       | 印章编号 |

#### 7.3.5 获取个人印章分页列表

*   **功能描述**: 获取个人印章分页列表。
*   **HTTP 方法**: `GET`
*   **接口地址**: `/member/user-seal/page`
*   **认证**: 是

##### 请求参数 (Query)

| 参数名     | 类型    | 是否必填 | 描述                 |
| :--------- | :------ | :------- | :------------------- |
| `pageNo`   | Integer | 否       | 页码，默认为1        |
| `pageSize` | Integer | 否       | 每页记录数，默认为10 |
| `name`     | String  | 否       | 印章名称，模糊匹配   |

### 7.4 企业印章管理

#### 7.4.1 创建企业印章

*   **功能描述**: 创建企业印章，需要企业管理员权限。
*   **HTTP 方法**: `POST`
*   **接口地址**: `/member/enterprise-seal/create`
*   **Content-Type**: `application/json`
*   **认证**: 是

##### 请求参数 (Body)

| 参数名        | 类型    | 是否必填 | 描述                           |
| :------------ | :------ | :------- | :----------------------------- |
| `enterpriseId`| Long    | 是       | 企业编号                       |
| `name`        | String  | 是       | 印章名称                       |
| `picture`     | String  | 是       | 印章图片URL（通过文件上传接口获取） |
| `createType`  | Integer | 是       | 创建方式：1-模板生成，2-手绘，3-上传图片 |

#### 7.4.2 更新企业印章

*   **功能描述**: 更新企业印章信息，需要企业管理员权限。
*   **HTTP 方法**: `PUT`
*   **接口地址**: `/member/enterprise-seal/update`
*   **Content-Type**: `application/json`
*   **认证**: 是

##### 请求参数 (Body)

| 参数名      | 类型    | 是否必填 | 描述                           |
| :---------- | :------ | :------- | :----------------------------- |
| `id`        | Long    | 是       | 印章编号                       |
| `name`      | String  | 是       | 印章名称                       |
| `picture`   | String  | 是       | 印章图片URL                    |
| `createType`| Integer | 是       | 创建方式：1-模板生成，2-手绘，3-上传图片 |

#### 7.4.3 删除企业印章

*   **功能描述**: 删除企业印章，需要企业管理员权限。
*   **HTTP 方法**: `DELETE`
*   **接口地址**: `/member/enterprise-seal/delete`
*   **认证**: 是

##### 请求参数 (Query)

| 参数名 | 类型 | 是否必填 | 描述     |
| :----- | :--- | :------- | :------- |
| `id`   | Long | 是       | 印章编号 |

#### 7.4.4 企业印章授权

*   **功能描述**: 将企业印章授权给企业成员使用，需要企业管理员权限。
*   **HTTP 方法**: `POST`
*   **接口地址**: `/member/enterprise-seal/grant-create`
*   **Content-Type**: `application/json`
*   **认证**: 是

##### 请求参数 (Body)

| 参数名           | 类型 | 是否必填 | 描述         |
| :--------------- | :--- | :------- | :----------- |
| `sealId`         | Long | 是       | 印章编号     |
| `enterpriseId`   | Long | 是       | 企业编号     |
| `enterpriseUserId`| Long | 是      | 企业成员编号 |

#### 7.4.5 删除企业印章授权

*   **功能描述**: 删除企业印章授权，需要企业管理员权限。
*   **HTTP 方法**: `DELETE`
*   **接口地址**: `/member/enterprise-seal/grant-delete`
*   **认证**: 是

##### 请求参数 (Query)

| 参数名 | 类型 | 是否必填 | 描述       |
| :----- | :--- | :------- | :--------- |
| `id`   | Long | 是       | 授权记录编号 |

#### 7.4.6 获取企业印章授权列表

*   **功能描述**: 获取某个企业印章的授权列表，需要企业管理员权限。
*   **HTTP 方法**: `GET`
*   **接口地址**: `/member/enterprise-seal/grant-list`
*   **认证**: 是

##### 请求参数 (Query)

| 参数名   | 类型 | 是否必填 | 描述     |
| :------- | :--- | :------- | :------- |
| `sealId` | Long | 是       | 印章编号 |

#### 7.4.7 获取我的企业印章授权列表

*   **功能描述**: 获取当前用户被授权的企业印章列表。
*   **HTTP 方法**: `GET`
*   **接口地址**: `/member/enterprise-seal/grant-page-by-user`
*   **认证**: 是

##### 请求参数 (Query)

| 参数名        | 类型    | 是否必填 | 描述                 |
| :------------ | :------ | :------- | :------------------- |
| `pageNo`      | Integer | 否       | 页码，默认为1        |
| `pageSize`    | Integer | 否       | 每页记录数，默认为10 |
| `enterpriseId`| Long    | 是       | 企业编号             |