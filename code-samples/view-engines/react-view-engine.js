var path = require('path');
var ReactEngine = require('react-engine');

    // create an engine instance
    var engine = ReactEngine.server.create({
        reactRoutes:'./routes.jsx'
    });

    // view engine setup react engine
    server.engine('.js', engine);

    // set the view directory
    server.set('views', path.join(__dirname, '/app/universal/handlers'));

    // set jsx or js as the view engine
    // (without this you would need to supply the extension to res.render())
    // ex: res.render('index.jsx') instead of just res.render('index').
    server.set('view engine', 'js');

    // finally, set the custom view
    server.set('view', require('react-engine/lib/expressView'));
    server.set('view', require('react-engine/lib/expressView'));