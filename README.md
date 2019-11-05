# triforce-api



### How to generate documentation


1. `npm install apidoc -g`

2. `npm run doc`





### Version info

This app was originally generated on Sat Jan 20 2018 19:12:05 GMT+0500 (PKT) using Sails v1.0.0-45 _(internally: [`sails-generate@1.15.4`](https://github.com/balderdashy/sails-generate/tree/v1.15.4/lib/core-generators/new))_.



<!--
Note:  Generators are usually run using the globally-installed `sails` CLI (command-line interface).  This CLI version is _environment-specific_ rather than app-specific, thus over time, as a project's dependencies are upgraded or the project is worked on by different developers on different computers using different versions of Node.js, the Sails dependency in its package.json file may differ from the globally-installed Sails CLI release it was originally generated with.  (Be sure to always check out the relevant [upgrading guides](https://sailsjs.com/upgrading) before upgrading the version of Sails used by your app.  If you're stuck, [get help here](https://sailsjs.com/support).)
-->


# Developer Notes:
## Authentication
We use JWT token based authentication. It means whenever we want to protect a link we'll attach a jwt-token with the route.

Currently there are two types of auth.

1- user auth (for login and then accessing other user related routes e.g. profile)
2- link auth (only valid for the link token is generate for)
### 1 - user auth
when user logs in we generate a jwt-token for that user.
the token contains user object and ip of user. token object:
```
{
    user: {firstName, lastName, ...},
    requester: '192.168.0.1'    //user ip here
}
```
now when user tries to access any protected link that should only be allowed to logged-in user, then user need to send token in request

user can send token in header or as a parameter

if sending in header then header should be:
```
Authorization: Bearer JWT-TOKEN-HERE
```
or user can send as a paramter in url e.g.
```$xslt
http://localhost:1337/beta/user/profile?token=JWT-TOKEN-HERE
```
we validate tokens using policies. all policies are defined in `/api/policies` folder
and then we link these policies with controller functions in `/config/policies.js`

currently logged-in user information can be found in all controller functions by accessing `req.token.user`

### 2 - link auth
sometimes we need token only for one url e.g. when user want to update his email or activate account, then we need a token that we send with the url
to user's email address. when user clicks on link then we validate the token to check if this token is valid and not expired and also , if this token is 
allowed for current url or not. 

to generate a link-token, we follow this structure:
```
jwToken.issue({
    route: sails.config.BASE_URL + 'beta/user/update-email',    // link here. this token will be valid only for this link 
     data: {    // data here. anything that you want to put
         email: newEmail,
         email: newEmail,
         userId: userInfo.id
         userId: userInfo.id
     }
 }, sails.config.ACCOUNT_ACTIVATION_TOKEN_EXPIRY/*expiry date for the link*/);

```
this data that we send in `data` section of above token can be accessed in the link controller function by `req.payload`

Whenever you need to send links to someone to their email address, always use link-based auth
 