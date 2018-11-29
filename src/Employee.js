import React from "react";
import "./index.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from "axios";
import debounce from "lodash/debounce";

class Employee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emp_data: [],
      dep_data: {},
      isLoading: false,
      filterState: {},
      testService: {},
      pages: 0
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

  fetchDepartmentDetails = var2 => {
    if (!this.state.dep_data[var2]) {
      axios
        .get(var2)
        .then(json => {
          const data1 = json.data;
          this.setState({
            dep_data: { ...this.state.dep_data, [var2]: data1 }
          });
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };

  fetchGridData = debounce((state, instance) => {
    this.setState({ isLoading: true });
    console.log(state);
    console.log(instance);
    axios
      .get("https://spring-employee.herokuapp.com/employees")
      .then(json =>
        json.data._embedded.employees.map(result => ({
          ID: result.empid,
          Name: result.empname,
          Skill: result.skill,
          Salary: result.salary,
          Grade: result.grade,
          City: result.city,
          Country: result.country,
          DOJ: result.doj,
          DeptName: result.deptid.deptname,
          Designation: result.designation,
          dep_link: result._links.deptid.href
        }))
      )

      .then(newData =>
        this.setState({
          ...this.state,
          emp_data: newData,
          isLoading: false
        })
      )

      .catch(function(error) {
        console.log(error);
      });
  }, 500);

  render() {
    const { emp_data, isLoading } = this.state;
    const content = (
      <div>
        <ReactTable
          data={emp_data}
          freezeWhenExpanded={true}
          filterable
          manual
          loading={isLoading}
          onFetchData={this.fetchGridData}
          columns={[
            {
              Header: "ID",
              accessor: "ID",
              //sortable: true
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "ID")}
                  value={
                    this.state.filterState.ID ? this.state.filterState.ID : ""
                  }
                />
              )
            },
            {
              Header: "Name",
              accessor: "Name",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "Name")}
                  value={
                    this.state.filterState.Name
                      ? this.state.filterState.Name
                      : ""
                  }
                />
              )
            },

            {
              Header: "Skill",
              accessor: "Skill",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "Skill")}
                  value={
                    this.state.filterState.Skill
                      ? this.state.filterState.Skill
                      : ""
                  }
                />
              )
            },
            {
              Header: "DOJ",
              accessor: "DOJ"
            },
            {
              Header: "Designation",
              accessor: "Designation",
              minWidth: 110,
              Filter: ({ filter, onChange }) => (
                <select
                  onChange={this.handleChange(onChange, "Skill")}
                  value={this.getFilterValueFromState("Designation", "all")}
                  style={{ width: "100%" }}
                >
                  <option value="all">Show all</option>
                  <option value="protector of Asgard">
                    protector of Asgard
                  </option>
                  <option value="Sr.manager">Sr.manager</option>
                  <option value="developer">developer</option>
                </select>
              )
            },
            {
              Header: "DeptName",
              accessor: "DeptName",
              filterMethod: (filter, row) =>
                row[filter.id].startsWith(filter.value)
            },
            {
              Header: "Grade",
              accessor: "Grade",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "Grade")}
                  value={
                    this.state.filterState.Grade
                      ? this.state.filterState.Grade
                      : ""
                  }
                />
              )
            },
            {
              Header: "Salary",
              accessor: "Salary",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "Salary")}
                  value={
                    this.state.filterState.Salary
                      ? this.state.filterState.Salary
                      : ""
                  }
                />
              )
            },
            {
              Header: "City",
              accessor: "City",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "City")}
                  value={
                    this.state.filterState.City
                      ? this.state.filterState.City
                      : ""
                  }
                />
              )
            },
            {
              Header: "Country",
              accessor: "Country",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "Country")}
                  value={
                    this.state.filterState.Country
                      ? this.state.filterState.Country
                      : ""
                  }
                />
              )
            }
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
          getTdProps={() => {
            return {
              style: {
                overflow: "visible"
              }
            };
          }}
          //freezeWhenExpanded={true}
          SubComponent={rows => {
            const { dep_data } = this.state;
            let var2 = "";
            let var1 = rows.original.dep_link;
            for (let i = 0; i < var1.length; i++) {
              if (var1[i] !== "{") {
                var2 += var1[i];
              }
              if (var1[i] === "{") {
                break;
              }
            }
            const dep = dep_data[var2];
            //debugger;
            if (dep) {
              return (
                <div className="Posts">
                  <header>
                    <ul>
                      <li>Dep ID : {dep.deptid}</li>
                      <li>Dep Name : {dep.deptname}</li>
                      <li>Dep Head : {dep.depthead.empname}</li>
                      <li>City : {dep.depthead.city}</li>
                      <li>Country : {dep.depthead.country}</li>
                      <li>Designation : {dep.depthead.designation}</li>
                      <li>DOJ : {dep.depthead.doj}</li>
                      <li>Grade : {dep.depthead.grade}</li>
                      <li>Salary : {dep.depthead.salary}</li>
                      <li>Skill : {dep.depthead.skill}</li>
                    </ul>
                  </header>
                </div>
              );
            } else {
              return <div className="Posts">Loading...</div>;
            }
          }}
          getTrProps={(state, rowInfo, column, instance) => {
            return {
              onClick: e => {
                let var2 = "";
                console.log(e);
                console.log(rowInfo);

                let var1 = rowInfo.row._original.dep_link;
                for (let i = 0; i < var1.length; i++) {
                  if (var1[i] !== "{") {
                    var2 += var1[i];
                  }
                  if (var1[i] === "{") {
                    break;
                  }
                }

                this.fetchDepartmentDetails(var2);
              }
            };
          }}
        />
      </div>
    );

    return <div>{content}</div>;
  }
}

export default Employee;
