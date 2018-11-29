import React from "react";
import ReactTable from "react-table";
//import { rows2 } from "./Utils";
import "react-table/react-table.css";
import axios from "axios";
import "./index.css";

class Department extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dep_data: [],
      isLoading: false,
      filterState: {}
    };
    //this.ClickAction = this.ClickAction.bind(this);
    //this.performAction = this.performAction.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }
  componentDidMount() {
    this.setState({ isLoading: true });
    axios
      .get("https://spring-employee.herokuapp.com/departments")
      .then(json =>
        json.data._embedded.departments.map(result => ({
          Deptid: result.deptid,
          Department: result.deptname,
          DeptHead: result.depthead.empname
        }))
      )
      .then(newData => {
        this.setState({ dep_data: newData, isLoading: false });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      let url = " ";
      if (this.state.filterState.Department) {
        url = `https://spring-employee.herokuapp.com/departments/search/bydeptname?deptname=${
          this.state.filterState.Department
        }`;
      } else if (this.state.filterState.Deptid) {
        url = `https://spring-employee.herokuapp.com/departments/search/bydeptid?deptid=${
          this.state.filterState.Deptid
        }`;
      } else {
        url = "https://spring-employee.herokuapp.com/departments";
      }
      axios
        .get(url)
        .then(json =>
          json.data._embedded.departments.map(result => ({
            Deptid: result.deptid,
            Department: result.deptname,
            DeptHead: result.depthead.empname
          }))
        )
        .then(newData => {
          this.setState({ dep_data: newData, isLoading: false });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }
  render() {
    const { dep_data } = this.state;

    return (
      <div>
        <ReactTable
          data={dep_data}
          filterable
          manual={true}
          columns={[
            {
              Header: "Deptid",
              accessor: "Deptid",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  onKeyPress={this.handleKeyPress}
                  value={
                    this.state.filterState.Department
                      ? this.state.filterState.Department
                      : ""
                  }
                  onChange={event => {
                    this.setState({
                      filterState: {
                        ...this.state.filterState,
                        Department: event.target.value
                      }
                    });
                    onChange();
                  }}
                />
              )
            },
            {
              Header: "Department",
              accessor: "Department",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  onKeyPress={this.handleKeyPress}
                  value={
                    this.state.filterState.Department
                      ? this.state.filterState.Department
                      : ""
                  }
                  onChange={event => {
                    this.setState({
                      filterState: {
                        ...this.state.filterState,
                        Department: event.target.value
                      }
                    });
                    onChange();
                  }}
                />
              )
            },
            {
              Header: "DeptHead",
              accessor: "DeptHead"
            }
          ]}
          defaultSorted={[
            {
              id: "Deptid",
              desc: true
            }
          ]}
          defaultPageSize={5}
          className="-striped -highlight"
        />
      </div>
    );
  }
}
export default Department;
