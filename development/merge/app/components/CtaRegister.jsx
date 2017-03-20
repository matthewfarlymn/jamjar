var React = require('react');

var CtaRegister = React.createClass({
    render: function() {
        return(
            <section className="cta register">
                <div className="row center-xs container">
                    <div className="col-xs col-md-8">
                        <h1>Join Today!</h1>
                        <h2>Sweet rewards are just around the corner</h2>
                        <p>Lorem ipsum dolor sit amet, sapien etiam, nunc amet dolor ac odio mauris justo. Luctus arcu, urna praesent at id quisque ac. Arcu es massa vestibulum malesuada, integer vivamus elit eu mauris eus, cum eros quis aliquam wisi. Nulla wisi laoreet suspendisse integer vivamus elit eu mauris hendrerit facilisi, mi mattis pariatur aliquam pharetra eget.</p>
                        <a className="button brown" href="/access">Register</a>
                    </div>
                </div>
            </section>
        );
    }
});

module.exports = CtaRegister;