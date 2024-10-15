import React, { useState } from "react";
import AdminSiderbar from "../../components/sidebar/sidebar";
import { dummyEmailData } from "./dummyEmailData";
import { MdEmail } from "react-icons/md";

const Emails = () => {
  const [emails, setEmails] = useState(dummyEmailData);

  const [currentPage, setCurrentPage] = useState(1);
  const emailsPerPage = 10;

  // Calculate indexes for pagination
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = emails.slice(indexOfFirstEmail, indexOfLastEmail);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-20 h-screen">
      <AdminSiderbar />

      <div className="p-5 w-full">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-xl font-bold">Emails</h1>
          <div className="flex items-center gap-2">
            <MdEmail className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">
              Showing {indexOfFirstEmail + 1} to{" "} 
              {indexOfLastEmail > emails.length ? emails.length : indexOfLastEmail} of {emails.length} entries
            </span>
          </div>
        </div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Created At
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentEmails.map((email, index) => (
              <tr
                key={index}
                className="bg-white border-b dark:border-gray-700 hover:bg-gray-200  hover:text-gray-700"
              >
                <td className="px-6 py-4">{email.email}</td>
                <td className="px-6 py-4">{email.createdAt.toDateString()}</td>
                <td className="flex items-center px-6 py-4">
                  <div className="flex items-center gap-2 cursor-pointer">
                    <MdEmail className="w-6 h-6 text-secondary" />
                    Send Email
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center mt-4 space-x-2">
          {[...Array(Math.ceil(emails.length / emailsPerPage)).keys()].map(
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

export default Emails;
