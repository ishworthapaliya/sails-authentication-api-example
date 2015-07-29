# simple-authentication

a [Sails](http://sailsjs.org) application with simple authentication API.


##Routes

```
'POST /signup': 'UserController.signup',
'PUT /login': 'UserController.login',
'GET /logout': 'UserController.logout',
'GET /me': 'UserController.getloggedInUser'
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