var React = require('react');
var {Link, IndexLink} = require('react-router');

var Header = React.createClass({
    render: function() {
        return(
            <header>
                <div className="row middle-xs container">
                    <nav className="col-xs">
                        <ul className="row middle-xs">
                            <li>
                                <IndexLink to="/" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>
                                    <img className="logo" src="../assets/images/jam-jar-logo.png" alt="Logo"/>
                                </IndexLink>
                            </li>
                            <li>
                                <Link to="/about" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>About</Link>
                            </li>
                            <li>
                                <Link to="/products" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>Products</Link>
                            </li>
                        </ul>
                    </nav>
                    <div className="col-xs">
                        <ul className="row end-xs middle-xs">
                            <li>
                                <Link to="/" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>
                                    <span className="fa fa-search" aria-hidden="true"></span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/access" className="button pink">Sign-In</Link>
                            </li>
                            <li>
                                <Link to="/" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>
                                    <span className="fa fa-shopping-cart" aria-hidden="true"></span>
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