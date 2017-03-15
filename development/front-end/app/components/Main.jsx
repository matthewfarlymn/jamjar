var React = require('react');
var Nav = require('Nav');

var Main = (props) => {
    return(
        <div>
            <Nav/>
            <div className="row container">
                <div className="col-xs">
                    {props.children}
                </div>
            </div>
        </div>
    );
};

module.exports = Main;