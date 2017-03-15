var React = require('react');
var {Link, IndexLink} = require('react-router');

var Nav = React.createClass({
    onSearch: function(e) {
        e.preventDefault();
        var location = this.refs.search.value;
        var encodedLocation = encodeURIComponent(location);
        if(location.length > 0) {
            this.refs.search.value = '';
            browserHistory.push = ('/?location=${encodedLocation}');
        }
    },
    render: function() {
        return(
            <nav>
                <div className="row middle-xs container">
                    <div className="col-xs">
                        <ul className="row middle-xs">
                            <li>
                                <IndexLink to="/" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>
                                    <img className="logo" src="../assets/images/jam-jar-logo.png" alt="Logo"></img>
                                </IndexLink>
                            </li>
                            <li>
                                <Link to="/about" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>About</Link>
                            </li>
                            <li>
                                <Link to="/products" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>Products</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="col-xs">
                        <ul className="row end-xs middle-xs">
                            <li>
                                <Link to="/" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>
                                    <span className="fa fa-search" aria-hidden="true"></span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>
                                    <Link to="/" activeClassName="active" activeStyle={{fontWeight: 'bold'}}><span className="fa fa-user-circle-o" aria-hidden="true"></span></Link>
                                </Link>
                            </li>
                            <li>
                                <Link to="/" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>
                                    <span className="fa fa-shopping-cart" aria-hidden="true"></span>

                                    </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
});

module.exports = Nav;