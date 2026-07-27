import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppStateProvider } from './context/AppState';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Compare } from './pages/Compare';
import { Recipes } from './pages/Recipes';
import { RecipeDetail } from './pages/RecipeDetail';
import { Plan } from './pages/Plan';
import { Inventory } from './pages/Inventory';
import { Shop } from './pages/Shop';
import { Learn, LearnDetail } from './pages/Learn';

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter basename="/stocked">
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="compare" element={<Compare />} />
            <Route path="recipes" element={<Recipes />} />
            <Route path="recipes/:id" element={<RecipeDetail />} />
            <Route path="plan" element={<Plan />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="shop" element={<Shop />} />
            <Route path="learn" element={<Learn />} />
            <Route path="learn/:id" element={<LearnDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}
