import React, {useState, FormEvent, useContext, useEffect} from 'react'
import { Segment, Form, Button, Grid } from 'semantic-ui-react'
import { IActivity, IActivityFormValues, ActivityFormValues } from '../../../app/models/activity'
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteChildrenProps } from 'react-router-dom';
import { Form as FinalForm, Field} from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import DateInput from '../../../app/common/form/DateInput';
import { Category } from '../../../app/common/options/CategoryOptions';
import { combineDateAndTime } from '../../../app/common/util/util';
import {combineValidators, isRequired, composeValidators, hasLengthGreaterThan} from 'revalidate';

const validate = combineValidators({
    title: isRequired({message: 'The event title is required'}),
    category: isRequired({message: 'Category is required'}),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({message: 'Desc needs to be more than 5 characters'})
    )(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time')
});

interface DetailsParam {
    id: string
}

export const ActivityFrom: React.FC<RouteChildrenProps<DetailsParam>> = ({match, history}) => {
    // Set store
    const activityStore = useContext(ActivityStore);
    // Destructure the store
    const {
        createActivity,
        editActivity, 
        submitting,  
        loadActivity,
    } = activityStore;

    // Use constructor
    // useState is called when it's set method is called. 
    // This will take a new instance of the ActivityFormValues
    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (match?.params.id) {
            setLoading(true);
            loadActivity(match.params.id).then(
                (activity) => setActivity(new ActivityFormValues(activity)))
                .finally(() => setLoading(false));
        }
    }, [
        match?.params.id, 
        loadActivity   
    ]);

    // const handleSubmit = () => {

    // }

    const handleFinalFormSubmit = (values: any) => {
        const dateTime = combineDateAndTime(values.date, values.time)
        const{date, time, ...activity} = values;
        console.log(activity);
        activity.date = dateTime;
        // If activity id is not set, push a new guid as id into the object and then
        // push the activity into the activity array
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    }

    return (
        <Grid>
            <Grid.Column width={10}>
            <Segment clearing>
            <FinalForm
                validate={validate}
                // populates the form with the activity object
                initialValues={activity} 
                onSubmit={handleFinalFormSubmit} 
                render={({handleSubmit, invalid, pristine}) => (
                <Form onSubmit={handleSubmit} loading={loading}>
                    <Field name='title' placeholder='Title' value={activity.title} component={TextInput}/>
                    <Field name='description' placeholder='Description' value={activity.description} rows={3} component={TextAreaInput}/>
                    <Field name='category' placeholder='Category' options={Category} value={activity.category} component={SelectInput}/>
                    <Form.Group widths='equal'>
                    <Field name='date' date={true} placeholder='Date' value={activity.date} component={DateInput}/>
                    <Field name='time' time={true} placeholder='Time' value={activity.time} component={DateInput}/>
                    </Form.Group>
                    <Field name='city' placeholder='City' value={activity.city} component={TextInput}/>
                    <Field name='venue' placeholder='Venue' value={activity.venue} component={TextInput}/>
                    <Button loading={submitting} disabled={loading || invalid || pristine} floated='right' positive type='submit' content='Submit'/>
                    <Button onClick={activity.id ? () => history.push(`/activities/${activity.id}`): () => history.push('/activities')} disabled={loading} floated='right' type='button' content='Cancel'/>
                </Form>
            )}/>
        </Segment>
            </Grid.Column>
        </Grid>
    )
}

export default observer(ActivityFrom)