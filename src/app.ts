import express from 'express';
import path from 'path';
import nunjucks from 'nunjucks';
import * as process from "node:process";
import {getCompanies, getCompany, setupCompany} from "./lib/docsapp";
import {Company} from "./lib/docsapp-model";

const app = express();
const port = Number.parseInt(process.env.PORT || "3000");
const host = process.env.HOST || '0.0.0.0';

// Setup Nunjucks templating engine
nunjucks.configure(
    ['node_modules/govuk-frontend/dist', 'views'],
    {
        autoescape: true,
        express: app,
        watch: true
    }
);

app.set('view engine', 'njk');

// Middleware to serve static files from GOV.UK Frontend
app.use('/govuk', express.static(path.join('node_modules', 'govuk-frontend', 'dist', 'govuk')));
app.use('/assets', express.static(path.join('node_modules', 'govuk-frontend', 'dist', 'govuk', 'assets')));

// Include custom assets if needed
app.use(express.static('public'));

// Middleware: this is necessary to parse request body, otherwise it remains undefined
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home route for homepage
app.get('/', (req, res) => {
    res.render('index', {
        page: 'home',
        heading: 'Welcome to Companies House Registry',
        description: 'A basic company registry for Companies House.'
    });
});

// Basic route for about
app.get('/about', (req, res) => {
    res.render('about', {
        page: "about",
        heading: 'The Companies House Junior Devs',
        description: 'Get to know the new team of Junior Devs at Companies House!'
    });
});

// Sample code for companies endpoint
app.get('/companies', async (req, res) => {
    let rows = await getCompanies();
    console.log("Retrieved list of companies");
    console.log(rows);
    res.render('list', {
        page: "list",
        heading: 'The Companies House Registry',
        description: 'List of all companies',
        companies: rows
    });
});

// Sample code for companies endpoint
app.get('/companies/:number', async (req, res) => {
    let row = await getCompany(Number.parseInt(req.params.number));
    res.render('view', {
        page: "list",
        heading: 'The Companies House Registry',
        description: `Company details for #${req.params.number}`,
        company: row
    });
});

// Sample code for company registration endpoint
app.get('/register', (req, res) => {
    res.render('new', {
        page: "new",
        heading: 'The Companies House Registry',
        description: 'Register a new company with us.'
    });
});

app.post('/register', async (req, res) => {
    let incDate = undefined;
    if (req.body['companyInc-day'] && req.body['companyInc-month'] && req.body['companyInc-year']) {
        incDate = new Date(req.body['companyInc-year'], req.body['companyInc-month'], req.body['companyInc-day']);
    }
    let company: Company = {
        active: req.body.companyActive == 'active',
        companyName: req.body.companyName,
        incorporatedOn: incDate,
        registeredAddress: req.body.companyAddress,
        type: req.body.companyType
    };
    console.log("Posting new company data")
    console.log(company)
    let newCompany = await setupCompany(company);
    console.log("Posted new company data")
    console.log(newCompany)
    res.render('view', {
        page: "new",
        heading: 'The Companies House Registry',
        description: 'Your company was registered.',
        company: newCompany
    });
});

// Start the server
app.listen(port, host, () => {
    console.log(`Application is running on http://${host}:${port}`);
});
