var React = require('react');
var {Link, IndexLink} = require('react-router');

var Footer = React.createClass({
    render: function() {
        return(
            <footer>
                <div className="row middle-xs container">
                    <div className="col-xs-6">
                        <ul className="row middle-xs">
                            <li>
                                Copyright <span className="fa fa-copyright" aria-hidden="true"></span> Jam Jar 2017. Powered by Jam Jar
                            </li>
                        </ul>
                    </div>
                    <div className="col-xs-6">
                        <ul className="row end-xs middle-xs">
                            <li>
                                <Link to="/" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>
                                    <span className="fa fa-facebook-official" aria-hidden="true"></span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>
                                    <span className="fa fa-twitter" aria-hidden="true"></span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/" activeClassName="active" activeStyle={{fontWeight: 'bold'}}>
                                    <span className="fa fa-linkedin" aria-hidden="true"></span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        );
    }
});

module.exports = Footer;