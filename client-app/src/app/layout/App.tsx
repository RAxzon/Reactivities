import React, {Fragment, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import { NavBar } from '../../features/nav/navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, withRouter, RouteComponentProps } from 'react-router-dom';
import Homepage from '../../features/home/Homepage';
import { ActivityFrom } from '../../features/activities/form/ActivityFrom';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

const App: React.FC<RouteComponentProps> = ({location}) => {

    return (
      // Fragment is instead of empty <div>
      <Fragment>
        <Route exact path='/' component={Homepage}/>
        <Route path={'/(.+)'} render={() => (
          <Fragment>
            <NavBar/>
            <Container style={{margin: "7em"}}>
            {/* Give the route a path and a component to load */}
            <Route exact path='/activities' component={ActivityDashboard}/>
            <Route path='/activities/:id' component={ActivityDetails}/>
            <Route key={location.key} path={['/createActivities', '/manage/:id']} component={ActivityFrom}/>
            </Container>
          </Fragment>
        )}/>
      </Fragment>
    );
  }

export default withRouter(observer(App));
