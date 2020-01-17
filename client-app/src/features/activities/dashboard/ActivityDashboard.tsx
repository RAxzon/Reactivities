import React, {useContext } from 'react';
import { Grid, List } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import ActivityDetails from '../details/ActivityDetails';
import { ActivityFrom } from '../form/ActivityFrom';
import { observer } from 'mobx-react-lite';
import ActivityStore from '../../../app/stores/activityStore';



const ActivityDashboard: React.FC = () => {
    const activityStore = useContext(ActivityStore);
    const {editMode, selectedActivity} = activityStore;
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                {/* Only show if activty is set */}
                {selectedActivity && !editMode && (
                <ActivityDetails/>
                )}
                {editMode &&
                // Check for a selected Activity, if no activity set  activity to null
                <ActivityFrom 
                key={selectedActivity && selectedActivity.id || 0}
                activity={selectedActivity!}/>
                }   
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityDashboard);