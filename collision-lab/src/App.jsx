import React from 'react';
import Layout from './components/Layout';
import { ExperimentProvider } from './components/context.jsx';

export default function App() {
  return (
    <ExperimentProvider>
      <Layout />
    </ExperimentProvider>
  );
} 