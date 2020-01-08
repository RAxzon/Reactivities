import React from 'react';
import { Grid, List } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity'
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import { ActivityFrom } from '../form/ActivityFrom';

interface IProps {
    activities: IActivity[]
    selectActivity: (id: string) => void;
    // Can be an activity or could be null
    selectedActivity: IActivity | null;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void;
    setSelectedActivity: (activity: IActivity | null) => void;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
    deleteActivity: (id: string) => void;
}


const ActivityDashboard: React.FC<IProps> = ({
    activities, 
    selectedActivity, 
    selectActivity, 
    editMode, 
    setEditMode,
    setSelectedActivity,
    createActivity,
    editActivity,
    deleteActivity
}) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList 
                activities={activities} 
                selectActivity={selectActivity}
                deleteActivity={deleteActivity}/>
            </Grid.Column>
            <Grid.Column width={6}>
                {/* Only show if activty is set */}
                {selectedActivity && !editMode && (
                <ActivityDetails 
                selectedActivity={selectedActivity} 
                setEditMode={setEditMode}
                setSelectedActivity={setSelectedActivity}/>
                )}
                {editMode &&
                // Check for a selected Activity, if no activity set  activity to null
                <ActivityFrom key={selectedActivity && selectedActivity.id || 0}
                setEditMode={setEditMode} 
                activity={selectedActivity}
                createActivity={createActivity}
                editActivity={editActivity}/>}
            </Grid.Column>
        </Grid>
    )
}

export default ActivityDashboard;