# Challenge Project Backend - Geração Tech

Welcome to my challenge project! This backend was developed as part of the Geração Tech program.

## Getting Started

### Prerequisites

Ensure that you have Node.js and MySQL installed in your development environment.

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Gleis0nLemos/project-backend-gt.git
    ```

2. Navigate to the project folder:
    ```bash
    cd project-backend-gt
    ```

3. Install the Node.js dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the root of your project. Below is an example:
    ```plaintext
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=challenge_backend_development
    JWT_SECRET=your_secret_key
    ```

### Database Setup

1. In your terminal (or MySQL client), log in to MySQL:
    ```bash
    mysql -u usuario -p
    ```

2. Create the database:
    ```sql
    CREATE DATABASE challenge_backend_development;
    ```

3. Run the database migrations:
    ```bash
    npx sequelize-cli db:migrate
    ```

## Testing the Application

For testing the routes and CRUD operations, I recommend using Postman or a similar tool.

### User Routes

- **Create a User:**
    - Send a `POST` request to `http://localhost:3000/v1/user` with the following body:
    ```json
    {
      "firstname": "user firstname",
      "surname": "user surname",
      "email": "user@mail.com",
      "password": "123@123",
      "confirmPassword": "123@123"
    }
    ```
    - A token will be generated. Save this token to test other routes.

- **Update a User:**
    - Send a `PUT` request to `/v1/user/:id` with the user's ID and the following body:
    ```json
    {
      "firstname": "user firstname",
      "surname": "user surname",
      "email": "user@mail.com"
    }
    ```
    - Remember to add the token in the Authorization header as a Bearer token.
    - Expected Response: `204 No Content`.

- **Get a User by ID:**
    - Send a `GET` request to `/v1/user/:id` with the corresponding ID and the token.
    - Expected Response:
    ```json
    {
      "id": 1,
      "firstname": "user firstname",
      "surname": "user surname",
      "email": "user@mail.com"
    }
    ```

- **Delete a User:**
    - Send a `DELETE` request to `/v1/user/:id` with the token.
    - Expected Responses:
        - `204 No Content`: Success.
        - `401 Unauthorized`: Missing or invalid token.
        - `404 Not Found`: User does not exist.

If your token is invalid, regenerate it by sending a `POST` request to `/v1/auth/login` with the user's email and password:
```json
{
  "email": "user@mail.com",
  "password": "user_password"
}
```
you will receive a new token as a response

### Categories Routes

#### Create a Category

To create a category, make a `POST` request to the route:

`POST /v1/category`

#### Request Body Example:

```json
{
  "name": "Shoes",
  "slug": "shoes",
  "use_in_menu": true
}
```

#### Response:

- **201 Created** - Returned when the category is successfully created.

---

#### Get All Categories

To see all categories, make a `GET` request to the route:

`GET /v1/category/search`

#### Get a Category by ID

To see a specific category by ID, make a `GET` request to the route:

`GET /v1/category/:id`

Replace `:id` with the respective ID of the category you want to retrieve.

---

#### Update a Category

To update a category, make a `PUT` request to the route:

`PUT /v1/category/:id`

Replace `:id` with the respective category ID.

#### Request Body Example:

```json
{
  "name": "Shoes",
  "slug": "shoes",
  "use_in_menu": true
}
```

#### Response:

- **204 No Content** - Returned when the request is successful, but no content is returned in the body.

---

#### Delete a Category

To delete a category, make a `DELETE` request to the route:

`DELETE /v1/category/:id`

Replace `:id` with the respective ID of the category you want to delete.

#### Response:

- **204 No Content** - Returned when the request is successful, but no content is returned in the body.


### Product Route

#### Create a Product

To create a product, make a `POST` request to the route:

`POST /v1/product`

#### Request Body Example:

```json
{  
  "enabled": true,  
  "name": "Produto 2",  
  "slug": "produto-2",  
  "stock": 10,  
  "description": "Descrição do produto 2",  
  "price": 250.90,  
  "price_with_discount": 199.90,  
  "category_ids": [1],  
  "images": [  
    {  
      "type": "image/png",  
      "content": "base64 da imagem 1"  
    },  
    {  
      "type": "image/png",  
      "content": "base64 da imagem 2"  
    },  
    {  
      "type": "image/jpg",  
      "content": "base64 da imagem 3"  
    }  
  ],  
  "options": [  
    {  
      "title": "Cor",  
      "shape": "square",  
      "radius": "4px",  
      "type": "text",  
      "values": ["PP", "GG", "M"]  
    },  
    {  
      "title": "Tamanho",  
      "shape": "circle",  
      "type": "color",  
      "values": ["#000", "#333"]  
    }  
  ]  
}
```

#### Get All Products

To see all products, make a `GET` request to the route:

`GET /v1/product/search`

#### Get a Product by ID

To see a specific product by ID, make a `GET` request to the route:

`GET /v1/product/:id`

Replace `:id` with the respective ID of the product you want to retrieve.

---

#### Update a Product

To update a product, make a `PUT` request to the route:

`PUT /v1/product/:id`

Replace `:id` with the respective product ID.

#### Request Body Example:

```json
{
  "enabled": true,
  "name": "Produto 01 atualizado",
  "slug": "produto-01-atualizado",
  "stock": 20,
  "description": "Descrição do produto 01 atualizado",
  "price": 49.9,
  "price_with_discount": 0,
  "category_ids": [1],
  "images": [ 
    {
      "type": "image/png",
      "content": "base64 da imagem 1" 
    },
    {
      "id": 2,
      "deleted": true
    },
    {
      "id": 3,
      "content": "base64 da imagem 3" 
    },
    {
      "id": 1,
      "content": "https://store.com/media/product-01/image-01.jpg"
    }
  ],
  "options": [
    {
      "id": 1,
      "deleted": true
    },
    {
      "id": 2,
      "radius": "10px",
      "values": ["42/43", "44/45"]
    },
    {
      "title": "Tipo",
      "shape": "square",
      "type": "text",
      "values": ["100% algodão", "65% algodão"]
    }
  ]
}
```

#### Response:

- **204 No Content** - Returned when the request is successful, but no content is returned in the body.

---

#### Delete a Product

To delete a product, make a `DELETE` request to the route:

`DELETE /v1/product/:id`

Replace `:id` with the respective ID of the product you want to delete.

#### Response:

- **204 No Content** - Returned when the request is successful, but no content is returned in the body.

---

And that's it! We have finished the tests that are ready so far. Due to time constraints, it was not possible to complete all the endpoints. However, in the future, I will leave the project complete! Thank you for your patience in advance. If you need anything, send me a DM.

