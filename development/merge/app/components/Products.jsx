var React = require('react');
var CtaRegister = require('CtaRegister');

var products = [];

for (var i = 0; i < 12; i++) {
    products.push(<div className="col-xs-12 col-sm-6 col-md-3">
        <img src={'./assets/images/jam-jar_AdobeStock_84330027.jpg'} alt="Logo"/>
        <h3>Blueberry {i}</h3>
        <p>Excerpt ipsum dolor sit amet, sapien etiam, nunc amet dolor ac odio mauris justo.<a href="/">Learn More</a></p>
    </div>)
}

var Products = React.createClass({
    render: function() {
        return(
            <div>
                <section className="products">
                    <header className="row middle-xs container">
                        <div className="col-xs-12">
                            <h1>Products</h1>
                        </div>
                    </header>
                    <div className="row container">
                        {products}
                    </div>
                </section>
                <CtaRegister/>
            </div>
        );
    }
});

module.exports = Products;