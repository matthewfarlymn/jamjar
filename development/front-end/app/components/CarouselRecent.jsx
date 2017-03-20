var React = require('react');

var CarouselRecent = React.createClass({
    render: function() {
        return(
            <section className="carousel grey">
                <header className="row middle-xs container">
                    <div className="col-xs-6">
                        <h1>Recently Added</h1>
                    </div>
                    <div className="col-xs-6 end-xs">
                        <a className="button pink" href="/products">See All</a>
                    </div>
                </header>
                <div className="row container">
                    <div className="col-xs-12 col-sm-6 col-md-3">
                        <img src={'./assets/images/jam-jar_AdobeStock_84330027.jpg'} alt="Logo"/>
                        <h3>Blueberry</h3>
                        <p>Excerpt ipsum dolor sit amet, sapien etiam, nunc amet dolor ac odio mauris justo.<a href="/">Learn More</a></p>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3">
                        <img src={'./assets/images/jam-jar_AdobeStock_84330027.jpg'} alt="Logo"/>
                        <h3>Blueberry</h3>
                        <p>Excerpt ipsum dolor sit amet, sapien etiam, nunc amet dolor ac odio mauris justo.<a href="/">Learn More</a></p>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3">
                        <img src={'./assets/images/jam-jar_AdobeStock_84330027.jpg'} alt="Logo"/>
                        <h3>Blueberry</h3>
                        <p>Excerpt ipsum dolor sit amet, sapien etiam, nunc amet dolor ac odio mauris justo.<a href="/">Learn More</a></p>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-3">
                        <img src={'./assets/images/jam-jar_AdobeStock_84330027.jpg'} alt="Logo"/>
                        <h3>Blueberry</h3>
                        <p>Excerpt ipsum dolor sit amet, sapien etiam, nunc amet dolor ac odio mauris justo.<a href="/">Learn More</a></p>
                    </div>
                </div>
            </section>
        );
    }
});

module.exports = CarouselRecent;