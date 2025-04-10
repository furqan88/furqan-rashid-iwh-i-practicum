const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require('dotenv').config();

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS_TOKEN = process.env.PRIVATE_APP_ACCESS;
const PLANT_CUSTOM_OBJECT_ID = process.env.CUSTOM_OBJECT_PLANT;

const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json'
  };
  
// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Get the custom object Plants 
app.get('/', async (req, res) => {
    const apiURL = `https://api.hubapi.com/crm/v3/objects/${PLANT_CUSTOM_OBJECT_ID}?properties=name,description,species`;
  
    try {
        const response = await axios.get(apiURL, {
          headers
        });
        const records = response.data.results;
        res.render('homepage', {
          pageTitle: 'Plants Records',
          plants: records
        });
      } catch (err) {
        console.error('Error fetching records:', err.message);
        res.status(500).send('Failed to fetch records');
      }
  });
// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

// * Code for Route 2 goes here
// Route 2: Show Plant object form
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        pageTitle: 'Update Plant Custom Object Form | Integrating With HubSpot I Practicum'
    });
  });
// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here | Handle form submission to add new record 
app.post('/update-cobj', async (req, res) => {
    const { name, species, description } = req.body;
    const customObjectURL = `https://api.hubapi.com/crm/v3/objects/${PLANT_CUSTOM_OBJECT_ID}`;

    const newRecord = {
      properties: {
        name,
        species,
        description
      }
    };
  
    try {
      await axios.post(customObjectURL, newRecord, { headers });
      res.redirect('/');
    } catch (err) {
      console.error('Error creating record:', err);
      res.status(500).send('Failed to create record');
    }
  });
/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));