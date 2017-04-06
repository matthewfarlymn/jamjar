var React = require('react');

var Access = React.createClass({
    getInitialState: function() {
        return {
            firstName: '',
            lastName: '',
            email: '',
            password1: ''
        }
    },

    handleSubmit: function(e) {
        var _this = this;
        this.serverRequest = axios
        .post("/api/Users", {
            userFirstName: _this.ref.firstName,
            userLastName: _this.ref.lastName,
            userEmail: _this.ref.email,
            userPassword: _this.ref.password1
        })
        .then(function(response) {
            console.log(response);
        }) .catch(function (error) {
            console.log(error);
        });
    },

    render: function() {
        return(
            <div>
                <section className="access">
                    <div className="row center-xs container">
                        <div className="col-xs-12 col-sm-4 sign-in">
                            <h1>Sign-In</h1>
                            <form action="/" method="get">
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" placeholder="Email"/>
                                <label htmlFor="password">Password</label>
                                <input type="password" name="password" placeholder="Password"/>
                                <input className="button pink" type="submit" value="Sign-In"/>
                                <br/>
                                <input type="checkbox" name="RememberMe"/>
                                <label htmlFor="RememberMe">Remember me</label>
                                <span> | <a href="/">Forgot password?</a></span>
                            </form>
                        </div>
                        <div className="col-xs-12 col-sm-4 register">
                            <h1>Register</h1>
                            <form onSubmit={this.onSubmit}>
                                <label htmlFor="firstName">First Name</label>
                                <input type="text" name="firstName" placeholder="First Name" ref="firstName"/>
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" name="lastName" placeholder="Last Name" ref="lastName"/>
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" placeholder="Email" ref="email"/>
                                <label htmlFor="password1">Password</label>
                                <input type="password" name="password1" placeholder="Password" ref="password1"/>
                                <label htmlFor="password2">Re-enter Password</label>
                                <input type="password" name="password2" placeholder="Password"/>
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