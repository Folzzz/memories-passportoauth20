
## Packages
    - express : web framework to create routes
    - mongoose : to work with database (mongodb)
    - connect-mongo : allows us to store our session in the database, so we dont get logged-out when we restart server
    - express-handlebars : template engine
    - express-sessions : for sessions and cookies
    - dotenv : for config, environment variables
    - method-override : makes us put put and delete request from our template (default allows only get and post)
    - moment : for date format
    - morgan : for logging
    - passport : for authentication
    - passport-google-oauth20 : we are authenticating with google, so we use passport google oauth v2.0
    - nodemon : devdependency - watches server everytime we make changes
    - cross-env : devdependency - this allows global environment variable, depending on the operating system been used