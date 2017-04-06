var React = require('react');
var axios = require('axios');

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
        e.preventDefault();
        var _this = this;
        console.log(_this.firstName);
        this.serverRequest = axios.post("/api/Users", {
            userFirstName: _this.firstName,
            userLastName: _this.lastName,
            userEmail: _this.email,
            userPassword: _this.password1
        }).then(function(response) {
            console.log(response);
        }).catch(function (error) {
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
                                <input type="text" name="firstName" placeholder="First Name" ref={firstName => this.firstName = firstName}/>
                                <label htmlFor="lastName">Last Name</label>
                                <input type="text" name="lastName" placeholder="Last Name" ref={lastName => this.lastName = lastName}/>
                                <label htmlFor="email">Email</label>
                                <input type="email" name="email" placeholder="Email" ref={email => this.email = email}/>
                                <label htmlFor="password1">Password</label>
                                <input type="password" name="password1" placeholder="Password" ref={password1 => this.password1 = password1}/>
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