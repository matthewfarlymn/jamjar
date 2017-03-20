var React = require('react');
var {Link, IndexLink} = require('react-router');

var Header = React.createClass({
    render: function() {
        return(
            <header>
                <div className="row middle-xs container">
                    <nav className="col-xs col-sm-6">
                        <div className="row middle-xs">
                            <IndexLink to="/">
                                <img className="logo" src="../assets/images/jam-jar-logo.png" alt="Logo"/>
                            </IndexLink>
                            <ul className="primary-nav">
                                <li>
                                    <Link to="/about" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>About</Link>
                                </li>
                                <li>
                                    <Link to="/products" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>Products</Link>
                                </li>
                                <li>
                                    <Link to="/contact" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>Contact</Link>
                                </li>
                            </ul>
                        </div>
                    </nav>
                    <div className="col-xs col-sm-6">
                        <ul className="row end-xs middle-xs secondary-nav">
                            <li className="search">
                                <Link to="/">
                                    <span className="fa fa-search" aria-hidden="true"></span>
                                </Link>
                            </li>
                            <li className="sign-up">
                                <Link to="/access" className="button pink">Sign-In</Link>
                            </li>
                            <li className="cart">
                                <Link to="/">
                                    <span className="fa fa-shopping-cart" aria-hidden="true"></span>
                                </Link>
                            </li>
                            <li className="ellipse-v">
                                <Link to="#">
                                    <span className="fa fa-ellipsis-v" aria-hidden="true"></span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        );
    }
});

module.exports = Header;