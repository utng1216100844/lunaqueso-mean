require('dotenv').config();
require('./config/config');
require('./database');
require('./config/passportConfig');

const express = require('express'),
    path = require('path'),
    morgan = require('morgan'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    passport = require('passport');

const rtsIndex = require('./routes/index.router');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api', rtsIndex);
app.use(express.static('./dist/mean-lunadequeso'));

//Manda llamar al componente principal de la app.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/dist/mean-lunadequeso/server/index.js'));
});

// error handler
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});

// Rutas
app.use(process.env.URL_CLIENT, require('./routes/client.routes'));
app.use(process.env.URL_DISCOUNT, require('./routes/discount.routes'));
app.use(process.env.URL_PRODUCT, require('./routes/product.routes'));
app.use(process.env.URL_PROMOTION, require('./routes/promotion.routes'));
app.use(process.env.URL_PROVIDER, require('./routes/provider.routes'));
app.use(process.env.URL_PURCHASE, require('./routes/purchase.routes'));
app.use(process.env.URL_ROL, require('./routes/rol.routes'));
app.use(process.env.URL_USER, require('./routes/user.routes'));
app.use(process.env.URL_TYPEPRODUCT, require('./routes/tipo_producto.routes'));
app.use(process.env.URL_PQUANTITY, require('./routes/quantityproduct.routes'));
// app.use(process.env.URL_PROCVENTA, require('./routes/pVenta.routes'));
// app.use(process.env.URL_ORDER, require('./routes/order.routes'));

app.listen(process.env.PORT, () => {
    console.log(`Server started in ${process.env.PORT}`);
});
