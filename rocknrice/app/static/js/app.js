let React = require('react');
let ReactDOM = require('react-dom');
let $ = require('jquery');

let CragSearchForm = React.createClass({
    nameChange: function(event) {
        this.props.onSearchRequest(event.target.value);
    },
    render: function () {
        return (
            <div className="content">
                <div className="form">
                    <div>
                        <label>Name:</label>
                        <input type="text" onChange={this.nameChange}/>
                    </div>
                </div>
            </div>
        );
    }
});


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
           all_crags: [],
           cur_crags: []
       }
    },
    componentDidMount: function() {
        $.ajax({
            url: '../static/crags.json',
            dataType: 'json',
            success: function(data) {
                this.setState({all_crags: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    filterCrags: function (query) {
        let filtered_crags = this.state.all_crags.filter(function (crag) {
            return crag.name.toLowerCase().includes(query);
        });
        this.setState({cur_crags: filtered_crags});
    },
    render: function () {
        return (
            <div>
                <p>Product Search</p>
                <CragSearchForm onSearchRequest={this.filterCrags}/>
                <ClimbList data={this.state.cur_crags}/>
            </div>
        );
    }
});

let App = React.createClass({
    render: function () {
        return (
            <div>
                <ClimbSearch/>
            </div>
        );
    }
});

ReactDOM.render(<App/>,  document.getElementById("app"));
