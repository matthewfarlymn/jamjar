var React = require('react');
var ReactDOM = require('react-dom');
var {Route, Router, IndexRoute, browserHistory} = require('react-router');
var Body = require('Body');
var Home = require('Home');
var Access = require('Access');
var About = require('About');
var Products = require('Products');

// App css
require('style!css!sass!ApplicationStyles')

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={Body}>
            <IndexRoute component={Home} />
            <Route path="access" component={Access} />
            <Route path="about" component={About} />
            <Route path="products" component={Products} />
        </Route>
    </Router>,
    document.getElementById('app')
);