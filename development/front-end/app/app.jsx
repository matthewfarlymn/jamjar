var React = require('react');
var ReactDOM = require('react-dom');
var {Route, Router, IndexRoute, browserHistory} = require('react-router');
var Main = require('Main');
var Weather = require('Weather');
var About = require('About');
var Products = require('Products');

// App css
require('style!css!sass!ApplicationStyles')

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={Main}>
            <Route path="about" component={About} />
            <Route path="products" component={Products} />
            // <IndexRoute component={Weather} />
        </Route>
    </Router>,
    document.getElementById('app')
);