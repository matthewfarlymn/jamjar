var React = require('react');
var Slider = require('Slider');
var CTA = require('CTA');

var Home = React.createClass({
    render: function() {
        return(
            <div>
                <Slider/>
                <CTA/>
            </div>
        );
    }
});

module.exports = Home;