import React from "react";
import ReactTable from "react-table";
//import { rows2 } from "./Utils";
import "react-table/react-table.css";
import axios from "axios";
import "./index.css";
import debounce from "lodash/debounce";

class Department extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dep_data: [],
      isLoading: false,
      filterState: {}
    };
  }

  handleChange = (onChange, identifier) => {
    return e => {
      this.setState({
        filterState: {
          ...this.state.filterState,
          [identifier]: e.target.value
        }
      });
      onChange();
    };
  };
  getFilterValueFromState = (identifier, defaultValue = "") => {
    const filterState = this.state.filterState;
    if (!filterState) {
      return defaultValue;
    }
    if (
      typeof filterState[identifier] !== "undefined" ||
      filterState[identifier] !== null
    ) {
      return filterState[identifier];
    }
    return defaultValue;
  };
  fetchGridData = debounce((state, instance) => {
    this.setState({ isLoading: true });
    console.log(state);
    console.log(instance);
    axios
      .get("https://spring-employee.herokuapp.com/departments")
      .then(json =>
        json.data.content.map(result => ({
          Deptid: result.deptid,
          Department: result.deptname,
          DeptHead: result.depthead.empname
        }))
      )

      .then(newData =>
        this.setState({
          ...this.state,
          dep_data: newData,
          isLoading: false
        })
      )

      .catch(function(error) {
        console.log(error);
      });
  }, 500);

  render() {
    const { dep_data, isLoading } = this.state;
    return (
      <div>
        <ReactTable
          data={dep_data}
          filterable
          manual
          loading={isLoading}
          onFetchData={this.fetchGridData}
          columns={[
            {
              Header: "Deptid",
              accessor: "Deptid",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "Deptid")}
                  value={
                    this.state.filterState.Deptid
                      ? this.state.filterState.Deptid
                      : ""
                  }
                />
              )
            },
            {
              Header: "Department",
              accessor: "Department",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "Department")}
                  value={
                    this.state.filterState.Department
                      ? this.state.filterState.Department
                      : ""
                  }
                />
              )
            },
            {
              Header: "DeptHead",
              accessor: "DeptHead",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "DeptHead")}
                  value={
                    this.state.filterState.DeptHead
                      ? this.state.filterState.DeptHead
                      : ""
                  }
                />
              )
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
