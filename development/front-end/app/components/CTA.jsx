var React = require('react');

var CTA = React.createClass({
    render: function() {
        return(
            <section className="cta">
                <div className="row center-xs container">
                    <div className="col-xs-8">
                        <h1>Join Today!</h1>
                        <h2>Sweet rewards are just around the corner</h2>
                        <p>Lorem ipsum dolor sit amet, sapien etiam, nunc amet dolor ac odio mauris justo. Luctus arcu, urna praesent at id quisque ac. Arcu es massa vestibulum malesuada, integer vivamus elit eu mauris eus, cum eros quis aliquam wisi. Nulla wisi laoreet suspendisse integer vivamus elit eu mauris hendrerit facilisi, mi mattis pariatur aliquam pharetra eget.</p>
                        <a className="button brown" href="/">Register</a>
                    </div>
                </div>
            </section>
        );
    }
});

module.exports = CTA;