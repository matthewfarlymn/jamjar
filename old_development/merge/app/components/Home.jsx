var React = require('react');
var Slider = require('Slider');
var CtaRegister = require('CtaRegister');
var CarouselPopular = require('CarouselPopular');
var CarouselRecent = require('CarouselRecent');
var CtaContact = require('CtaContact');

var Home = React.createClass({
    render: function() {
        return(
            <div>
                <Slider/>
                <CtaRegister/>
                <CarouselPopular/>
                <CarouselRecent/>
                <CtaContact/>
            </div>
        );
    }
});

module.exports = Home;