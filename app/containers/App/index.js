/* eslint-disable no-unused-vars */
/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 * NOTE: while this component should technically be a stateless functional
 * component (SFC), hot reloading does not currently support SFCs. If hot
 * reloading is not a necessity for you then you can refactor it and remove
 * the linting exception.
 */

import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import {
  Container,
  Image,
  Menu,
} from 'semantic-ui-react';
import OpenCase from 'containers/OpenCase';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import Register from 'containers/Register';
import ListCases from 'containers/ListCases';
import Logo from './logo.png';

const FixedMenuLayout = () => (
  <div>
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item as={Link} to="/list" header>
          <Image size="mini" src={Logo} style={{ marginRight: '1.5em' }} />
          CourtEOS
        </Menu.Item>
        <Menu.Item as={Link} to="/list">
          List
        </Menu.Item>
        <Menu.Item as={Link} to="/register">
          Register
        </Menu.Item>
        <Menu.Item as={Link} to="/open">
          New
        </Menu.Item>
      </Container>
    </Menu>
    <Container style={{ marginTop: '7em' }}>
      <Switch>
        <Route exact path="/" component={ListCases} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/open" component={OpenCase} />
        <Route
          exact
          path="/accept/:id"
          component={({ match }) => <OpenCase accept={1} match={match} />}
        />
        <Route
          exact
          path="/resolve/:id"
          component={({ match }) => (
            <OpenCase resolve={1} match={match} />
          )}
        />
        <Route
          exact
          path="/show/:id"
          component={({ match }) => (
            <OpenCase accept={1} show={1} match={match} />
          )}
        />
        <Route exact path="/list" component={ListCases} />
        <Route component={NotFoundPage} />
      </Switch>
    </Container>
  </div>
);

// export default FixedMenuLayout
export default FixedMenuLayout;
