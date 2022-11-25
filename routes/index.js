var express = require('express');
var router = express.Router();
var multer = require('multer');
var fs = require('fs');
var path = require("path");
var upload = multer({dest:"./public/images/uploads/"});

var copy_list_of_users = JSON.parse(JSON.stringify(require('../users.json')));
var list_of_users = [];
for (let key in copy_list_of_users)
{
  copy_list_of_users[key].index = Number(key);
  if (typeof(copy_list_of_users[key].friends) == "undefined")
  {
    copy_list_of_users[key].friends = [];
  }
  if (typeof(copy_list_of_users[key].news) == "undefined")
  {
    copy_list_of_users[key].news = [];
  }
  if (typeof(copy_list_of_users[key].messages) == "undefined")
  {
    copy_list_of_users[key].messages = [];
  }
  list_of_users.push(copy_list_of_users[key]);
}

for (let i = 0; i < list_of_users.length; i++)
{
  if (list_of_users[i].messages.length == 0)
  {
    for (let j = 0; j < list_of_users.length; j++)
    {
      list_of_users[i].messages.push([]);
    }
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('users', {users: list_of_users});
});

router.put('/messages/:num(\\d+)', function (req, res, next)
{
  let body = req.body;
  let index = body.index;
  let text = body.text;
  let self_index = Number(req.params.num);

  console.log(Number(index));
  console.log(self_index);
  console.log(list_of_users[self_index].messages);
  console.log( list_of_users[index].messages);
  list_of_users[self_index].messages[index].push(`Вы: ${text}`);
  list_of_users[index].messages[self_index].push(`Вам: ${text}`);

  res.json({fromserver: "ok"});
});

router.get('/messages/:num(\\d+)', function (req, res, next)
{
  res.render('messages', {users: list_of_users, hide_user: Number(req.params.num)});
});

router.delete('/news/:num(\\d+)', function (req, res, next)
{
  let index = req.body.index;

  list_of_users[index].news = [];

  res.json({fromserver: "ok"});
});

router.put('/friends/:num(\\d+)', function (req, res, next)
{
  let index = req.body.index;
  let self_index = req.body.self_index;

  list_of_users[index].friends.push(Number(self_index));
  list_of_users[self_index].friends.push(Number(index));

  list_of_users[index].news.push(`${list_of_users[index].name} добавил в друзья ${list_of_users[self_index].name}`);
  list_of_users[self_index].news.push(`${list_of_users[self_index].name} добавил в друзья ${list_of_users[index].name}`);

  /*for (let i = 0; i < list_of_users[index].friends.length; i++)
  {
    list_of_users[list_of_users[index].friends[i]].news.push(`${list_of_users[index].name} добавил в друзья ${list_of_users[self_index].name}`);
  }

  for (let i = 0; i < list_of_users[self_index].friends.length; i++)
  {
    list_of_users[list_of_users[self_index].friends[i]].news.push(`${list_of_users[self_index].name} добавил в друзья ${list_of_users[index].name}`);
  }*/

  res.json({fromserver: "ok"});
});

router.delete('/friends/:num(\\d+)', function (req, res, next)
{
  let index = Number(req.body.index);
  let self_index = Number(req.body.self_index);

  for (let i = 0; i < list_of_users[index].friends.length; i++)
  {
    if (list_of_users[index].friends[i] == self_index)
    {
      list_of_users[index].friends.splice(i, 1);
      break;
    }
  }

  for (let i = 0; i < list_of_users[self_index].friends.length; i++)
  {
    if (list_of_users[self_index].friends[i] == index)
    {
      list_of_users[self_index].friends.splice(i, 1);
      break;
    }
  }

  list_of_users[index].news.push(`${list_of_users[index].name} и ${list_of_users[self_index].name} теперь не друзья`);
  list_of_users[self_index].news.push(`${list_of_users[self_index].name} и ${list_of_users[index].name} теперь не друзья`);

  /*for (let i = 0; i < list_of_users[index].friends.length; i++)
  {
    list_of_users[list_of_users[index].friends[i]].news.push(`${list_of_users[index].name} и ${list_of_users[self_index].name} теперь не друзья`);
  }

  for (let i = 0; i < list_of_users[self_index].friends.length; i++)
  {
    list_of_users[list_of_users[self_index].friends[i]].news.push(`${list_of_users[self_index].name} и ${list_of_users[index].name} теперь не друзья`);
  }*/

  res.json({fromserver: "ok"});
});

router.get('/news/:num(\\d+)', function (req, res, next)
{
  let index = Number(req.params.num);
  let list_of_friends = [];

  for (let i = 0; i < list_of_users.length; i++)
  {
    if (list_of_users[i].friends.includes(index))
    {
      list_of_friends.push(list_of_users[i]);
    }
  }
  res.render('news', {users: list_of_friends, self_index: index});
});

