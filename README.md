# Personal Blog Site API
![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Jest](https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white) 

#### **The API controls resgister and log in of users, and the management of the articles stored by the users.**

## Using the API

The API will be available at `http://localhost:3000`.

## Authentication

The API relies on headers, sending the signed token within the response body and receiving the same token within the authorization header, which must be stored manually in the client application.

## API Route

| Endpoint  | Description | 
| ------ | ------ |
| **`/personal-blog`** | API Version 1 |

## Connection Route

| Endpoint | Queries | Description | 
| ------ | ------ | ------ |
| **GET ***`/ping`***** | none | Verify API and DB connection |

## User Routes

| Endpoint | Queries | Description | 
| ------ | ------ | ------ |
| **GET ***`/user/data`***** | **token** | Get all data from user |
| **POST ***`/user/key`***** | api_key | Sign in user ***(get token)*** |
| **POST ***`/user/login`***** | name, password | Sign in user ***(get token)*** |
| **POST ***`/user/register`***** | name, password, email, author | Sign up user  ***(get token)***  |
| **PATCH ***`/user/name`***** | name, **token** | Change user name |
| **PATCH ***`/user/email`***** | email, **token** | Change user email |
| **PATCH ***`/user/author`***** | author, **token** | Change user author name |
| **PATCH ***`/user/password`***** | password, **token** | Change user password |
| **DELETE ***`/user/data`***** | **token** | Remove user |
| **DELETE ***`/user/cleanup`***** | NODE_ENV=***test*** | Remove all users |

## Article Routes

| Endpoint | Queries | Description | 
| ------ | ------ | ------ |
| **GET ***`/article`***** | **token** | Get all articles from user |
| **PATCH ***`/article/data`***** | id, name, title, keywords, image_name, description **token** | Change article data info |
| **PATCH ***`/article/publishment`***** | id, is_publish, **token** | Change article publish state |
| **POST ***`/article`***** | name, title, keywords, image_name, description, **token** |  Add new article |
| **DELETE ***`/article`***** | id, **token** |  Remove article |

## Section Routes

| Endpoint | Queries | Description | 
| ------ | ------ | ------ |
| **GET ***`/section`***** | article_id, **token** | Get all sections from article |
| **PUT ***`/section`***** | id, content, content_type, image_name, width, height, font_size, font_weight, font_family, line_height, margin_top, text_align, text_color, border_radius **token** | Change section |
| **POST ***`/section`***** | article_id, content, content_type, image_name, width, height, font_size, font_weight, font_family, line_height, margin_top, text_align, text_color, border_radius **token** | Add new section |
| **DELETE ***`/section`***** | id, **token** | Remove section |