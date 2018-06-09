const express = require('express')
const bodyParser = require('body-parser')
const form = require('express-form')
const field = form.field;
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post('/generate',
       form(
         field("tenant_name").trim().required().is(/^[a-z]+$/),
         field("tenant_address").trim().required().is(/^[a-z]+$/)
       ),
       function(req, res) {
         console.log("complete form:", req.form);
         if (!req.form.isValid) {
           console.log(req.form.errors);
         } else {
           console.log("tenant_name:", req.form.tenant_name);
           console.log("tenant_address:", req.form.tenant_address);

           res.render('pages/lease.ejs')
         }
       }
  )
  .listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`))
