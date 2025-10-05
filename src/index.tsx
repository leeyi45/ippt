import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from './main.tsx';

const root = ReactDOM.createRoot(document.getElementById('root')!);

if (process.env.NODE_ENV === 'production') {
  root.render(<Main />);
} else {
  root.render(<React.StrictMode>
    <Main />
  </React.StrictMode>);
}
