import React from "react";
import "./index.css";
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from "axios";

class Employee extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emp_data: [],
      dep_data: {},
      isLoading: false,
      filterState: {}
    };
    this.getDesig = this.getDesig.bind(this);
    this.handleOriginal = this.handleOriginal.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  componentDidMount() {
    this.setState({ isLoading: true }, () => {
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
          this.setState({ ...this.state, emp_data: newData, isLoading: false })
        )

        .catch(function(error) {
          console.log(error);
        });
    });
  }

  getDesig(desig) {
    console.log(desig);
    let url = `https://spring-employee.herokuapp.com/employees/search/bydesignation?designation=${desig}`;
    if (!desig || desig === "all") {
      url = "https://spring-employee.herokuapp.com/employees";
    }

    return axios
      .get(url)
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
        this.setState({ ...this.state, emp_data: newData, isLoading: false })
      )
      .catch(function(error) {
        console.log(error);
      });
  }

  handleKeyPress(e) {
    if (e.key === "Enter") {
      let url = " ";
      if (this.state.filterState.Name) {
        url = `https://spring-employee.herokuapp.com/employees/search/byempname?empname=${
          this.state.filterState.Name
        }`;
        //console.log(url);
      } else if (this.state.filterState.Skill) {
        url = `https://spring-employee.herokuapp.com/employees/search/byskill?skill=${
          this.state.filterState.Skill
        }`;
      } else if (this.state.filterState.City) {
        url = `https://spring-employee.herokuapp.com/employees/search/bycity?city=${
          this.state.filterState.City
        }`;
      } else if (this.state.filterState.Country) {
        url = `https://spring-employee.herokuapp.com/employees/search/bycountry?country=${
          this.state.filterState.Country
        }`;
      } else {
        url = "https://spring-employee.herokuapp.com/employees";
      }
      axios
        .get(url)
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
          this.setState({ ...this.state, emp_data: newData, isLoading: false })
        )
        .catch(function(error) {
          console.log(error);
        });

      return;
    }
  }

  handleOriginal(var2) {
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
  }

  render() {
    let content;
    const { emp_data, isLoading } = this.state;
    if (isLoading) {
      content = <div>Loading...</div>;
    } else {
      content = (
        <div>
          <ReactTable
            data={emp_data}
            filterable
            manual={true}
            onFetchData={(state, instance) => {
              // console.log(instance);
              if (instance.props.data.length !== 0) {
                if (this.state.filterState.designation) {
                  this.getDesig(this.state.filterState.designation);
                }
              }
            }}
            columns={[
              {
                Header: "ID",
                accessor: "ID",
                filterMethod: (filter, row) =>
                  String(row[filter.id]).startsWith(filter.value)
              },
              {
                Header: "Name",
                accessor: "Name",
                Filter: ({ filter, onChange }) => (
                  <input
                    type="text"
                    size="8"
                    onKeyPress={this.handleKeyPress}
                    value={
                      this.state.filterState.Name
                        ? this.state.filterState.Name
                        : ""
                    }
                    onChange={event => {
                      this.setState({
                        filterState: {
                          ...this.state.filterState,
                          Name: event.target.value
                        }
                      });
                      onChange();
                    }}
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
                    onKeyPress={this.handleKeyPress}
                    value={
                      this.state.filterState.Skill
                        ? this.state.filterState.Skill
                        : ""
                    }
                    onChange={event => {
                      this.setState({
                        filterState: {
                          ...this.state.filterState,
                          Skill: event.target.value
                        }
                      });
                      onChange();
                    }}
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
                    value={
                      this.state.filterState.designation
                        ? this.state.filterState.designation || "all"
                        : "all"
                    }
                    onChange={event => {
                      this.setState({
                        filterState: {
                          ...this.state.filterState,
                          designation: event.target.value
                        }
                      });
                      onChange();
                    }}
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
                filterMethod: (filter, row) =>
                  String(row[filter.id]).startsWith(filter.value)
              },
              {
                Header: "Salary",
                accessor: "Salary",
                filterMethod: (filter, row) =>
                  String(row[filter.id]).startsWith(filter.value)
              },
              {
                Header: "City",
                accessor: "City",
                Filter: ({ filter, onChange }) => (
                  <input
                    type="text"
                    size="8"
                    onKeyPress={this.handleKeyPress}
                    value={
                      this.state.filterState.City
                        ? this.state.filterState.City
                        : ""
                    }
                    onChange={event => {
                      this.setState({
                        filterByState: {
                          ...this.state.filterState,
                          City: event.target.value
                        }
                      });
                      onChange();
                    }}
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
                    onKeyPress={this.handleKeyPress}
                    value={
                      this.state.filterState.Country
                        ? this.state.filterState.Country
                        : ""
                    }
                    onChange={event => {
                      this.setState({
                        filterState: {
                          ...this.state.filterState,
                          Country: event.target.value
                        }
                      });
                      onChange();
                    }}
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
            freezeWhenExpanded={true}
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

                  this.handleOriginal(var2);
                }
              };
            }}
          />
        </div>
      );
    }
    return <div>{content}</div>;
  }
}

export default Employee;