router.get('/friends/:num(\\d+)', function (req, res, next)
{
  let index = Number(req.params.num);
  let list_of_friends = [];
  let list_of_unfriends = [];

  for (let i = 0; i < list_of_users.length; i++)
  {
    if (list_of_users[i].friends.includes(index))
    {
      list_of_friends.push(list_of_users[i]);
    }
    else if (list_of_users[i].index != index)
    {
      list_of_unfriends.push(list_of_users[i]);
    }
  }
  res.render('friends', {users: list_of_friends, unusers: list_of_unfriends, self_index: index});
});

router.delete('/', function (req, res, next)
{
  let index = req.body.index;
  let file;

  /*for (let i = 0; i < list_of_users[index].friends.length; i++)
  {
    list_of_users[list_of_users[index].friends[i]].news.push(`${list_of_users[index].name} удалил свою страницу`);
  }*/

  list_of_users.splice(index, 1);
  for (let i = 0; i < list_of_users.length; i++)
  {
    list_of_users[i].index = i;
    file = path.join('./public/images/', `${i}.jpg`);
    //req.file.originalname
    fs.rename(`./public/images/${list_of_users[i].image}.jpg`, file, function (err) {});
    list_of_users[i].image = i;
    for (let j = 0; j < list_of_users[i].friends.length; j++)
    {
      if (list_of_users[i].friends[j] == index)
      {
        list_of_users[i].friends.splice(j, 1);
        break;
      }
    }
    for (let j = 0; j < list_of_users[i].friends.length; j++)
    {
      if (list_of_users[i].friends[j] > index)
      {
        list_of_users[i].friends[j] = list_of_users[i].friends[j] - 1;
      }
    }
    list_of_users[i].messages.splice(index, 1);
  }

  res.json({fromserver:"ok"});
});

router.post("/", function (req, res, next)
{
  let body = req.body;

  let name = body.name;
  let email = body.email;
  let birthday = body.birthday;
  let role = body.role;
  let status = body.status;

  let index = 0;

  let indexes = [];

  if (name && email && birthday && role && status)
  {
    for (let i = 0; i < list_of_users.length; i++)
    {
      indexes.push(list_of_users[i].index);
    }

    for (let i = 0; i < indexes.length; i++)
    {
      if(index < indexes[i])
      {
        index = indexes[i];
      }
    }

    index++

    list_of_users[index] = {"name": name, "birthday":birthday, "email":email, "image":`${index}`,
      "role": role, "status": status, "index": index, "friends": [], "news": [], "messages": []};

    for (let j = 0; j < list_of_users.length; j++)
    {
      list_of_users[index].messages.push([]);
      if (index != j)
      {
        list_of_users[j].messages.push([]);
      }
    }

  }

  res.json({"fromserver": index});
});

router.post("/upload", upload.single("image"), function(req, res, next)
{
  let file;

  file = path.join('./public/images/', `temp.jpg`);
  //req.file.originalname
  fs.rename(req.file.path, file, function (err) {});
  res.json({"fromserver": "ok1"});
});

router.put("/upload",  function(req, res, next)
{
  let file;
  let index = req.body.index;

  if (list_of_users[index].friends.length > 0)
  {
    for (let i = 0; i < list_of_users[index].friends.length; i++)
    {
      list_of_users[index].news.push(`${list_of_users[index].name} сменил фотографию`);
    }
  }

  file = path.join('./public/images/', `${index}.jpg`);
  //req.file.originalname
  fs.rename('./public/images/temp.jpg', file, function (err) {});
  //res.json({"fromserver": "ok2"});
  res.redirect("/");
});

router.put('/', function(req, res, next)
{
  let body = req.body;
  let index = body.index;
  let name = body.name;
  let email = body.email;
  let birthday = body.birthday;
  let role = body.role;
  let status = body.status;

  if(name)
  {

    list_of_users[index].news.push(`${list_of_users[index].name} поменял имя на ${name}`);

    list_of_users[index].name = name;
  }

  if(email)
  {

    list_of_users[index].news.push(`${list_of_users[index].name} поменял email на ${email}`);

    list_of_users[index].email = email;
  }

  if(birthday)
  {

    list_of_users[index].news.push(`${list_of_users[index].name} поменял дату рождения на ${birthday}`);

    list_of_users[index].birthday = birthday;
  }

  if(role)
  {
    list_of_users[index].news.push(`${list_of_users[index].name} теперь ${role}`);

    list_of_users[index].role = role;
  }

  if(status)
  {

    list_of_users[index].news.push(`${list_of_users[index].name} теперь имеет статус: ${status}`);

    list_of_users[index].status = status;
  }


  res.json({fromserver: "ok"});
  //res.render('users', {users: list_of_users});
});

module.exports = router;
module.exports.user_list = list_of_users;