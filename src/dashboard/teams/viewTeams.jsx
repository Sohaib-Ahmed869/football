import React, { useState } from 'react';
import AdminSiderbar from '../../components/sidebar/sidebar';
import { dummyTeamsData } from './dummyTeamsData';
import TeamCard from '../../components/teams/teamCard';

const ViewTeams = () => {
    const [teams, setTeams] = useState(dummyTeamsData); // Use the dummy teams data


    const handleRemove = (teamId) => {
        setTeams(teams.filter(team => team.id !== teamId)); 
    };

    return (
        <div className="pt-2 pb-16">
            <AdminSiderbar />
            <div className="flex flex-col justify-start gap-4 w-full pt-5">
                <div className="flex flex-col gap-4">
                    {teams.length > 0 ? (
                        teams.map((team) => (
                            <TeamCard 
                                key={team.id} 
                                team={team} 
                                onRemove={handleRemove} // Pass the handleRemove function
                                type='remove'
                            />
                        ))
                    ) : (
                        <p className="text-gray-500">No teams available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewTeams;
