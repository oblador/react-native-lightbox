import React, { Component, Fragment } from 'react';
import { Provider } from './PresenterContext';
import EventEmitter from 'events';

const createPresenterProvider = Presenter =>
  class PresenterProvider extends Component {
    constructor(props) {
      super(props);
      this.eventEmitter = new EventEmitter();
    }

    render() {
      return (
        <Fragment>
          <Provider value={this.eventEmitter}>{this.props.children}</Provider>
          <Presenter eventEmitter={this.eventEmitter} />
        </Fragment>
      );
    }
  };

export default createPresenterProvider;
