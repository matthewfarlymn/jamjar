var React = require('react');

var popular_products = [];

for (var i = 0; i < 4; i++) {
    popular_products.push(<div className="col-xs-12 col-sm-6 col-md-3">
        <img src={'./assets/images/jam-jar_AdobeStock_84330027.jpg'} alt="Logo"/>
        <h3>Blueberry {i}</h3>
        <p>Excerpt ipsum dolor sit amet, sapien etiam, nunc amet dolor ac odio mauris justo.<a href="/">Learn More</a></p>
    </div>)
}

var CarouselPopular = React.createClass({
    render: function() {
        return(
            <section className="carousel">
                <header className="row middle-xs container">
                    <div className="col-xs-6">
                        <h1>Popular Picks</h1>
                    </div>
                    <div className="col-xs-6 end-xs">
                        <a className="button pink" href="/products">See All</a>
                    </div>
                </header>
                <div className="row container">
                    {popular_products}
                </div>
            </section>
        );
    }
});

module.exports = CarouselPopular;