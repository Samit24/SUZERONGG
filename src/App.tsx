import { lazy, Suspense } from "react";
import "./App.css";

const ThreatGlobe = lazy(() => import("./components/ThreatGlobe"));
const MainContainer = lazy(() => import("./components/MainContainer"));

const App = () => {
  return (
    <main className="main-body">
      <Suspense>
        <MainContainer>
          <Suspense>
            <ThreatGlobe />
          </Suspense>
        </MainContainer>
      </Suspense>
    </main>
  );
};

export default App;
