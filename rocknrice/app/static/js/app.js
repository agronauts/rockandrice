let React = require('react');
let ReactDOM = require('react-dom');
let $ = require('jquery')

let ClimbList = React.createClass({
    render: function () {
        let climbs = this.props.data.map(function (climb) {
            return (
                <tr>
                    <td>{climb.name}</td>
                    <td>{climb.description.substring(0,30)}</td>
                </tr>
            );
        });
        return (
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>{climbs}</tbody>
            </table>
        )
    }
});

let ClimbSearch = React.createClass({
    getInitialState: function () {
       return {
           crags: [
               {name: 'blah', description: 'whew'}
           ]
       }
    },
    componentDidMount: function() {
        $.ajax({
            url: '../static/crags.json',
            dataType: 'json',
            success: function(data) {
                this.setState({crags: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render: function () {
        return (
            <div>
                <p>Product Search</p>
                {/*<p>{this.state.crags}</p>*/}
                <ClimbList data={this.state.crags}/>
            </div>
        );
    }
});

let calculatePayment = function(principal, years, rate) {
    let monthlyRate = rate / 100 / 12;
    let monthlyPayment = principal * monthlyRate / (1 - (Math.pow(1/(1 + monthlyRate), years * 12)));
    let balance = principal;
    let amortization = [];
    for (let y=0; y<years; y++) {
        let interestY = 0;  //Interest payment for year y
        let principalY = 0; //Principal payment for year y
        for (let m=0; m<12; m++) {
            let interestM = balance * monthlyRate;       //Interest payment for month m
            let principalM = monthlyPayment - interestM; //Principal payment for month m
            interestY = interestY + interestM;
            principalY = principalY + principalM;
            balance = balance - principalM;
        }
        amortization.push({principalY: principalY, interestY: interestY, balance: balance});
    }
    return {monthlyPayment: monthlyPayment, amortization:amortization};
};

let Header = React.createClass({
    render: function () {
        return (
            <header>
                <h1>{this.props.title}</h1>
            </header>
        );
    }
});

let AmortizationChart = React.createClass({
    render: function () {
        let items = this.props.data.map(function (year, index) {
            return (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="currency principal">{Math.round(year.principalY).toLocaleString()}</td>
                    <td className="stretch">
                        <div className="flex">
                            <div className="bar principal" style={{flex: year.principalY, WebkitFlex: year.principalY}}></div>
                            <div className="bar interest" style={{flex: year.interestY, WebkitFlex: year.interestY}}></div>
                        </div>
                    </td>
                    <td className="currency interest">{Math.round(year.interestY).toLocaleString()}</td>
                    <td className="currency">{Math.round(year.balance).toLocaleString()}</td>
                </tr>
            );
        });
        return (
            <table>
                <thead>
                <tr>
                    <th>Year</th>
                    <th className="principal">Principal</th>
                    <th className="stretch"></th>
                    <th className="interest">Interest</th>
                    <th>Balance</th>
                </tr>
                </thead>
                <tbody>{items}</tbody>
            </table>
        );
    }
});

let MortgageCalculator = React.createClass({
    getInitialState: function() {
        return {
            principal: this.props.principal,
            years: this.props.years,
            rate: this.props.rate
        };
    },
    principalChange: function(event) {
        this.setState({principal: event.target.value});
    },
    yearsChange: function(event) {
        this.setState({years: event.target.value});
    },
    rateChange: function(event) {
        this.setState({rate: event.target.value});
    },
    render: function () {
        let payment = calculatePayment(this.state.principal, this.state.years, this.state.rate);
        let monthlyPayment = payment.monthlyPayment;
        let amortization = payment.amortization;
        return (
            <div className="content">
                <div className="form">
                    <div>
                        <label>Principal:</label>
                        <input type="text" value={this.state.principal} onChange={this.principalChange}/>
                    </div>
                    <div>
                        <label>Years:</label>
                        <input type="text" value={this.state.years} onChange={this.yearsChange}/>
                    </div>
                    <div>
                        <label htmlFor="rate">Rate:</label>
                        <input type="text" value={this.state.rate} onChange={this.rateChange}/>
                    </div>
                </div>
                <h2>Monthly Payment: <span className="currency">{Number(monthlyPayment.toFixed(2)).toLocaleString()}</span></h2>
                <AmortizationChart data={amortization}/>
            </div>
        );
    }
});

let App = React.createClass({
    render: function () {
        return (
            <div>
                <Header title="React Mortgage Calculator"/>
                <ClimbSearch/>
                <MortgageCalculator principal="200000" years="30" rate="5"/>
            </div>
        );
    }
});

ReactDOM.render(<App/>,  document.getElementById("app"));