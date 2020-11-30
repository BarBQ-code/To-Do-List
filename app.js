const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

let items = ['Eat', 'Sleep', 'Rave', 'Repeat'];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    let today = new Date();
    const options = 
    {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };
    let day = today.toLocaleDateString("en-US", options);

    res.render('list', {kindOfDay: day, newListItem: items});

});

app.post('/', (req, res) => {
    item = req.body.newItem;
    items.push(item);
    res.redirect('/');
});

app.listen(PORT, () => {
    console.log('Server Listening On Port: ' + PORT);
});