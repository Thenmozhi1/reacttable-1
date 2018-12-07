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
      pages: -1
    };
  }

  handleChange = (onChange, identifier) => {
    return event => {
      this.setState({
        filterState: {
          ...this.state.filterState,
          [identifier]: event.target.value
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

  fetchDepartmentDetails = async deptId => {
    if (!this.state.dep_data[deptId]) {
      const json = await axios.get(deptId);

      const deptData = json.data;
      this.setState({
        dep_data: { ...this.state.dep_data, [deptId]: deptData }
      });
    }
  };

  fetchGridData = debounce(async (state, instance) => {
    let url = "";
    const params = {
      page: state.page,
      size: state.pageSize,
      sort: state.sorted["0"]
        ? state.sorted["0"].id +
          "," +
          (state.sorted["0"].desc === false ? "desc" : "asc")
        : "empid"
    };

    const filterKeys = Object.keys(this.state.filterState);
    if (filterKeys.length !== 0) {
      url = "/search/byadvsearch?advsearch=( ";
      url += filterKeys
        .map(key => {
          return this.state.filterState[key]
            ? key + ":" + this.state.filterState[key]
            : "";
        })
        .join(" and ");
      url += " )";
    }
    this.setState({
      isLoading: true
    });

    const json = await axios.get(
      "https://spring-employee.herokuapp.com/employees" + url,
      { params }
    );

    const newData = json.data.content.map(result => ({
      empid: result.empid,
      empname: result.empname,
      skill: result.skill,
      salary: result.salary,
      grade: result.grade,
      city: result.city,
      country: result.country,
      doj: result.doj,
      designation: result.designation,
      DeptName: result.deptid.deptname,
      Dep_head: result.deptid
    }));

    this.setState({
      ...this.state,
      emp_data: newData,
      isLoading: false,
      pages: json.data.page.totalPages
    });
  }, 500);

  render() {
    const { emp_data, isLoading, pages } = this.state;
    const content = (
      <div>
        <ReactTable
          data={emp_data}
          freezeWhenExpanded={true}
          filterable
          pages={pages}
          showPagination={true}
          showPaginationTop={true}
          showPaginationBottom={true}
          manual
          minRows={0}
          loading={isLoading}
          onFetchData={this.fetchGridData}
          columns={[
            {
              Header: "ID",
              accessor: "empid",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "empid")}
                  value={
                    this.state.filterState.empid
                      ? this.state.filterState.empid
                      : ""
                  }
                />
              )
            },
            {
              Header: "Name",
              accessor: "empname",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "empname")}
                  value={
                    this.state.filterState.empname
                      ? this.state.filterState.empname
                      : ""
                  }
                />
              )
            },

            {
              Header: "Skill",
              accessor: "skill",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "skill")}
                  value={
                    this.state.filterState.skill
                      ? this.state.filterState.skill
                      : ""
                  }
                />
              )
            },
            {
              Header: "DOJ",
              accessor: "doj",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "doj")}
                  value={
                    this.state.filterState.DOJ ? this.state.filterState.DOJ : ""
                  }
                />
              )
            },
            {
              Header: "Designation",
              accessor: "designation",
              minWidth: 110,
              Filter: ({ filter, onChange }) => (
                <select
                  onChange={this.handleChange(onChange, "designation")}
                  value={this.getFilterValueFromState("designation", "all")}
                  style={{
                    width: "100%"
                  }}
                >
                  <option value="all"> Show all </option>
                  <option value="protector of Asgard">
                    protector of Asgard
                  </option>
                  <option value="Sr.manager"> Sr.manager </option>
                  <option value="developer"> developer </option>
                </select>
              )
            },
            {
              Header: "Grade",
              accessor: "grade",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "grade")}
                  value={
                    this.state.filterState.grade
                      ? this.state.filterState.grade
                      : ""
                  }
                />
              )
            },
            {
              Header: "Salary",
              accessor: "salary",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "salary")}
                  value={
                    this.state.filterState.salary
                      ? this.state.filterState.salary
                      : ""
                  }
                />
              )
            },
            {
              Header: "City",
              accessor: "city",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "city")}
                  value={
                    this.state.filterState.city
                      ? this.state.filterState.city
                      : ""
                  }
                />
              )
            },
            {
              Header: "Country",
              accessor: "country",
              Filter: ({ filter, onChange }) => (
                <input
                  type="text"
                  size="8"
                  onChange={this.handleChange(onChange, "country")}
                  value={
                    this.state.filterState.country
                      ? this.state.filterState.country
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
          SubComponent={rows => {
            const dep = rows.original.Dep_head.depthead;

            if (dep.empname) {
              return (
                <div className="Posts">
                  <header>
                    <ul>
                      <li> Dep ID: {rows.original.Dep_head.deptid} </li>
                      <li> Dep Name: {rows.original.Dep_head.deptname} </li>
                      <li> Dep Head: {dep.empname} </li>
                      <li> City: {dep.city} </li>
                      <li> Country: {dep.country} </li>
                      <li> Designation: {dep.designation} </li>
                      <li> DOJ: {dep.doj} </li> <li> Grade: {dep.grade} </li>
                      <li> Salary: {dep.salary} </li>
                      <li> Skill: {dep.skill} </li>
                    </ul>
                  </header>
                </div>
              );
            } else {
              return <div className="Posts"> Loading... </div>;
            }
          }}
        />
      </div>
    );

    return <div> {content} </div>;
  }
}

export default Employee;
