// datadog integration
if (process.env.DYNO) { // only on heroku (not when run locally)
  var StatsD = require('hot-shots');
  var dogstatsd = new StatsD();
  // Increment a counter.
  dogstatsd.increment('page.views')
}
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator');

var writtenNumber = require('written-number');
writtenNumber.defaults.lang = 'fr';

express()
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post('/generate_lease',
    [
      body('unit').notEmpty().withMessage('Unit is required'),
      body('start_date').notEmpty().withMessage('Start date is required'),
      body('rent_amount').notEmpty().withMessage('Rent amount is required'),
      body('tenant_name').notEmpty().withMessage('Tenant name is required'),
      body('tenant_address').notEmpty().withMessage('Tenant address is required'),
      body('landlord_name').notEmpty().withMessage('Landlord name is required'),
      body('landlord_address').notEmpty().withMessage('Landlord address is required'),
      body('cotenant_name').optional(),
      body('cotenant_address').optional(),
      body('caution_name').optional(),
      body('caution_address').optional()
    ],
    (req, res) => {
      console.log("route generate_lease:");
      console.log("complete body response:", req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).render('pages/index', { errors: errors.array() });
      }
      const formData = { ...req.body };
      formData.rent_amount_written = writtenNumber(formData.rent_amount);
      res.render('pages/lease.ejs', formData);
    }
  )
  .post('/generate_information_document',
    [
      body('unit').notEmpty().withMessage('Unit is required'),
      body('rent_amount').notEmpty().withMessage('Rent amount is required'),
      body('landlord_name').notEmpty().withMessage('Landlord name is required'),
      body('landlord_email').notEmpty().withMessage('Landlord email is required').isEmail().withMessage('Invalid email'),
      body('landlord_phone').notEmpty().withMessage('Landlord phone is required')
    ],
    (req, res) => {
      console.log("route generate_information_document:");
      console.log("complete body response:", req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(400).render('pages/index', { errors: errors.array() });
      }
      const formData = { ...req.body };
      formData.rent_amount_written = writtenNumber(formData.rent_amount);
      res.render('pages/information_document.ejs', formData);
    }
  )
  .listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`))
