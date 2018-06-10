const express = require('express')
const bodyParser = require('body-parser')
const form = require('express-form')
const field = form.field;
const path = require('path')
const PORT = process.env.PORT || 5000

express()
  .use(bodyParser())
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post('/generate',
       form(
         field("unit").required(),
         field("rent_amount").required(),
         field("tenant_name").required(),
         field("tenant_address").required(),
         field("cotenant_name"),
         field("cotenant_address"),
         field("caution_name"),
         field("caution_address")
       ),
       function(req, res) {
         console.log("complete body response:", req.body);
         console.log("complete form:", req.form);
         if (!req.form.isValid) {
           console.log(req.form.errors);
         } else {
           console.log("tenant_name:", req.form.tenant_name);
           console.log("tenant_address:", req.form.tenant_address);
           res.render('pages/lease.ejs', req.form)
         }
       }
  )
  .listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`))
