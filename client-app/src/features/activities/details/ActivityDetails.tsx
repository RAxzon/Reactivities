import React, { useContext, useEffect } from 'react'
import {Grid, GridColumn } from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps} from 'react-router-dom';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { ActivityDetailedHeader } from './ActivityDetailedHeader';
import { ActivityDetailedInfo } from './ActivityDetailedInfo';
import { ActivityDetailedChat } from './ActivityDetailedChat';
import { ActivityDetailedSidebar } from './ActivityDetailedSidebar';

interface DetailParams {
    id: string
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = ({match, history}) => {
    const activityStore = useContext(ActivityStore)
    const {activity, loadActivity, loadingInitial} = activityStore;
    // When component is created
    useEffect(() => {
        loadActivity(match.params.id)
        // If left out, this method is going to run in a loop. LoadActivity is the dependecy
    }, [loadActivity, match.params.id, history]);
    
    if(loadingInitial) return <LoadingComponent content='loading component'/>
    
    if(!activity) {
        return <h2>Not Found</h2>
    }

    return (
        <Grid>
            <GridColumn width={10}>
                <ActivityDetailedHeader activity={activity}/>
                <ActivityDetailedInfo activity={activity}/>
                <ActivityDetailedChat/>
            </GridColumn>
            <GridColumn width={6}>
                <ActivityDetailedSidebar/>
            </GridColumn>
        </Grid>
    )
}

export default observer(ActivityDetails)