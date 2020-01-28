import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';

configure({enforceActions: 'always'});

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable loadingInitial = false;
    @observable activity: IActivity | null = null;
    @observable submitting = false;
    @observable target = '';
    
    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        )
        
        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date]] : [activity];
            return activities;
        }, {} as {[key: string]: IActivity[]}));
    }

    // An action is required to alter an observable 

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction('loading activities', () => {
                activities.forEach((activity) => {
                    activity.date = new Date(activity.date)
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

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if(activity) {
            this.activity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            // Else, get activity from api
            try {
                activity = await agent.Activities.details(id);
                runInAction('getting activity', () => {
                    activity.date = new Date(activity.Date)
                    this.activity = activity;
                    this.activityRegistry.set(activity.id, activity)
                    this.loadingInitial = false;
                })
                return activity;
            } catch (error) {
                runInAction('getting activity error', () => {
                    this.loadingInitial = false;
                })
                toast.error('Problem submitting data');
                console.log(error);
            }
        }
    }

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction('creating activity', () => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            });
            history.push(`/activities/${activity.id}`)
        } catch(error) {
            runInAction('creating activity error', () => {
                this.submitting = false;
            })
            toast.error('Problem submitting data');
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
            this.activity = activity;
            this.submitting = false;
        });
        history.push(`/activities/${activity.id}`)
        } catch (error) {
            runInAction('edited activity error', () => {
                this.submitting = false;
            })
            console.log(error);
        }
    }

    @action clearActivity = () => {
        this.activity = null;
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