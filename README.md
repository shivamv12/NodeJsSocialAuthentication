# 🔐 NodeJs Social Authentication
OAuth(or Open Authorization) is the approach for authenticating end-user. It makes your application much easier and handy for an end-user, as they can eaily choose a social login (Facebook, Google or Twitter and so forth) to signup, instead of filling a boring traditional form with some labels &amp; inputs.

## 💻 Prerequisites
- You must have a good knowledge of NodeJs.
  - (How nodejs works, how their middleware helps to intercept the requests, how to handle routes in Nodejs etc.)
- You should have a basic idea of <a href="https://www.digitalocean.com/community/tutorials/an-introduction-to-oauth-2">How OAuth Works</a>.
- At last but not least, MongoDB basic query (CRUD) knowledge & some mongo driver (like <a href="https://mongoosejs.com/">Mongoose</a>) to connect NodeJs to MongoDB Server.

## 🌀 Clone the Repository
By running the following command on your terminal you will be able to clone this repository.

```
/$ git clone https://github.com/shivamv12/NodeJsSocialAuthentication.git
```

After clone the repository, go inside the repo-folder & install all the project dependencies. 🏗

```
/$ cd NodeJsSocialAuthentication ↵ 
/NodeJsSocialAuthentication $ npm i
```

Once you install all the dependecies, only thing you need to do is, create ```environment``` file and provide all the key's value.
(For reference, there is one ```.env.example``` file available, there you will find all the required KEYS to run this project.)

For Twitter API Keys/Secret: Create <a href="https://developer.twitter.com/en/portal/dashboard">Project/App</a><br/>
For Google API Keys/Secret: Create <a href="https://console.cloud.google.com/getting-started">Project/App</a><br/>
For Facebook / Instagram API Keys/Secret: Create <a href="https://developers.facebook.com/apps/">Project/App</a>

After getting all the API keys/secret paste them inside ```.env``` file. And run your project using following command. 
```
/NodeJsSocialAuthentication $ npm run dev
```

After successfully running the project, you will see following screen.<br/>


![Screenshot from 2021-05-16 15-07-08](https://user-images.githubusercontent.com/18550912/118392681-6acb0780-b658-11eb-9813-a191b0539172.png)
