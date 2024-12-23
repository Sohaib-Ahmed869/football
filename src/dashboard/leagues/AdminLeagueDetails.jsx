import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminSiderbar from "../../components/sidebar/sidebar";
import axios from "axios";
import dfawallpaper from "../../assets/dfa-wallpaper.png";
import { BiFootball } from "react-icons/bi";

const URL = import.meta.env.VITE_BACKEND_URL;

const AdminLeagueDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [league, setLeague] = useState(null);

  const [topScorers, setTopScorers] = useState([]);

  const [totalGoals, setTotalGoals] = useState(0);

  const fetchLeague = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${URL}/leagues/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      const data = response.data;
      if (response.status >= 400) {
        throw new Error(data.message);
      }
      setLeague(data.league);
    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeague();
  }, []);

  const [pointsTable, setPointsTable] = useState({});

  const calculatePointsTable = () => {
    //get the count of winner for each team
    const pointsTable = {};
    league?.matches.forEach((match) => {
      if (match.winner) {
        if (pointsTable[match.winner._id]) {
          pointsTable[match.winner._id] += 3;
        } else {
          pointsTable[match.winner._id] = 3;
        }
      }
    });

    //get the count of matches played by each team
    league?.teams.forEach((team) => {
      const matchesPlayed = league?.matches.filter(
        (match) =>
          match.teamA?._id === team._id || match.teamB?._id === team._id
      ).length;
      pointsTable[team._id] = [pointsTable[team._id], matchesPlayed];
    });

    //sort the points table
    const sortedPointsTable = Object.entries(pointsTable).sort(
      (a, b) => b[1] - a[1]
    );

    //get the teams
    const teams = league?.teams;

    //get the points table

    const pointsTableData = sortedPointsTable.map((team) => {
      const teamData = teams.find((t) => t._id === team[0]);
      return {
        team: teamData,
        points: team[1][0],
        matchesPlayed: team[1][1],
      };
    });

    setPointsTable(pointsTableData);
  };

  const getTopScorerAndTotalGoals = () => {
    const scorers = [];
    let totalGoals = 0;
    league?.matches.forEach((match) => {
      match.scorers.forEach((scorer) => {
        const scorerIndex = scorers.findIndex(
          (s) => s.player === scorer.player
        );
        if (scorerIndex !== -1) {
          scorers[scorerIndex].score += scorer.score;
        } else {
          scorers.push({ player: scorer.player, score: scorer.score });
        }
        totalGoals += scorer.score;
      });
    });
    //sort the scorers
    scorers.sort((a, b) => b.score - a.score);

    setTopScorers(scorers);
    setTotalGoals(totalGoals);
  };

  useEffect(() => {
    calculatePointsTable();
    getTopScorerAndTotalGoals();
  }, [league]);

  return (
    <div
      className="min-h-screen bg-gray-100 p-20 pt-5 max-sm:p-4"
      style={{
        backgroundImage: `url(${dfawallpaper})`,
        backgroundSize: "cover",
      }}
    >
      <AdminSiderbar />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className=" mx-auto mt-20 border p-10 max-sm:p-2">
          {error && (
            <div
              role="alert"
              className="alert alert-error flex justify-between items-center py-2 mb-4 bg-red-100 border border-red-400 rounded-md"
            >
              <span className="text-red-600">{error}</span>
              <button
                className="text-red-600 font-bold"
                onClick={() => setError(null)}
              >
                x
              </button>
            </div>
          )}
          <div className="flex justify-between items-center mb-6 max-sm:flex-col">
            <h1 className="text-4xl font-bold mb-6 text-center w-1/2 items-center flex-col flex max-sm:text-xl">
              <BiFootball className="inline-block text-4xl max-sm:text-xl" />
              {league?.leagueName} Details
              <p className="mb-2 text-sm font-normal mt-2">
                <span className="flex">
                  {new Date(league?.startDate).toLocaleDateString()} -{" "}
                  {new Date(league?.endDate).toLocaleDateString()}
                </span>
              </p>
            </h1>
            <div className="mb-6 p-6 rounded-lg w-1/2 text-sm max-sm:w-full border border-dashed">
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-700">League Information</p>

                <p className="">
                  <strong>Total Teams:</strong> {league?.teams?.length}
                </p>
              </div>

              <p>
                <strong>Teams:</strong>
              </p>
              <ol className="list-decimal ml-5">
                {league?.teams?.map((team, idx) => (
                  <li key={idx} className=" text-gray-800">
                    {team.teamName}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <h2 className="text-3xl font-semibold mb-4 text-gray-800 max-sm:text-xl">
            Points Table
          </h2>
          <div className="max-sm:text-sm md:table mb-10">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Rank</th>
                  <th className="text-left">Team</th>
                  <th className="text-left">Points</th>
                  <th className="text-left">Matches</th>
                </tr>
              </thead>
              <tbody>
                {pointsTable.map((team, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{team.team.teamName}</td>
                    <td>{team.points}</td>
                    <td>{team.matchesPlayed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-3xl font-semibold mb-4 text-gray-800 max-sm:text-xl">
            Statistics
          </h2>
          <div className="grid grid-cols-1 gap-6 max-sm:grid-cols-1 bg-white mb-10">
            <div className=" p-5 rounded-lg shadow-lg max-sm:text-sm">
              <div className="flex justify-between items-center mb-4 max-sm:flex-col">
                <p className="">
                  <strong>Total Goals:</strong> {totalGoals}
                </p>
              </div>

              <div>
                <strong>Top Scorers:</strong>
                <ul className="mt-2 ml-4 list-disc">
                  {topScorers.map((scorer, i) => (
                    <li key={i} className="text-sm">
                      {scorer.player} - {scorer.score}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-semibold mb-4 text-gray-800 max-sm:text-xl">
            Matches
          </h2>
          <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
            {league?.matches?.map((match, idx) => (
              <div
                key={idx}
                className=" p-5 rounded-lg shadow-lg max-sm:text-sm"
              >
                <div className="flex justify-between items-center mb-4 max-sm:flex-col">
                  <p className="">
                    <strong>Match:</strong> {match.teamA?.teamName} vs{" "}
                    {match.teamB?.teamName}
                  </p>
                  <p className="">
                    <strong>Date:</strong>{" "}
                    {new Date(match.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-between items-center mb-4 max-sm:flex-col">
                  <p className="">
                    <strong>Winner:</strong> {match.winner?.teamName}
                  </p>
                  <p className="">
                    <strong>Score:</strong> {match.score?.teamA} -{" "}
                    {match.score?.teamB}
                  </p>
                </div>
                <div>
                  <strong>Scorers:</strong>
                  <ul className="mt-2 ml-4 list-disc">
                    {match.scorers.map((scorer, i) => (
                      <li key={i} className="text-sm">
                        {scorer.player} ({scorer.team?.teamName}) -{" "}
                        {scorer?.score}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLeagueDetails;
