var React = require('react');

var Access = React.createClass({
    render: function() {
        return(
            <div>
                <section className="access">
                    <div className="row center-xs container">
                        <div className="col-xs-12 col-sm-4 sign-in">
                            <h1>Sign-In</h1>
                            <form action="/" method="get">
                                <label htmlFor="Email">Email</label>
                                <input type="email" name="Email" placeholder="Email"/>
                                <label htmlFor="Password1">Password</label>
                                <input type="password" name="Password1" placeholder="Password"/>
                                <input className="button pink" type="submit" value="Sign-In"/>
                                <br/>
                                <input type="checkbox" name="RememberMe"/>
                                <label htmlFor="RememberMe">Remember me</label>
                                <span> | <a href="/">Forgot password?</a></span>
                            </form>
                        </div>
                        <div className="col-xs-12 col-sm-4 register">
                            <h1>Register</h1>
                            <form action="/" method="post">
                                <label htmlFor="FirstName">First Name</label>
                                <input type="text" name="FirstName" placeholder="First Name"/>
                                <label htmlFor="LastName">Last Name</label>
                                <input type="text" name="LastName" placeholder="Last Name"/>
                                <label htmlFor="Email">Email</label>
                                <input type="email" name="Email" placeholder="Email"/>
                                <label htmlFor="Password1">Password</label>
                                <input type="password" name="Password1" placeholder="Password"/>
                                <label htmlFor="Password2">Re-enter Password</label>
                                <input type="password" name="Password2" placeholder="Password"/>
                                <input className="button gold" type="submit" value="Register"/>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
});

module.exports = Access;