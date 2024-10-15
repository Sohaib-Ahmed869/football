import React, { useEffect, useState } from "react";
import AdminSiderbar from "../../components/sidebar/sidebar";
import { dummyUserData } from "./dummyUserData";
import { BiUser } from "react-icons/bi";

const Users = () => {
  const [users, setUsers] = useState(dummyUserData);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Calculate indexes for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const blockUser = (index) => {
    const updatedUsers = [...users];
    updatedUsers[index].status =
      updatedUsers[index].status === "active" ? "blocked" : "active";
    setUsers(updatedUsers);
  };

  const [teamFilter, setTeamFilter] = useState("all");

  const filterUsers = (team) => {
    setTeamFilter(team);
    if (team === "all") {
      setUsers(dummyUserData);
    } else {
      setUsers(dummyUserData.filter((user) => user.team === team));
    }
  };

  useEffect(() => {
    filterUsers(teamFilter);
  }, [teamFilter]);

  const [nameSearch, setNameSearch] = useState("");

  const searchUsers = (name) => {
    setNameSearch(name);
    if (name === "") {
      setUsers(dummyUserData);
    } else {
      setUsers(
        dummyUserData.filter((user) =>
          user.username.toLowerCase().includes(name.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    searchUsers(nameSearch);
  }, [nameSearch]);

  return (
    <div className="p-20 h-screen ">
      <AdminSiderbar />

      <div className="p-5 w-full">
        <div className="flex items-center gap-2 mb-4">
          <BiUser className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          <h1 >Manage the users</h1>
        </div>
        <div className="flex justify-between items-center mb-4 gap-4">
          <input
            type="text"
            value={nameSearch}
            onChange={(e) => searchUsers(e.target.value)}
            placeholder="Search by name"
            className="p-2 border border-gray-300 rounded-md input w-96"
          />

          <div className="flex items-center space-x-4">
            <label htmlFor="teamFilter" className="text-lg font-semibold">
              Filter by team:
            </label>
            <select
              value={teamFilter}
              onChange={(e) => filterUsers(e.target.value)}
              id="teamFilter"
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="all">All</option>
              <option value="Team Alpha">Team Alpha</option>
              <option value="Team Beta">Team Beta</option>
              <option value="Team Gamma">Team Gamma</option>
            </select>
          </div>
        </div>

        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Address
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Team
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:border-gray-700 hover:bg-gray-200  hover:text-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {user.username}
                </th>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.address}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">{user.team}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="flex items-center px-6 py-4 justify-between">
                  {/* Button to open the modal for user details */}
                  <button
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    onClick={() =>
                      document.getElementById(`modal-${index}`).showModal()
                    }
                  >
                    See Details
                  </button>

                  <button
                    onClick={() => blockUser(index)}
                    className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                  >
                    {user.status === "active" ? "Block" : "Unblock"}
                  </button>

                  {/* User Info Modal */}
                  <UserInfoModal user={user} modalId={`modal-${index}`} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(Math.ceil(users.length / usersPerPage)).keys()].map(
            (number) => (
              <button
                key={number}
                onClick={() => paginate(number + 1)}
                className={`btn ${
                  currentPage === number + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                } px-4 py-2 rounded btn`}
              >
                {number + 1}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;

const UserInfoModal = ({ user, modalId }) => {
  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box bg-gray-200 text-black max-w-4xl relative p-6 rounded-lg shadow-lg">
        <h3 className="text-lg mb-4">
          <span className="font-semibold text-secondary">{user.username}</span>
        </h3>

        <div className="grid grid-cols-2 gap-4 text-md leading-7">
          <p>
            <strong>Email:</strong> <span className="ml-4">{user.email}</span>
          </p>
          <p>
            <strong>Phone:</strong> <span className="ml-4">{user.phone}</span>
          </p>
          <p>
            <strong>Address:</strong>{" "}
            <span className="ml-4">{user.address}</span>
          </p>
          <p>
            <strong>Team:</strong> <span className="ml-4">{user.team}</span>
          </p>
          <p>
            <strong>Date of Birth:</strong>{" "}
            <span className="ml-4">{user.dob.toDateString()}</span>
          </p>
          <p>
            <strong>Points:</strong> <span className="ml-4">{user.points}</span>
          </p>
          <p className="absolute bottom-4 right-4">
            <span
              className={`px-2 py-1 rounded-full text-lg font-medium ${
                user.status === "active"
                  ? "bg-green-300 text-green-900"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {user.status}
            </span>
          </p>
        </div>

        <button
          onClick={() => document.getElementById(modalId).close()}
          className="btn absolute top-4 right-4 bg-red-600 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-md"
        >
          Close
        </button>
      </div>
    </dialog>
  );
};
