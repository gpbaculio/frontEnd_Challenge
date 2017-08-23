import express          from 'express';
import graphQLHTTP      from 'express-graphql';
import path             from 'path';
import webpack          from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { schema }       from './data/schema';
import { getUser }      from './auth';
import mongoose         from 'mongoose';
import bluebird from 'bluebird';

const APP_PORT     = 4000;
const GRAPHQL_PORT = 8080;

  var mongodbUri = 'mongodb://glendon:ethanbasty@ds151909.mlab.com:51909/gpbdatabasetest';
  var options    = { 
                    server:  { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }, 
                   };       
  mongoose.Promise = bluebird;
  mongoose.connect(mongodbUri, options);
  const db = mongoose.connection;
        db.on('error', (e) => console.log(e))
          .once('open', () => console.log('Connection to Database established.'))

const graphQLServer = express();
      graphQLServer.use('/', graphQLHTTP(async (req) => {
       let { user } = await getUser(req.headers.authorization); 
       if(!user) {
        user = 'guest'
       }
        return { 
          schema, 
          pretty: true,
          graphiql: true,
           context: {
             user,
         }
        }
      }));

      graphQLServer.listen(GRAPHQL_PORT, () => console.log(
        `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
      ));

// Serve the Relay app
const compiler = webpack({
  entry: ['whatwg-fetch', path.resolve(__dirname, 'js', 'index.js')],
  module: {
    loaders: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        test: /\.js$/,
      },  
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      }
    ],
  },
  output: {filename: 'app.js', path: '/',publicPath:'/'},
});

const app = new WebpackDevServer(compiler, {
  contentBase: '/public/',
  proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
  publicPath: '/js/',
  stats: {colors: true},
    hot: true,
  historyApiFallback: true,// 
  historyApiFallback: {    // used this options for auth
    index: 'index.html',  
     disableDotRule: true,
  htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
  } 
});

// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'public')));
app.listen(APP_PORT, () => {
  console.log(`App is now running on http://localhost:${APP_PORT}`);
});
