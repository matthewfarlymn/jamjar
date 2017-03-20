var React = require('react');

var Slider = React.createClass({
    render: function() {
        return(
            <section className="slider">
                <div className="row reverse middle-xs container">
                    <div className="col-xs-12 col-sm-6">
                        <img src="../assets/images/jam-jar_AdobeStock_84330027.jpg" alt="Logo"/>
                    </div>
                    <div className="col-xs-12 col-sm-6">
                        <h1>Blueberry's Back</h1>
                        <p>Lorem ipsum dolor sit amet, sapien etiam, nunc amet dolor ac odio mauris justo. Luctus arcu, urna praesent at id quisque ac. Arcu es massa vestibulum malesuada, integer vivamus elit eu mauris eus, cum eros quis aliquam wisi. Nulla wisi laoreet suspendisse integer vivamus elit eu mauris hendrerit facilisi, mi mattis pariatur aliquam pharetra eget.</p>
                        <a className="button gold" href="/">Learn More</a>
                        <a className="button pink" href="/">Buy Now</a>
                    </div>
                </div>
            </section>
        );
    }
});

module.exports = Slider;