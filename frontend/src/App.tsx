import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TestSelectionPage from './pages/TestSelectionPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          
          <Routes>
            <Route path="/" element={<TestSelectionPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;