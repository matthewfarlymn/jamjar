var React = require('react');
var CtaRegister = require('CtaRegister');

var About = React.createClass({
    render: function() {
        return(
            <div>
                <section className="about">
                    <div className="row container">
                        <div className="col-xs">
                            <h1>About</h1>
                            <p>Lorem ipsum dolor sit amet, sapien etiam, nunc amet dolor ac odio mauris justo. Luctus arcu, urna praesent at id quisque ac. Arcu es massa vestibulum malesuada, integer vivamus elit eu mauris eus, cum eros quis aliquam wisi. Nulla wisi laoreet suspendisse integer vivamus elit eu mauris hendrerit facilisi, mi mattis pariatur aliquam pharetra eget.</p>
                            <p>Lorem ipsum dolor sit amet, sapien etiam, nunc amet dolor ac odio mauris justo. Luctus arcu, urna praesent at id quisque ac. Arcu es massa vestibulum malesuada, integer vivamus elit eu mauris eus, cum eros quis aliquam wisi. Nulla wisi laoreet suspendisse integer vivamus elit eu mauris hendrerit facilisi, mi mattis pariatur aliquam pharetra eget.</p>
                            <h2>Subheading</h2>
                            <ul>
                                <li>Item 1</li>
                                <li>Item 2</li>
                                <li>Item 3</li>
                                <li>Item 4</li>
                                <li>Item 5</li>
                                <li>Item 6</li>
                            </ul>
                            <p>Lorem ipsum dolor sit amet, sapien etiam, nunc amet dolor ac odio mauris justo. Luctus arcu, urna praesent at id quisque ac. Arcu es massa vestibulum malesuada, integer vivamus elit eu mauris eus, cum eros quis aliquam wisi. Nulla wisi laoreet suspendisse integer vivamus elit eu mauris hendrerit facilisi, mi mattis pariatur aliquam pharetra eget.</p>
                        </div>
                    </div>
                </section>
                <CtaRegister/>
            </div>
        );
    }
});

module.exports = About;