import React from 'react';
import createPresenterProvider from './createPresenterProvider';
import ModalPresenter from './ModalPresenter';
import Header from './Header';
import Background from './Background';

export default createPresenterProvider(ModalPresenter, {
  ChromeComponent: Header,
  BackgroundComponent: Background,
});
