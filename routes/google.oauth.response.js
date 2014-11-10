var request = require('request');

module.exports = {

    handle: function (req, res) {
        console.log("google app authorisatin - query params");
        console.log(req.query);
        console.log("google app authorisatin - post params");
        console.log(req.body);
        console.log("google app authorisatin - original url");
        console.log(req.originalUrl);

        var emailFormParams = req.query.state;
        var form = {
            code: req.query.code,
            client_id: '421703536444-megt0e62oo4kjamdavcq451f61snfi70.apps.googleusercontent.com',
            client_secret: 'lSkDHrnRyTYIjxNqAU_s7UD9',
            redirect_uri: 'http://localhost:5000/googleOuathResponse',
            grant_type: 'authorization_code'
        };
        request.post({
            url: 'https://accounts.google.com/o/oauth2/token',
            form: form,
            json: true
        }, function (err, response, body) {
            console.log("google oauth body");
            console.dir(body);

            var headers = {
                'Authorization': 'Bearer ' + body.access_token
            };
            request.get({
                url: 'https://www.googleapis.com/plus/v1/people/me',
                headers: headers,
                json : true
            }, function (err, response, body) {
                var fromEmail = body.emails[0].value;
                console.dir(fromEmail);
                res.send(200);
            });
        });


    }

};