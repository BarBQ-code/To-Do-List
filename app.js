const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');

const app = express();
const PORT = 3000;


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = new mongoose.Schema({
    name: String
});

const Item = new mongoose.model("Item", itemsSchema);


const item1 = new Item({
    name: "Welcome!"
});

const item2 = new Item({
    name: "Hit the + button to add a new item."
});

const item3 = new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3];

const listsSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});

const defualtName = 'To Do List';

const List = new mongoose.model('List', listsSchema);

app.get('/', (req, res) => {

    Item.find({}, (err, foundItems) => {
        if(err) {
            console.log(err);
        } else {
            
            if(foundItems.length === 0){
                Item.insertMany(defaultItems, (err) => {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log("Inserted Successfuly");
                    }
                });
                res.redirect('/');
            }
            else{
                res.render('list', {listTitle: defualtName, newListItems: foundItems});

            }
            

        }
    });


});

app.get('/:customListName', (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, function(err, foundList){
      if (!err){
        if (!foundList){
          //Create a new list
          const list = new List({
            name: customListName,
            items: defaultItems
          });
          list.save();
          res.redirect("/" + customListName);
        } else {
          //Show an existing list
  
          res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
        }
      }
    });
});


app.post('/', (req, res) => {
    item = req.body.newItem;
    listName = req.body.button;
    console.log(listName);
    const itemToAdd = new Item({
        name: item
    });

    if(listName === defualtName) {
        itemToAdd.save();
        res.redirect('/');
    } else {
        List.findOne({name: listName}, (err, foundList) => {
            foundList.items.push(itemToAdd);
            foundList.save();
            res.redirect('/' + listName);
        });
    }

    
});

app.post('/delete', (req, res) => {
    const id = req.body.checkbox;
    const listName = req.body.listName;
    
    if(listName === defualtName) {
        Item.deleteOne({_id: id}, (err, result) =>{

            if(err) {
                console.log(err);
            } else {
                console.log(result);
            }
        });
        res.redirect('/');
    } else {
        List.findOneAndUpdate({name: listName}, {$pull : {items: {_id: id}}}, (err, foundList) => {
            if(!err) {
                res.redirect('/' + listName);
            }
        });
    }

    
    
});


app.listen(PORT, () => {
    console.log('Server Listening On Port: ' + PORT);
});