import React, { PureComponent } from 'react';
import { Consumer as PresenterContextConsumer } from './PresenterContext';
import { Consumer as GalleryContextConsumer } from './GalleryContext';

const withLightboxContext = WrappedComponent =>
  class WithLightboxContext extends PureComponent {
    static WrappedComponent = WrappedComponent;
    static displayName = `WithLightboxContext(${WrappedComponent.displayName || 'Unknown'})`;

    render() {
      return (
        <PresenterContextConsumer>
          {presenterContext => (
            <GalleryContextConsumer>
              {galleryContext => (
                <WrappedComponent {...presenterContext} gallery={galleryContext} {...this.props} />
              )}
            </GalleryContextConsumer>
          )}
        </PresenterContextConsumer>
      );
    }
  };

export default withLightboxContext;
