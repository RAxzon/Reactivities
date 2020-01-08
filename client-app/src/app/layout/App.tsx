import React, { useState, useEffect, Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import axios from 'axios';
import { IActivity } from '../models/activity';
import { NavBar } from '../../features/nav/navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

const App = () => {
  // The state, and a function to set the state
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0])
    setEditMode(false);
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity = (activity: IActivity) => {
    // Spread current activities into an array, pass the new activity
    setActivities([...activities, activity])
    setSelectedActivity(activity);
    setEditMode(false);   
  }

  const handleEditActivity = (activity: IActivity) => {
    // Create an array of all activities that are not the current activity, pass the new activity in
    setActivities([...activities.filter(a => a.id !== activity.id), activity])
    setSelectedActivity(activity);
    setEditMode(false);
  }

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(a => a.id !== id)])
  }

  useEffect(() => {
    axios.get<IActivity[]>('http://localhost:5000/api/activities')
    .then((response) => {
      let activities: IActivity[] = [];
      response.data.forEach(activity => {
        activity.date = activity.date.split('.')[0]
        activities.push(activity);
      });
      setActivities(activities);
    });
    // Ensures that the useEffect only is called once
  }, []);

    return (
      // Fragment is instead of empty <div>
      <Fragment>
        <NavBar openCreateForm={handleOpenCreateForm}/>
        <Container style={{margin: "7em"}}>
          <ActivityDashboard 
            activities={activities} 
            selectActivity={handleSelectActivity}
            selectedActivity={selectedActivity}
            editMode={editMode}
            setEditMode={setEditMode}
            setSelectedActivity={setSelectedActivity}
            createActivity={handleCreateActivity}
            editActivity={handleEditActivity}
            deleteActivity={handleDeleteActivity}/>
        </Container>
      </Fragment>
    );
  }

export default App;
