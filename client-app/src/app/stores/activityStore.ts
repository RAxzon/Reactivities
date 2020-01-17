import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';

configure({enforceActions: 'always'});

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activities: IActivity[] = [];
    @observable loadingInitial = false;
    @observable selectedActivity: IActivity | undefined;
    @observable editMode = false;
    @observable submitting = false;
    @observable target = '';
    
    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        );
    }

    // An action is required to alter an observable 

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction('loading activities', () => {
                activities.forEach((activity) => {
                    activity.date = activity.date.split('.')[0]
                    this.activityRegistry.set(activity.id, activity)
                 });
                 this.loadingInitial = false;
            })
        } catch (error) { 
            runInAction('loading activities error', () => {
                this.loadingInitial = false;
            })
            console.log(error);
        }
    };

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('creating activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.editMode = false;
                this.submitting = false;
            })
        } catch(error) {
            runInAction('creating activity error', () => {
                this.submitting = false;
            })
            console.log(error);
        }
    };

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
        await agent.Activities.update(activity);
        runInAction('edited activity', () => {
            // Push the current activity into the list of activities
            this.activityRegistry.set(activity.id, activity);
            this.selectedActivity = activity;
            this.editMode = false;
            this.submitting = false;
        })

        } catch (error) {
            runInAction('edited activity error', () => {
                this.submitting = false;
            })
            console.log(error);
        }
    }

    @action openEditForm = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = true;
    }

    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = undefined;
    }

    @action cancelFormOpen = () => {
        this.editMode = false;
    }

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = false;
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            // Remove from db
        await agent.Activities.delete(id);
        runInAction('deleted activity', () => {
            // Remove from local list 
            this.activityRegistry.delete(id);
            this.submitting = false
            this.target = '';
        })
        } catch (error) {
            runInAction('deleted activity error', () => {
                this.submitting = false;
                this.target = '';
            })
            console.log(error);
        }
    }
}

// Create a new instance on creation, can now be 
// accessed from the components by using the useContext hook

export default createContext(new ActivityStore())