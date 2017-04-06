var React = require('react');
var CtaRegister = require('CtaRegister');
var axios = require('axios');

var Products = React.createClass({

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
            <div>
                <section className="products">
                    <header className="row middle-xs container">
                        <div className="col-xs-12">
                            <h1>Products</h1>
                        </div>
                    </header>
                    <div className="row container">
                        {this.state.products.map(function(product) {
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
                <CtaRegister/>
            </div>
        );
    }
});

module.exports = Products;