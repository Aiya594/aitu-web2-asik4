## Endpoints

GET {{baseUrl}}/health

POST {{baseUrl}}/api/auth/register
POST {{baseUrl}}/api/auth/login
POST {{baseUrl}}/api/auth/logout

GET {{baseUrl}}/api/users/profile
PUT {{baseUrl}}/api/users/profile

POST {{baseUrl}}/api/bookings
GET {{baseUrl}}/api/bookings
GET {{baseUrl}}/api/bookings/{{bookingId}}
PUT {{baseUrl}}/api/bookings/{{bookingId}}
DELETE {{baseUrl}}/api/bookings/{{bookingId}}


GET {{baseUrl}}/api/menu
POST /api/menu
PUT /api/menu/{{menuId}}
DELETE /api/menu/{{menuId}}
