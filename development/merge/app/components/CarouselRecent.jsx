var React = require('react');
var axios = require('axios');

var CarouselRecent = React.createClass({

    getInitialState: function() {
        return {
            products: []
        }
    },

    componentDidMount: function() {
        var _this = this;
        this.serverRequest = axios
        .get("/api/Products")
        .then(function(response) {
            console.log(response);
            _this.setState({
                products: response.data
            });
        }) .catch(function (error) {
            console.log(error);
        });
    },

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
                    {this.state.products.slice(0, 4).map(function(product) {
                        return(
                            <div className="col-xs-12 col-sm-6 col-md-3" key={product.productId}>
                                <img src={product.productImage1} Image1 alt="Logo"/>
                                <h3>{product.productTitle}</h3>
                                <p>{product.productDesc}<a href="/">Learn More</a></p>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    }
});

module.exports = CarouselRecent;