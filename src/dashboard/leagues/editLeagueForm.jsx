import React, { useState, useEffect } from "react";
import AdminSiderbar from "../../components/sidebar/sidebar";
import dfawallpaper from "../../assets/dfa-wallpaper.png";
import { inputDateFormat } from "../../utils/inputDateFormat";

const EditLeagueForm = ({ leagueData, onSubmit , teamsData}) => {
    const [leagueName, setLeagueName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [availablePlayers, setAvailablePlayers] = useState([]);

    useEffect(() => {
        if (leagueData) {
            setLeagueName(leagueData.leagueName);
            setStartDate(inputDateFormat(leagueData.startDate));
            setEndDate(inputDateFormat(leagueData.endDate));
            setSelectedTeams(leagueData.teams);
            setMatches(leagueData.matches);
            setAvailablePlayers(() => {
                const players = [];
                leagueData.teams.forEach(leagueTeam => {
                    const teamPlayers = teamsData.find(team => team._id === leagueTeam._id).players;
                    teamPlayers.forEach(player => {
                        players.push({ teamId: leagueTeam._id, playerName: player });
                    });
                });
                return players;
            })
        }
    }, [leagueData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        const updatedLeague = {
            leagueName,
            startDate,
            endDate,
            teams: selectedTeams,
            matches,
        };
        console.log(updatedLeague);
        onSubmit(updatedLeague);
        setLoading(false);
    };

    const addMatch = () => {
        setMatches([...matches, { teamA: '', teamB: '', score: { teamA: 0, teamB: 0 }, scorers: [], date: '' }]);
    };

    const addScorer = (matchIndex) => {
        const newMatches = [...matches];
        newMatches[matchIndex].scorers.push({ player: '', team: '' });
        setMatches(newMatches);
    };

    const handleTeamChange = (teamId) => {
        setSelectedTeams(prev =>
            prev.includes(teamId)
                ? prev.filter(id => id !== teamId)
                : [...prev, teamId]
        );
    };

    const getTeamById = (teamId) => {
        const team = teamsData.find(team => team._id === teamId);
        return team ? team.teamName : 'Unknown Team';
    }

    return (
        <div
            style={{
                backgroundImage: `url(${dfawallpaper})`,
                backgroundSize: "cover",
            }}
        >
            <AdminSiderbar />
            <div className="flex flex-col justify-center gap-4 w-full max-sm:w-full max-md:w-2/3 mt-6 max-sm:mt-10">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-3/4 mx-auto">
                    <h1 className="text-2xl font-bold">Edit League</h1>

                    <label className="text-gray-500">League Name</label>
                    <input
                        type="text"
                        value={leagueName}
                        onChange={(e) => setLeagueName(e.target.value)}
                        className="rounded-md p-3 border border-gray-300"
                        required
                    />

                    <label className="text-gray-500">Start Date</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="rounded-md p-3 border border-gray-300"
                        required
                    />

                    <label className="text-gray-500">End Date</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="rounded-md p-3 border border-gray-300"
                        required
                    />

                    <div className="flex flex-col gap-4">
                        <label className="text-gray-500">Teams</label>
                        {teamsData.map((team) => (
                            <div key={team._id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={selectedTeams.map((team)=> team._id).includes(team._id)}
                                    onChange={() => handleTeamChange(team._id)}
                                    className="rounded"
                                />
                                <span>{team.teamName}</span>
                            </div>
                        ))}
                    </div>

                    {matches.map((match, index) => (
                        <div key={index} className="flex flex-col gap-4 border p-4 rounded-md border-gray-300">
                            <label className="text-gray-500">Match {index + 1}</label>
                            <div className="flex gap-4">
                                <div className="flex flex-col w-1/2">
                                    <label className="text-gray-500">Team A</label>
                                    <select
                                        value={match.teamA}
                                        onChange={(e) => {
                                            const newMatches = [...matches];
                                            newMatches[index].teamA = e.target.value;
                                            setMatches(newMatches);
                                        }}
                                        className="rounded-md p-3 border border-gray-300"
                                    >
                                        <option value="">Select Team A</option>
                                        {selectedTeams.map((team) => (
                                            <option key={team._id} value={team._id}>
                                                {team.teamName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex flex-col w-1/2">
                                    <label className="text-gray-500">Team B</label>
                                    <select
                                        value={match.teamB}
                                        onChange={(e) => {
                                            const newMatches = [...matches];
                                            newMatches[index].teamB = e.target.value;
                                            setMatches(newMatches);
                                        }}
                                        className="rounded-md p-3 border border-gray-300"
                                    >
                                        <option value="">Select Team B</option>
                                        {selectedTeams.map((team) => (
                                            <option key={team._id} value={team._id}>
                                                {team.teamName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col w-1/2">
                                    <label className="text-gray-500">Score (Team A: Team B)</label>
                                    <input
                                        type="text"
                                        value={`${match.score.teamA}:${match.score.teamB}`}
                                        onChange={(e) => {
                                            const [scoreA, scoreB] = e.target.value.split(':').map(Number);
                                            const newMatches = [...matches];
                                            newMatches[index].score = { teamA: scoreA || 0, teamB: scoreB || 0 };
                                            setMatches(newMatches);
                                        }}
                                        className="rounded-md p-3 border border-gray-300"
                                    />
                                </div>


                                <div className="flex flex-col w-1/2">
                                    <label className="text-gray-500">Scorers</label>
                                    {match.scorers.map((scorer, scorerIndex) => (
                                        <div key={scorerIndex} className="flex gap-2">
                                            <select
                                                type="text"
                                                placeholder="Player Name"
                                                value={scorer.player}
                                                onChange={(e) => {
                                                    const selectedPlayer = e.target.value;
                                                    const team = availablePlayers.find(player => player.playerName === selectedPlayer)?.teamId || ''; 
                                                    const newMatches = [...matches];
                                                    newMatches[index].scorers[scorerIndex].player = selectedPlayer;
                                                    newMatches[index].scorers[scorerIndex].team = getTeamById(team); // Automatically set the team based on selected player
                                                    setMatches(newMatches);
                                                }}
                                                className="rounded-md p-3 border border-gray-300 w-2/3"
                                            >
                                                <option value="">Select Player</option>
                                                {availablePlayers.map(player => (
                                                    <option key={player.playerName} value={player.playerName} selected={player.playerName === scorer.player}>
                                                        {player.playerName}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="text"
                                                placeholder="Team Name"
                                                value={scorer.team}
                                                readOnly
                                                className="rounded-md p-3 border border-gray-300 w-1/3"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => addScorer(index)}
                                        className="mt-2 bg-secondary text-white rounded-md py-1"
                                    >
                                        + Add Scorer
                                    </button>
                                </div>
                            </div>
                            <label className="text-gray-500">Match Date</label>
                            <input
                                type="date"
                                value={inputDateFormat(match.date)}
                                onChange={(e) => {
                                    const newMatches = [...matches];
                                    newMatches[index].date = e.target.value;
                                    setMatches(newMatches);
                                }}
                                className="rounded-md p-3 border border-gray-300"
                            />
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addMatch}
                        className="mt-4 bg-secondary text-white rounded-md py-2"
                    >
                        + Add Match
                    </button>

                    <button
                        type="submit"
                        className="mt-4 bg-primary text-white rounded-md py-2"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update League'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditLeagueForm;
