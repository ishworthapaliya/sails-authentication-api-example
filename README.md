# simple-authentication

a [Sails](http://sailsjs.org) application with simple authentication API.


##Clone and install dependency

```
git clone https://github.com/ishworthapaliya/sails-authentication-api-example.git
npm install
```


##Routes

see config/routes.js
see api/controllers/UserController.js

```
'POST /signup': 'UserController.signup',
'PUT /login': 'UserController.login',
'GET /logout': 'UserController.logout',
'GET /me': 'UserController.loggedInUser'
```

##Signup

Create user: (`POST`, `/signup`)

```
{
    "email": "test@test.tld",
    "password": "mypassword",
    "name": "Mister Tester",
}
```

##Log in

Log in: (`PUT`, `/signup`)

```
{
    "email": "test@test.tld",
    "password": "mypassword"
}
```

##Log out

Log out: (`GET`, `/logout`)