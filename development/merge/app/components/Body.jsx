var React = require('react');
var Header = require('Header');
var Footer = require('Footer');

var Body = (props) => {
    return(
        <div>
            <Header/>
            {props.children}
            <Footer/>
        </div>
    );
};

module.exports = Body;